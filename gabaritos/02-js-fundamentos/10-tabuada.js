export function tabuada(numero) {
  const linhas = [];
  for (let i = 1; i <= 10; i++) {
    linhas.push(`${numero} x ${i} = ${numero * i}`);
  }
  return linhas;
}
