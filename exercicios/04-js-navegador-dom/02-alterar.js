/**
 * Exercício 02 — Alterando elementos: texto, classes, atributos e estilo
 *
 * a) `trocarTexto(elemento, texto)`
 *      troca o texto do elemento (textContent).
 *
 * b) `alternarTema(documento)`
 *      liga/desliga a classe "escuro" no <body> (classList.toggle) e RETORNA true se o tema
 *      escuro ficou ligado, false se ficou desligado.
 *
 * c) `marcarComoLido(artigo)`
 *      adiciona a classe "lido" e guarda data-lido="true" (use artigo.dataset.lido).
 *
 * d) `esconder(elemento)` e `mostrar(elemento)`
 *      usam a propriedade `hidden` (esconder → hidden = true, mostrar → hidden = false).
 *      Não use style.display: o atributo `hidden` também funciona para leitores de tela.
 *
 * e) `ativarAba(abas, indice)`
 *      `abas` é uma lista (array) de botões. A aba de posição `indice` fica com a classe
 *      "ativa" e aria-selected="true"; TODAS as outras perdem a classe "ativa" e ficam com
 *      aria-selected="false". Use classList e setAttribute.
 *
 * f) `definirCorPrimaria(elemento, cor)`
 *      define a variável CSS --cor-primaria no elemento:
 *      elemento.style.setProperty("--cor-primaria", cor)
 *
 * g) `marcarCampoInvalido(campo, mensagemDeErro)`
 *      Se a mensagem tiver texto: aria-invalid="true" no campo e a classe "invalido".
 *      Se a mensagem for vazia ("" ou null): REMOVE o atributo aria-invalid
 *      (removeAttribute) e a classe "invalido".
 *
 * Aula: seção 1.4.
 * Teste: npm run exercicio -- 02-alterar
 */
export function trocarTexto(elemento, texto) {
  // escreva seu código aqui
}

export function alternarTema(documento) {
  // escreva seu código aqui
}

export function marcarComoLido(artigo) {
  // escreva seu código aqui
}

export function esconder(elemento) {
  // escreva seu código aqui
}

export function mostrar(elemento) {
  // escreva seu código aqui
}

export function ativarAba(abas, indice) {
  // escreva seu código aqui
}

export function definirCorPrimaria(elemento, cor) {
  // escreva seu código aqui
}

export function marcarCampoInvalido(campo, mensagemDeErro) {
  // escreva seu código aqui
}
