const UM_DIA_EM_MS = 24 * 60 * 60 * 1000;

const paraData = (iso) => new Date(`${iso}T00:00:00Z`);
const paraIso = (data) => data.toISOString().slice(0, 10);

export function formatarDataBR(iso) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function diasEntre(inicio, fim) {
  return Math.round((paraData(fim) - paraData(inicio)) / UM_DIA_EM_MS);
}

export function adicionarDias(iso, dias) {
  const data = paraData(iso);
  data.setUTCDate(data.getUTCDate() + dias);
  return paraIso(data);
}

export function diaDaSemana(iso) {
  return paraData(iso).toLocaleDateString("pt-BR", { weekday: "long", timeZone: "UTC" });
}

export function ehDiaUtil(iso) {
  const dia = paraData(iso).getUTCDay();
  return dia !== 0 && dia !== 6;
}

export function calcularIdade(nascimento, hoje) {
  const [anoN, mesN, diaN] = nascimento.split("-").map(Number);
  const [anoH, mesH, diaH] = hoje.split("-").map(Number);
  const jaFezAniversario = mesH > mesN || (mesH === mesN && diaH >= diaN);
  return anoH - anoN - (jaFezAniversario ? 0 : 1);
}
