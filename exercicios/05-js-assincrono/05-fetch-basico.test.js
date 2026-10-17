import { describe, expect, test, vi } from "vitest";
import * as modulo from "./05-fetch-basico.js";

const { buscarJson, enviarJson, HttpError, RedeError } = modulo;

const resposta = (corpo, status = 200) => Response.json(corpo, { status });
const fetchRetornando = (...respostas) => {
  const fila = [...respostas];
  return vi.fn(async () => {
    const proxima = fila.length > 1 ? fila.shift() : fila[0];
    if (proxima instanceof Error) throw proxima;
    return proxima;
  });
};

describe("classes de erro", () => {
  test("HttpError", () => {
    expect(typeof HttpError, "Exporte a classe HttpError").toBe("function");
    const erro = new HttpError(404);
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe("HttpError");
    expect(erro.status).toBe(404);
    expect(erro.message).toBe("O servidor respondeu 404");
  });

  test("RedeError", () => {
    expect(typeof RedeError, "Exporte a classe RedeError").toBe("function");
    const original = new TypeError("fetch failed");
    const erro = new RedeError(original);
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe("RedeError");
    expect(erro.message).toBe("Falha de rede. Verifique sua conexão.");
    expect(erro.causa).toBe(original);
  });
});

describe("buscarJson", () => {
  test("devolve o JSON da resposta", async () => {
    const fetch = fetchRetornando(resposta({ nome: "Ana" }));
    await expect(buscarJson("https://api.exemplo.com/u", { fetch })).resolves.toEqual({ nome: "Ana" });
  });

  test("chama o fetch com a url, o signal e os headers", async () => {
    const fetch = fetchRetornando(resposta({}));
    const controlador = new AbortController();
    await buscarJson("https://api.exemplo.com/u", { fetch, signal: controlador.signal, headers: { "X-Chave": "1" } });
    expect(fetch).toHaveBeenCalledWith("https://api.exemplo.com/u", {
      signal: controlador.signal,
      headers: { "X-Chave": "1" },
    });
  });

  test("status 404 ou 500 viram HttpError (o fetch não rejeita sozinho!)", async () => {
    for (const status of [404, 500]) {
      const fetch = fetchRetornando(resposta({ erro: "x" }, status));
      const erro = await buscarJson("https://api.exemplo.com/u", { fetch }).catch((e) => e);
      expect(erro).toBeInstanceOf(HttpError);
      expect(erro.status).toBe(status);
    }
  });

  test("falha de rede vira RedeError, guardando a causa", async () => {
    const original = new TypeError("fetch failed");
    const fetch = fetchRetornando(original);
    const erro = await buscarJson("https://api.exemplo.com/u", { fetch }).catch((e) => e);
    expect(erro).toBeInstanceOf(RedeError);
    expect(erro.causa).toBe(original);
  });

  test("cancelamento (AbortError) passa direto, sem virar RedeError", async () => {
    const abortado = new DOMException("The operation was aborted.", "AbortError");
    const fetch = fetchRetornando(abortado);
    const erro = await buscarJson("https://api.exemplo.com/u", { fetch }).catch((e) => e);
    expect(erro).toBe(abortado);
    expect(erro).not.toBeInstanceOf(RedeError);
  });

  test("corpo que não é JSON vira um erro claro", async () => {
    const fetch = fetchRetornando(new Response("<html>Bad Gateway</html>", { status: 200 }));
    await expect(buscarJson("https://api.exemplo.com/u", { fetch })).rejects.toThrow("Resposta inválida do servidor");
  });

  test("um erro HTTP vence: o corpo nem é lido", async () => {
    const fetch = fetchRetornando(new Response("<html>erro</html>", { status: 502 }));
    const erro = await buscarJson("https://api.exemplo.com/u", { fetch }).catch((e) => e);
    expect(erro).toBeInstanceOf(HttpError);
    expect(erro.status).toBe(502);
  });
});

describe("enviarJson", () => {
  test("envia POST com JSON por padrão", async () => {
    const fetch = fetchRetornando(resposta({ id: 7 }, 201));
    const retorno = await enviarJson("https://api.exemplo.com/tarefas", { titulo: "Estudar" }, { fetch });
    expect(retorno).toEqual({ id: 7 });
    expect(fetch).toHaveBeenCalledWith("https://api.exemplo.com/tarefas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"titulo":"Estudar"}',
      signal: undefined,
    });
  });

  test("método personalizado e token", async () => {
    const fetch = fetchRetornando(resposta({}));
    await enviarJson("https://api.exemplo.com/tarefas/7", { feita: true }, { fetch, metodo: "PATCH", token: "abc123" });
    const [, opcoes] = fetch.mock.calls[0];
    expect(opcoes.method).toBe("PATCH");
    expect(opcoes.headers).toEqual({ "Content-Type": "application/json", Authorization: "Bearer abc123" });
  });

  test("sem dados (undefined) não envia body", async () => {
    const fetch = fetchRetornando(new Response(null, { status: 204 }));
    await enviarJson("https://api.exemplo.com/x", undefined, { fetch, metodo: "DELETE" });
    expect("body" in fetch.mock.calls[0][1]).toBe(false);
  });

  test("204 devolve null sem ler o corpo", async () => {
    const fetch = fetchRetornando(new Response(null, { status: 204 }));
    await expect(enviarJson("https://api.exemplo.com/x", {}, { fetch, metodo: "DELETE" })).resolves.toBeNull();
  });

  test("mesmos erros do buscarJson", async () => {
    const erroHttp = await enviarJson("https://x.com", {}, { fetch: fetchRetornando(resposta({}, 422)) }).catch((e) => e);
    expect(erroHttp).toBeInstanceOf(HttpError);
    expect(erroHttp.status).toBe(422);

    const erroRede = await enviarJson("https://x.com", {}, { fetch: fetchRetornando(new TypeError("falhou")) }).catch((e) => e);
    expect(erroRede).toBeInstanceOf(RedeError);
  });
});
