export function maiorEMenor(numeros) {
  if (numeros.length === 0) return null;

  let maior = numeros[0];
  let menor = numeros[0];
  for (const numero of numeros) {
    if (numero > maior) maior = numero;
    if (numero < menor) menor = numero;
  }
  return { maior, menor };
}
