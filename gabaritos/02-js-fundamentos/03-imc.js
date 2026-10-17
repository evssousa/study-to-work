export function calcularIMC(pesoKg, alturaM) {
  const imc = pesoKg / (alturaM * alturaM);
  return Math.round(imc * 10) / 10;
}

export function classificarIMC(imc) {
  if (imc < 18.5) return "abaixo do peso";
  if (imc < 25) return "normal";
  if (imc < 30) return "sobrepeso";
  return "obesidade";
}
