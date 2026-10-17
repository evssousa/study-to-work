export function capitalizar(texto) {
  return texto
    .toLowerCase()
    .split(" ")
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");
}

export function truncar(texto, limite) {
  if (texto.length <= limite) return texto;
  return `${texto.slice(0, limite - 1)}…`;
}
