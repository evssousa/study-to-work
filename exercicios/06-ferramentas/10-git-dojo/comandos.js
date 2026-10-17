/**
 * Exercício 10 — Dojo de Git: resolva situações reais do dia a dia
 *
 * Em cada cenário abaixo o teste monta um repositório TEMPORÁRIO com um problema típico, executa os
 * comandos Git que VOCÊ escreveu e confere o estado final. Seu repositório do curso nunca é tocado.
 *
 * Como fazer: em cada cenário, escreva a lista de comandos (textos, na ordem) que resolve o problema.
 *
 *   - um comando por item, sempre começando com `git` (nada de `&&`, `;`, `|` ou `>`);
 *   - nada interativo (sem `-i` / `--interactive`) e nada de rede (sem push, pull, fetch, clone);
 *   - mensagens com espaços ficam entre aspas:  'git commit -m "feat: algo"'
 *   - o repositório já tem identidade (nome e e-mail) configurada;
 *   - você NÃO edita arquivos: tudo se resolve com comandos do Git.
 *
 * Treine de verdade: crie uma pasta de teste, monte a situação e tente os comandos antes de
 * escrevê-los aqui. `git status` e `git log --oneline --graph --all` são seus melhores amigos.
 *
 * ───────────────────────────────────────────────────────────────────────────────────────────
 * 1. `mensagem` — Você acabou de fazer um commit, ainda NÃO enviou, e a mensagem está errada:
 *      adiciona calculo de desconto
 *    Troque a mensagem do ÚLTIMO commit por:  feat: adiciona calculo de desconto
 *    (o conteúdo do commit não pode mudar, nem o número de commits)
 *
 * 2. `desfazer` — O último commit ("fix: ajusta o imposto") já foi para o GitHub e quebrou tudo.
 *    Como outras pessoas já baixaram esse commit, NÃO reescreva a história. Desfaça os efeitos dele
 *    criando um commit NOVO (sem abrir o editor de mensagem).
 *
 * 3. `urgencia` — Você está na branch `feature/relatorio` com uma alteração pela metade em
 *    relatorio.js (não commitada). Chega um bug urgente: faça isto, nesta ordem:
 *      a) guarde o trabalho pela metade sem commitar;
 *      b) vá para a branch `main`;
 *      c) crie ali um commit VAZIO com a mensagem  fix: hotfix urgente
 *      d) volte para `feature/relatorio`;
 *      e) recupere o trabalho que você tinha guardado.
 *    No fim, a alteração pela metade deve estar de volta e nada pode sobrar guardado.
 *
 * 4. `umCommit` — A branch `experimento` tem 3 commits. Só o do meio ("fix: corrige arredondamento")
 *    é bom. Você está na `main`: traga APENAS esse commit para a `main`, sem os outros dois.
 *    (A branch experimento não pode ser alterada.)
 *
 * 5. `limpar` — Você bagunçou a pasta: alterou config.js sem querer (quer descartar a alteração) e
 *    criou o arquivo rascunho.txt que não serve para nada (quer apagá-lo). No fim, `git status` deve
 *    estar completamente limpo e nada pode ficar guardado.
 *
 * 6. `segredo` — O último commit ("feat: configura a API"), AINDA não enviado, incluiu sem querer o
 *    arquivo .env com uma senha. Faça o commit sair do repositório SEM apagar o .env do seu disco
 *    (você ainda precisa dele) e mantenha a mesma mensagem de commit.
 *    (Na vida real, se o .env já tivesse sido enviado ao GitHub, a senha estaria comprometida: seria
 *    preciso TROCÁ-LA. Apagar o arquivo depois não adianta, pois a história guarda tudo.)
 *
 * 7. `historiaLinear` — Você está na branch `feature` com 2 commits; enquanto isso, a `main` recebeu
 *    outro commit. Antes de abrir o Pull Request, deixe o histórico da `feature` em LINHA RETA: os seus
 *    2 commits devem ficar por cima da `main` atual, sem commit de merge.
 *
 * 8. `versao` — Marque o commit atual como a primeira versão do projeto: uma tag ANOTADA chamada
 *    v1.0.0 com a mensagem  Primeira versão
 * ───────────────────────────────────────────────────────────────────────────────────────────
 *
 * Aula: seção 7.4 a 7.6.
 * Teste: npm run exercicio -- 10-git-dojo
 */
export const solucoes = {
  mensagem: [],
  desfazer: [],
  urgencia: [],
  umCommit: [],
  limpar: [],
  segredo: [],
  historiaLinear: [],
  versao: [],
};
