export function somar(numeros) {
  return numeros.reduce((soma, numero) => soma + numero, 0);
}

export function totalDoCarrinho(itens) {
  return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
}

export function contarPorCategoria(produtos) {
  return produtos.reduce((contagem, produto) => {
    contagem[produto.categoria] = (contagem[produto.categoria] ?? 0) + 1;
    return contagem;
  }, {});
}

export function maisCaro(produtos) {
  return produtos.reduce((campeao, produto) => (campeao === null || produto.preco > campeao.preco ? produto : campeao), null);
}

export function agruparPorCategoria(produtos) {
  return produtos.reduce((grupos, produto) => {
    grupos[produto.categoria] ??= [];
    grupos[produto.categoria].push(produto);
    return grupos;
  }, {});
}
