import { proximaVersao } from "./01-semver.js";
import { analisarCommit } from "./08-commits.js";

function interpretar(mensagens) {
  const commits = [];
  for (const mensagem of mensagens) {
    try {
      commits.push(analisarCommit(mensagem));
    } catch {
      // mensagens fora do padrão (merges, "wip"...) são ignoradas
    }
  }
  return commits;
}

export function tipoDeVersao(mensagens) {
  const commits = interpretar(mensagens);
  if (commits.some((c) => c.breaking)) return "maior";
  if (commits.some((c) => c.tipo === "feat")) return "menor";
  if (commits.some((c) => c.tipo === "fix" || c.tipo === "perf")) return "patch";
  return null;
}

export function proximaVersaoPelosCommits(versaoAtual, mensagens) {
  const tipo = tipoDeVersao(mensagens);
  return tipo === null ? versaoAtual : proximaVersao(versaoAtual, tipo);
}

const item = ({ escopo, descricao }) => (escopo ? `- **${escopo}:** ${descricao}` : `- ${descricao}`);

export function gerarChangelog(versao, data, mensagens) {
  const commits = interpretar(mensagens);
  const secoes = [
    ["Mudanças que quebram compatibilidade", commits.filter((c) => c.breaking)],
    ["Novidades", commits.filter((c) => !c.breaking && c.tipo === "feat")],
    ["Correções", commits.filter((c) => !c.breaking && c.tipo === "fix")],
    ["Desempenho", commits.filter((c) => !c.breaking && c.tipo === "perf")],
  ].filter(([, lista]) => lista.length > 0);

  const linhas = [`## [${versao}] - ${data}`, ""];
  if (secoes.length === 0) {
    linhas.push("Sem mudanças relevantes para os usuários.");
  } else {
    for (const [titulo, lista] of secoes) {
      linhas.push(`### ${titulo}`, "", ...lista.map(item), "");
    }
  }
  return `${linhas.join("\n").trimEnd()}\n`;
}
