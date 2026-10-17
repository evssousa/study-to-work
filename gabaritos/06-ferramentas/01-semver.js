const PADRAO = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export function analisarVersao(texto) {
  const encontrado = PADRAO.exec(texto);
  if (!encontrado) throw new Error(`Versão inválida: ${texto}`);
  const [, maior, menor, patch, preLancamento] = encontrado;
  return { maior: Number(maior), menor: Number(menor), patch: Number(patch), preLancamento: preLancamento ?? null };
}

const ehNumero = (identificador) => /^\d+$/.test(identificador);

function compararPreLancamento(a, b) {
  const partesA = a.split(".");
  const partesB = b.split(".");
  for (let i = 0; i < Math.max(partesA.length, partesB.length); i++) {
    if (partesA[i] === undefined) return -1;
    if (partesB[i] === undefined) return 1;
    const [x, y] = [partesA[i], partesB[i]];
    if (x === y) continue;
    if (ehNumero(x) && ehNumero(y)) return Number(x) < Number(y) ? -1 : 1;
    if (ehNumero(x)) return -1;
    if (ehNumero(y)) return 1;
    return x < y ? -1 : 1;
  }
  return 0;
}

export function compararVersoes(a, b) {
  const va = analisarVersao(a);
  const vb = analisarVersao(b);
  for (const campo of ["maior", "menor", "patch"]) {
    if (va[campo] !== vb[campo]) return va[campo] < vb[campo] ? -1 : 1;
  }
  if (va.preLancamento === vb.preLancamento) return 0;
  if (va.preLancamento === null) return 1;
  if (vb.preLancamento === null) return -1;
  return compararPreLancamento(va.preLancamento, vb.preLancamento);
}

export function satisfaz(versao, intervalo) {
  const alvo = analisarVersao(versao);

  if (intervalo === "*") return alvo.preLancamento === null;

  const operador = /^(\^|~|>=|<=|>|<)(.+)$/.exec(intervalo);
  if (!operador) {
    try {
      analisarVersao(intervalo);
    } catch {
      throw new Error(`Intervalo inválido: ${intervalo}`);
    }
    return compararVersoes(versao, intervalo) === 0;
  }

  const [, simbolo, base] = operador;
  let referencia;
  try {
    referencia = analisarVersao(base);
  } catch {
    throw new Error(`Intervalo inválido: ${intervalo}`);
  }
  if (alvo.preLancamento !== null) return false;

  const comparacao = compararVersoes(versao, base);
  switch (simbolo) {
    case ">=":
      return comparacao >= 0;
    case ">":
      return comparacao > 0;
    case "<=":
      return comparacao <= 0;
    case "<":
      return comparacao < 0;
    case "~":
      return comparacao >= 0 && compararVersoes(versao, `${referencia.maior}.${referencia.menor + 1}.0`) < 0;
    case "^": {
      let limite;
      if (referencia.maior > 0) limite = `${referencia.maior + 1}.0.0`;
      else if (referencia.menor > 0) limite = `0.${referencia.menor + 1}.0`;
      else limite = `0.0.${referencia.patch + 1}`;
      return comparacao >= 0 && compararVersoes(versao, limite) < 0;
    }
    default:
      throw new Error(`Intervalo inválido: ${intervalo}`);
  }
}

export function proximaVersao(atual, tipo) {
  const { maior, menor, patch } = analisarVersao(atual);
  if (tipo === "maior") return `${maior + 1}.0.0`;
  if (tipo === "menor") return `${maior}.${menor + 1}.0`;
  if (tipo === "patch") return `${maior}.${menor}.${patch + 1}`;
  throw new Error(`Tipo de versão inválido: ${tipo}`);
}
