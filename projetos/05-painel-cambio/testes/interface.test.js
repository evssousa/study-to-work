import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { abrirPainel, guardadoComUsd } from "./app.js";
import { COTACOES, HISTORICO, adiada, criarFetchFalso, proibirFetchGlobal, urlsChamadas } from "./carregar.js";

beforeEach(proibirFetchGlobal);
afterEach(() => vi.useRealTimers());

const IDS_OBRIGATORIOS = [
  "app", "estado-cotacoes", "btn-atualizar", "tabela-cotacoes", "form-conversor", "resultado-conversao",
  "estado-historico", "lista-historico",
];
const CAMPOS_OBRIGATORIOS = ["#form-conversor [name=valor]", "#form-conversor select[name=moeda]", "#form-conversor select[name=direcao]", "#tabela-cotacoes tbody"];

const carregou = (ui) => vi.waitFor(() => expect(ui.estadoCotacoes()).toBe("sucesso"));
const historicoCarregou = (ui) => vi.waitFor(() => expect(ui.estadoHistorico()).toBe("sucesso"));

// Um fetch para cotações que o teste controla: cada chamada ao "last" fica pendente até resolver.
function fetchControlado({ historico = HISTORICO } = {}) {
  const pendentes = [];
  const normal = criarFetchFalso({ historico });
  const fetch = vi.fn((url, opcoes) => {
    if (String(url).includes("/json/last/")) {
      const espera = adiada();
      pendentes.push({ url: String(url), opcoes, espera });
      return espera.promise;
    }
    return normal(url, opcoes);
  });
  return { fetch, pendentes };
}

const respostaDeCotacoes = (moedas = ["USD", "EUR"], sobrescrever = {}) =>
  Response.json(Object.fromEntries(moedas.map((m) => [`${m}BRL`, { ...COTACOES[m], ...sobrescrever[m] }])));

describe("index.html — o contrato da tela", () => {
  test.each(IDS_OBRIGATORIOS)("existe o elemento #%s", async (id) => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    expect(ui.document.getElementById(id), `Falta um elemento com id="${id}" no index.html`).not.toBeNull();
  });

  test.each(CAMPOS_OBRIGATORIOS)("existe %s", async (seletor) => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    expect(ui.q(seletor), `Falta ${seletor}`).not.toBeNull();
  });

  test("o conversor oferece as duas direções: para-brl e de-brl", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    const valores = [...ui.q("#form-conversor select[name=direcao]").options].map((o) => o.value);
    expect(valores).toEqual(["para-brl", "de-brl"]);
  });

  test("as moedas configuradas viram as opções do seletor", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso(), moedas: ["USD", "EUR", "GBP"] });
    expect([...ui.q("#form-conversor select[name=moeda]").options].map((o) => o.value)).toEqual(["USD", "EUR", "GBP"]);
  });
});

