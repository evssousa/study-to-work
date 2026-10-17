export function criarContador(inicial = 0) {
  let atual = inicial;
  return {
    incrementar: () => ++atual,
    decrementar: () => --atual,
    valor: () => atual,
    resetar: () => {
      atual = inicial;
      return atual;
    },
  };
}

export function criarGeradorDeId(prefixo) {
  let ultimo = 0;
  return () => {
    ultimo++;
    return `${prefixo}-${ultimo}`;
  };
}

export function executarUmaVez(funcao) {
  let jaExecutou = false;
  let resultado;
  return (...argumentos) => {
    if (!jaExecutou) {
      resultado = funcao(...argumentos);
      jaExecutou = true;
    }
    return resultado;
  };
}

export function criarMultiplicador(fator) {
  return (numero) => numero * fator;
}
