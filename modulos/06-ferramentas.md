# Módulo 06 — Ferramentas do dia a dia profissional

> **Duração sugerida:** 3 semanas (ritmo regular).
> **Pré-requisitos:** Módulos 00 a 05.
> **Projeto do módulo:** a calculadora CLT × PJ vira um **pacote publicado no npm**, com testes, ESLint, Prettier, Husky, CI no GitHub e changelog.

## Objetivos

Até aqui você aprendeu a **escrever** código. Este módulo ensina o que cerca o código em qualquer empresa e em qualquer projeto sério:

- Usar o **terminal** com mais fluidez (pipes, redirecionamentos, códigos de saída).
- Gerenciar **dependências** com o npm: versionamento semântico, `package.json`, lockfile e segurança.
- Separar **configuração** do código, com variáveis de ambiente e arquivos `.env`.
- Entender o **Vite** (servidor de desenvolvimento e build) e a diferença entre módulos ES e CommonJS.
- Garantir qualidade automática com **ESLint**, **Prettier**, **EditorConfig**, **Husky** e **lint-staged**.
- Escrever **testes** com o test runner nativo do Node e medir a qualidade deles.
- Trabalhar com **Git como em uma equipe**: GitHub Flow, Pull Requests, Conventional Commits, `stash`, `rebase`, `cherry-pick`, `revert`, tags e como se salvar de erros.
- Automatizar verificações com **integração contínua** (GitHub Actions).
- **Publicar um pacote** no npm.

> Os exercícios aparecem nos blocos **✏️ Pratique agora**, logo depois de cada assunto.
> Resolva cada um assim que chegar nele, antes de continuar a leitura.

### Como o curso corrige este módulo

Diferente dos módulos anteriores, aqui os testes **executam as ferramentas de verdade**: o ESLint lê a sua configuração e analisa código, o Prettier formata, o `git` roda
os seus comandos em repositórios temporários, o `node --test` roda os seus testes contra versões defeituosas do código, e o `npm pack` mostra o que seria publicado. Por isso o
curso instala ESLint e Prettier para você (`npm install` na raiz). Nunca é tocado o seu repositório pessoal nos exercícios de Git: tudo acontece numa pasta temporária.

---

## 1. Terminal além do básico

No módulo 00 você aprendeu a navegar e a mexer em arquivos. O que torna o terminal poderoso é **combinar** comandos pequenos.

### 1.1 Entrada, saída e redirecionamento

Todo programa tem três "canais": **stdin** (entrada), **stdout** (saída normal) e **stderr** (saída de erro). No terminal, os dois últimos aparecem na tela, mas são canais diferentes
(foi por isso que o seu `console.error` foi para um canal e o `console.log` para outro).

```bash
echo "Olá" > saudacao.txt        # > escreve a saída em um arquivo (SOBRESCREVE)
echo "Mundo" >> saudacao.txt     # >> acrescenta ao fim do arquivo
cat saudacao.txt                 # mostra o arquivo
node programa.js 2> erros.txt    # 2> redireciona só o canal de erro
node programa.js > saida.txt 2>&1   # os dois para o mesmo arquivo
node programa.js < entrada.txt   # < alimenta a entrada com um arquivo
```

### 1.2 Pipes: ligando comandos

O **pipe** (`|`) liga a **saída** de um comando à **entrada** do próximo, como uma linha de montagem:

```bash
ls -la | grep ".md"              # lista os arquivos e mostra só os que têm ".md"
cat extrato.csv | wc -l          # quantas linhas tem o arquivo?
git log --oneline | head -5      # só os 5 commits mais recentes
npm ls | grep eslint             # a árvore de pacotes, filtrada
history | grep "git commit"      # procure um comando que você digitou antes
```

Os parceiros de pipe mais comuns:

| Comando | Para quê |
| --- | --- |
| `grep padrao` | filtra as linhas que contêm o padrão (`-i` ignora maiúsculas, `-n` mostra o número da linha, `-r` procura em pastas) |
| `head -n 5` / `tail -n 5` | as primeiras / últimas linhas (`tail -f arquivo` acompanha um log ao vivo) |
| `wc -l` | conta linhas |
| `sort` / `uniq` | ordena / remove linhas repetidas seguidas |
| `find . -name "*.js"` | procura arquivos por nome |
| `less arquivo` | lê um arquivo grande com rolagem (`q` sai) |

Quando uma ferramenta imprime **JSON**, o `jq` filtra: `curl -s https://api... | jq ".USDBRL.bid"`. Por isso o seu `--json` do projeto importa: programas conversam por texto.

### 1.3 Códigos de saída e encadeamento

Todo comando termina com um **código de saída**: `0` é sucesso e qualquer outro número é falha (você usou `process.exit(1)` nos projetos).

```bash
node verificar.js                 # roda
echo $?                           # mostra o código de saída do último comando (no PowerShell: $LASTEXITCODE)

npm run lint && npm test          # && : só roda o segundo se o primeiro der certo (código 0)
npm run lint || echo "falhou"     # || : só roda o segundo se o primeiro falhar
npm run build ; npm run deploy    # ;  : roda os dois, de qualquer jeito
```

É por causa dos códigos de saída que o **CI** (seção 8) e o **Husky** (seção 5.5) sabem se uma verificação passou: eles só olham esse número.

### 1.4 Variáveis de ambiente e o `PATH`

```bash
echo $HOME                        # no PowerShell: $env:USERPROFILE
NODE_ENV=production node app.js   # define uma variável SÓ para este comando (bash/Git Bash)
which node                        # onde está o programa "node" (no Windows PowerShell: Get-Command node)
echo $PATH                        # a lista de pastas onde o terminal procura programas
```

O `PATH` é como o terminal sabe o que fazer quando você digita `node`: ele procura um programa com esse nome em cada pasta da lista. O npm usa isso quando instala um pacote com comando (`bin`):
ele coloca o comando numa pasta que está no `PATH`.

### 1.5 Produtividade

| Atalho | Faz |
| --- | --- |
| `↑` / `↓` | percorre o histórico de comandos |
| `Ctrl+R` | busca no histórico enquanto você digita |
| `Tab` | completa nomes de arquivos e comandos |
| `Ctrl+C` | interrompe o programa em execução |
| `Ctrl+L` | limpa a tela |
| `Ctrl+A` / `Ctrl+E` | começo / fim da linha |
| `!!` | repete o último comando (bash) |

> **Windows:** os exemplos usam sintaxe de bash. No VS Code, escolha **Git Bash** como terminal padrão (módulo 00) para eles funcionarem. No PowerShell, os nomes mudam
> (`Get-Content`, `Select-String`...), mas as ideias são as mesmas. No Codespaces e no Mac, é bash/zsh direto.

---

## 2. npm e o `package.json`

### 2.1 O que é o npm

O **npm** (*Node Package Manager*) faz três coisas: é o **gerenciador** que instala bibliotecas no seu projeto, é o **registro**
público (npmjs.com) com mais de dois milhões de pacotes e é o **executor de scripts** do seu projeto. Alternativas que fazem o mesmo trabalho: **pnpm** (mais rápido, economiza disco, muito usado em monorepos)
e **yarn**. O funcionamento é igual; muda o comando.

### 2.2 Os comandos do dia a dia

```bash
npm init -y                   # cria um package.json
npm install                   # instala TUDO o que está no package.json (apelido: npm i)
npm install date-fns          # instala uma biblioteca e a registra em "dependencies"
npm install -D vitest         # instala como dependência de DESENVOLVIMENTO ("devDependencies")
npm uninstall date-fns        # remove
npm update                    # atualiza dentro dos intervalos permitidos
npm outdated                  # mostra o que tem versão mais nova
npm ls                        # a árvore de dependências (npm ls --depth=0 mostra só as diretas)
npm audit                     # vulnerabilidades conhecidas nas dependências
npm run nome-do-script        # executa um script do package.json (npm test e npm start dispensam o "run")
npx nome-do-pacote            # executa um pacote SEM instalá-lo (baixa, roda e descarta)
```

### 2.3 `dependencies` x `devDependencies`

