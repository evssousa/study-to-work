import { beforeEach, describe, expect, test, vi } from "vitest";
import { COTACOES, HISTORICO, criarFetchFalso, importarDoProjeto, proibirFetchGlobal, semEspera, urlsChamadas } from "./carregar.js";

const { ClienteCambio } = await importarDoProjeto("cambio.js");
const { CacheComTTL } = await importarDoProjeto("cache.js");
const { HttpError, RedeError, RespostaInvalidaError } = await importarDoProjeto("http.js");

beforeEach(proibirFetchGlobal);

const cliente = (opcoes = {}) => new ClienteCambio({ fetch: criarFetchFalso(), esperar: semEspera(), ...opcoes });

describe("ClienteCambio.cotacoes", () => {
  test("busca todas numa chamada só e normaliza os números (que chegam como texto)", async () => {
    const fetch = criarFetchFalso();
    const resultado = await cliente({ fetch }).cotacoes(["USD", "EUR"]);
    expect(urlsChamadas(fetch)).toEqual(["https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL"]);
    expect(resultado).toEqual([
      { moeda: "USD", nome: "Dólar Americano", taxa: 5.0931, variacaoPercentual: 0.895418, maxima: 5.097, minima: 5.0375, timestamp: 1792098492 },
      { moeda: "EUR", nome: "Euro", taxa: 5.7156, variacaoPercentual: 1.261425, maxima: 5.717, minima: 5.6387, timestamp: 1792098269 },
    ]);
    expect(typeof resultado[0].taxa).toBe("number");
  });

  test("segue a ordem pedida e ignora moedas repetidas", async () => {
    const fetch = criarFetchFalso();
    const resultado = await cliente({ fetch }).cotacoes(["GBP", "USD", "GBP"]);
    expect(resultado.map((c) => c.moeda)).toEqual(["GBP", "USD"]);
    expect(urlsChamadas(fetch)[0]).toMatch(/last\/GBP-BRL,USD-BRL$/);
  });

  test("moeda que a API não devolveu simplesmente não aparece", async () => {
    const fetch = vi.fn(async () => Response.json({ USDBRL: COTACOES.USD }));
    const resultado = await cliente({ fetch }).cotacoes(["USD", "EUR"]);
    expect(resultado.map((c) => c.moeda)).toEqual(["USD"]);
  });

  test("respeita uma baseUrl diferente", async () => {
    const fetch = criarFetchFalso();
    await cliente({ fetch, baseUrl: "https://meu-proxy.exemplo.com" }).cotacoes(["USD"]);
    expect(urlsChamadas(fetch)[0]).toBe("https://meu-proxy.exemplo.com/json/last/USD-BRL");
  });

  test("valida as moedas antes de chamar a rede", async () => {
    const fetch = criarFetchFalso();
    const api = cliente({ fetch });
    await expect(api.cotacoes([])).rejects.toThrow("Informe ao menos uma moeda");
    await expect(api.cotacoes("USD")).rejects.toThrow("Informe ao menos uma moeda");
    await expect(api.cotacoes(["usd"])).rejects.toThrow("Moeda inválida: usd");
    await expect(api.cotacoes(["USD", "DÓLAR!"])).rejects.toThrow("Moeda inválida: DÓLAR!");
    await expect(api.cotacoes([42])).rejects.toThrow("Moeda inválida: 42");
    expect(fetch).not.toHaveBeenCalled();
  });

  test("repassa o signal de cancelamento ao fetch", async () => {
    const fetch = criarFetchFalso();
    const controlador = new AbortController();
    await cliente({ fetch }).cotacoes(["USD"], { signal: controlador.signal });
    expect(fetch.mock.calls[0][1].signal).toBe(controlador.signal);
  });

  test("corpo inesperado vira RespostaInvalidaError", async () => {
    for (const corpo of [[1, 2], null, "texto", 42]) {
      const api = cliente({ fetch: vi.fn(async () => Response.json(corpo)) });
      await expect(api.cotacoes(["USD"])).rejects.toBeInstanceOf(RespostaInvalidaError);
    }
  });
});

