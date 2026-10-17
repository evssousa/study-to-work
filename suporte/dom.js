import { JSDOM } from "jsdom";

/**
 * Cria uma página de mentira (um "navegador" dentro do Node) com o HTML informado,
 * para os testes de exercícios que mexem no DOM.
 * A URL é necessária para o localStorage funcionar.
 */
export function criarDom(html = "", { url = "http://localhost/" } = {}) {
  const dom = new JSDOM(`<!doctype html><html lang="pt-BR"><head><title>Teste</title></head><body>${html}</body></html>`, { url });
  instalarClassesDoDom(dom.window);
  return { dom, window: dom.window, document: dom.window.document };
}

// Classes que existem no navegador como globais (new FormData(form), evento instanceof Node...).
// No Node elas não existem ou são outras, que não entendem os elementos do jsdom.
const CLASSES_GLOBAIS = [
  "FormData",
  "Event",
  "CustomEvent",
  "KeyboardEvent",
  "MouseEvent",
  "Node",
  "Element",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLFormElement",
  "DocumentFragment",
];

export function instalarClassesDoDom(janela) {
  for (const nome of CLASSES_GLOBAIS) {
    Object.defineProperty(globalThis, nome, { value: janela[nome], configurable: true, writable: true });
  }
}

/** Dispara um evento que "sobe" pela árvore (bubbles), como os eventos reais do navegador. */
export function disparar(elemento, tipo, opcoes = {}) {
  const janela = elemento.ownerDocument?.defaultView ?? elemento.defaultView;
  const evento = new janela.Event(tipo, { bubbles: true, cancelable: true, ...opcoes });
  elemento.dispatchEvent(evento);
  return evento;
}

/** Simula a pessoa digitando: troca o valor e dispara o evento "input". */
export function digitar(campo, texto) {
  campo.value = texto;
  return disparar(campo, "input");
}

/** Simula o pressionar de uma tecla (keydown) no elemento ou no document. */
export function pressionar(alvo, tecla, opcoes = {}) {
  const janela = alvo.ownerDocument?.defaultView ?? alvo.defaultView;
  const evento = new janela.KeyboardEvent("keydown", { key: tecla, bubbles: true, cancelable: true, ...opcoes });
  alvo.dispatchEvent(evento);
  return evento;
}

/** Simula o envio de um formulário (dispara o evento "submit", como o botão de enviar faz). */
export function enviar(formulario) {
  formulario.requestSubmit();
}

/** Marca ou desmarca uma caixa de seleção e dispara "change", como um clique faria. */
export function marcar(caixa, marcada = true) {
  caixa.checked = marcada;
  return disparar(caixa, "change");
}

/** Texto de um elemento, sem espaços repetidos nas pontas. */
export function textoDe(elemento) {
  return elemento?.textContent.replace(/\s+/g, " ").trim() ?? null;
}