| Seção | O que vai nela | Exemplo |
| --- | --- | --- |
| `dependencies` | o que o **seu código precisa para funcionar** em produção | `express`, `date-fns`, `zod` |
| `devDependencies` | o que só **você, desenvolvendo,** precisa: testes, lint, formatador, build | `eslint`, `prettier`, `vitest`, `vite` |

Quem instala o seu pacote baixa só as `dependencies`. Por isso um pacote enxuto, com **zero dependências**, é um diferencial: menos peso, menos risco de segurança, menos coisa quebrando
(o projeto deste módulo é assim).

Existe ainda `peerDependencies` (bibliotecas que exigem que o projeto *hospedeiro* já tenha algo, como "meu plugin precisa do React") e `optionalDependencies`. Você os verá em bibliotecas.

### 2.4 Versionamento semântico (SemVer)

Toda versão de pacote tem o formato **MAIOR.MENOR.PATCH** (por exemplo, `4.17.21`):

| Parte | Muda quando... | Exemplo | Seguro atualizar? |
| --- | --- | --- | --- |
| **MAIOR** (`4`.x.x) | a mudança **quebra a compatibilidade**: código antigo pode parar de funcionar | remover uma função, mudar o formato de retorno | **leia as notas** antes |
| **MENOR** (x.`17`.x) | acrescenta funcionalidade **sem quebrar** nada | uma opção nova | sim |
| **PATCH** (x.x.`21`) | só **corrige bugs** | um arredondamento errado | sim |

Um sufixo depois do hífen marca um **pré-lançamento**: `2.0.0-beta.1` vem *antes* da `2.0.0` final.

No `package.json`, você diz **quais versões aceita** com um símbolo na frente:

| Escrito | Significa | Aceita | Não aceita |
| --- | --- | --- | --- |
| `"4.17.21"` | exatamente essa | 4.17.21 | qualquer outra |
| `"^4.17.21"` | compatível (o padrão do npm) | 4.17.21, 4.18.0, 4.99.0 | 5.0.0 |
| `"~4.17.21"` | só correções | 4.17.22, 4.17.99 | 4.18.0 |
| `">=4.0.0"` | no mínimo | 4.0.0, 9.0.0 | 3.9.9 |
| `"*"` | qualquer uma (perigoso!) | tudo | |

O `^` tem uma regra especial para versões **0.x**, que significam "ainda instável": `^0.2.3` aceita só `0.2.x`, e `^0.0.3` aceita só `0.0.3`.
O motivo: nesse período, até uma mudança "menor" pode quebrar.

Como o npm decide qual versão instalar? Ele compara versões **na ordem correta** (`1.10.0` é maior que `1.9.0`: não é comparação de texto!), inclusive com pré-lançamentos. É isso que você
vai implementar:

> ✏️ **Pratique agora — Exercício 01: SemVer**
>
> Abra `exercicios/06-ferramentas/01-semver.js`. Analise versões, compare (inclusive pré-lançamentos, na ordem oficial), verifique se uma versão satisfaz `^`, `~`, `>=`... e calcule a próxima versão.
>
> ```bash
> npm run exercicio -- 01-semver
> ```

### 2.5 Scripts

A seção `scripts` do `package.json` guarda comandos com nome, e vira a "interface" do projeto: qualquer pessoa que chegar sabe que `npm test` testa e `npm run lint` verifica o código, sem precisar descobrir como.

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "test": "node --test",
  "lint": "eslint .",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

- Dentro de um script, os executáveis das `devDependencies` (como `eslint`) já são encontrados: o npm acrescenta `node_modules/.bin` ao `PATH`.
- Dois-pontos no nome (`format:check`) é só convenção para agrupar.
- Argumentos extras vão depois de `--`: `npm test -- --watch`.
- **Scripts de ciclo de vida:** o npm roda automaticamente alguns scripts em momentos específicos.

| Script | Quando o npm o executa |
| --- | --- |
| `pre<nome>` / `post<nome>` | antes / depois do script `<nome>` (ex.: `pretest`) |
| `prepare` | depois de um `npm install` local e antes de empacotar/publicar. É onde o Husky se liga |
| `prepublishOnly` | **só** antes de `npm publish`: a trava de segurança que roda lint e testes para não publicar nada quebrado |

### 2.6 O `package.json` de um pacote publicável

Para publicar, o `package.json` precisa dizer muito mais. Um exemplo comentado:

```json
{
  "name": "@ana/clt-pj",
  "version": "1.2.0",
  "description": "Compara CLT e PJ pelo terminal",
  "keywords": ["clt", "pj", "calculadora"],
  "license": "MIT",
  "author": "Ana Souza",
  "type": "module",
  "repository": { "type": "git", "url": "git+https://github.com/ana/clt-pj.git" },
  "bin": { "clt-pj": "src/cli.js" },
  "exports": { ".": "./src/index.js" },
  "files": ["src", "README.md", "LICENSE", "CHANGELOG.md"],
  "engines": { "node": ">=20" }
}
```

| Campo | Para quê |
| --- | --- |
| `name` | o nome no npm. **Com escopo** (`@usuario/nome`) evita colidir com nomes já existentes. Só minúsculas, números e `- . _ ~` |
| `version` | a versão atual (SemVer). Cada publicação precisa de uma versão **nova** |
| `description`, `keywords` | aparecem na busca do npm |
| `license` | o que as pessoas podem fazer com o código (`MIT` é a mais comum: permissiva) |
| `repository` | link para o código; o npm mostra na página do pacote |
| `type` | `"module"` = os `.js` são módulos ES (`import`/`export`) |
| `bin` | transforma o pacote em **comando**: `{ "clt-pj": "src/cli.js" }` cria o comando `clt-pj` apontando para o arquivo |
| `exports` | **a porta da biblioteca**: o que `import ... from "@ana/clt-pj"` entrega. Tudo o que não está aqui fica **privado** (ninguém consegue importar arquivos internos) |
| `files` | a **lista do que vai** no pacote. Sem ela, vai quase tudo (inclusive testes e configs). Sempre defina |
| `engines` | versões do Node suportadas |
| `private: true` | **impede** a publicação (use em apps que não são pacotes, para evitar acidentes) |

**Arquivo de comando (`bin`):** precisa começar com o *shebang* `#!/usr/bin/env node`, uma linha que diz ao sistema operacional "execute este arquivo com o Node".
Sem ela, no Linux e no Mac o comando não roda.

O npm sempre inclui no pacote o `package.json`, o `README`, a `LICENSE` e os arquivos do `bin` e do `exports`, independentemente do `files`.

> ✏️ **Pratique agora — Exercício 02: um linter de package.json**
>
> Abra `exercicios/06-ferramentas/02-package-json.js`. Escreva a função que lê um `package.json` e aponta o que falta para ele estar pronto para publicar.
>
> ```bash
> npm run exercicio -- 02-package-json
> ```

### 2.7 O lockfile, `npm ci` e segurança das dependências

O `package.json` diz "aceito `^4.17.21`". Hoje isso instala a 4.17.21, mas daqui a um ano, em outro computador, instalaria a 4.19.0. Para todo mundo
usar **exatamente** as mesmas versões, existe o **`package-lock.json`**: o npm o gera sozinho e ele registra a versão exata de cada pacote e de cada
sub-dependência.

- **Versione o `package-lock.json`** (commit!). Nunca o edite à mão.
- **`node_modules/` nunca vai para o Git** (vai no `.gitignore`): é recriada a partir do lockfile.
- `npm install` pode atualizar o lock; **`npm ci`** instala exatamente o que o lock diz, apaga `node_modules` antes e **falha** se o lock e o `package.json` discordarem.
  Use `npm ci` em servidores e no CI: instalações reproduzíveis.

**Segurança da cadeia de suprimentos.** Cada pacote que você instala traz dezenas de outros, escritos por estranhos, e roda no seu computador. Hábitos que protegem:

- Antes de instalar, confira: nome (cuidado com **typosquatting**: `expresss` no lugar de `express`), downloads semanais, data da última publicação, repositório.
- Prefira pacotes populares e mantidos, e **poucos**. Se a "dependência" tem 10 linhas, escreva você mesmo (a história do `left-pad`, que quebrou metade da internet em 2016, é a lição).
- `npm audit` mostra vulnerabilidades conhecidas; ferramentas como Dependabot (GitHub) abrem PRs de atualização sozinhas.
- Scripts de instalação de pacotes de terceiros podem executar código: nunca rode `npm install` de repositório desconhecido sem olhar.
- Nunca publique segredos num pacote (a seção `files` e o `npm pack --dry-run` existem para você conferir).

