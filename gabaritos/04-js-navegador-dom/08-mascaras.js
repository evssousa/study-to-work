const apenasDigitos = (texto) => texto.replace(/\D/g, "");

export function mascararTelefone(texto) {
  const d = apenasDigitos(texto).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  const fimDoMeio = d.length === 11 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, fimDoMeio)}-${d.slice(fimDoMeio)}`;
}

export function mascararCEP(texto) {
  const d = apenasDigitos(texto).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function mascararReais(texto) {
  const d = apenasDigitos(texto);
  if (d === "") return "";
  return (Number(d) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ativarMascara(campo, mascara) {
  campo.value = mascara(campo.value);
  campo.addEventListener("input", () => {
    campo.value = mascara(campo.value);
  });
}
