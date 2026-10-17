export const solucoes = {
  mensagem: ['git commit --amend -m "feat: adiciona calculo de desconto"'],
  desfazer: ["git revert HEAD --no-edit"],
  urgencia: [
    "git stash",
    "git switch main",
    'git commit --allow-empty -m "fix: hotfix urgente"',
    "git switch feature/relatorio",
    "git stash pop",
  ],
  umCommit: ["git cherry-pick experimento~1"],
  limpar: ["git restore config.js", "git clean -f"],
  segredo: ["git rm --cached .env", "git commit --amend --no-edit"],
  historiaLinear: ["git rebase main"],
  versao: ['git tag -a v1.0.0 -m "Primeira versão"'],
};