describe("cotações — os estados da tela", () => {
  test("começa em 'carregando' enquanto a API não responde", async () => {
    const { fetch } = fetchControlado();
    const ui = await abrirPainel({ fetch });
    expect(ui.estadoCotacoes()).toBe("carregando");
    expect(ui.textoCotacoes()).toBe("Carregando cotações...");
    expect(ui.linhas()).toHaveLength(0);
  });

  test("sucesso: uma linha por moeda, na ordem pedida, com taxa e variação", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso(), moedas: ["USD", "EUR", "GBP"] });
    await carregou(ui);
    expect(ui.linhas().map((l) => l.dataset.moeda)).toEqual(["USD", "EUR", "GBP"]);
    expect(ui.celulas("USD", "moeda")).toBe("USD");
    expect(ui.celulas("USD", "nome")).toBe("Dólar Americano");
    expect(ui.celulas("USD", "taxa")).toBe("R$ 5,0931");
    expect(ui.celulas("USD", "variacao")).toBe("+0,90%");
    expect(ui.celulas("EUR", "taxa")).toBe("R$ 5,7156");
    expect(ui.celulas("GBP", "variacao")).toBe("-0,43%");
  });

  test("a variação ganha a classe alta ou baixa", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso(), moedas: ["USD", "GBP"] });
    await carregou(ui);
    expect(ui.q('tr[data-moeda="USD"] .variacao').classList.contains("alta")).toBe(true);
    expect(ui.q('tr[data-moeda="GBP"] .variacao').classList.contains("baixa")).toBe(true);
  });

  test("a mensagem mostra a data e hora da cotação mais recente, no horário de Brasília", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    await carregou(ui);
    expect(ui.textoCotacoes()).toBe("Atualizado em 15/10/2026 18:08");
  });

  test("a requisição vai para a URL certa", async () => {
    const fetch = criarFetchFalso();
    const ui = await abrirPainel({ fetch, moedas: ["USD", "EUR"] });
    await carregou(ui);
    expect(urlsChamadas(fetch, "/json/last/")).toEqual(["https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL"]);
  });

  test("grava as cotações no localStorage para uso sem internet", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    await carregou(ui);
    const salvo = ui.guardadoAgora();
    expect(salvo.cotacoes.map((c) => [c.moeda, c.taxa])).toEqual([["USD", 5.0931], ["EUR", 5.7156]]);
  });

  test("falha SEM dados salvos → estado 'erro' e tabela vazia", async () => {
    const fetch = vi.fn(async () => { throw new TypeError("fetch failed"); });
    const ui = await abrirPainel({ fetch });
    await vi.waitFor(() => expect(ui.estadoCotacoes()).toBe("erro"));
    expect(ui.textoCotacoes()).toBe("Não foi possível carregar as cotações.");
    expect(ui.linhas()).toHaveLength(0);
  });

  test("o botão 'Atualizar agora' tenta de novo depois de uma falha", async () => {
    // As 3 primeiras buscas de COTAÇÕES falham (1 clique = 3 tentativas); a partir daí a internet "volta".
    const normal = criarFetchFalso();
    let falhasDeCotacao = 0;
    const fetch = vi.fn(async (url, opcoes) => {
      if (String(url).includes("/json/last/") && falhasDeCotacao < 3) {
        falhasDeCotacao++;
        throw new TypeError("fetch failed");
      }
      return normal(url, opcoes);
    });
    const ui = await abrirPainel({ fetch });
    await vi.waitFor(() => expect(ui.estadoCotacoes()).toBe("erro"));
    ui.atualizar();
    await carregou(ui);
    expect(ui.linhas()).toHaveLength(2);
  });

  test("erros 5xx são repetidos automaticamente (3 tentativas) antes de desistir", async () => {
    const fetch = vi.fn(async () => Response.json({}, { status: 503 }));
    const ui = await abrirPainel({ fetch });
    await vi.waitFor(() => expect(ui.estadoCotacoes()).toBe("erro"));
    expect(urlsChamadas(fetch, "/json/last/")).toHaveLength(3);
  });
});

describe("sem internet: a última cotação salva", () => {
  test("mostra o que estava salvo imediatamente, já avisando que está atualizando", async () => {
    const { fetch } = fetchControlado();
    const ui = await abrirPainel({ fetch, guardado: guardadoComUsd });
    expect(ui.estadoCotacoes()).toBe("carregando");
    expect(ui.textoCotacoes()).toBe("Atualizando...");
    expect(ui.linhas().map((l) => l.dataset.moeda)).toEqual(["USD"]);
    expect(ui.celulas("USD", "taxa")).toBe("R$ 5,0931");
  });

  test("se a atualização falhar, mantém os dados e avisa de quando eles são", async () => {
    const fetch = vi.fn(async () => { throw new TypeError("fetch failed"); });
    const ui = await abrirPainel({ fetch, guardado: guardadoComUsd });
    await vi.waitFor(() => expect(ui.estadoCotacoes()).toBe("desatualizado"));
    expect(ui.textoCotacoes()).toBe("Sem atualização. Mostrando a cotação de 15/10/2026 18:08.");
    expect(ui.linhas()).toHaveLength(1);
    expect(ui.celulas("USD", "taxa")).toBe("R$ 5,0931");
  });

  test("se a atualização der certo, substitui pelos dados novos", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso(), guardado: guardadoComUsd });
    await carregou(ui);
    expect(ui.linhas().map((l) => l.dataset.moeda)).toEqual(["USD", "EUR"]);
  });

  test("dados salvos corrompidos são ignorados", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso(), guardado: "{isto não é json" });
    await carregou(ui);
    expect(ui.linhas()).toHaveLength(2);
  });
});

