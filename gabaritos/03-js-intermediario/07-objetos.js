export function contarPalavras(texto) {
  const palavras = texto
    .toLowerCase()
    .split(" ")
    .filter((palavra) => palavra !== "");
  return palavras.reduce((contagem, palavra) => {
    contagem[palavra] = (contagem[palavra] ?? 0) + 1;
    return contagem;
  }, {});
}

export function maisFrequente(contagem) {
  const entradas = Object.entries(contagem);
  if (entradas.length === 0) return null;
  return entradas.reduce((campea, atual) => (atual[1] > campea[1] ? atual : campea))[0];
}

export function inverterObjeto(objeto) {
  return Object.fromEntries(Object.entries(objeto).map(([chave, valor]) => [valor, chave]));
}

export function filtrarObjeto(objeto, condicao) {
  return Object.fromEntries(Object.entries(objeto).filter(([chave, valor]) => condicao(valor, chave)));
}

export function criarObjeto(chave, valor) {
  return { [chave]: valor };
}

export function cidadeDoUsuario(usuario) {
  return usuario?.endereco?.cidade ?? "não informada";
}
