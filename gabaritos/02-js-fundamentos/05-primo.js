export function ehPrimo(numero) {
  if (numero < 2) return false;
  for (let divisor = 2; divisor <= Math.sqrt(numero); divisor++) {
    if (numero % divisor === 0) return false;
  }
  return true;
}
