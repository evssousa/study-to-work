export function contarVogais(frase) {
  let quantidade = 0;
  for (const caractere of frase.toLowerCase().normalize("NFD")) {
    if ("aeiou".includes(caractere)) quantidade++;
  }
  return quantidade;
}
