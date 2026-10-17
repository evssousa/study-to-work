/**
 * Exercício 03 — Criando e removendo elementos (com segurança!)
 *
 * IMPORTANTE: nenhuma destas funções pode usar innerHTML nem insertAdjacentHTML com
 * dados recebidos. Use createElement e textContent. O teste tenta "injetar" HTML por meio
 * dos textos e confere que ele aparece como texto puro, nunca como elementos (isso é
 * proteção contra XSS, explicada na aula).
 *
 * a) `criarItem(documento, texto)`
 *      retorna um <li> com o texto (ainda não está na página).
 *
 * b) `renderizarLista(ul, textos)`
 *      esvazia a <ul> e coloca nela um <li> para cada texto, na ordem.
 *      Use ul.replaceChildren(...) e a função criarItem. O documento é ul.ownerDocument.
 *
 * c) `criarCartao(documento, { titulo, descricao, imagem })`
 *      retorna um <article class="cartao"> com, nesta ordem:
 *        - (só se `imagem` for informada) <img> com src = imagem e alt = "" (decorativa)
 *        - <h2> com o título
 *        - <p> com a descrição
 *      Use createElement, setAttribute e o método append.
 *
 * d) `criarCartaoComTemplate(template, { titulo, descricao })`
 *      O template é um <template> que contém:
 *        <article class="cartao"><h2></h2><p></p></article>
 *      Clone o conteúdo (template.content.cloneNode(true)), preencha o h2 e o p e retorne
 *      o <article> (o elemento, não o fragmento).
 *
 * e) `removerConcluidos(ul)`
 *      remove da lista todos os <li> com a classe "feita" e retorna quantos foram removidos.
 *
 * f) `moverParaOFim(ul, li)`
 *      move o <li> (que já está na lista) para a última posição. Dica: append MOVE um
 *      elemento que já está na página, não cria uma cópia.
 *
 * Aula: seção 1.5 e 1.6.
 * Teste: npm run exercicio -- 03-criar
 */
export function criarItem(documento, texto) {
  // escreva seu código aqui
}

export function renderizarLista(ul, textos) {
  // escreva seu código aqui
}

export function criarCartao(documento, { titulo, descricao, imagem }) {
  // escreva seu código aqui
}

export function criarCartaoComTemplate(template, { titulo, descricao }) {
  // escreva seu código aqui
}

export function removerConcluidos(ul) {
  // escreva seu código aqui
}

export function moverParaOFim(ul, li) {
  // escreva seu código aqui
}
