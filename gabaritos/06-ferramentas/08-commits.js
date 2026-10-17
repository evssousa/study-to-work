const TIPOS = ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"];
const PRIMEIRA_LINHA = /^([a-z]+)(?:\(([^()\s][^()]*)\))?(!)?: +(\S.*)$/;

export function analisarCommit(mensagem) {
  const texto = mensagem.trim();
  if (texto === "") throw new Error("Mensagem vazia");

  const [primeiraLinha, ...resto] = texto.split(/\r?\n/);
  if (primeiraLinha.length > 72) throw new Error("A primeira linha passa de 72 caracteres");

  const encontrado = PRIMEIRA_LINHA.exec(primeiraLinha);
  if (!encontrado) throw new Error("Formato inválido. Use tipo(escopo): descrição");

  const [, tipo, escopo, exclamacao, descricaoBruta] = encontrado;
  if (!TIPOS.includes(tipo)) throw new Error(`Tipo desconhecido: ${tipo}`);

  const descricao = descricaoBruta.trim();
  if (descricao.length < 3) throw new Error("Descrição muito curta");

  const corpo = resto.join("\n").trim() || null;
  const quebraNoCorpo = corpo !== null && /^BREAKING[ -]CHANGE:/m.test(corpo);

  return { tipo, escopo: escopo ?? null, breaking: exclamacao === "!" || quebraNoCorpo, descricao, corpo };
}
