/**
 * Exercício 07 — Objetos a fundo
 *
 * a) `contarPalavras(texto)` → objeto com quantas vezes cada palavra aparece,
 *    em minúsculas. Palavras são separadas por espaços (pode haver espaços repetidos).
 *      contarPalavras("O gato e o rato") → { o: 2, gato: 1, e: 1, rato: 1 }
 *
 * b) `maisFrequente(contagem)` → a CHAVE com o maior valor (null se o objeto for vazio).
 *      maisFrequente({ o: 2, gato: 1 }) → "o"
 *
 * c) `inverterObjeto(objeto)` → troca chaves por valores.
 *      inverterObjeto({ a: "x", b: "y" }) → { x: "a", y: "b" }
 *
 * d) `filtrarObjeto(objeto, condicao)` → novo objeto só com as entradas em que
 *    condicao(valor, chave) é verdadeira.
 *      filtrarObjeto({ ana: 8, bia: 5 }, (nota) => nota >= 7) → { ana: 8 }
 *
 * e) `criarObjeto(chave, valor)` → um objeto com aquela chave (chave dinâmica).
 *      criarObjeto("email", "a@b.com") → { email: "a@b.com" }
 *
 * f) `cidadeDoUsuario(usuario)` → usuario.endereco.cidade, ou "não informada" se
 *    o usuário, o endereço ou a cidade não existirem (sem dar erro!).
 *
 * Aula: seções 3.1 a 3.4.
 * Teste: npm run exercicio -- 07-objetos
 */
export function contarPalavras(texto) {
  // escreva seu código aqui
}

export function maisFrequente(contagem) {
  // escreva seu código aqui
}

export function inverterObjeto(objeto) {
  // escreva seu código aqui
}

export function filtrarObjeto(objeto, condicao) {
  // escreva seu código aqui
}

export function criarObjeto(chave, valor) {
  // escreva seu código aqui
}

export function cidadeDoUsuario(usuario) {
  // escreva seu código aqui
}