### 2.8 `npx`: executar sem instalar

`npx pacote` baixa o pacote (para um cache), executa o comando dele e termina. É assim que se cria um projeto novo (`npx create-vite`) ou se roda uma ferramenta
ocasional, e é a forma como **seu pacote** será usado por quem não quer instalar nada: `npx @ana/clt-pj --salario 7000`.

### 2.9 Módulos ES x CommonJS

O JavaScript tem dois sistemas de módulos, e você vai esbarrar nos dois:

| | **ES Modules (ESM)**, o moderno | **CommonJS (CJS)**, o antigo do Node |
| --- | --- | --- |
| Importar | `import { x } from "./a.js"` | `const { x } = require("./a.js")` |
| Exportar | `export function f() {}` / `export default` | `module.exports = { f }` |
| Carregamento | assíncrono; funciona no navegador | síncrono; só no Node |
| Como ativar no Node | `"type": "module"` no `package.json` (ou extensão `.mjs`) | padrão sem `type` (ou extensão `.cjs`) |
| Extensão no import | obrigatória (`"./a.js"`) | opcional (`"./a"`) |
| `__dirname`, `__filename` | **não existem**: use `import.meta.url` | existem |

Como achar a pasta do arquivo atual em ESM (o que o `--versao` do projeto precisa):

```js
import { fileURLToPath } from "node:url";
import path from "node:path";

const esteArquivo = fileURLToPath(import.meta.url);
const estaPasta = path.dirname(esteArquivo);
const pacote = new URL("../package.json", import.meta.url);   // jeito mais curto: relativo ao arquivo, e não à pasta onde o comando rodou
```

Isso é importante: caminhos relativos como `"./dados.json"` em `readFileSync` valem a partir da pasta **onde o comando foi executado** (o `process.cwd()`), e não da pasta do arquivo `.js`. Uma ferramenta de
linha de comando roda de qualquer pasta, então os arquivos do próprio pacote precisam ser localizados com `import.meta.url`.

Você vai encontrar muito código `require(...)` em tutoriais e projetos antigos. Os dois sistemas conversam (com limitações); o código novo usa ESM.

---

## 3. Configuração e variáveis de ambiente

### 3.1 Por que não escrever no código

Endereço do banco, chave de uma API, porta do servidor, modo de depuração: tudo isso **muda de um ambiente para outro** (seu computador, o servidor de testes, a produção) e boa parte é **secreta**.
Se estiver escrito no código:

- você precisa mexer no código e fazer novo deploy só para trocar uma porta;
- a senha vai parar no Git, e **o que entra no Git nunca mais sai de verdade** (a história guarda tudo);
- a mesma versão do código não consegue rodar em dois ambientes diferentes.

A regra de ouro (do manifesto *Twelve-Factor App*): **configuração fica no ambiente, não no código**.

### 3.2 Variáveis de ambiente

São pares nome=valor fornecidos pelo sistema operacional ao programa. No Node, ficam em `process.env`, e **todo valor é texto**:

```js
const porta = process.env.PORTA;               // "3000" (texto!) ou undefined
const depurar = process.env.DEBUG === "true";  // converta explicitamente
```

Na produção (servidor, Docker, serviços de hospedagem), você define as variáveis no painel do serviço. No computador, é inconveniente digitar tudo toda vez, e por isso existe o arquivo `.env`.

### 3.3 O arquivo `.env`

```bash
# .env: NUNCA vai para o Git
PORTA=3000
DEBUG=true
API_URL=https://api.exemplo.com
SENHA_DO_BANCO="s3nh@ forte"   # aspas para valores com espaços ou símbolos
```

O formato é simples: uma `CHAVE=valor` por linha, `#` começa um comentário, aspas são opcionais. Desde o Node 20.6 você carrega o arquivo sem instalar nada:

```bash
node --env-file=.env app.js
```

Regras de segurança, que valem em qualquer empresa:

1. **`.env` no `.gitignore`**, antes do primeiro commit.
2. Versione um **`.env.example`** com os **nomes** das variáveis e valores de mentira, para quem chegar saber o que configurar.
3. **Valide a configuração na partida** (todas as variáveis presentes e do tipo certo), reunindo **todos** os problemas numa mensagem só. O programa deve falhar *rápido e com clareza* ("PORTA deve ser um número") em vez
   de quebrar horas depois com um erro misterioso.
4. **Nunca escreva segredos em logs.** Ao mostrar a configuração, esconda o que é secreto (`***`).
5. Se um segredo vazou (foi commitado, mesmo que apagado depois): **troque-o imediatamente**. Apagar o commit não adianta, porque ele já pode ter sido copiado. O GitHub tem *secret scanning* que avisa e bloqueia muitos casos.
6. **Tudo o que vai para o navegador é público.** Variáveis de ambiente "do front-end" (como as do Vite, seção 4) acabam escritas no JavaScript que qualquer pessoa pode ler. Segredo de verdade só vive no servidor.

> ✏️ **Pratique agora — Exercício 03: configuração por ambiente**
>
> Abra `exercicios/06-ferramentas/03-configuracao.js`. Escreva o leitor de arquivos `.env`, a validação tipada da configuração (com todos os problemas de uma vez) e a exibição segura, sem vazar segredos.
>
> ```bash
> npm run exercicio -- 03-configuracao
> ```

---

## 4. Vite: servidor de desenvolvimento e build

### 4.1 O problema que um bundler resolve

Nos módulos 01 a 05 você abriu o `index.html` com o Live Server e o navegador carregou seus arquivos `.js` direto. Funciona para projetos pequenos, mas projetos reais querem:

- usar **pacotes do npm** no navegador (`import { format } from "date-fns"`), o que o navegador, sozinho, não sabe resolver;
- **juntar** dezenas de arquivos em poucos, **minificar** e **otimizar** (menos bytes, carrega mais rápido);
- escrever **TypeScript**, **JSX** (React) ou Sass, que o navegador não entende, e compilar para JavaScript e CSS comuns;
- **recarregar** a página sozinha quando você salva (e, melhor, trocar só o pedaço alterado, o *hot reload*);
- ler **variáveis de ambiente** e gerar arquivos com **hash** no nome (`app.3f9a1c.js`) para o cache do navegador.

O **Vite** faz tudo isso e é, hoje, a ferramenta padrão para começar projetos de front-end (React, Vue, Svelte e outros, inclusive TypeScript, módulo 09).

### 4.2 Como funciona, em duas fases

| Fase | Comando | O que acontece |
| --- | --- | --- |
| **Desenvolvimento** | `npm run dev` | sobe um servidor local que entrega seus módulos ES **direto ao navegador**, transformando-os sob demanda. Inicia em instantes e atualiza o que você mudou na hora |
| **Produção** | `npm run build` | junta, otimiza e minifica tudo na pasta **`dist/`**, pronta para ser hospedada em qualquer servidor estático (GitHub Pages, Netlify...). `npm run preview` abre essa pasta para você conferir |

### 4.3 Criando um projeto

```bash
npm create vite@latest meu-app -- --template vanilla     # "vanilla" = JavaScript puro
cd meu-app
npm install
npm run dev        # abre http://localhost:5173
npm run build
```

A estrutura que ele gera: um `index.html` na **raiz** (é a *entrada* do projeto, e o Vite lê os `<script type="module">` dele), a pasta `src/` e o `package.json` com os scripts `dev`, `build`
e `preview`.

### 4.4 Configuração: `vite.config.js`

```js
import { defineConfig } from "vite";

export default defineConfig({
  base: "/racha-conta/",                  // site em subpasta (GitHub Pages)
  build: { outDir: "dist", sourcemap: true },
  server: { port: 3000, open: false },
  envPrefix: "APP_",
  resolve: { alias: { "@": "/src" } },
});
```

