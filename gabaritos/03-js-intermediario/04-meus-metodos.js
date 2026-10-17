export function meuMap(lista, transformar) {
  const resultado = [];
  for (let i = 0; i < lista.length; i++) {
    resultado.push(transformar(lista[i], i, lista));
  }
  return resultado;
}

export function meuFilter(lista, condicao) {
  const resultado = [];
  for (let i = 0; i < lista.length; i++) {
    if (condicao(lista[i], i, lista)) resultado.push(lista[i]);
  }
  return resultado;
}

export function meuReduce(lista, redutor, valorInicial) {
  let acumulado = valorInicial;
  for (let i = 0; i < lista.length; i++) {
    acumulado = redutor(acumulado, lista[i], i, lista);
  }
  return acumulado;
}
