# Projeto 06 — Publique a calculadora CLT × PJ no npm

## O problema

Você já tem uma ferramenta útil: a calculadora do projeto 02. Mas hoje ela é uma pasta no seu computador. Para outra
pessoa usá-la, ela precisaria baixar o código, descobrir como rodar e torcer para funcionar. Compare com o que
você faz com qualquer ferramenta profissional:

```bash
npx @seu-usuario/clt-pj --salario 7000 --dependentes 1
```

Um comando, em qualquer computador com Node, sem instalar nada. **É isso que você vai construir**: transformar o
projeto 02 em um **pacote npm de verdade**: instalável, versionado, documentado, testado automaticamente a cada mudança
e com a qualidade garantida por ferramentas, como acontece nas empresas e nos projetos de código aberto.

O resultado serve de duas formas:

- como **ferramenta de terminal** (`clt-pj --salario 7000`), inclusive com saída `--json` para outros programas lerem;
- como **biblioteca** (`import { calcularSalarioLiquido } from "@seu-usuario/clt-pj"`), para outros desenvolvedores reaproveitarem as contas.

E é um ótimo item de portfólio, porque mostra o que poucos projetos de iniciante mostram: **versionamento, histórico
de commits organizado, integração contínua, changelog, licença e publicação**.

## Ponto de partida

Copie a pasta do seu projeto 02 (já aprovado pela correção do projeto 02) para uma pasta nova, chamada `clt-pj`, **com o seu próprio
repositório Git** (`git init`). Todo o resto é construído por cima. Faça **commits pequenos no padrão Conventional Commits** ao longo do
caminho: a correção confere o seu histórico.

## Estrutura (obrigatória: os testes procuram estes arquivos)

```
clt-pj/
├── package.json
├── package-lock.json          # gerado pelo npm; deve ser versionado
├── README.md
├── CHANGELOG.md
├── LICENSE
├── .gitignore
├── .editorconfig
├── .prettierrc.json
├── eslint.config.js
├── .husky/pre-commit
├── .github/
│   ├── workflows/ci.yml
│   └── pull_request_template.md
├── src/
│   ├── cli.js                 # o comando (começa com #!/usr/bin/env node)
│   ├── index.js               # a porta de entrada da BIBLIOTECA (só reexporta)
│   ├── calculos.js            # as contas (funções puras, sem console)
│   └── tabelas.js             # as tabelas oficiais do ano
└── test/
    ├── calculos.test.js       # com o test runner do Node (node:test)
    └── cli.test.js
```

## Requisitos

### 1. `package.json` pronto para publicar

Use como roteiro o linter de `package.json` que você escreveu no exercício 02 do módulo. Os testes conferem:

| Campo | Regra |
| --- | --- |
| `name` | **com escopo**: `@seu-usuario/clt-pj` (o escopo é o seu usuário do npm; evita colidir com nomes que já existem) |
| `version` | `1.0.0` (ou outra válida; precisa bater com a tag do Git e com o CHANGELOG) |
| `description` | pelo menos 20 caracteres |
| `author` | seu nome |
| `license` | `"MIT"` |
| `type` | `"module"` |
| `repository`, `bugs`, `homepage` | apontam para o seu repositório no GitHub (`repository` é obrigatório) |
| `keywords` | pelo menos 3 |
| `bin` | `{ "clt-pj": "src/cli.js" }`: o nome do comando é o nome do pacote **sem o escopo** |
| `exports` | `{ ".": "./src/index.js" }`: o que `import ... from "@seu-usuario/clt-pj"` entrega |
| `files` | só o que deve ser publicado: `["src", "README.md", "LICENSE", "CHANGELOG.md"]` (**nunca** os testes) |
| `engines` | `{ "node": ">=20" }` |
| `dependencies` | **nenhuma** (o pacote usa só o que o Node já traz) |
| `devDependencies` | `eslint`, `@eslint/js`, `globals`, `prettier`, `husky`, `lint-staged` |

