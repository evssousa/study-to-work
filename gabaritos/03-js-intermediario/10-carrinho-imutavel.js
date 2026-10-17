export function adicionarItem(carrinho, produto) {
  const existe = carrinho.some((item) => item.id === produto.id);
  if (!existe) return [...carrinho, { ...produto, quantidade: 1 }];
  return carrinho.map((item) => (item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item));
}

export function removerItem(carrinho, id) {
  return carrinho.filter((item) => item.id !== id);
}

export function alterarQuantidade(carrinho, id, quantidade) {
  if (quantidade <= 0) return removerItem(carrinho, id);
  return carrinho.map((item) => (item.id === id ? { ...item, quantidade } : item));
}

export function totalDoCarrinho(carrinho) {
  return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
}