describe("ClienteCambio — erros e tentativas", () => {
  test("erro 404 (moeda inexistente) NÃO é repetido", async () => {
    const fetch = vi.fn(async () => Response.json({}, { status: 404 }));
    const esperar = semEspera();
    const erro = await cliente({ fetch, esperar }).cotacoes(["USD"]).catch((e) => e);
    expect(erro).toBeInstanceOf(HttpError);
    expect(erro.status).toBe(404);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(esperar).not.toHaveBeenCalled();
  });

  test("erro 5xx é repetido com backoff até funcionar", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json({}, { status: 503 }))
      .mockResolvedValueOnce(Response.json({}, { status: 502 }))
      .mockResolvedValueOnce(Response.json({ USDBRL: COTACOES.USD }));
    const esperar = semEspera();
    const resultado = await cliente({ fetch, esperar }).cotacoes(["USD"]);
    expect(resultado).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(esperar.mock.calls.map((c) => c[0])).toEqual([100, 200]);
  });

  test("falha de rede é repetida e, no fim, sobe como RedeError", async () => {
    const fetch = vi.fn(async () => { throw new TypeError("fetch failed"); });
    const erro = await cliente({ fetch }).cotacoes(["USD"]).catch((e) => e);
    expect(erro).toBeInstanceOf(RedeError);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  test("o número de tentativas é configurável", async () => {
    const fetch = vi.fn(async () => { throw new TypeError("fetch failed"); });
    await cliente({ fetch, tentativas: 1 }).cotacoes(["USD"]).catch(() => {});
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("cancelamento (AbortError) não é repetido nem vira RedeError", async () => {
    const abortado = new DOMException("cancelada", "AbortError");
    const fetch = vi.fn(async () => { throw abortado; });
    await expect(cliente({ fetch }).cotacoes(["USD"])).rejects.toBe(abortado);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe("ClienteCambio — cache", () => {
  test("a segunda chamada igual não vai à rede", async () => {
    const fetch = criarFetchFalso();
    const api = cliente({ fetch, cache: new CacheComTTL({ ttlMs: 60_000 }) });
    const a = await api.cotacoes(["USD"]);
    const b = await api.cotacoes(["USD"]);
    expect(b).toEqual(a);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("moedas diferentes não se confundem no cache", async () => {
    const fetch = criarFetchFalso();
    const api = cliente({ fetch, cache: new CacheComTTL({ ttlMs: 60_000 }) });
    await api.cotacoes(["USD"]);
    await api.cotacoes(["EUR"]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("ignorarCache força uma nova busca", async () => {
    const fetch = criarFetchFalso();
    const api = cliente({ fetch, cache: new CacheComTTL({ ttlMs: 60_000 }) });
    await api.cotacoes(["USD"]);
    await api.cotacoes(["USD"], { ignorarCache: true });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("depois do TTL o cache vence e busca de novo", async () => {
    let agora = 0;
    const fetch = criarFetchFalso();
    const api = cliente({ fetch, cache: new CacheComTTL({ ttlMs: 1000, agora: () => agora }) });
    await api.cotacoes(["USD"]);
    agora = 1000;
    await api.cotacoes(["USD"]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("erros não vão para o cache", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({}, { status: 404 })).mockResolvedValue(Response.json({ USDBRL: COTACOES.USD }));
    const api = cliente({ fetch, cache: new CacheComTTL({ ttlMs: 60_000 }) });
    await api.cotacoes(["USD"]).catch(() => {});
    await expect(api.cotacoes(["USD"])).resolves.toHaveLength(1);
  });

  test("sem cache, toda chamada vai à rede", async () => {
    const fetch = criarFetchFalso();
    const api = cliente({ fetch });
    await api.cotacoes(["USD"]);
    await api.cotacoes(["USD"]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe("ClienteCambio.historico", () => {
  test("monta a URL, ordena do mais antigo ao mais recente e usa o dia de Brasília", async () => {
    const fetch = criarFetchFalso();
    const resultado = await cliente({ fetch }).historico("USD", 3);
    expect(urlsChamadas(fetch)).toEqual(["https://economia.awesomeapi.com.br/json/daily/USD-BRL/3"]);
    expect(resultado).toEqual([
      { data: "2026-10-13", taxa: 5.0266 },
      { data: "2026-10-14", taxa: 5.0479 },
      { data: "2026-10-15", taxa: 5.0912 },
    ]);
  });

  test("7 dias por padrão", async () => {
    const fetch = criarFetchFalso();
    await cliente({ fetch }).historico("EUR");
    expect(urlsChamadas(fetch)[0]).toMatch(/daily\/EUR-BRL\/7$/);
  });

  test("funciona com os itens parciais que a API devolve (sem code/name/create_date)", async () => {
    const resultado = await cliente().historico("USD", 3);
    expect(resultado).toHaveLength(HISTORICO.USD.length);
  });

  test("valida a moeda e os dias antes de chamar a rede", async () => {
    const fetch = criarFetchFalso();
    const api = cliente({ fetch });
    await expect(api.historico("usd", 7)).rejects.toThrow("Moeda inválida: usd");
    for (const dias of [0, 31, 2.5, "7"]) {
      await expect(api.historico("USD", dias)).rejects.toThrow("Dias deve ser um inteiro entre 1 e 30");
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  test("resposta que não é uma lista → RespostaInvalidaError", async () => {
    const api = cliente({ fetch: vi.fn(async () => Response.json({ erro: "x" })) });
    await expect(api.historico("USD", 7)).rejects.toBeInstanceOf(RespostaInvalidaError);
  });

  test("usa o cache, e dias diferentes são pedidos diferentes", async () => {
    const fetch = criarFetchFalso();
    const api = cliente({ fetch, cache: new CacheComTTL({ ttlMs: 60_000 }) });
    await api.historico("USD", 7);
    await api.historico("USD", 7);
    await api.historico("USD", 15);
    expect(urlsChamadas(fetch).length).toBe(2);
  });

  test("repassa o signal e repete erros 5xx", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({}, { status: 500 })).mockResolvedValueOnce(Response.json(HISTORICO.USD));
    const controlador = new AbortController();
    await cliente({ fetch }).historico("USD", 3, { signal: controlador.signal });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[1][1].signal).toBe(controlador.signal);
  });
});
