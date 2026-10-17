export function somarAte(limite) {
  let soma = 0;
  for (let i = 1; i <= limite; i++) {
    soma += i;
  }
  return soma;
}

export function somarParesAte(limite) {
  let soma = 0;
  for (let i = 2; i <= limite; i += 2) {
    soma += i;
  }
  return soma;
}
