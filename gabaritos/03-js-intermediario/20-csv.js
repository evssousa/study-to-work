export function csvParaObjetos(texto, separador = ",") {
  const linhas = texto
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter((linha) => linha !== "");
  if (linhas.length === 0) return [];

  const [cabecalho, ...registros] = linhas;
  const chaves = cabecalho.split(separador).map((chave) => chave.trim());
  return registros.map((registro) => {
    const valores = registro.split(separador).map((valor) => valor.trim());
    return Object.fromEntries(chaves.map((chave, indice) => [chave, valores[indice]]));
  });
}

export function objetosParaCsv(objetos, separador = ",") {
  if (objetos.length === 0) return "";
  const chaves = Object.keys(objetos[0]);
  const linhas = objetos.map((objeto) => chaves.map((chave) => objeto[chave]).join(separador));
  return [chaves.join(separador), ...linhas].join("\n");
}
