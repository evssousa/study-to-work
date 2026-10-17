const NOME_VALIDO = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
const VERSAO_VALIDA = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z.-]+)?$/;
const SEM_VERSAO = new Set(["*", "latest", ""]);

const vazio = (texto) => typeof texto !== "string" || texto.trim() === "";

function dependenciasSemVersao(dependencias = {}) {
  return Object.keys(dependencias)
    .toSorted()
    .filter((nome) => SEM_VERSAO.has(dependencias[nome]))
    .map((nome) => `Dependência sem versão definida: ${nome}`);
}

export function validarPacote(pacote, arquivosExistentes = []) {
  const problemas = [];

  if (vazio(pacote.name)) problemas.push("Falta o campo name");
  else if (pacote.name.length > 214 || !NOME_VALIDO.test(pacote.name)) problemas.push(`Nome inválido: ${pacote.name}`);

  if (pacote.version === undefined) problemas.push("Falta o campo version");
  else if (!VERSAO_VALIDA.test(pacote.version)) problemas.push(`Versão inválida: ${pacote.version}`);

  if (vazio(pacote.description)) problemas.push("Falta o campo description");
  if (vazio(pacote.license)) problemas.push("Falta o campo license");
  if (pacote.type !== "module") problemas.push('Use "type": "module"');
  if (!pacote.repository) problemas.push("Falta o campo repository");

  if (pacote.bin) {
    const alvos = typeof pacote.bin === "string" ? [pacote.bin] : Object.values(pacote.bin);
    for (const arquivo of alvos) {
      if (!arquivosExistentes.includes(arquivo)) problemas.push(`O arquivo do bin não existe: ${arquivo}`);
    }
  }

  if (!Array.isArray(pacote.files) || pacote.files.length === 0) {
    problemas.push("Defina files para controlar o que é publicado");
  }

  const scriptDeTeste = pacote.scripts?.test;
  if (scriptDeTeste === undefined) problemas.push("Falta o script test");
  else if (scriptDeTeste.includes("no test specified")) problemas.push("O script test ainda é o padrão do npm init");

  if (!pacote.engines?.node) problemas.push("Defina engines.node");
  if (pacote.private === true) problemas.push("O pacote está marcado como private e não pode ser publicado");

  problemas.push(...dependenciasSemVersao(pacote.dependencies), ...dependenciasSemVersao(pacote.devDependencies));
  return problemas;
}
