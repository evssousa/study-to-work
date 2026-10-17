export function fibonacci(quantidade) {
  const sequencia = [];
  for (let i = 0; i < quantidade; i++) {
    if (i < 2) {
      sequencia.push(i);
    } else {
      sequencia.push(sequencia[i - 1] + sequencia[i - 2]);
    }
  }
  return sequencia;
}