| Opção | Para quê |
| --- | --- |
| `base` | o caminho a partir do qual o site é servido. No **GitHub Pages**, o endereço é `usuario.github.io/NOME-DO-REPOSITÓRIO/`, então o `base` precisa ser `"/NOME-DO-REPOSITÓRIO/"`; senão, os arquivos não são encontrados |
| `build.outDir` / `build.sourcemap` | a pasta de saída; mapas que ligam o código minificado ao original, para depurar no DevTools |
| `server.port` / `server.open` | a porta do servidor de desenvolvimento / abrir o navegador sozinho |
| `envPrefix` | só as variáveis que começam com esse prefixo chegam ao código do navegador (o padrão é `VITE_`) |
| `resolve.alias` | atalhos de importação: `import x from "@/utils.js"` |

(`defineConfig` só ajuda o editor a sugerir opções; o arquivo, no fundo, exporta um objeto.)

### 4.5 Variáveis de ambiente no Vite

Arquivos `.env` na raiz (`.env`, `.env.development`, `.env.production`) com variáveis que começam pelo prefixo (`VITE_` por padrão):

```bash
VITE_API_URL=https://api.exemplo.com
```

```js
const url = import.meta.env.VITE_API_URL;      // lido no código do navegador
import.meta.env.MODE;                          // "development" ou "production"
import.meta.env.DEV;  import.meta.env.PROD;    // booleanos
```

O Vite **escreve o valor dentro do JavaScript gerado no `build`**. Por isso o prefixo existe: ele impede que variáveis secretas do computador vazem para o site por engano. E por isso mesmo: **nunca coloque segredos num `VITE_...`**.

### 4.6 Mãos à obra (sem correção automática)

Migre o seu **Racha-conta** (projeto do módulo 04) para o Vite: crie um projeto Vite, copie `index.html`, `css/` e `src/`, ajuste o `<script>`, coloque o `base` com o nome do repositório, rode `npm run build` e publique
o conteúdo de `dist/` no GitHub Pages. Você vai notar que o código-fonte quase não muda: o ganho é a esteira em volta dele.

> ✏️ **Pratique agora — Exercício 04: o vite.config.js**
>
> Abra `exercicios/06-ferramentas/04-vite-config/vite.config.js`. Escreva a configuração para publicar o projeto no GitHub Pages.
>
> ```bash
> npm run exercicio -- 04-vite
> ```

---

## 5. Qualidade de código automática

### 5.1 Por que automatizar

Em uma equipe, dez pessoas escrevem de dez jeitos: aspas simples e duplas, indentação diferente, variáveis não usadas, `==` no meio de `===`. Discutir isso em code review gasta tempo e energia que deveriam ir para a **lógica**.
A solução é deixar **máquinas** cuidarem do que é mecânico:

| Ferramenta | Faz | Pergunta que responde |
| --- | --- | --- |
| **Prettier** | **formata** o código | "Como o código deve *parecer*?" (espaços, aspas, quebras de linha) |
| **ESLint** | **analisa** o código, sem executá-lo | "O código tem *bugs ou más práticas*?" (variável sem uso, `==`, `var`) |
| **EditorConfig** | padroniza o editor (indentação, fim de linha) | "Todos os editores se comportam igual?" |
| **Husky + lint-staged** | rodam as verificações *antes de cada commit* | "Como impedir que código fora do padrão entre?" |
| **CI** (seção 8) | roda tudo no servidor a cada push | "Como garantir, mesmo que alguém pule os hooks?" |

### 5.2 ESLint

O ESLint lê o código, monta a árvore de sintaxe e aplica **regras**, cada uma com um nome (`no-unused-vars`, `eqeqeq`, `prefer-const`).
Cada regra pode estar em três níveis: `"off"` (desligada), `"warn"` (avisa, mas não falha) e `"error"` (falha o `npm run lint`).

A configuração moderna, o *flat config*, é um **array** de objetos no arquivo `eslint.config.js` (o ESLint 9 em diante só aceita esse formato):

```js
import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/", "dist/", "coverage/"] },   // objeto SÓ com "ignores" ignora essas pastas para tudo
  js.configs.recommended,                                  // o conjunto oficial de regras sensatas
  {
    languageOptions: { globals: globals.node },            // variáveis globais que existem no seu ambiente
    rules: {
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],   // regra com opções: [nível, { opções }]
    },
  },
];
```

Peças importantes:

- **`js.configs.recommended`**: regras que pegam bugs quase certos (`no-undef`, `no-unused-vars`, `no-cond-assign`, `no-dupe-keys`...). Comece sempre por ela.
- **`globals`**: o ESLint não sabe se o seu código roda no Node ou no navegador. `no-undef` reclama de `document` num código Node (acertadamente!) e de `process` num código de navegador. Você declara o ambiente com
  `globals.node`, `globals.browser`, etc. (Se o projeto tem os dois, use configurações separadas por pasta com a chave `files`: `{ files: ["src/**/*.js"], languageOptions: { globals: globals.browser } }`.)
- **`ignores`**: pastas geradas (`dist`, `coverage`) e `node_modules` não devem ser analisadas.
- **Convenção `_`**: nomear `_req` um parâmetro que você *não vai usar* é o jeito de dizer "sei que está sobrando"; a opção `argsIgnorePattern: "^_"` respeita isso.

Rodando:

```bash
npx eslint .               # analisa tudo
npx eslint --fix .         # corrige sozinho o que for possível (prefer-const, aspas...)
npm init @eslint/config@latest   # assistente que cria o eslint.config.js
```

Na prática o ESLint roda em **três lugares**: no seu editor (a extensão *ESLint* sublinha o problema enquanto você digita), antes do commit (Husky) e no CI. Nenhum substitui os outros.

**Quando desligar uma regra?** Raramente, e com motivo escrito. Um comentário `// eslint-disable-next-line nome-da-regra -- por que` silencia uma linha. Se você desliga muita coisa, a regra provavelmente não faz sentido para o time: discuta e mude a configuração.
Resista à tentação de transformar `error` em `warn` para "fazer passar": warnings que ninguém lê viram ruído.

> ✏️ **Pratique agora — Exercício 05: configurando o ESLint**
>
> Abra `exercicios/06-ferramentas/05-eslint/eslint.config.js`. Monte a configuração de um projeto Node. A correção roda o **ESLint de verdade** com a sua configuração sobre trechos de código bons e ruins.
>
> ```bash
> npm run exercicio -- 05-eslint
> ```

### 5.3 Prettier

O Prettier é **opinativo**: tem poucas opções de propósito. Ele reescreve o código inteiro num estilo único (a partir da *estrutura* do código, não de como você digitou), o que acaba com as discussões de estilo.
Você escolhe meia dúzia de preferências e deixa de pensar em formatação para sempre.

```bash
npx prettier --check .       # só verifica: sai com código 1 se algum arquivo não estiver formatado (usado no CI)
npx prettier --write .       # reescreve os arquivos formatados
```

Configuração em `.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "all",
  "arrowParens": "avoid"
}
```

| Opção | Efeito |
| --- | --- |
| `semi` | ponto e vírgula no fim das instruções |
| `singleQuote` | aspas simples nos textos |
| `printWidth` | largura máxima da linha antes de quebrar |
| `tabWidth` / `useTabs` | indentação |
| `trailingComma` | vírgula depois do último item de listas multilinha (`"all"` deixa os diffs do Git mais limpos) |
| `arrowParens` | `n => n` (`"avoid"`) ou `(n) => n` (`"always"`) |

O Prettier formata JS, TS, JSON, CSS, HTML, Markdown e YAML. O arquivo `.prettierignore` (mesma sintaxe do `.gitignore`) lista o que não formatar (por exemplo `dist/` e `package-lock.json`).

**ESLint e Prettier não brigam** se cada um ficar na sua função: o Prettier cuida da *aparência*, o ESLint dos *bugs*. Evite regras de estilo no ESLint.

No VS Code, instale a extensão **Prettier – Code formatter** e ative em *Settings*: `Editor: Format On Save` e `Editor: Default Formatter` = Prettier. Em um projeto de equipe, versione as configurações em `.vscode/settings.json`.

