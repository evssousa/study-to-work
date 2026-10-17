/**
 * Exercício 16 — Gerador de slug (endereços amigáveis)
 *
 * Blogs e lojas transformam títulos em endereços legíveis:
 *   "Promoção de Verão: até 50% OFF!"  →  /blog/promocao-de-verao-ate-50-off
 *
 * `criarSlug(texto)` deve:
 *   1. colocar tudo em minúsculas e remover os acentos (normalize("NFD") + regex
 *      que remove os caracteres de acento: /[̀-ͯ]/g);
 *   2. trocar cada sequência de caracteres que NÃO são letras a-z ou números por UM hífen;
 *   3. remover hífens do começo e do fim.
 *
 * Exemplos:
 *   criarSlug("Olá, Mundo!")                       → "ola-mundo"
 *   criarSlug("  Promoção de Verão: até 50% OFF! ") → "promocao-de-verao-ate-50-off"
 *   criarSlug("C++ & JavaScript")                  → "c-javascript"
 *
 * Aula: seção 8.
 * Teste: npm run exercicio -- 16-slug
 */
export function criarSlug(texto) {
  // escreva seu código aqui
}
