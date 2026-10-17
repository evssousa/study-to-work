/**
 * Exercício 01 — Funções como valores (callbacks)
 *
 * Em JavaScript, uma função pode ser passada como argumento para outra função.
 * A função recebida é chamada de "callback".
 *
 * a) `aplicarATodos(numeros, transformar)` retorna um NOVO array com o resultado de
 *    transformar(numero) para cada número. Use for...of e push (não use .map, o teste confere).
 *      aplicarATodos([1, 2, 3], (n) => n * 10) → [10, 20, 30]
 *
 * b) `contarSe(lista, condicao)` retorna quantos itens fazem condicao(item) ser verdadeira.
 *      contarSe([3, 8, 12, 1], (n) => n > 5) → 2
 *
 * c) `executarVezes(quantidade, acao)` chama acao(0), acao(1), ... acao(quantidade - 1)
 *    e retorna um array com os resultados.
 *      executarVezes(3, (i) => i * i) → [0, 1, 4]
 *
 * d) `aplicarDuasVezes(funcao, valor)` retorna funcao(funcao(valor)).
 *      aplicarDuasVezes((n) => n + 3, 10) → 16
 *
 * Aula: seção 1.
 * Teste: npm run exercicio -- 01-funcoes
 */
export function aplicarATodos(numeros, transformar) {
  // escreva seu código aqui
}

export function contarSe(lista, condicao) {
  // escreva seu código aqui
}

export function executarVezes(quantidade, acao) {
  // escreva seu código aqui
}

export function aplicarDuasVezes(funcao, valor) {
  // escreva seu código aqui
}