> ✏️ **Pratique agora — Exercício 06: configurando o Prettier**
>
> Abra `exercicios/06-ferramentas/06-prettier/LEIA-ME.md` e depois o `.prettierrc.json` da pasta. Escreva as seis opções do estilo combinado pelo time; a correção roda o **Prettier de verdade** e compara o resultado.
>
> ```bash
> npm run exercicio -- 06-prettier
> ```

### 5.4 EditorConfig

O arquivo `.editorconfig` ensina qualquer editor (VS Code, JetBrains, Vim) a seguir as mesmas regras de indentação e fim de linha, **antes** de qualquer extensão:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

O ponto mais valioso é `end_of_line = lf`: quem usa Windows costuma gerar arquivos com fim de linha `CRLF` e quem usa Linux/Mac com `LF`; misturar os dois enche o Git de diferenças falsas.
(O VS Code precisa da extensão *EditorConfig for VS Code*.)

### 5.5 Hooks do Git: Husky e lint-staged

O Git permite **hooks**: programas que ele executa em momentos específicos (antes de um commit, antes de um push). Se o hook `pre-commit` terminar com código diferente de zero, **o commit é cancelado**.
Isso é perfeito para barrar código fora do padrão antes de entrar no histórico.

O problema: os hooks ficam em `.git/hooks`, uma pasta que **não é versionada**, então não são compartilhados com o time. O **Husky** resolve isso guardando os hooks numa pasta versionada (`.husky/`) e
configurando o Git para usá-la. E o **lint-staged** roda as ferramentas **só nos arquivos que estão no commit** (rápido, em vez de analisar o projeto inteiro).

```bash
npm install -D husky lint-staged
npx husky init                     # cria .husky/pre-commit e o script "prepare": "husky"
```

```bash
# .husky/pre-commit
npx lint-staged
```

```json
// package.json
"lint-staged": {
  "*.js": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml}": "prettier --write"
}
```

Agora, ao fazer `git commit`, o Husky aciona o lint-staged, que corrige e formata os arquivos do commit; se o ESLint encontrar um erro que não consegue corrigir, **o commit é recusado** com a mensagem do problema.

- O script `prepare` (`"husky"`) é o que **liga** os hooks: ele roda automaticamente quando alguém faz `npm install`. Por isso um colega que clona o projeto já tem os hooks ativos.
- `git commit --no-verify` pula os hooks. Existe para emergências, mas **não é confiável**: qualquer um pode usá-lo. A barreira que não dá para pular é o **CI** (seção 8). Hooks são
  uma conveniência para você descobrir os erros mais cedo; o CI é a garantia.
- Hooks devem ser **rápidos** (segundos). Testes demorados ficam no CI; no máximo, o `pre-push` roda os rápidos.

---

## 6. Testes com o test runner do Node

### 6.1 Por que agora

No módulo 11 você aprende testes a fundo (Vitest, componentes React, testes de ponta a ponta). Mas um projeto sério já precisa de testes **hoje**, e o Node traz um *test runner* nativo, sem nada para instalar. Ele serve
bem para bibliotecas e ferramentas de terminal, e o seu uso é quase idêntico ao do Vitest e do Jest, então o que você aprende aqui vale para os próximos módulos.

### 6.2 O básico

```js
// frete.test.js
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { calcularFrete } from "./frete.js";

describe("calcularFrete", () => {
  test("peso de até 1 kg custa 15", () => {
    assert.equal(calcularFrete({ pesoKg: 1, cep: "50000-000", valorDoPedido: 50 }), 15);
  });

  test("peso zero é inválido", () => {
    assert.throws(() => calcularFrete({ pesoKg: 0, cep: "50000000", valorDoPedido: 50 }), /Peso inválido/);
  });
});
```

```bash
node --test                 # roda todos os arquivos de teste do projeto
node --test frete.test.js   # só um arquivo
node --test --watch         # roda de novo a cada alteração
```

O Node procura automaticamente arquivos `*.test.js` e tudo dentro de pastas chamadas `test`. A saída mostra cada teste com ✔ ou ✖, e um resumo (`pass`, `fail`); o código de saída é `0` só se todos passaram (é isso que o CI lê).

As asserções de `node:assert/strict`:

| Asserção | Confere |
| --- | --- |
| `assert.equal(atual, esperado)` | igualdade estrita (`===`) |
| `assert.deepEqual(atual, esperado)` | objetos e arrays por conteúdo |
| `assert.ok(valor)` | o valor é verdadeiro |
| `assert.throws(() => código, /mensagem/)` | o código **lança** um erro cuja mensagem casa com o padrão |
| `await assert.rejects(promessa, /mensagem/)` | uma promise é rejeitada |
| `assert.match(texto, /padrão/)` | um texto casa com a expressão regular |

Mais recursos: `before`/`after`/`beforeEach`/`afterEach` (preparação e limpeza), `test.skip`, `test.todo`, `describe` para agrupar, e `--experimental-test-coverage` para medir quantas linhas os testes executam.

### 6.3 O que faz um teste ser bom

Um teste ruim passa mesmo quando o código está errado. Princípios:

1. **Teste o comportamento, não a implementação.** "Dado este pedido, o frete é 25" sobrevive a uma refatoração; "a função chamou `find` uma vez" não.
2. **Teste as fronteiras.** A maioria dos bugs mora nos limites: o valor *exato* da fronteira, *um pouco acima* e *um pouco abaixo* (1 kg, 1,01 kg; R$ 199,99 e R$ 200,00).
3. **Confira o valor, não só a ausência de erro.** `assert.ok(calcularFrete(...))` passa com qualquer número diferente de zero. `assert.equal(..., 25)` não.
4. **Um motivo para falhar.** Um teste que confere dez coisas mostra só a primeira falha e esconde as outras. Nomeie cada teste com a **regra** que ele protege.
5. **Cubra os caminhos de erro**: entrada inválida, vazia, no limite, no formato errado.
6. **Dados à mão.** Use números redondos que você confere de cabeça (como as tabelas fictícias do projeto 02), em vez de repetir no teste a fórmula do código (assim os dois erram juntos).
7. **Independência.** Um teste não pode depender de outro nem da ordem de execução.

Um padrão que ajuda a estruturar cada teste: **Arrange, Act, Assert** (preparar, executar, conferir).

### 6.4 Teste de mutação: quem testa os testes?

Como saber se a sua suíte de testes é **boa**? Medir "quantas linhas ela executa" (cobertura) é pouco: um teste pode executar uma linha sem conferir nada. O **teste de mutação** faz uma pergunta mais dura:
a ferramenta *planta defeitos* no código (troca um `<=` por `<`, um `+` por `-`, apaga uma validação) e roda os seus testes em cada versão defeituosa (cada uma é um **mutante**).

- Se algum teste **falha**, o mutante foi **morto** (os testes perceberam o defeito). Ótimo.
- Se **todos passam**, o mutante **sobreviveu**: existe um bug possível que seus testes não pegariam.

É exatamente o que a correção do exercício abaixo faz com o seu código. Bibliotecas profissionais (como o Stryker) fazem isso em projetos grandes. Os mutantes sobreviventes quase sempre apontam para uma **fronteira não testada**.

> ✏️ **Pratique agora — Exercício 07: escreva testes que pegam defeitos**
>
> Abra `exercicios/06-ferramentas/07-testes-node/LEIA-ME.md` e escreva os seus testes em `frete.spec.js`. Eles precisam passar no código correto **e** falhar em cada um dos 10 defeitos plantados.
>
> ```bash
> npm run exercicio -- 07-testes-node
> ```

---

## 7. Git como em uma equipe

### 7.1 O fluxo de trabalho: GitHub Flow

No módulo 00 você usou Git sozinho. Em equipe, o fluxo mais comum é o **GitHub Flow**, simples e eficaz:

```
main  ──●────────────────────●─────────────●──   (sempre estável: pode ser colocada em produção)
         \                  / \           /
feat/filtro ●──●──●────────/   \  fix/frete ●──●
              (commits pequenos)  (outra tarefa)
                      ↑ Pull Request: revisão → ajustes → merge
```

