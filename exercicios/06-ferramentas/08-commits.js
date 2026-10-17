/**
 * Exercício 08 — Conventional Commits: ler e validar mensagens de commit
 *
 * O padrão "Conventional Commits" (módulo 00, seção 5.8) dá estrutura às mensagens, e isso permite
 * que FERRAMENTAS leiam o histórico: gerar o changelog sozinhas, decidir o número da próxima versão
 * e filtrar o que importa. Aqui você escreve o leitor dessas mensagens.
 *
 *   tipo(escopo)!: descrição curta
 *   <linha em branco>
 *   corpo opcional, com mais explicações
 *   <linha em branco>
 *   BREAKING CHANGE: rodapé opcional, explicando a quebra de compatibilidade
 *
 *   - o (escopo) é opcional:  feat(carrinho): permite alterar a quantidade
 *   - o ! antes do dois-pontos marca uma mudança que QUEBRA a compatibilidade: feat!: remove a opção --antiga
 *   - o tipo é um destes: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
 *
 * `analisarCommit(mensagem)` → { tipo, escopo, breaking, descricao, corpo }
 *
 *   escopo    o texto entre parênteses, ou null
 *   breaking  true se houver "!" antes do ":" OU se o corpo/rodapé tiver uma linha que comece com
 *             "BREAKING CHANGE:" (ou "BREAKING-CHANGE:")
 *   descricao o texto depois de ": ", sem espaços nas pontas
 *   corpo     tudo depois da primeira linha (sem a linha em branco inicial, sem espaços nas pontas),
 *             ou null se não houver
 *
 * Mensagens inválidas lançam um Error, verificadas NESTA ordem:
 *   mensagem vazia (ou só espaços)          "Mensagem vazia"
 *   primeira linha com mais de 72 letras    "A primeira linha passa de 72 caracteres"
 *   primeira linha fora do formato          "Formato inválido. Use tipo(escopo): descrição"
 *     (precisa ter: tipo em minúsculas, escopo opcional, "!" opcional, ":", pelo menos um espaço, e algo depois)
 *   tipo que não está na lista              `Tipo desconhecido: ${tipo}`
 *   descrição com menos de 3 caracteres     "Descrição muito curta"
 *
 * Exemplos:
 *   analisarCommit("feat(carrinho): permite alterar a quantidade")
 *     → { tipo: "feat", escopo: "carrinho", breaking: false, descricao: "permite alterar a quantidade", corpo: null }
 *   analisarCommit("fix!: remove a opção --antiga\n\nBREAKING CHANGE: use --nova")
 *     → { tipo: "fix", escopo: null, breaking: true, descricao: "remove a opção --antiga", corpo: "BREAKING CHANGE: use --nova" }
 *
 * Aula: seção 7.2.
 * Teste: npm run exercicio -- 08-commits
 */
export function analisarCommit(mensagem) {
  // escreva seu código aqui
}
