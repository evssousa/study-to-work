# Exercício 04 — Git na prática

Este exercício usa o **seu** repositório (a cópia deste curso no seu GitHub). Faça tudo
pelo terminal, na raiz do repositório.

1. Confira se o Git sabe quem você é:
   `git config --global user.name` e `git config --global user.email`.
   Se estiverem vazios, configure (seção 5.3 da aula).
2. Crie e mude para uma branch chamada `pratica/git`:
   `git switch -c pratica/git`
3. Crie o arquivo `exercicios/00-ambiente-web-git/04-git/sobre-mim.md` com:
   - um título (`# Sobre mim`)
   - pelo menos 3 linhas contando quem você é e por que está estudando programação
4. Faça o commit **seguindo o Conventional Commits**, por exemplo:
   `git add exercicios/00-ambiente-web-git/04-git/sobre-mim.md`
   `git commit -m "docs: adiciona apresentação pessoal"`
5. Acrescente ao arquivo uma seção `## Meus objetivos` e faça um **segundo commit**,
   também no padrão (ex.: `docs: adiciona objetivos de estudo`).
6. Volte para a branch principal e traga as mudanças:
   `git switch main` e depois `git merge pratica/git`
7. Envie para o GitHub: `git push` (e `git push -u origin pratica/git` para enviar a branch).

Teste: `npm run exercicio -- 04-git`
