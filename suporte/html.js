import path from "node:path";
import { JSDOM } from "jsdom";
import { existe, lerTexto } from "./arquivos.js";

/**
 * Carrega um arquivo HTML como o navegador faria (sem executar scripts).
 * As folhas de estilo locais (<link rel="stylesheet" href="...">) também são
 * lidas, para que os testes possam conferir as regras de CSS.
 */
export function carregarPagina(caminhoDoHtml, { url } = {}) {
  const html = lerTexto(caminhoDoHtml);
  const dom = new JSDOM(html, url ? { url } : undefined);
  const { document } = dom.window;
  const pasta = path.dirname(caminhoDoHtml);

  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    const href = link.getAttribute("href") ?? "";
    if (/^(https?:)?\/\//.test(href)) continue;
    const caminhoDoCss = path.join(pasta, href);
    if (!existe(caminhoDoCss)) continue;
    const estilo = document.createElement("style");
    estilo.dataset.origem = href;
    estilo.textContent = lerTexto(caminhoDoCss);
    document.head.append(estilo);
  }

  return { dom, document, window: dom.window, html };
}

/** Carrega apenas um arquivo CSS, para testar as regras dele. */
export function carregarCSS(caminhoDoCss) {
  const css = lerTexto(caminhoDoCss);
  const dom = new JSDOM(`<!doctype html><html><head><style></style></head><body></body></html>`);
  dom.window.document.querySelector("style").textContent = css;
  return { document: dom.window.document, css };
}

/**
 * Lista todas as regras de CSS da página. Regras dentro de @media
 * vêm com a propriedade `media` preenchida (ex.: "(min-width: 768px)").
 */
export function listarRegras(document) {
  const regras = [];
  const percorrer = (lista, media) => {
    for (const regra of lista) {
      if (regra.selectorText !== undefined) {
        regras.push({ seletor: normalizarSeletor(regra.selectorText), estilo: regra.style, media });
      } else if (regra.cssRules) {
        percorrer(regra.cssRules, regra.media?.mediaText ?? regra.conditionText ?? media);
      }
    }
  };
  for (const folha of document.styleSheets) percorrer(folha.cssRules, null);
  return regras;
}

function normalizarSeletor(seletor) {
  return seletor
    .split(",")
    .map((parte) =>
      parte
        .trim()
        .replace(/\s*([>+~])\s*/g, " $1 ")
        .replace(/\s+/g, " "),
    )
    .join(", ");
}

const semEspacos = (texto) => texto.replace(/\s+/g, "");

/**
 * Valor de uma propriedade CSS declarada para um seletor.
 * Se houver várias regras para o mesmo seletor, vale a última (como na cascata).
 */
export function valorCSS(document, seletor, propriedade, { media = null } = {}) {
  const alvo = normalizarSeletor(seletor);
  let valor = "";
  for (const regra of listarRegras(document)) {
    const mesmaMedia =
      media === null ? regra.media === null : semEspacos(regra.media ?? "").includes(semEspacos(media));
    const seletores = regra.seletor.split(", ");
    if (mesmaMedia && (regra.seletor === alvo || seletores.includes(alvo))) {
      const v = regra.estilo.getPropertyValue(propriedade);
      if (v) valor = v.trim();
    }
  }
  return valor;
}

/** Retorna as media queries usadas no CSS da página, sem espaços: "(min-width:768px)". */
export function listarMedias(document) {
  return [...new Set(listarRegras(document).map((r) => r.media).filter(Boolean).map(semEspacos))];
}

const domDeApoio = new JSDOM("");

/**
 * Converte um valor para o formato que o navegador usa ao ler o CSS.
 * Ex.: normalizarValor("color", "#4b2e1e") → "rgb(75, 46, 30)".
 */
export function normalizarValor(propriedade, valor) {
  const estilo = domDeApoio.window.document.createElement("div").style;
  estilo.setProperty(propriedade, valor);
  return estilo.getPropertyValue(propriedade);
}

/** Compara dois valores de CSS ignorando espaços: "repeat(3,1fr)" = "repeat(3, 1fr)". */
export function mesmoValorCSS(a, b) {
  return semEspacos(a).toLowerCase() === semEspacos(b).toLowerCase();
}
