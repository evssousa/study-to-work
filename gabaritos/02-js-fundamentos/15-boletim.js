export function calcularMedia(notas) {
  if (notas.length === 0) return 0;
  let soma = 0;
  for (const nota of notas) soma += nota;
  return Math.round((soma / notas.length) * 10) / 10;
}

export function situacao(aluno) {
  const media = calcularMedia(aluno.notas);
  if (media >= 7) return "aprovado";
  if (media >= 5) return "recuperação";
  return "reprovado";
}

export function nomesDosAprovados(alunos) {
  const nomes = [];
  for (const aluno of alunos) {
    if (situacao(aluno) === "aprovado") nomes.push(aluno.nome);
  }
  return nomes;
}
