const pagos = (pedidos) => pedidos.filter((pedido) => pedido.status === "pago");

export function totalDoPedido(pedido) {
  return pedido.itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
}

export function faturamento(pedidos) {
  return pagos(pedidos)
    .map(totalDoPedido)
    .reduce((soma, total) => soma + total, 0);
}

export function ticketMedio(pedidos) {
  const quantidade = pagos(pedidos).length;
  if (quantidade === 0) return 0;
  return Math.round((faturamento(pedidos) / quantidade) * 100) / 100;
}

export function clientesQueCompraram(pedidos) {
  const nomes = pagos(pedidos).map((pedido) => pedido.cliente);
  return [...new Set(nomes)].toSorted((a, b) => a.localeCompare(b, "pt-BR"));
}

export function itensVendidos(pedidos) {
  return pagos(pedidos).flatMap((pedido) => pedido.itens.map((item) => `${item.quantidade}x ${item.produto}`));
}