1. A **`main`** está sempre funcionando.
2. Cada tarefa vira uma **branch curta**, criada a partir da `main` atualizada: `feat/filtro-categoria`, `fix/frete-gratis`.
3. Você faz **commits pequenos** e envia a branch (`git push -u origin feat/filtro-categoria`).
4. Abre um **Pull Request (PR)** no GitHub: um pedido para juntar a sua branch na `main`, onde o time **revisa** o código e o CI roda as verificações.
5. Depois de aprovado e com o CI verde, o PR é **mergeado** e a branch apagada.

```bash
git switch main && git pull                 # começar de uma main atualizada
git switch -c feat/filtro-categoria         # criar a branch da tarefa
# ...trabalhar, commitar...
git push -u origin feat/filtro-categoria    # enviar e abrir o PR no GitHub
```

**Estratégias de merge do PR** (botões do GitHub):

| Estratégia | O que faz | Quando |
| --- | --- | --- |
| **Merge commit** | cria um commit de junção, mantém todos os commits da branch | preservar a história completa |
| **Squash and merge** | junta todos os commits do PR **em um só** na `main` | histórico limpo, um commit por tarefa (muito usado) |
| **Rebase and merge** | reaplica os commits da branch em linha reta sobre a `main` | histórico linear sem commit de merge |

**Proteção da `main`:** equipes ativam, nas configurações do repositório, *branch protection*: ninguém faz push direto na `main`, o PR exige aprovação e o CI verde. É o que faz o fluxo valer.

### 7.2 Mensagens de commit: Conventional Commits

No módulo 00 você viu o padrão `tipo(escopo): descrição`. Agora entenda **por que** ele é mais que estética: com mensagens estruturadas, **máquinas conseguem ler o histórico**.

```
feat(carrinho): permite alterar a quantidade     ← nova funcionalidade → sobe a versão MENOR
fix: corrige o frete grátis                      ← correção → sobe o PATCH
feat!: remove a opção --antiga                   ← o "!" marca uma QUEBRA → sobe a versão MAIOR
docs: atualiza o README                          ← não muda o que o usuário recebe
```

Ferramentas lêem essas mensagens para **gerar o changelog** e **decidir a próxima versão** automaticamente (`release-please`, `semantic-release`). Para isso funcionar, o formato precisa ser **rigoroso**,
e é um bom exercício de leitura de texto estruturado:

```
tipo(escopo)!: descrição curta (até ~72 caracteres)
<linha em branco>
corpo opcional, explicando o PORQUÊ
<linha em branco>
BREAKING CHANGE: rodapé opcional descrevendo a quebra
```

Boas práticas de mensagem: no imperativo ou no presente ("adiciona", "corrige"), explicando o **porquê** no corpo quando não for óbvio, um commit por mudança lógica, e nunca "ajustes", "wip" ou "agora vai".

> ✏️ **Pratique agora — Exercício 08: lendo Conventional Commits**
>
> Abra `exercicios/06-ferramentas/08-commits.js`. Escreva o analisador de mensagens de commit: tipo, escopo, quebra de compatibilidade, descrição, corpo e as mensagens de erro para cada tipo de problema.
>
> ```bash
> npm run exercicio -- 08-commits
> ```

### 7.3 Changelog e versões

