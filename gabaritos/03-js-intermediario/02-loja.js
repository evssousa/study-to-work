export function nomes(produtos) {
  return produtos.map((produto) => produto.nome);
}

export function disponiveis(produtos) {
  return produtos.filter((produto) => produto.estoque > 0);
}

export function buscarPorId(produtos, id) {
  return produtos.find((produto) => produto.id === id) ?? null;
}

export function buscarPorNome(produtos, termo) {
  const busca = termo.toLowerCase();
  return produtos.filter((produto) => produto.nome.toLowerCase().includes(busca));
}

export function algumEsgotado(produtos) {
  return produtos.some((produto) => produto.estoque === 0);
}

export function todosDaCategoria(produtos, categoria) {
  return produtos.every((produto) => produto.categoria === categoria);
}
