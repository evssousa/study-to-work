/**
 * Exercício 07 — Palíndromo
 *
 * Palíndromo é um texto que se lê igual de trás para frente: "arara", "ovo".
 *
 * `ehPalindromo(texto)` retorna true ou false, IGNORANDO:
 *   - maiúsculas e minúsculas ("Ana" é palíndromo)
 *   - acentos ("Após a sopa" é palíndromo)
 *   - espaços, hífens e pontuação ("Socorram-me, subi no ônibus em Marrocos")
 *
 * Passo a passo sugerido:
 *   1. Coloque tudo em minúsculas e separe os acentos: texto.toLowerCase().normalize("NFD")
 *   2. Monte um texto "limpo" só com letras de a-z e números (percorra caractere por caractere
 *      e use "abcdefghijklmnopqrstuvwxyz0123456789".includes(caractere)).
 *   3. Compare o texto limpo com ele mesmo invertido (você já fez isso no exercício 06).
 *
 * Aula: seção 4 (strings: toLowerCase, normalize, includes) e 7 (laços).
 * Teste: npm run exercicio -- 07-palindromo
 */
export function ehPalindromo(texto) {
  // escreva seu código aqui
}