O **changelog** é o histórico de mudanças **para pessoas**: o que há de novo, o que foi corrigido, o que quebra. O formato mais usado é o [Keep a Changelog](https://keepachangelog.com/pt-BR/):

```markdown
# Changelog

## [Unreleased]

## [1.3.0] - 2026-10-15

### Novidades
- **carrinho:** permite alterar a quantidade
- adiciona exportação em CSV

### Correções
- corrige o frete grátis

## [1.2.0] - 2026-09-30
...
```

Cada versão publicada tem uma **tag** no Git (`v1.3.0`), e o número da próxima versão sai dos commits: se houve quebra, sobe o MAIOR; senão, se houve `feat`, sobe o MENOR; senão, se houve `fix`, sobe o PATCH;
se só houve `docs`/`chore`, nem vale lançar. Você já tem as peças (SemVer e leitura de commits), e vai juntá-las:

> ✏️ **Pratique agora — Exercício 09: do histórico ao changelog**
>
> Abra `exercicios/06-ferramentas/09-changelog.js`. Calcule o tipo da próxima versão, a própria versão e gere o texto do changelog a partir de uma lista de commits, ignorando o que não segue o padrão.
>
> ```bash
> npm run exercicio -- 09-changelog
> ```

### 7.4 Desfazendo coisas (sem pânico)

A habilidade que mais tira o medo do Git é saber **desfazer**. O comando certo depende de **onde** o erro está:

| Situação | Comando | Observação |
| --- | --- | --- |
| Mudei um arquivo e quero **descartar** a alteração | `git restore arquivo.js` | **perde** o que não foi commitado: irreversível |
| Fiz `git add` sem querer | `git restore --staged arquivo.js` | tira da área de preparação, mantém a alteração |
| Criei arquivos soltos que não servem | `git clean -n` (simula) e depois `git clean -f` (apaga) | `-d` inclui pastas. **Sempre simule antes** |
| A **mensagem** do último commit está errada (ainda não enviei) | `git commit --amend -m "nova mensagem"` | reescreve o commit |
| Esqueci um arquivo no último commit (ainda não enviei) | `git add arquivo` e `git commit --amend --no-edit` | |
| O último commit **já foi enviado** e está com problema | `git revert HEAD` | cria um commit **novo** que desfaz o anterior; **não reescreve** a história |
| Quero voltar a branch para um commit anterior (só local!) | `git reset --hard <commit>` | **apaga** commits e alterações da branch; perigoso |

**A regra de ouro:** nunca reescreva história que já foi **enviada e que outras pessoas usam** (`--amend`, `reset`, `rebase` em commits publicados). Quem já baixou aquele commit fica com uma versão diferente da sua,
e vira uma bagunça. Para desfazer algo **publicado**, use o `git revert`, que apenas *acrescenta* um commit.

**O erro mais grave: segredo commitado.** Se uma senha ou chave foi parar num commit:

1. **Troque o segredo na hora** (revogue a chave, mude a senha). É o único passo que realmente resolve.
2. Se o commit ainda **não foi enviado**: tire o arquivo e reescreva o commit (`git rm --cached .env` + `git commit --amend --no-edit`) e ponha `.env` no `.gitignore`.
3. Se **já foi enviado**: considere o segredo comprometido. Limpar a história exige ferramentas como `git filter-repo`, mas mesmo assim cópias podem existir.

`git rm --cached arquivo` é a chave: tira o arquivo do **Git** mas **mantém no seu disco**.

### 7.5 Guardar, trazer e reorganizar

**`git stash`: o bolso do Git.** Você está no meio de uma tarefa, sem querer commitar, e chega um bug urgente. O `stash` guarda o trabalho pela metade e devolve a pasta ao último commit:

```bash
git stash                   # guarda as alterações (dos arquivos já versionados)
git switch main             # vá resolver o urgente...
# ...fix, commit...
git switch feat/relatorio   # volte
git stash pop               # traz o trabalho de volta (e apaga do bolso)
git stash list              # o que está guardado
```

**`git cherry-pick`: trazer só UM commit.** Uma branch experimental tem três commits, e só o do meio é bom. Em vez de juntar tudo:

```bash
git switch main
git cherry-pick experimento~1      # copia aquele commit para a branch atual (cria um commit novo com o mesmo conteúdo)
```

(`experimento~1` é "o commit antes da ponta de `experimento`"; `~2` é dois antes.) Também serve para levar uma correção da `main` para uma branch de versão antiga.

**`merge` x `rebase`: duas formas de juntar trabalho.** Sua branch `feature` saiu da `main`, mas a `main` andou. Como atualizar?

```
        A──B──C        ← main (andou)
       /
 ──●──●
       \
        D──E           ← feature (saiu antes)
```

| | `git merge main` (estando na feature) | `git rebase main` (estando na feature) |
| --- | --- | --- |
| Resultado | cria um **commit de junção**; a história mostra os dois caminhos | **reaplica** D e E *por cima* de C, em linha reta |
| Histórico | fiel ao que aconteceu | limpo e linear |
| Commits D e E | continuam os mesmos | viram **commits novos** (hashes diferentes) |
| Segurança | nunca reescreve história | **reescreve** a história da branch |

```
Depois do rebase:   ──●──A──B──C──D'──E'    (feature em cima da main)
```

Use `rebase` para **atualizar a sua própria branch** antes do PR (história limpa), e **nunca em branches compartilhadas**. Se você já enviou a branch e fez rebase, o envio exige `git push --force-with-lease` (que se recusa se alguém mexeu na
branch no meio-tempo; muito mais seguro que `--force`).

### 7.6 Tags e releases

Uma **tag** é um rótulo permanente em um commit, normalmente o de uma versão: `v1.0.0`. Existem duas:

```bash
git tag v1.0.0                                # tag "leve": só um apelido para o commit
git tag -a v1.0.0 -m "Primeira versão"        # tag ANOTADA: guarda autor, data e mensagem (a que se usa em releases)
git tag                                       # lista
git push origin v1.0.0                        # tags NÃO sobem sozinhas com o push da branch
git push origin --tags                        # envia todas
```

No GitHub, uma tag vira uma **Release**, uma página com as notas da versão (o trecho do CHANGELOG) e arquivos para baixar.

> ✏️ **Pratique agora — Exercício 10: o dojo de Git**
>
> Abra `exercicios/06-ferramentas/10-git-dojo/comandos.js`. Oito situações reais (mensagem errada, commit publicado com bug, trabalho pela metade, um só commit de outra branch, bagunça na pasta, segredo commitado, histórico em linha reta, tag de versão).
> Você escreve **os comandos Git** de cada uma; a correção monta repositórios temporários, executa os seus comandos e confere o resultado. Treine numa pasta de teste antes!
>
> ```bash
> npm run exercicio -- 10-git-dojo
> ```

### 7.7 Conflitos

Um **conflito** acontece quando duas branches alteraram **a mesma região** de um arquivo e o Git não sabe qual escolher. Ele para o merge/rebase e marca o arquivo:

```
<<<<<<< HEAD
<h1>Bem-vindo à loja</h1>
=======
<h1>Bem-vinda à Loja do Bairro</h1>
>>>>>>> feat/novo-titulo
```

Entre `<<<<<<<` e `=======` está a versão da **sua branch atual**; entre `=======` e `>>>>>>>`, a **que está chegando**. Para resolver:

1. Abra o arquivo (o VS Code mostra botões *Accept Current*, *Accept Incoming*, *Accept Both*) e deixe **o resultado correto**, que muitas vezes não é nenhuma das duas versões e sim uma mistura. **Apague as linhas de marcação.**
2. `git add arquivo` (diz ao Git "resolvido").
3. Em um merge: `git commit`. Em um rebase: `git rebase --continue`. Para desistir: `git merge --abort` ou `git rebase --abort`.
4. **Rode os testes**: um conflito resolvido que compila pode estar logicamente errado.

Para conflitos serem raros: branches **curtas** (horas ou poucos dias), commits pequenos, atualize a sua branch com a `main` com frequência e converse com quem mexe na mesma área.

### 7.8 Investigando o histórico

O Git guarda a história inteira, e isso é uma ferramenta de investigação:

```bash
git log --oneline --graph --all     # o desenho das branches
git log -p arquivo.js               # o histórico de UM arquivo, com as alterações
git log -S "calcularFrete"          # commits que acrescentaram ou removeram esse texto
git blame arquivo.js                # quem alterou cada linha, e em qual commit
git show a1b2c3d                    # os detalhes de um commit
git diff main..feature              # diferença entre branches
git bisect start                    # BUSCA BINÁRIA do commit que introduziu um bug
git bisect bad                      #   (o commit atual está com o bug)
git bisect good v1.0.0              #   (esta versão antiga estava boa)
git bisect run npm test             #   deixa o Git testar sozinho e achar o culpado
git reflog                          # o diário de TUDO que moveu o HEAD: sua rede de segurança
```

O **`git reflog`** salva vidas: depois de um `reset --hard` ou de um rebase errado, os commits "sumidos" ainda estão ali (por semanas), e o reflog mostra o hash para você voltar (`git reset --hard <hash>`).
Raramente um trabalho commitado se perde de verdade no Git.

### 7.9 Pull Request e code review

**Abrindo um bom PR:**

- **Pequeno e focado**: uma coisa por PR (idealmente até ~400 linhas). PRs gigantes não são lidos de verdade.
- **Título e descrição úteis**: *o que* mudou, *por que*, *como testar* e, se tem interface, prints. O template (`.github/pull_request_template.md`) faz o GitHub pré-preencher isso.
- Revise **o seu próprio PR** antes de pedir revisão: você acha metade dos problemas.
- CI verde antes de chamar alguém.

**Revisando o PR de outra pessoa:**

- Foque no que importa: **correção** (resolve o problema? casos de borda?), **leitura** (dá para entender?), **testes**, **segurança**. O que é mecânico (formatação) é problema do Prettier, não seu.
- Seja **gentil e específico**: "e se `pesoKg` vier `undefined`?" é melhor que "isso está errado". Faça perguntas, sugira alternativas.
- Diferencie o **obrigatório** do **sugestão**: um prefixo como *nit:* (detalhe pequeno) ou *sugestão:* deixa claro o que bloqueia.
- Elogie o que ficou bom. Revisão é conversa, não prova.

**Recebendo uma revisão:** não leve para o lado pessoal (o comentário é sobre o código); responda a todos os comentários; discorde com argumentos, quando for o caso; e agradeça. Um bom histórico de PRs revisados é o melhor treino para trabalhar em equipe.

---

## 8. Integração contínua com GitHub Actions

### 8.1 A ideia

**Integração contínua (CI)** é rodar as verificações do projeto (lint, formatação, testes, build) **automaticamente, em um servidor limpo, a cada mudança**. Por quê?

- O "na minha máquina funciona" deixa de existir: o servidor é um ambiente zerado, que só tem o que está no repositório.
- Ninguém consegue pular as verificações (como pode com `--no-verify`).
- O PR mostra ✅ ou ❌ antes da revisão, e a proteção da `main` pode **exigir** o ✅ para o merge.

O **GitHub Actions** é o CI do GitHub: gratuito para repositórios públicos. Os arquivos `.yml` da pasta `.github/workflows/` descrevem o que rodar.

### 8.2 Anatomia de um workflow

```yaml
name: CI                                   # o nome que aparece na aba Actions

on:                                        # QUANDO roda
  push:
    branches: [main]                       #   a cada push na main
  pull_request:                            #   e em todo Pull Request

jobs:                                      # O QUE roda (cada job é uma máquina virtual)
  qualidade:
    runs-on: ubuntu-latest                 # o sistema operacional do servidor
    strategy:
      matrix:                              # roda o job VÁRIAS vezes, uma por valor
        node-version: [20, 22, 24]
    steps:                                 # os passos, em ordem
      - uses: actions/checkout@v4          # baixa o código do repositório
      - uses: actions/setup-node@v4        # instala o Node
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm                       # guarda ~/.npm entre execuções (instalação mais rápida)
      - run: npm ci                        # instala exatamente o que o lockfile diz
      - run: npm run lint
      - run: npm run format:check
      - run: npm test
```

- **`on`**: eventos que disparam (`push`, `pull_request`, `schedule` para horários, `workflow_dispatch` para botão manual).
- **`jobs`/`steps`**: cada passo é um `uses:` (uma *action* pronta, reutilizável) ou um `run:` (um comando de terminal). **Se um passo terminar com código diferente de zero, o job falha** e os passos seguintes não rodam. É a mesma lógica dos códigos de saída da seção 1.3.
- **`matrix`**: testa em várias versões do Node de uma vez, para garantir que o pacote funciona para todo mundo que declarou suportar.
- **Segredos**: chaves (token do npm, por exemplo) ficam em *Settings → Secrets* do repositório e entram como `${{ secrets.NPM_TOKEN }}`, **nunca** escritas no arquivo.
- **YAML**: a indentação é a estrutura (use **espaços**, nunca tabs); `-` começa um item de lista.

Depois de subir o workflow, a aba **Actions** do repositório mostra cada execução, com o log de cada passo. Um erro tem log: leia o passo vermelho.

**Badge** de status para o README: `![CI](https://github.com/usuario/repo/actions/workflows/ci.yml/badge.svg)`.

CI é a primeira metade da esteira; a segunda (**CD**, entrega contínua: publicar/hospedar automaticamente) você vê no módulo 17, com Docker e deploy.

---

## 9. Publicando no npm

### 9.1 Preparando o pacote

O que as pessoas veem quando chegam ao seu pacote é o **README**. Ele precisa responder rápido: *o que é, como instalar, como usar (com exemplo de saída), quais opções, como contribuir, qual a licença.*
Itens do pacote publicável:

- **`LICENSE`**: sem licença, legalmente ninguém pode usar o seu código. A **MIT** é a mais comum (permite quase tudo, exige manter o aviso de copyright). Copie o texto padrão e ponha o ano e o seu nome.
- **`CHANGELOG.md`** (seção 7.3) e versionamento semântico: seja disciplinado, pois quem usa o pacote confia nas regras do SemVer.
- **`files`** enxuto (seção 2.6).
- **Zero ou poucas dependências.**
- **Aviso honesto de limites** (principalmente em ferramentas que calculam dinheiro, impostos ou saúde).

### 9.2 Conferindo antes de publicar

```bash
npm pack --dry-run          # lista os arquivos que iriam no pacote e o tamanho (sem criar nada)
npm pack                    # cria o arquivo .tgz de verdade: dá para instalar com `npm install ./pacote-1.0.0.tgz` e testar
npm link                    # liga o pacote ao seu computador: o comando `clt-pj` passa a existir para você (npm unlink desfaz)
```

**Sempre leia a lista do `npm pack --dry-run`.** Ela revela segredos e arquivos de teste que escaparam. É assim que gente experiente evita publicar um `.env`.

### 9.3 Publicando

```bash
npm login                       # uma vez; ative a verificação em duas etapas (2FA) na conta do npm
npm publish --access public     # pacotes com escopo (@usuario/...) são privados por padrão; --access public libera
```

Antes do envio, o npm executa o seu script **`prepublishOnly`** (que roda lint, formatação e testes): se algo falhar, **nada é publicado**.

Uma publicação tem consequências que valem conhecer:

- O par **nome + versão é permanente**: uma versão publicada nunca pode ser reutilizada, mesmo que você a apague.
- Despublicar (`npm unpublish`) só é permitido em condições restritas (poucas horas após a publicação, e sem dependentes). Por isso o ensaio (`--dry-run`) importa.
- Para avisar que uma versão é ruim: `npm deprecate @usuario/pacote@1.0.1 "tem um bug no cálculo; use 1.0.2"`, que mostra o aviso a quem instalar.
- **Proteja a conta**: 2FA ligado, e em CI use *tokens* de acesso limitados (ou a publicação confiável do GitHub) em vez da sua senha.
- Para publicar uma nova versão: atualize o CHANGELOG, `npm version patch|minor|major` (sobe o número, cria o commit e a **tag** `vX.Y.Z` do Git), `git push --follow-tags` e `npm publish`.
- *Provenance* (`npm publish --provenance`, num workflow do GitHub Actions) acrescenta uma assinatura que prova de qual repositório e de qual commit o pacote saiu: uma camada de confiança para quem usa.

Quando o pacote estiver no ar, qualquer pessoa no mundo roda `npx @usuario/clt-pj --salario 7000`. Vale a pena fazer isso pelo menos uma vez: é uma sensação especial, e um ótimo item no currículo.

---

## 10. Outras ferramentas que você vai encontrar

| Ferramenta | Para quê |
| --- | --- |
| **nvm**, **fnm** ou **Volta** | instalar e alternar entre versões do Node por projeto (arquivo `.nvmrc` ou `engines`) |
| **pnpm** | gerenciador de pacotes rápido e econômico, muito usado em monorepos |
| **Postman**, **Insomnia**, **Bruno** ou a extensão *REST Client* do VS Code | testar APIs com requisições salvas (módulo 12 em diante) |
| **curl** e **jq** | chamar APIs e filtrar JSON no terminal |
| **Dependabot** / **Renovate** | abrem PRs automáticos para atualizar dependências |
| **GitHub Projects/Issues** | quadro de tarefas ligado ao código (`Closes #12` no PR fecha a issue) |
| **DevTools avançado** (Performance, Memory, Lighthouse) | investigar lentidão e vazamentos |
| **Docker** | empacotar o ambiente inteiro (módulo 17) |

---

## Projeto do módulo — Publique a calculadora CLT × PJ no npm

Enunciado completo: [projetos/06-pacote-npm/README.md](../projetos/06-pacote-npm/README.md).

Pegue a calculadora do projeto 02 e a transforme em um **pacote profissional**: comando de terminal (`--json`, `--ajuda`, `--versao`, erros no stderr) e biblioteca (`exports`), com **testes próprios** (`node --test`), **ESLint**, **Prettier**,
**EditorConfig**, **Husky + lint-staged**, **CI no GitHub Actions** em três versões do Node, **CHANGELOG** no formato Keep a Changelog, licença MIT, **histórico de commits no padrão** e **tag de versão**. Se quiser, publique de verdade no npm.

A correção executa as ferramentas do seu projeto de verdade (`npm run lint`, `npm run format:check`, `npm test`, `npm pack --dry-run`), roda o seu comando de outra pasta e confere o histórico do Git.

```bash
npm run corrigir-projeto -- 06 ../clt-pj
```

---

## Resumo dos exercícios

Você já fez todos ao longo da aula. Confira com `npm run progresso`.

| # | Exercício | Assunto | Seção |
| --- | --- | --- | --- |
| 01 | `01-semver.js` | analisar, comparar e satisfazer versões; próxima versão | 2.4 |
| 02 | `02-package-json.js` | validar um `package.json` para publicação | 2.6 |
| 03 | `03-configuracao.js` | `.env`, configuração tipada e sem vazar segredos | 3 |
| 04 | `04-vite-config/` | `vite.config.js` para o GitHub Pages | 4 |
| 05 | `05-eslint/` | `eslint.config.js` (o ESLint roda de verdade) | 5.2 |
| 06 | `06-prettier/` | `.prettierrc.json` (o Prettier roda de verdade) | 5.3 |
| 07 | `07-testes-node/` | testes que pegam 10 defeitos plantados | 6 |
| 08 | `08-commits.js` | analisar Conventional Commits | 7.2 |
| 09 | `09-changelog.js` | changelog e próxima versão a partir dos commits | 7.3 |
| 10 | `10-git-dojo/` | oito situações reais de Git, em repositórios temporários | 7.4–7.6 |

---

## Checklist para avançar

- [ ] Uso pipes, redirecionamentos e códigos de saída, e explico `&&` e `||`.
- [ ] Explico `dependencies` x `devDependencies`, o que `^` e `~` aceitam, e por que versiono o `package-lock.json` e uso `npm ci` no CI.
- [ ] Monto o `package.json` de um pacote publicável (`bin`, `exports`, `files`, `engines`) e sei o que `prepublishOnly` faz.
- [ ] Diferencio ESM de CommonJS e localizo arquivos com `import.meta.url`.
- [ ] Separo configuração do código com variáveis de ambiente, nunca versiono `.env` e nunca escrevo segredos em logs.
- [ ] Explico o que o Vite faz no desenvolvimento e no build, e configuro o `base` para o GitHub Pages.
- [ ] Configuro ESLint (flat config) e Prettier, e sei qual cuida de quê.
- [ ] Configuro Husky + lint-staged e sei por que o CI é a barreira que não dá para pular.
- [ ] Escrevo testes com `node:test` que cobrem fronteiras e confiro os valores, não só a ausência de erro.
- [ ] Sigo o GitHub Flow: branch curta, commits no padrão, PR com descrição, revisão e merge.
- [ ] Sei desfazer erros com `restore`, `amend`, `revert`, `stash`, `cherry-pick` e `rebase`, e sei quando **não** reescrever a história.
- [ ] Resolvo conflitos de merge e uso `reflog`, `blame` e `bisect` para investigar.
- [ ] Escrevo um workflow do GitHub Actions com matriz de versões do Node.
- [ ] Os 10 exercícios passam (`npm run progresso`).
- [ ] O pacote `clt-pj` passou na correção, tem o CI verde no GitHub e (opcional) está publicado no npm.
