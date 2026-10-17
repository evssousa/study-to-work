/**
 * Exercício 05 — Delegação de eventos
 *
 * Colocar um listener em CADA item da lista não funciona para itens criados depois, e
 * desperdiça memória. A solução é UM listener só, na lista (o pai), e descobrir qual
 * filho foi clicado com evento.target.closest(...).
 *
 * `ativarLista(ul)` — a lista tem itens assim:
 *   <li data-id="1">
 *     <span class="texto">Comprar pão</span>
 *     <button data-acao="remover" aria-label="Remover Comprar pão">✕</button>
 *   </li>
 *
 * Regras:
 *   - clicar no botão de remover (ou em qualquer coisa dentro dele) remove o <li> inteiro;
 *   - clicar em qualquer outro lugar do <li> alterna a classe "feita" nesse <li>;
 *   - clicar na lista fora de qualquer item (no espaço vazio, na própria <ul>) não faz nada;
 *   - itens ADICIONADOS DEPOIS da chamada de ativarLista também funcionam;
 *   - use exatamente UM addEventListener (o teste espia a chamada!).
 *
 * Passo a passo sugerido, dentro do listener:
 *   const botao = evento.target.closest('[data-acao="remover"]');
 *   const item  = evento.target.closest("li");
 *   if (!item) return;           // clicou fora de um item
 *   ...
 *
 * Por que closest e não evento.target direto? Se o usuário clicar no ✕, o target pode
 * ser um elemento dentro do botão (como um <svg>), e não o botão.
 *
 * Aula: seção 2.3.
 * Teste: npm run exercicio -- 05-delegacao
 */
export function ativarLista(ul) {
  // escreva seu código aqui
}