**Scripts:**

| Script | Faz |
| --- | --- |
| `test` | `node --test` |
| `lint` | `eslint .` |
| `format` | `prettier --write .` |
| `format:check` | `prettier --check .` |
| `prepare` | `husky` (liga os hooks do Git depois do `npm install`) |
| `prepublishOnly` | roda `lint`, `format:check` e `test`: **o npm executa isto antes de publicar**, e se falhar, nada é publicado |

E a configuração do **lint-staged**: nos arquivos `*.js`, rodar `eslint --fix` e `prettier --write`; em
`*.{json,md,yml}`, `prettier --write`.

### 2. A linha de comando (`src/cli.js`)

Primeira linha: `#!/usr/bin/env node` (o *shebang*). Comportamento, executado **de qualquer pasta**:

| Comando | Resultado |
| --- | --- |
| `clt-pj --salario 6000` | As linhas do resumo (como no projeto 02). Código 0 |
| `clt-pj --salario 6000 --json` | **Só** um JSON no stdout (veja abaixo). Código 0 |
| `clt-pj --versao` ou `-v` | Só a versão do `package.json` (ex.: `1.0.0`). Código 0 |
| `clt-pj --ajuda` ou `-h` | Texto de ajuda que começa com `Uso:` e lista **todas** as opções (`--salario`, `--dependentes`, `--beneficios`, `--aliquota-pj`, `--contador`, `--meses`, `--json`, `--versao`, `--ajuda`). Código 0 |
| `clt-pj` (sem argumentos) | A ajuda, e código 1 |
| `clt-pj --salario 5000 --xyz` | **stderr**: `Opção desconhecida: --xyz` e uma dica para usar `--ajuda`. stdout vazio. Código 1 |
| `clt-pj --salario abc` | **stderr**: `Salário bruto inválido`. Código 1 |
| `clt-pj --salario` (sem valor) | Erro de uso no stderr (que **não** diga "opção desconhecida") com a dica da `--ajuda`. Código 1 |

**O JSON** (`--json`) tem exatamente estas chaves, todas **números em reais** (e não textos formatados como `"R$ 5.400,00"`):

```json
{
  "salarioBruto": 6000,
  "inss": 641.51,
  "irrf": 385.1,
  "salarioLiquido": 4973.39,
  "totalAnualCLT": 72711.87,
  "faturamentoPJEquivalente": 6446.09
}
```

Os valores têm que bater com o que a sua biblioteca calcula para as mesmas entradas, inclusive com
`--dependentes`, `--beneficios`, `--aliquota-pj 15,5` (vírgula decimal aceita), `--contador` e `--meses`.

Detalhes que fazem diferença:

- **Erros vão para o stderr** (`console.error`) e saem com código 1; resultados vão para o stdout. Assim `clt-pj --json | jq` nunca recebe lixo.
- **A versão vem do `package.json`**, lida a partir do arquivo do próprio pacote (`new URL("../package.json", import.meta.url)`), e **não** da pasta
  onde o comando foi executado. Os testes rodam o comando de outra pasta para conferir.
- **Valores que começam com `-`**: o `parseArgs` do Node acha que `-5` é outra opção; quem quer passar um número negativo escreve `--salario=-5`.
  Trate o erro de modo que a mensagem faça sentido (o erro do `parseArgs` tem a propriedade `code`: `ERR_PARSE_ARGS_UNKNOWN_OPTION` é diferente dos demais).
- `src/cli.js` só **interpreta argumentos e imprime**. As contas ficam em `calculos.js`, que não pode ter `console`, `process` nem leitura de arquivos.

### 3. A biblioteca (`src/index.js`)

Reexporta (`export { ... } from "./calculos.js"`) as funções `calcularSalarioLiquido`, `calcularPacoteAnualCLT`, `calcularPJEquivalente`,
`calcularINSS`, `calcularIRRF` e `arredondar`, e o objeto `tabelas`.