describe("atualização manual e automática", () => {
  test("clicar em 'Atualizar agora' busca de novo e mostra 'Atualizando...' enquanto espera", async () => {
    const { fetch, pendentes } = fetchControlado();
    const ui = await abrirPainel({ fetch });
    pendentes[0].espera.resolver(respostaDeCotacoes());
    await carregou(ui);

    ui.atualizar();
    expect(ui.estadoCotacoes()).toBe("carregando");
    expect(ui.textoCotacoes()).toBe("Atualizando...");
    expect(pendentes).toHaveLength(2);
    pendentes[1].espera.resolver(respostaDeCotacoes());
    await carregou(ui);
  });

  test("atualiza sozinho a cada intervalo e para quando chamam parar()", async () => {
    vi.useFakeTimers();
    const fetch = criarFetchFalso();
    const ui = await abrirPainel({ fetch, intervaloMs: 60_000 });
    await vi.advanceTimersByTimeAsync(10);
    expect(urlsChamadas(fetch, "/json/last/")).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(60_000);
    expect(urlsChamadas(fetch, "/json/last/")).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(urlsChamadas(fetch, "/json/last/")).toHaveLength(3);

    ui.painel.parar();
    await vi.advanceTimersByTimeAsync(300_000);
    expect(urlsChamadas(fetch, "/json/last/")).toHaveLength(3);
    expect(vi.getTimerCount()).toBe(0);
  });

  test("CONDIÇÃO DE CORRIDA: a resposta antiga e lenta não sobrescreve a mais nova", async () => {
    const { fetch, pendentes } = fetchControlado();
    const ui = await abrirPainel({ fetch });
    ui.atualizar(); // segunda busca; a primeira ainda está pendente

    expect(pendentes[0].opcoes.signal.aborted).toBe(true); // a antiga foi cancelada
    pendentes[1].espera.resolver(respostaDeCotacoes(["USD", "EUR"], { USD: { bid: "6.0000" } }));
    await carregou(ui);
    expect(ui.celulas("USD", "taxa")).toBe("R$ 6,00");

    pendentes[0].espera.resolver(respostaDeCotacoes(["USD", "EUR"], { USD: { bid: "4.0000" } })); // chega atrasada
    await new Promise((r) => setTimeout(r, 30));
    expect(ui.celulas("USD", "taxa")).toBe("R$ 6,00");
    expect(ui.estadoCotacoes()).toBe("sucesso");
  });
});

