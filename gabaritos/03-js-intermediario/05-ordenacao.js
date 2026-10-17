export function ordenarPorPreco(produtos) {
  return produtos.toSorted((a, b) => a.preco - b.preco);
}

export function ordenarPorNome(produtos) {
  return produtos.toSorted((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export function ordenarPorCategoriaEPreco(produtos) {
  return produtos.toSorted((a, b) => a.categoria.localeCompare(b.categoria, "pt-BR") || b.preco - a.preco);
}

export function maisVendidos(vendas, quantidade) {
  return vendas.toSorted((a, b) => b.unidades - a.unidades).slice(0, quantidade);
}
