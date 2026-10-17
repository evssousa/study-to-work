export async function somarEmParalelo(buscas) {
  const numeros = await Promise.all(buscas.map((busca) => busca()));
  return numeros.reduce((soma, numero) => soma + numero, 0);
}

export async function separarResultados(buscas) {
  const resultados = await Promise.allSettled(buscas.map((busca) => busca()));
  return {
    valores: resultados.filter((r) => r.status === "fulfilled").map((r) => r.value),
    erros: resultados.filter((r) => r.status === "rejected").map((r) => r.reason.message),
  };
}

export async function fonteMaisRapida(buscas) {
  try {
    return await Promise.any(buscas.map((busca) => busca()));
  } catch {
    throw new Error("Todas as fontes falharam");
  }
}

export async function emLotes(itens, tamanho, processar) {
  const resultados = [];
  for (let inicio = 0; inicio < itens.length; inicio += tamanho) {
    const lote = itens.slice(inicio, inicio + tamanho);
    resultados.push(...(await Promise.all(lote.map(processar))));
  }
  return resultados;
}
