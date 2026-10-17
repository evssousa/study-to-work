const ORDENS = ["relevancia", "preco", "nome"];

function lerNumero(texto) {
  if (texto === null || texto.trim() === "") return null;
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : null;
}

export function lerFiltros(busca) {
  const parametros = new URLSearchParams(busca);
  const pagina = Number(parametros.get("pagina"));
  const ordem = parametros.get("ordem");
  return {
    categoria: parametros.get("categoria") || null,
    min: lerNumero(parametros.get("min")),
    max: lerNumero(parametros.get("max")),
    ordem: ORDENS.includes(ordem) ? ordem : "relevancia",
    pagina: Number.isInteger(pagina) && pagina >= 1 ? pagina : 1,
  };
}

export function montarBusca({ categoria, min, max, ordem, pagina }) {
  const parametros = new URLSearchParams();
  if (categoria) parametros.set("categoria", categoria);
  if (min !== null) parametros.set("min", String(min));
  if (max !== null) parametros.set("max", String(max));
  if (ordem !== "relevancia") parametros.set("ordem", ordem);
  if (pagina !== 1) parametros.set("pagina", String(pagina));
  const texto = parametros.toString();
  return texto === "" ? "" : `?${texto}`;
}

export function linkWhatsApp(telefone, mensagem) {
  let numero = telefone.replace(/\D/g, "");
  if (numero.length < 10) throw new Error("Telefone inválido");
  if (numero.length <= 11) numero = `55${numero}`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
