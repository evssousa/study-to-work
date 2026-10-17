import { afterEach } from "vitest";
import { caminhoDoProjeto } from "../../../suporte/arquivos.js";
import { digitar, disparar, instalarClassesDoDom, textoDe } from "../../../suporte/dom.js";
import { carregarPagina } from "../../../suporte/html.js";
import { importarDoProjeto, semEspera } from "./carregar.js";

const abertos = [];
afterEach(() => {
  // Para os timers de atualização automática de cada painel aberto no teste.
  while (abertos.length > 0) abertos.pop().parar?.();
});

/** Uma cotação já salva no formato que o app grava no localStorage. */
export const COTACAO_SALVA = {
  moeda: "USD",
  nome: "Dólar Americano",
  taxa: 5.0931,
  variacaoPercentual: 0.895418,
  maxima: 5.097,
  minima: 5.0375,
  timestamp: 1792098492,
};

export const guardadoComUsd = { versao: 1, moeda: "USD", cotacoes: [COTACAO_SALVA] };

/**
 * Abre o index.html do aluno num navegador de mentira, chama iniciarPainel e devolve
 * funções para "usar" a tela.
 */
export async function abrirPainel({ fetch, guardado, moedas = ["USD", "EUR"], intervaloMs = 60_000, esperar = semEspera() } = {}) {
  const { iniciarPainel } = await importarDoProjeto("ui.js");
  const pagina = carregarPagina(caminhoDoProjeto("index.html"), { url: "http://localhost/" });
  instalarClassesDoDom(pagina.window);
  const { document, window } = pagina;

  if (guardado !== undefined) {
    window.localStorage.setItem("painel-cambio:v1", typeof guardado === "string" ? guardado : JSON.stringify(guardado));
  }
  const raiz = document.querySelector("#app");
  const painel = iniciarPainel(raiz, { fetch, storage: window.localStorage, moedas, intervaloMs, esperar });
  abertos.push(painel ?? {});

  const q = (seletor) => raiz.querySelector(seletor);
  const todos = (seletor) => [...raiz.querySelectorAll(seletor)];

  const ui = {
    ...pagina,
    raiz,
    painel,
    storage: window.localStorage,
    q,
    todos,
    texto: (seletor) => textoDe(q(seletor)),
    estado: (seletor) => q(seletor).dataset.estado,
    estadoCotacoes: () => q("#estado-cotacoes").dataset.estado,
    textoCotacoes: () => textoDe(q("#estado-cotacoes")),
    estadoHistorico: () => q("#estado-historico").dataset.estado,
    textoHistorico: () => textoDe(q("#estado-historico")),
    linhas: () => todos("#tabela-cotacoes tbody tr"),
    celulas: (moeda, classe) => textoDe(q(`#tabela-cotacoes tr[data-moeda="${moeda}"] .${classe}`)),
    historico: () => todos("#lista-historico li").map((li) => textoDe(li)),
    conversao: () => textoDe(q("#resultado-conversao")),
    digitarValor: (digitos) => digitar(q("#form-conversor [name=valor]"), digitos),
    campoValor: () => q("#form-conversor [name=valor]").value,
    escolherMoeda(moeda) {
      const seletor = q("#form-conversor [name=moeda]");
      seletor.value = moeda;
      disparar(seletor, "change");
    },
    escolherDirecao(direcao) {
      const seletor = q("#form-conversor [name=direcao]");
      seletor.value = direcao;
      disparar(seletor, "change");
    },
    atualizar: () => q("#btn-atualizar").click(),
    guardadoAgora: () => JSON.parse(window.localStorage.getItem("painel-cambio:v1")),
  };
  return ui;
}