### 4. Testes do próprio pacote (`test/`)

Escritos com o **test runner nativo do Node** (`node:test` e `node:assert/strict`, como no exercício 07 do módulo). A correção roda o seu
`npm test` e exige **pelo menos 12 testes passando e nenhum falhando**, em pelo menos 2 arquivos. Cubra as contas (INSS progressivo, o teto,
IRRF, dependentes, validações, FGTS, PJ) **e** a linha de comando (`--versao`, `--ajuda`, erros, `--json`). Dica: nos testes das contas use tabelas
**fictícias com números redondos**, como fizeram os testes do projeto 02, para as contas poderem ser conferidas à mão.

### 5. Qualidade automática

- **`eslint.config.js`**: a configuração do exercício 05 do módulo (recomendadas + `eqeqeq`, `no-var`, `prefer-const`, `no-eval`, `no-unused-vars` com `_`
  ignorado, globais do Node). A correção testa a SUA configuração com código ruim de propósito: ela precisa reclamar de `var`, `==`, variável sem uso e `let` que podia ser `const`,
  e **não** reclamar de `console.log` nem de `process`. `npm run lint` precisa passar.
- **`.prettierrc.json`** à sua escolha, mas `npm run format:check` precisa passar em **todos** os arquivos (JS, JSON, Markdown, YAML).
- **`.editorconfig`**: `root = true`, `charset = utf-8`, `end_of_line = lf`, `indent_style = space`, `indent_size = 2`, `insert_final_newline = true`.
- **Husky**: `.husky/pre-commit` com `npx lint-staged`.
- **`.gitignore`**: `node_modules/`, `.env`, `coverage/`, `*.tgz`.

### 6. Integração contínua: `.github/workflows/ci.yml`

A cada `push` e `pull_request`, o GitHub deve rodar, num servidor Ubuntu (`ubuntu-latest`), uma **matriz** com Node 20, 22 e 24:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  qualidade:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20, 22, 24]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
      - run: npm test
```

(Entenda cada linha: a aula explica a anatomia de um workflow. A correção confere os trechos importantes; confira também no GitHub, na aba **Actions**, se ficou verde.)

`.github/pull_request_template.md`: com as seções **O que mudou** e **Como testar** e um checklist com pelo menos 3 itens (`- [ ]`), por exemplo lint, formatação e testes passando.

### 7. Documentos

- **`LICENSE`**: MIT, com `Copyright (c) <ano> <seu nome>` (sem placeholders).
- **`CHANGELOG.md`**: formato [Keep a Changelog](https://keepachangelog.com/pt-BR/): título `# Changelog`, seção `## [Unreleased]` e a entrada da versão atual
  `## [1.0.0] - AAAA-MM-DD` com pelo menos uma seção `### ...` (Novidades, Correções...).
- **`README.md`** (a vitrine do pacote): título; badges (pelo menos o da versão no npm: `https://img.shields.io/npm/v/@seu-usuario/clt-pj`); **Instalação** (com `npx @seu-usuario/clt-pj ...`
  e `npm install --global ...`); **Uso** com exemplo de saída; **Opções** (tabela); `--json` com exemplo; **Uso como biblioteca**; **Desenvolvimento** (como rodar testes, lint e formatação);
  **Licença**. Inclua também um aviso honesto: *as tabelas de INSS e IRRF são do ano X, vêm da fonte Y e o resultado é uma estimativa, não é aconselhamento contábil*.

### 8. Git e versão

- Repositório Git próprio, **com pelo menos 6 commits, todos no padrão Conventional Commits**, mostrando o trabalho (pelo menos um `feat`, um `test` e um `ci` ou `build`).
- `package-lock.json` **versionado**; `node_modules` e `.env` **nunca**.
- Árvore limpa no final (`git status` sem pendências).
- Uma **tag anotada** com a versão: `git tag -a v1.0.0 -m "Versão 1.0.0"`, apontando para um commit do histórico.

## O caminho sugerido (um passo de cada vez)