describe("conversor", () => {
  test("antes de ter cotações, avisa que está aguardando", async () => {
    const { fetch } = fetchControlado();
    const ui = await abrirPainel({ fetch });
    expect(ui.conversao()).toBe("Aguardando cotações...");
  });

  test("sem valor digitado, pede um valor", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    await carregou(ui);
    expect(ui.conversao()).toBe("Digite um valor para converter");
  });

  test("moeda → real, com a máscara de dinheiro no campo", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    await carregou(ui);
    ui.digitarValor("10000");
    expect(ui.campoValor()).toBe("100,00");
    expect(ui.conversao()).toBe("USD 100,00 = R$ 509,31");
  });

  test("real → moeda", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    await carregou(ui);
    ui.digitarValor("10000");
    ui.escolherDirecao("de-brl");
    expect(ui.conversao()).toBe("R$ 100,00 = USD 19,63");
  });

  test("trocar a moeda recalcula na hora", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    await carregou(ui);
    ui.digitarValor("10000");
    ui.escolherMoeda("EUR");
    expect(ui.conversao()).toBe("EUR 100,00 = R$ 571,56");
  });

  test("a conversão já aparece quando as cotações chegam, se o valor foi digitado antes", async () => {
    const { fetch, pendentes } = fetchControlado();
    const ui = await abrirPainel({ fetch });
    ui.digitarValor("10000");
    expect(ui.conversao()).toBe("Aguardando cotações...");
    pendentes[0].espera.resolver(respostaDeCotacoes());
    await carregou(ui);
    expect(ui.conversao()).toBe("USD 100,00 = R$ 509,31");
  });

  test("funciona com as cotações salvas, sem internet", async () => {
    const fetch = vi.fn(async () => { throw new TypeError("fetch failed"); });
    const ui = await abrirPainel({ fetch, guardado: guardadoComUsd });
    ui.digitarValor("10000");
    expect(ui.conversao()).toBe("USD 100,00 = R$ 509,31");
  });

  test("lembra da moeda escolhida", async () => {
    const primeira = await abrirPainel({ fetch: criarFetchFalso() });
    await carregou(primeira);
    primeira.escolherMoeda("EUR");
    expect(primeira.guardadoAgora().moeda).toBe("EUR");

    const reaberta = await abrirPainel({ fetch: criarFetchFalso(), guardado: primeira.storage.getItem("painel-cambio:v1") });
    expect(reaberta.q("#form-conversor [name=moeda]").value).toBe("EUR");
  });

  test("uma moeda salva que não está mais na lista cai para a primeira", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso(), guardado: { moeda: "GBP", cotacoes: [] } });
    expect(ui.q("#form-conversor [name=moeda]").value).toBe("USD");
  });

  test("o formulário não recarrega a página ao apertar Enter", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    const evento = new ui.window.Event("submit", { bubbles: true, cancelable: true });
    ui.q("#form-conversor").dispatchEvent(evento);
    expect(evento.defaultPrevented).toBe(true);
  });
});

