/**
 * Exercício 06 — Eventos de teclado: uma galeria navegável
 *
 * `ativarGaleria(documento, fotos, imagem, legenda)`
 *    - `fotos`: array de objetos { arquivo: "praia.jpg", descricao: "Praia ao entardecer" }
 *    - `imagem`: o elemento <img> que mostra a foto atual
 *    - `legenda`: o elemento que mostra "2 de 5 — Praia ao entardecer"
 *
 * Comportamento:
 *   - Ao ativar, mostra a primeira foto: imagem.src = arquivo, imagem.alt = descricao,
 *     legenda.textContent = "1 de N — descricao".
 *   - Tecla ArrowRight → próxima foto. Na última, volta para a primeira (circular).
 *   - Tecla ArrowLeft  → foto anterior. Na primeira, vai para a última.
 *   - Tecla Home → primeira foto.  Tecla End → última foto.
 *   - Escape → volta para a primeira foto.
 *   - Qualquer outra tecla é ignorada.
 *   - IMPORTANTE: se a pessoa estiver digitando em um campo (evento.target é um <input>
 *     ou <textarea>), as teclas NÃO devem mudar a foto. Use evento.target.matches("input, textarea").
 *   - Nas teclas que você trata, chame evento.preventDefault() (para a página não rolar).
 *
 * O listener fica no `documento` (evento "keydown"): o teclado vale para a página toda.
 *   (Num navegador de verdade, a tecla "nasce" no elemento que tem o foco, ou no <body>, e
 *   sobe até o document: por isso o evento.target nunca é o próprio document.)
 *
 * O nome da tecla está em evento.key ("ArrowRight", "Home", "Escape"...).
 * Dica de aritmética circular: (indice + 1) % total   e   (indice - 1 + total) % total
 *
 * Aula: seção 2.4.
 * Teste: npm run exercicio -- 06-teclado
 */
export function ativarGaleria(documento, fotos, imagem, legenda) {
  // escreva seu código aqui
}
