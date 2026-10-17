/**
 * Exercício 06 — Encadeando métodos: relatório de pedidos
 *
 * Cada pedido tem este formato:
 *   {
 *     id: 1,
 *     cliente: "Ana",
 *     status: "pago",            // "pago", "pendente" ou "cancelado"
 *     itens: [{ produto: "Café", preco: 25, quantidade: 2 }, ...],
 *   }
 *
 * Só pedidos com status "pago" contam nos relatórios.
 *
 * a) `totalDoPedido(pedido)`          → soma de preco × quantidade dos itens
 * b) `faturamento(pedidos)`           → soma dos totais dos pedidos pagos
 * c) `ticketMedio(pedidos)`           → faturamento ÷ quantidade de pedidos pagos,
 *                                       arredondado em 2 casas; 0 se não houver pedidos pagos
 * d) `clientesQueCompraram(pedidos)`  → nomes dos clientes com pedido pago, SEM repetir,
 *                                       em ordem alfabética
 * e) `itensVendidos(pedidos)`         → um array de textos "2x Café" com todos os itens dos
 *                                       pedidos pagos, na ordem dos pedidos (use flatMap)
 *
 * Reaproveite: faturamento usa totalDoPedido.
 *
 * Aula: seção 2.7.
 * Teste: npm run exercicio -- 06-encadeamento
 */
export function totalDoPedido(pedido) {
  // escreva seu código aqui
}

export function faturamento(pedidos) {
  // escreva seu código aqui
}

export function ticketMedio(pedidos) {
  // escreva seu código aqui
}

export function clientesQueCompraram(pedidos) {
  // escreva seu código aqui
}

export function itensVendidos(pedidos) {
  // escreva seu código aqui
}