1. `git init` e o commit inicial (`chore: inicia o projeto`) com `package.json`, `.gitignore`, `.editorconfig` e `LICENSE`.
2. Reorganize os arquivos do projeto 02 e crie o `index.js` (`feat: ...`).
3. Melhore a CLI: `--ajuda`, `--versao`, `--json`, erros no stderr (`feat: ...`).
4. Escreva os testes com `node:test` (`test: ...`). Rode com `npm test`.
5. `npm install -D eslint @eslint/js globals prettier husky lint-staged`, configure tudo e rode `npm run format` uma vez para formatar o projeto inteiro (`build: ...`).
6. Crie o workflow e o template de PR (`ci: ...`). Suba para o GitHub e veja a aba **Actions** ficar verde.
7. Escreva README, CHANGELOG e documentos (`docs: ...`).
8. Antes de pedir a correção, rode você mesmo `npm run lint && npm run format:check && npm test` e `npm pack --dry-run` para ver o que seria publicado.
9. Crie a tag da versão.
10. *(Opcional, mas é a graça do projeto)* **publique de verdade**.

## Publicando de verdade (opcional)

> Publicar é **público e quase irreversível**: o nome e a versão publicados não podem ser reaproveitados, e só dá para despublicar nas primeiras horas. Por isso, faça o ensaio
> antes e só publique quando a correção estiver verde.

```bash
npm pack --dry-run          # lista os arquivos que iriam no pacote
npm publish --dry-run       # ensaia a publicação inteira (roda o prepublishOnly), sem publicar
npm login                   # uma vez; ative a verificação em duas etapas (2FA) na sua conta do npm
npm publish --access public # pacotes com escopo são privados por padrão; --access public libera
```

Depois, em outro computador (ou numa pasta vazia): `npx @seu-usuario/clt-pj --salario 7000`. Para testar localmente antes de publicar: `npm link`
dentro da pasta do projeto e rode `clt-pj --ajuda` de qualquer lugar.

## Correção

```bash
npm run corrigir-projeto -- 06 ../clt-pj
```

A correção **roda as ferramentas do seu projeto de verdade**: `npm run lint`, `npm run format:check`, `npm test`, `npm pack --dry-run` e o seu comando em outra pasta. Por isso,
rode `npm install` dentro de `clt-pj` antes. Ela leva alguns segundos a mais que a dos outros projetos.

Checagens **humanas** depois da correção:

- No GitHub, a aba **Actions** está verde nas três versões do Node?
- Abra um Pull Request de teste de uma branch qualquer: o template aparece pré-preenchido?
- Faça uma alteração propositalmente ruim (`var x = 1`) e tente commitar: o Husky barra?
- Peça a alguém (ou use outro computador) para rodar `npx` com o seu pacote.

## Para ir além (opcional)

- **Cobertura de testes**: `node --test --experimental-test-coverage`.
- Publicar com **provenance** (`npm publish --provenance` num workflow), que prova de onde o pacote veio.
- Automatizar o release com **release-please** ou **semantic-release**, lendo os Conventional Commits (o que você implementou nos exercícios 08 e 09!).
- Um comando `clt-pj comparar` para duas propostas lado a lado.
- Dependabot (`.github/dependabot.yml`) para manter as dependências atualizadas.

## O que falar na entrevista

"Peguei uma ferramenta de terminal minha e a transformei em um pacote publicado no npm. Configurei ESLint e Prettier, com Husky e lint-staged para barrar código fora do padrão antes
do commit, e uma pipeline no GitHub Actions que roda lint, formatação e testes em três versões do Node a cada push. O histórico segue Conventional Commits, tem changelog no formato Keep a Changelog e
versão marcada com tag, seguindo versionamento semântico. O pacote tem zero dependências de produção, funciona como comando e como biblioteca, e a saída `--json` permite
integrar com outras ferramentas. Também cuidei do que vai e do que não vai no pacote publicado, conferindo com `npm pack`."
