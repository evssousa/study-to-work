export function memoizar(funcao) {
  const cache = {};
  return (argumento) => {
    if (!(argumento in cache)) {
      cache[argumento] = funcao(argumento);
    }
    return cache[argumento];
  };
}

export function debounce(funcao, esperaMs) {
  let temporizador = null;
  return (...argumentos) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcao(...argumentos), esperaMs);
  };
}
