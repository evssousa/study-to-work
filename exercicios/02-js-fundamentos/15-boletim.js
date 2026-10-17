/**
 * Exercício 15 — Boletim escolar (arrays de objetos)
 *
 * Cada aluno é um objeto assim: { nome: "Ana", notas: [8, 6.5, 9] }
 *
 * a) `calcularMedia(notas)` retorna a média das notas, arredondada para 1 casa decimal.
 *    Se não houver notas, retorna 0.
 *      calcularMedia([8, 6.5, 9]) → 7.8
 *
 * b) `situacao(aluno)` retorna, com base na média:
 *      - "aprovado"    se a média for 7 ou mais
 *      - "recuperação" se for 5 ou mais (e menor que 7)
 *      - "reprovado"   se for menor que 5
 *
 * c) `nomesDosAprovados(alunos)` recebe um array de alunos e retorna um array
 *    só com os NOMES dos aprovados, na mesma ordem.
 *
 * Reaproveite as funções: `situacao` deve usar `calcularMedia`, e
 * `nomesDosAprovados` deve usar `situacao`.
 *
 * Aula: seções 8 (funções que chamam funções) e 9 (arrays de objetos).
 * Teste: npm run exercicio -- 15-boletim
 */
export function calcularMedia(notas) {
  // escreva seu código aqui
}

export function situacao(aluno) {
  // escreva seu código aqui
}

export function nomesDosAprovados(alunos) {
  // escreva seu código aqui
}
