/**
 * Exercício 10 — Herança, polimorfismo e composição
 *
 * ── class Conta ────────────────────────────────────────────────
 *   new Conta(titular)                       saldo começa em 0 (centavos, campo privado #saldo)
 *   get titular, get saldo                   somente leitura
 *   depositar(valorCentavos)                 valor inteiro > 0, senão throw new Error("Valor inválido");
 *                                            soma ao saldo e registra no extrato; retorna `this`
 *   sacar(valorCentavos)                     valor inválido → "Valor inválido";
 *                                            se não puder sacar → throw new Error("Saldo insuficiente");
 *                                            subtrai e registra no extrato; retorna `this`
 *   get extrato                              array NOVO de { tipo: "deposito" | "saque", valorCentavos }
 *   get tipo                                 "Conta"  (os filhos sobrescrevem)
 *   descrever()                              `${tipo} de ${titular}: saldo de ${saldo} centavos`
 *   static get totalDeContas                 quantas contas já foram criadas (de qualquer tipo)
 *
 *   Regra de saque da Conta comum: o saldo não pode ficar negativo.
 *   Dica: para os filhos mudarem a regra, crie um método (protegido por convenção, com
 *   nome começando por _) como  _podeSacar(valor)  que o `sacar` consulta.
 *   Campos # privados NÃO são visíveis nas subclasses: por isso o saldo é lido pelo getter
 *   `saldo`, e os filhos não mexem direto nele.
 *
 * ── class ContaPoupanca extends Conta ──────────────────────────
 *   new ContaPoupanca(titular, taxaMensal)   ex.: 0.01 = 1% ao mês
 *   tipo → "Poupança"
 *   renderJuros()                            deposita Math.round(saldo × taxaMensal) centavos
 *                                            e retorna `this` (se o juros for 0, não registra nada)
 *
 * ── class ContaCorrente extends Conta ──────────────────────────
 *   new ContaCorrente(titular, limiteCentavos)   cheque especial: pode ficar negativo até -limite
 *   tipo → "Conta corrente"
 *   sacar passa a permitir saldo >= -limite (use super.sacar ou o _podeSacar)
 *
 * ── POLIMORFISMO ───────────────────────────────────────────────
 * `sacarDeTodas(contas, valorCentavos)` — recebe uma lista de contas de tipos variados e
 * tenta sacar de cada uma. Retorna um array de textos, um por conta, na ordem:
 *    "Ana (Conta): ok"   ou   "Bruno (Poupança): Saldo insuficiente"
 * Repare: a função NÃO pergunta o tipo de cada conta (nada de if/instanceof): cada
 * conta responde ao `sacar` do seu jeito. Isso é polimorfismo.
 * Use `${conta.titular} (${conta.tipo}): ...`
 *
 * ── COMPOSIÇÃO ─────────────────────────────────────────────────
 * Herança diz "é um" (Poupança É UMA Conta). Composição diz "TEM um": `Banco` tem contas.
 *   class Banco
 *     abrir(conta)          guarda a conta; retorna a conta
 *     get contas            array novo com as contas
 *     get patrimonioCentavos  soma dos saldos de todas as contas
 *     buscarPorTitular(nome)  as contas daquele titular (array)
 *
 * Aula: seção 6.4 e 6.5.
 * Teste: npm run exercicio -- 10-heranca
 */

// escreva as classes aqui (e exporte todas) e a função sacarDeTodas
