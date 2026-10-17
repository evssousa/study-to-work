/**
 * Exercício 09 — Desestruturação, spread e rest
 *
 * a) `formatarContato(contato)` — use DESESTRUTURAÇÃO no parâmetro, com valores padrão.
 *    contato: { nome, telefone?, endereco?: { cidade? } }
 *    Retorna: "Ana (Recife) — 81 99999-0000"
 *    Sem telefone usa "sem telefone"; sem endereço ou sem cidade usa "cidade não informada".
 *      formatarContato({ nome: "Bia" }) → "Bia (cidade não informada) — sem telefone"
 *
 * b) `primeiroEResto(lista)` → { primeiro, resto }  (desestruturação de array + rest)
 *      primeiroEResto([10, 20, 30]) → { primeiro: 10, resto: [20, 30] }
 *
 * c) `trocar(par)` → recebe [a, b] e retorna [b, a]
 *
 * d) `somarTodos(...numeros)` → soma quantos números forem passados (parâmetro rest)
 *      somarTodos(1, 2, 3) → 6        somarTodos() → 0
 *
 * e) `maiorDeTodos(...numeros)` → o maior, usando Math.max com spread; null se nenhum
 *
 * f) `juntarConfiguracoes(padrao, doUsuario)` → novo objeto com as configurações padrão,
 *    sobrescritas pelas do usuário (spread). Não altera nenhum dos dois.
 *      juntarConfiguracoes({ tema: "claro", idioma: "pt" }, { tema: "escuro" })
 *        → { tema: "escuro", idioma: "pt" }
 *
 * Aula: seções 4.1 a 4.3.
 * Teste: npm run exercicio -- 09-desestruturacao
 */
export function formatarContato(contato) {
  // escreva seu código aqui (troque o parâmetro por uma desestruturação)
}

export function primeiroEResto(lista) {
  // escreva seu código aqui
}

export function trocar(par) {
  // escreva seu código aqui
}

export function somarTodos() {
  // escreva seu código aqui (troque os parênteses por ...numeros)
}

export function maiorDeTodos() {
  // escreva seu código aqui
}

export function juntarConfiguracoes(padrao, doUsuario) {
  // escreva seu código aqui
}
