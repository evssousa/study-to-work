export function formatarContato({ nome, telefone = "sem telefone", endereco: { cidade = "cidade não informada" } = {} }) {
  return `${nome} (${cidade}) — ${telefone}`;
}

export function primeiroEResto([primeiro, ...resto]) {
  return { primeiro, resto };
}

export function trocar([a, b]) {
  return [b, a];
}

export function somarTodos(...numeros) {
  return numeros.reduce((soma, numero) => soma + numero, 0);
}

export function maiorDeTodos(...numeros) {
  if (numeros.length === 0) return null;
  return Math.max(...numeros);
}

export function juntarConfiguracoes(padrao, doUsuario) {
  return { ...padrao, ...doUsuario };
}
