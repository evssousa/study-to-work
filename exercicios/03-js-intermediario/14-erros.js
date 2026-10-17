/**
 * Exercício 14 — Erros personalizados
 *
 * a) Crie e EXPORTE a classe `ValidacaoError`, que estende Error:
 *      new ValidacaoError("valor", "O valor deve ser um número positivo")
 *      → erro.name === "ValidacaoError"
 *      → erro.campo === "valor"
 *      → erro.message === "O valor deve ser um número positivo"
 *
 * b) Crie e EXPORTE a classe `SaldoInsuficienteError`, que estende Error:
 *      new SaldoInsuficienteError(100, 250)
 *      → erro.name === "SaldoInsuficienteError"
 *      → erro.saldo === 100 e erro.valor === 250
 *      → erro.message === "Saldo de 100 insuficiente para sacar 250"
 *
 * c) `sacar(saldo, valor)`:
 *      - valor que não é número ou é <= 0 → lança ValidacaoError("valor", "O valor deve ser um número positivo")
 *      - valor maior que o saldo          → lança SaldoInsuficienteError(saldo, valor)
 *      - senão                            → retorna o novo saldo
 *
 * d) `tentarSacar(saldo, valor, operacao = sacar)`: chama operacao(saldo, valor) dentro de
 *    um try/catch e retorna um objeto em vez de lançar:
 *      - deu certo                                   → { ok: true, saldo: novoSaldo }
 *      - ValidacaoError ou SaldoInsuficienteError    → { ok: false, erro: mensagemDoErro }
 *      - QUALQUER outro erro (um bug)                → lance de novo (não esconda bugs!)
 *    O parâmetro `operacao` existe para o teste conseguir simular um bug.
 *
 * e) `comRegistro(funcao, registro)`: coloca "início" no array `registro`, executa a
 *    funcao e retorna o resultado dela. Coloca "fim" no registro SEMPRE, mesmo se a
 *    funcao lançar erro (use finally). O erro, se houver, continua sendo lançado.
 *
 * Aula: seção 7.
 * Teste: npm run exercicio -- 14-erros
 */

// escreva as classes aqui

export function sacar(saldo, valor) {
  // escreva seu código aqui
}

export function tentarSacar(saldo, valor, operacao = sacar) {
  // escreva seu código aqui
}

export function comRegistro(funcao, registro) {
  // escreva seu código aqui
}
