import { pathToFileURL } from "node:url";
import { vi } from "vitest";
import { caminhoDoProjeto } from "../../../suporte/arquivos.js";

/** Importa um arquivo de src/ do projeto do aluno. */
export function importarDoProjeto(arquivo) {
  return import(pathToFileURL(caminhoDoProjeto("src", arquivo)).href);
}

/** Garante que o projeto usa o fetch RECEBIDO por parâmetro: o global explode se for chamado. */
export function proibirFetchGlobal() {
  vi.stubGlobal("fetch", () => {
    throw new Error("Use o fetch recebido por parâmetro, nunca o fetch global (senão não dá para testar).");
  });
}

// ---- Dados no formato REAL da AwesomeAPI (https://economia.awesomeapi.com.br) ----
// Atenção: todos os números chegam como TEXTO.

const completo = (code, name, dados) => ({ code, codein: "BRL", name, varBid: "0.01", ask: dados.bid, create_date: "2026-10-15 18:00:00", ...dados });

export const COTACOES = {
  USD: completo("USD", "Dólar Americano/Real Brasileiro", { high: "5.097", low: "5.0375", pctChange: "0.895418", bid: "5.0931", timestamp: "1792098492" }),
  EUR: completo("EUR", "Euro/Real Brasileiro", { high: "5.717", low: "5.6387", pctChange: "1.261425", bid: "5.7156", timestamp: "1792098269" }),
  GBP: completo("GBP", "Libra Esterlina/Real Brasileiro", { high: "6.62", low: "6.55", pctChange: "-0.4321", bid: "6.5874", timestamp: "1792098300" }),
};

// O histórico diário: o primeiro item traz code/name; os demais só os números (como na API real).
export const HISTORICO = {
  USD: [
    { code: "USD", codein: "BRL", name: "Dólar Americano/Real Brasileiro", high: "5.0975", low: "5.0375", varBid: "0.0433", pctChange: "0.857778", bid: "5.0912", ask: "5.0923", timestamp: "1792097277", create_date: "2026-10-15 17:47:57" },
    { high: "5.0539", low: "5.0179", varBid: "0.0213", pctChange: "0.423748", bid: "5.0479", ask: "5.0483", timestamp: "1792013384" },
    { high: "5.0286", low: "4.9852", varBid: "0.0403", pctChange: "0.808215", bid: "5.0266", ask: "5.0269", timestamp: "1791930605" },
  ],
  EUR: [
    { code: "EUR", codein: "BRL", name: "Euro/Real Brasileiro", high: "5.72", low: "5.64", varBid: "0.07", pctChange: "1.2", bid: "5.7001", ask: "5.7010", timestamp: "1792097300", create_date: "2026-10-15 17:48:20" },
    { high: "5.65", low: "5.60", varBid: "0.02", pctChange: "0.3", bid: "5.6402", ask: "5.6410", timestamp: "1792013400" },
  ],
};

/**
 * Cria um "fetch" falso que responde como a AwesomeAPI.
 * `cotacoes`: objeto moeda → dados (padrão: COTACOES). `historico`: moeda → lista.
 * Retorna um vi.fn com a lista de chamadas em `.mock.calls`.
 */
export function criarFetchFalso({ cotacoes = COTACOES, historico = HISTORICO } = {}) {
  return vi.fn(async (url) => {
    const caminho = String(url);
    const ultimas = caminho.match(/\/json\/last\/(.+)$/);
    if (ultimas) {
      const pares = ultimas[1].split(",");
      const corpo = {};
      for (const par of pares) {
        const moeda = par.replace("-BRL", "");
        if (!cotacoes[moeda]) return Response.json({ status: 404, code: "CoinNotExists" }, { status: 404 });
        corpo[`${moeda}BRL`] = cotacoes[moeda];
      }
      return Response.json(corpo);
    }
    const diarias = caminho.match(/\/json\/daily\/([A-Z]+)-BRL\/(\d+)$/);
    if (diarias) {
      const lista = historico[diarias[1]];
      return lista ? Response.json(lista) : Response.json({ status: 404 }, { status: 404 });
    }
    return Response.json({}, { status: 404 });
  });
}

/** As URLs chamadas por um fetch falso, filtradas por trecho. */
export const urlsChamadas = (fetch, trecho = "") => fetch.mock.calls.map((c) => String(c[0])).filter((u) => u.includes(trecho));

/** Uma promise que o teste resolve ou rejeita quando quiser. */
export function adiada() {
  const controle = {};
  controle.promise = new Promise((resolver, rejeitar) => {
    controle.resolver = resolver;
    controle.rejeitar = rejeitar;
  });
  return controle;
}

export const semEspera = () => vi.fn(async () => {});
