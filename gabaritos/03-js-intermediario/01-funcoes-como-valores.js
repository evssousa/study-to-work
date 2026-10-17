export function aplicarATodos(numeros, transformar) {
  const resultado = [];
  for (const numero of numeros) {
    resultado.push(transformar(numero));
  }
  return resultado;
}

export function contarSe(lista, condicao) {
  let quantidade = 0;
  for (const item of lista) {
    if (condicao(item)) quantidade++;
  }
  return quantidade;
}

export function executarVezes(quantidade, acao) {
  const resultados = [];
  for (let i = 0; i < quantidade; i++) {
    resultados.push(acao(i));
  }
  return resultados;
}

export function aplicarDuasVezes(funcao, valor) {
  return funcao(funcao(valor));
}
