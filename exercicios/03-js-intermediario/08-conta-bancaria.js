/**
 * Exercício 08 — Métodos e `this`: uma conta bancária
 *
 * Complete a função `criarConta(titular)`. Ela retorna um OBJETO com dados e métodos.
 * Dentro dos métodos, use `this` para acessar os dados da própria conta.
 *
 * Dados:
 *   titular   → o nome recebido
 *   saldo     → começa em 0
 *   historico → começa como [] e recebe { tipo: "deposito" | "saque", valor }
 *
 * Métodos (escreva no formato curto: depositar(valor) { ... }):
 *   depositar(valor) → soma ao saldo e registra no histórico.
 *                      Valor menor ou igual a 0: throw new Error("Valor inválido")
 *   sacar(valor)     → subtrai do saldo e registra no histórico.
 *                      Valor menor ou igual a 0: throw new Error("Valor inválido")
 *                      Valor maior que o saldo: throw new Error("Saldo insuficiente")
 *   resumo()         → "Ana: saldo de 70 em 3 operações"
 *
 * depositar e sacar devem RETORNAR a própria conta (return this), para permitir
 * encadear chamadas:   conta.depositar(100).sacar(30).resumo()
 *
 * Aula: seção 3.5.
 * Teste: npm run exercicio -- 08-conta
 */
export function criarConta(titular) {
  // escreva seu código aqui
}
