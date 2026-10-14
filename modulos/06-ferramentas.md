# Módulo 06 — Ferramentas do dia a dia profissional

**Duração:** 2 semanas · **Pré-requisito:** Módulo 05

## Objetivos

- Gerenciar dependências com npm.
- Usar um bundler moderno (Vite).
- Garantir qualidade com ESLint, Prettier e hooks de Git.
- Trabalhar com Git como em uma empresa (branches, PRs, code review).

---

## 1. npm e o `package.json`

```bash
npm init -y                  # cria o package.json
npm install date-fns         # dependência de produção
npm install -D vitest        # dependência de desenvolvimento
npm uninstall date-fns
npm run dev                  # roda um script
npx create-vite@latest       # executa um pacote sem instalar
npm outdated                 # dependências desatualizadas
npm audit                    # vulnerabilidades conhecidas
```

```json
{
  "name": "meu-projeto",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "dependencies": { "date-fns": "^4.1.0" },
  "devDependencies": { "vite": "^7.0.0" }
}
```

- **Versionamento semântico** `MAJOR.MINOR.PATCH`: `^4.1.0` aceita `4.x.x`; `~4.1.0` aceita `4.1.x`.
- O `package-lock.json` trava as versões exatas — **sempre** faça commit dele.
- `node_modules` **nunca** vai para o Git.
- Alternativas: **pnpm** (mais rápido, muito usado em monorepos) e **yarn**.

## 2. Vite — servidor de desenvolvimento e build

```bash
npm create vite@latest meu-app -- --template vanilla
cd meu-app
npm install
npm run dev     # servidor com recarregamento instantâneo
npm run build   # gera a pasta dist/ otimizada para produção
```

O que um bundler faz: junta e minifica arquivos, resolve `import` de pacotes do npm, otimiza
imagens e CSS, e gera arquivos com *hash* no nome para cache.

Variáveis de ambiente no Vite: arquivo `.env` com `VITE_API_URL=...` e acesso via
`import.meta.env.VITE_API_URL`. Lembre: **tudo que vai para o frontend é público.**

## 3. Qualidade de código

### ESLint — encontra bugs e más práticas

```bash
npm init @eslint/config@latest
npx eslint .
```

### Prettier — formata automaticamente

```bash
npm install -D prettier
```

```json
// .prettierrc
{ "semi": true, "singleQuote": false, "printWidth": 100 }
```

Configure o VS Code para **formatar ao salvar** (`"editor.formatOnSave": true`).

### Hooks de Git com Husky + lint-staged

Roda o lint e o formatador antes de cada commit, só nos arquivos alterados:

```bash
npm install -D husky lint-staged
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

```json
// package.json
"lint-staged": { "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"] }
```

## 4. Git como em uma empresa

### Fluxo com Pull Requests (GitHub Flow)

```bash
git switch main && git pull
git switch -c feat/filtro-categoria
# ... trabalha e faz commits pequenos ...
git push -u origin feat/filtro-categoria
# abre um Pull Request no GitHub → revisão → ajustes → merge
```

### Comandos que salvam o dia

```bash
git stash / git stash pop          # guarda mudanças temporariamente
git commit --amend                 # corrige o último commit (antes do push)
git restore arquivo.js             # descarta mudanças locais em um arquivo
git revert <hash>                  # desfaz um commit criando outro (seguro em branch compartilhada)
git rebase main                    # reaplica seus commits sobre a main atualizada
git log --graph --oneline --all    # visualiza o histórico
git blame arquivo.js               # quem alterou cada linha
git bisect                         # encontra o commit que introduziu um bug
```

### Code review — como dar e receber

- PRs **pequenos** (até ~400 linhas) com descrição: o quê, por quê, como testar, prints.
- Ao revisar: seja gentil e específico, sugira em vez de ordenar, diferencie
  "obrigatório" de "sugestão/nit".
- Ao receber: não leve para o pessoal; responda todos os comentários.

## 5. Outras ferramentas que você vai encontrar

- **EditorConfig** — padroniza indentação entre editores.
- **Postman / Insomnia / Bruno** ou a extensão *REST Client* — testar APIs.
- **Chrome DevTools avançado** — Performance, Lighthouse, Memory.
- **Markdown** — documentação e READMEs.

---

## Exercícios

1. Migre o projeto Kanban (módulo 04) para Vite, com ESLint e Prettier.
2. Instale uma biblioteca do npm (ex.: `date-fns`) e use-a para formatar os prazos.
3. Configure Husky + lint-staged e tente commitar um código com erro de lint.
4. Simule trabalho em equipe: crie 3 issues no GitHub, resolva cada uma em uma branch e abra
   um PR para cada, com descrição completa. Faça merge com *squash*.
5. Use `git bisect` para encontrar um bug que você inseriu de propósito em um commit antigo.

## Projeto do módulo

**Template de projeto profissional**: um repositório "template" no GitHub com Vite, ESLint,
Prettier, Husky, lint-staged, EditorConfig, `.gitignore`, README modelo (descrição, tecnologias,
como rodar, prints) e template de Pull Request (`.github/pull_request_template.md`).
Use-o para iniciar todos os próximos projetos.

## Checklist para avançar

- [ ] Entendo `package.json`, dependências, scripts e versionamento semântico.
- [ ] Crio e faço build de projetos com Vite.
- [ ] Meus projetos têm lint e formatação automáticos.
- [ ] Trabalho com branches, PRs, rebase, stash e revert.
