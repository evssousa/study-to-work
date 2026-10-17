/**
 * Exercício 09 — Do histórico do Git ao changelog e à próxima versão
 *
 * Com mensagens no padrão Conventional Commits (exercício 08), dá para AUTOMATIZAR duas tarefas
 * que as equipes odeiam fazer à mão: escrever o changelog (a lista do que mudou em cada versão) e
 * decidir o número da próxima versão. É assim que ferramentas como semantic-release e
 * release-please funcionam.
 *
 * Use os exercícios anteriores:
 *   import { analisarCommit } from "./08-commits.js";
 *   import { proximaVersao } from "./01-semver.js";
 *
 * Todas as funções recebem um array de MENSAGENS de commit (texto). Mensagens que não seguem o
 * padrão (como "Merge branch 'main'...") são simplesmente IGNORADAS, sem lançar erro.
 *
 * a) `tipoDeVersao(mensagens)` → "maior" | "menor" | "patch" | null
 *      "maior"  se algum commit for breaking (!, ou BREAKING CHANGE);
 *      "menor"  se não houver quebra, mas houver algum `feat`;
 *      "patch"  se não houver feat, mas houver algum `fix` ou `perf`;
 *      null     se só houver docs, chore, style, refactor, test, build, ci, revert ou nada
 *               (nada que o usuário perceba: não vale lançar versão nova).
 *
 * b) `proximaVersaoPelosCommits(versaoAtual, mensagens)` → a próxima versão (texto).
 *    Se tipoDeVersao for null, devolve a versão atual sem mudar.
 *
 * c) `gerarChangelog(versao, data, mensagens)` → texto em Markdown, neste formato EXATO:
 *
 *      ## [1.3.0] - 2026-10-15
 *
 *      ### Mudanças que quebram compatibilidade
 *
 *      - **api:** troca o formato da resposta
 *
 *      ### Novidades
 *
 *      - **carrinho:** permite alterar a quantidade
 *      - adiciona exportação em CSV
 *
 *      ### Correções
 *
 *      - corrige o frete grátis
 *
 *      ### Desempenho
 *
 *      - acelera o cálculo do imposto
 *
 *    Regras:
 *      - o título é `## [versao] - data`; depois uma linha em branco;
 *      - as seções, nesta ordem: "Mudanças que quebram compatibilidade" (qualquer commit
 *        breaking, seja do tipo que for), "Novidades" (feat), "Correções" (fix), "Desempenho" (perf).
 *        Um commit breaking aparece SÓ na seção de quebras, e não duplicado na do seu tipo;
 *      - seção sem nenhum item não aparece;
 *      - cada item é "- " + descrição; se houver escopo: "- **escopo:** descrição";
 *      - itens na ordem em que os commits foram recebidos;
 *      - uma linha em branco depois de cada título de seção e depois de cada seção;
 *      - o texto termina com UMA quebra de linha;
 *      - se NENHUM commit entrar em seção (só docs/chore...), o texto é:
 *          "## [versao] - data\n\nSem mudanças relevantes para os usuários.\n"
 *
 * Aula: seção 7.3.
 * Teste: npm run exercicio -- 09-changelog
 */
import { proximaVersao } from "./01-semver.js";
import { analisarCommit } from "./08-commits.js";

export function tipoDeVersao(mensagens) {
  // escreva seu código aqui
}

export function proximaVersaoPelosCommits(versaoAtual, mensagens) {
  // escreva seu código aqui
}

export function gerarChangelog(versao, data, mensagens) {
  // escreva seu código aqui
}