describe("histórico dos últimos dias", () => {
  test("carrega o histórico da moeda escolhida, do dia mais recente ao mais antigo", async () => {
    const fetch = criarFetchFalso();
    const ui = await abrirPainel({ fetch });
    expect(ui.estadoHistorico()).toBe("carregando");
    expect(ui.textoHistorico()).toBe("Carregando histórico...");
    await historicoCarregou(ui);
    expect(ui.textoHistorico()).toBe("Últimos 7 dias de USD");
    expect(ui.historico()).toEqual(["15/10/2026: R$ 5,0912", "14/10/2026: R$ 5,0479", "13/10/2026: R$ 5,0266"]);
    expect(urlsChamadas(fetch, "/json/daily/")).toEqual(["https://economia.awesomeapi.com.br/json/daily/USD-BRL/7"]);
  });

  test("trocar de moeda carrega o histórico da nova", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    await historicoCarregou(ui);
    ui.escolherMoeda("EUR");
    expect(ui.estadoHistorico()).toBe("carregando");
    await vi.waitFor(() => expect(ui.textoHistorico()).toBe("Últimos 7 dias de EUR"));
    expect(ui.historico()).toEqual(["15/10/2026: R$ 5,7001", "14/10/2026: R$ 5,6402"]);
  });

  test("voltar a uma moeda já vista usa o cache (não chama a API de novo)", async () => {
    const fetch = criarFetchFalso();
    const ui = await abrirPainel({ fetch });
    await historicoCarregou(ui);
    ui.escolherMoeda("EUR");
    await vi.waitFor(() => expect(ui.textoHistorico()).toBe("Últimos 7 dias de EUR"));
    ui.escolherMoeda("USD");
    await vi.waitFor(() => expect(ui.textoHistorico()).toBe("Últimos 7 dias de USD"));
    expect(urlsChamadas(fetch, "/json/daily/USD")).toHaveLength(1);
    expect(urlsChamadas(fetch, "/json/daily/EUR")).toHaveLength(1);
  });

  test("falha no histórico mostra a mensagem, sem afetar as cotações", async () => {
    const fetch = criarFetchFalso({ historico: {} });
    const ui = await abrirPainel({ fetch });
    await carregou(ui);
    await vi.waitFor(() => expect(ui.estadoHistorico()).toBe("erro"));
    expect(ui.textoHistorico()).toBe("Não foi possível carregar o histórico.");
    expect(ui.historico()).toEqual([]);
    expect(ui.linhas()).toHaveLength(2);
  });

  test("CONDIÇÃO DE CORRIDA: trocar de moeda rápido não mistura os históricos", async () => {
    const lento = adiada();
    const normal = criarFetchFalso();
    const fetch = vi.fn((url, opcoes) => (String(url).includes("/daily/USD") ? lento.promise : normal(url, opcoes)));
    const ui = await abrirPainel({ fetch });
    ui.escolherMoeda("EUR"); // enquanto o histórico do USD ainda está pendente
    await vi.waitFor(() => expect(ui.textoHistorico()).toBe("Últimos 7 dias de EUR"));

    lento.resolver(Response.json(HISTORICO.USD)); // o do USD chega atrasado
    await new Promise((r) => setTimeout(r, 30));
    expect(ui.textoHistorico()).toBe("Últimos 7 dias de EUR");
    expect(ui.historico()).toEqual(["15/10/2026: R$ 5,7001", "14/10/2026: R$ 5,6402"]);
  });
});

describe("segurança e acessibilidade", () => {
  test("dados da API entram como texto, nunca como HTML", async () => {
    const maliciosa = { ...COTACOES, USD: { ...COTACOES.USD, name: '<img src=x onerror="alert(1)">/Real Brasileiro' } };
    const ui = await abrirPainel({ fetch: criarFetchFalso({ cotacoes: maliciosa }) });
    await carregou(ui);
    expect(ui.raiz.querySelectorAll("img, script")).toHaveLength(0);
    expect(ui.celulas("USD", "nome")).toBe('<img src=x onerror="alert(1)">');
  });

  test("todos os campos têm rótulo", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    await carregou(ui);
    for (const campo of ui.todos("input, select, textarea")) {
      const id = campo.getAttribute("id");
      const temRotulo = (id && ui.document.querySelector(`label[for="${id}"]`)) || campo.closest("label") || campo.getAttribute("aria-label");
      expect(temRotulo, `Campo name="${campo.getAttribute("name")}" sem rótulo`).toBeTruthy();
    }
  });

  test("os estados são anunciados para leitores de tela e a tabela é acessível", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    for (const id of ["estado-cotacoes", "estado-historico"]) {
      const elemento = ui.q(`#${id}`);
      expect(elemento.getAttribute("role") === "status" || elemento.getAttribute("aria-live") === "polite", `#${id} precisa de role="status"`).toBe(true);
    }
    expect(ui.q("#tabela-cotacoes caption")?.textContent.trim()).toBeTruthy();
    const cabecalhos = ui.todos("#tabela-cotacoes thead th");
    expect(cabecalhos.length).toBeGreaterThanOrEqual(4);
    expect(cabecalhos.every((th) => th.getAttribute("scope") === "col")).toBe(true);
  });

  test("o resultado da conversão é anunciado quando muda (aria-live)", async () => {
    const ui = await abrirPainel({ fetch: criarFetchFalso() });
    const saida = ui.q("#resultado-conversao");
    expect(saida.getAttribute("aria-live") === "polite" || saida.getAttribute("role") === "status").toBe(true);
  });
});
