/**
 * Exercício 12 — Acordeão (FAQ) acessível, com teclado e foco
 *
 * Um acordeão mostra uma pergunta por vez. Para ser acessível, cada cabeçalho é um
 * <button> que informa ao leitor de tela se está aberto (aria-expanded) e qual painel
 * controla (aria-controls).
 *
 * `ativarAcordeao(raiz)` — a raiz contém:
 *
 *   <h3><button class="acordeao__botao" aria-expanded="false" aria-controls="p1">Pergunta 1</button></h3>
 *   <div class="acordeao__painel" id="p1" hidden>Resposta 1</div>
 *   <h3><button class="acordeao__botao" aria-expanded="true" aria-controls="p2">Pergunta 2</button></h3>
 *   <div class="acordeao__painel" id="p2">Resposta 2</div>
 *   ...
 *
 * Comportamento:
 *   - Ao ativar, deixe tudo coerente com aria-expanded: o painel de um botão com
 *     aria-expanded="true" fica visível; os demais ficam com o atributo hidden.
 *     Se mais de um começar aberto, só o PRIMEIRO fica aberto.
 *   - Clicar em um botão: se ele estava fechado, abre o seu painel e FECHA todos os outros
 *     (só um aberto por vez); se estava aberto, fecha (pode ficar tudo fechado).
 *     A cada mudança, atualize aria-expanded ("true"/"false") E o atributo hidden do painel.
 *     O painel de um botão é o elemento cujo id está em aria-controls.
 *   - Teclado, quando o foco está em um botão do acordeão:
 *       ArrowDown → foco no próximo botão (do último, volta ao primeiro);
 *       ArrowUp   → foco no botão anterior (do primeiro, vai ao último);
 *       Home / End → foco no primeiro / último botão.
 *     Nessas teclas chame evento.preventDefault(). (Enter e Espaço já ativam o botão
 *     sozinhos: um <button> faz isso de graça. Você não precisa tratar essas teclas.)
 *   - Use delegação: um listener de "click" e um de "keydown" na raiz.
 *
 * Aula: seção 6.
 * Teste: npm run exercicio -- 12-acordeao
 */
export function ativarAcordeao(raiz) {
  // escreva seu código aqui
}
