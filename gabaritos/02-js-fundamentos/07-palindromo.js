const PERMITIDOS = "abcdefghijklmnopqrstuvwxyz0123456789";

export function ehPalindromo(texto) {
  const separado = texto.toLowerCase().normalize("NFD");
  let limpo = "";
  for (const caractere of separado) {
    if (PERMITIDOS.includes(caractere)) limpo += caractere;
  }

  let invertido = "";
  for (let i = limpo.length - 1; i >= 0; i--) {
    invertido += limpo[i];
  }
  return limpo === invertido;
}
