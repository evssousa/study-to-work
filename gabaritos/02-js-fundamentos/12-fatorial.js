export function fatorial(n) {
  if (n < 0) throw new Error("Não existe fatorial de número negativo");
  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
}

export function fatorialRecursivo(n) {
  if (n < 0) throw new Error("Não existe fatorial de número negativo");
  if (n === 0) return 1;
  return n * fatorialRecursivo(n - 1);
}
