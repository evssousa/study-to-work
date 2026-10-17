/**
 * Exercício 01 — Selecionando elementos
 *
 * Todas as funções recebem o `documento` (a página). Em um site de verdade você usaria
 * a variável global `document`; aqui ela chega como parâmetro para o teste conseguir
 * entregar uma página de mentira. A página de teste tem este HTML:
 *
 *   <header><nav>
 *     <a href="/">Início</a>
 *     <a href="/produtos" class="ativo">Produtos</a>
 *     <a href="/contato">Contato</a>
 *   </nav></header>
 *   <main>
 *     <h1 id="titulo">Loja do Bairro</h1>
 *     <ul class="lista">
 *       <li class="item">Café</li>
 *       <li class="item destaque">Pão</li>
 *       <li class="item">Leite</li>
 *     </ul>
 *   </main>
 *
 * a) `tituloDaPagina(documento)`     → o texto do elemento #titulo
 * b) `textosDosLinks(documento)`     → array com o texto de cada link do menu (nav a)
 *      → ["Início", "Produtos", "Contato"]
 * c) `quantosItens(documento)`       → quantos elementos .item existem
 * d) `itemEmDestaque(documento)`     → o texto do item com a classe .destaque;
 *                                      null se não existir nenhum
 * e) `enderecoDoLinkAtivo(documento)` → o valor do atributo href do link .ativo ("/produtos")
 * f) `primeiroItemDe(lista)`         → recebe um ELEMENTO (a ul) e retorna o texto do primeiro
 *                                      li DENTRO dele; null se não houver. Use lista.querySelector.
 *
 * Dicas: querySelectorAll devolve uma NodeList, que não tem .map. Converta com
 * [...nodeList] ou Array.from(nodeList). O texto de um elemento está em .textContent.
 *
 * Aula: seção 1.3.
 * Teste: npm run exercicio -- 01-selecionar
 */
export function tituloDaPagina(documento) {
  // escreva seu código aqui
}

export function textosDosLinks(documento) {
  // escreva seu código aqui
}

export function quantosItens(documento) {
  // escreva seu código aqui
}

export function itemEmDestaque(documento) {
  // escreva seu código aqui
}

export function enderecoDoLinkAtivo(documento) {
  // escreva seu código aqui
}

export function primeiroItemDe(lista) {
  // escreva seu código aqui
}
