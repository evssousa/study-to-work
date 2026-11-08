# Projeto 02 — Gerador de Página "Link em Bio"

## O problema

Instagram, LinkedIn, TikTok — cada rede social permite apenas **um link** na bio do perfil.
Todo mundo que quer compartilhar mais de um link (portfólio, GitHub, currículo, canal no YouTube)
acaba usando o Linktree ou serviços parecidos. O problema: o plano gratuito tem limitações, o
plano pago custa dinheiro mensalmente, e o domínio fica no nome deles.

Você vai construir a sua própria página de link em bio, publicá-la gratuitamente no GitHub Pages
e colocar o endereço direto na sua bio — sem pagar nada, com domínio no seu nome, e com código
que você mesmo escreveu.

## O que você vai construir

Um script Node.js que lê um arquivo `config.json` com seus dados e gera um `index.html` completo.
Você faz o commit, envia para o GitHub, ativa o GitHub Pages e pronto: a página está no ar.
Coloca o link na bio do Instagram ou LinkedIn e começa a receber cliques reais de pessoas reais.

### Exemplo de `config.json`

```json
{
  "nome": "Ana Souza",
  "titulo": "Desenvolvedora Front-end",
  "foto": "foto.jpg",
  "cor": "#6c3fc9",
  "links": [
    { "texto": "Meu portfólio", "url": "https://ana.github.io/portfolio", "icone": "🌐" },
    { "texto": "GitHub", "url": "https://github.com/ana", "icone": "🐙" },
    { "texto": "LinkedIn", "url": "https://linkedin.com/in/ana", "icone": "💼" },
    { "texto": "Currículo (PDF)", "url": "https://...", "icone": "📄" }
  ]
}
```

### Como a página fica

```
┌─────────────────────────────────┐
│                                 │
│         [foto da Ana]           │
│         Ana Souza               │
│      Desenvolvedora Front-end   │
│                                 │
│  🌐  Meu portfólio              │
│  🐙  GitHub                     │
│  💼  LinkedIn                   │
│  📄  Currículo (PDF)            │
│                                 │
└─────────────────────────────────┘
```

## Estrutura (obrigatória: os testes procuram estes arquivos)

```
link-em-bio/
├── config.json        # seus dados pessoais e links (você preenche)
├── package.json       # "type": "module", "name", "description"
├── .gitignore         # node_modules/
├── README.md
└── src/
    ├── validar.js     # valida o config e lança erros com mensagens claras
    ├── html.js        # funções que geram strings HTML (SEM console.log, SEM fs)
    └── gerar.js       # lê config.json, chama html.js, escreve index.html
```

**Por que essa separação?**

`html.js` recebe apenas dados e devolve strings HTML — sem nenhum efeito colateral, sem importar
`fs`, sem `console.log`. Isso significa que você consegue testar cada função sem precisar do sistema
de arquivos. `gerar.js` é o ponto de entrada que conecta tudo: lê o arquivo, chama a validação,
chama a geração e escreve o resultado. É o mesmo princípio de separação que você praticou nos
exercícios do módulo.

## Requisitos de cada módulo

### `config.json` (você preenche — estes são os seus dados de verdade)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nome` | string | sim | Seu nome. Mínimo 2 caracteres. |
| `titulo` | string | não | Subtítulo exibido embaixo do nome (ex.: "Dev Front-end"). |
| `foto` | string | não | Caminho relativo para uma imagem (ex.: `"foto.jpg"`). |
| `cor` | string | não | Cor principal da página em hexadecimal (ex.: `"#6c3fc9"`). Padrão: `#333333`. |
| `links` | array | sim | Lista de links. Pelo menos 1. |
| `links[].texto` | string | sim | Texto do botão. |
| `links[].url` | string | sim | URL completa. Deve começar com `https://` ou `http://`. |
| `links[].icone` | string | não | Emoji exibido antes do texto. |
| `redes` | object | não | Redes sociais. Chaves: `instagram`, `twitter`, `linkedin`, `github`, `youtube`, `tiktok`. Valor: nome de usuário ou `@usuario`. |

### `src/validar.js`

Exporte uma função:

**`validarConfig(config)`** → retorna o objeto `config` se válido; caso contrário, lança `Error`
com as mensagens exatas abaixo.

| Situação | Mensagem do erro |
|----------|-----------------|
| `config` não é um objeto | `"Config deve ser um objeto"` |
| `nome` ausente ou string com menos de 2 chars | `"Nome obrigatório (mínimo 2 caracteres)"` |
| `foto` fornecida, mas não é string | `"Foto deve ser um caminho de arquivo"` |
| `cor` fornecida, mas não é hex válido (`#xxx` ou `#xxxxxx`) | `"Cor deve ser um valor hexadecimal (ex: #6c3fc9)"` |
| `links` ausente ou não é array | `"Links deve ser uma lista"` |
| `links` é array vazio | `"Adicione pelo menos um link"` |
| Algum link sem `texto` | `"Todo link precisa de um texto"` |
| Algum link sem `url` ou `url` não começa com `http` | `"URL inválida: [url]"` |

### `src/html.js`

Funções puras exportadas — sem `console.log`, sem `fs`, sem `process`, sem efeitos colaterais.

> **Regra de segurança:** todo texto que vem do `config` (nome, textos dos links, título, etc.)
> **deve passar por `escaparHtml()`** antes de aparecer no HTML gerado. Isso evita XSS caso
> alguém coloque caracteres especiais no `config.json`.

| Função | Descrição |
|--------|-----------|
| `slugify(texto)` | Converte texto em slug de URL: minúsculas, sem acentos, espaços e chars especiais viram hífens. `"João da Silva"` → `"joao-da-silva"`. |
| `escaparHtml(texto)` | Escapa `&`, `<`, `>`, `"`, `'` para inserção segura em HTML. |
| `gerarEstilo(config)` | Retorna uma string CSS. Use CSS custom properties (`--cor-primaria` a partir de `config.cor`, `--cor-fundo`, `--cor-texto`). Inclua: layout responsivo mobile-first, modo escuro automático (`prefers-color-scheme: dark`), `focus-visible` nos links, hover suave. |
| `gerarCartao(config)` | Retorna o HTML principal: foto (se `config.foto`), nome, título, lista de links como elementos `<a>`. Cada link deve ter `aria-label` com o texto, abrir em nova aba com `rel="noopener noreferrer"`. |
| `gerarRedes(config)` | Retorna HTML com ícones e links das redes sociais em `config.redes`. Cada plataforma conhecida tem um emoji e um padrão de URL. Retorna string vazia se não houver `redes`. |
| `gerarPagina(config)` | Retorna o documento HTML completo. Deve ter: `lang="pt-BR"`, `charset UTF-8`, `viewport`, meta description com `config.titulo`, `<title>` com `config.nome`, `<style>` inline com `gerarEstilo()`, corpo com `gerarCartao()` + `gerarRedes()`. |

### `src/gerar.js`

O ponto de entrada da CLI.

**Uso:**
```bash
node src/gerar.js
```

**Passos:**

1. Lê `config.json` do diretório atual com `fs.readFileSync` e `'utf-8'`.
   - Se o arquivo não existir: imprime `"Arquivo config.json não encontrado. Crie-o com seus dados."` e sai com `process.exit(1)`.
2. Faz o parse do JSON.
   - Se JSON inválido: imprime mensagem de erro e sai com código 1.
3. Chama `validarConfig()`.
   - Se lançar erro: imprime a mensagem e sai com código 1.
4. Chama `gerarPagina()`.
5. Escreve o resultado em `index.html` com `fs.writeFileSync`.
6. Imprime: `"✓ index.html gerado! Faça commit e publique no GitHub Pages ou Vercel."`

## Deploy (obrigatório)

O projeto vai em um **repositório próprio no GitHub** (não na pasta do curso). O projeto só
está entregue quando estiver publicado e acessível por um link real. Use o **GitHub Pages** ou
a **Vercel** — ambos são gratuitos.

### Opção A — GitHub Pages

1. Preencha `config.json` com seus dados de verdade.
2. Rode `node src/gerar.js` para gerar o `index.html`.
3. Faça commit de tudo (incluindo `index.html`) e push para o GitHub.
4. No repositório: **Settings → Pages → Source: Deploy from a branch → main / root → Save**.
5. Aguarde 1–2 minutos. Link: `https://seu-usuario.github.io/link-em-bio/`
6. Coloque esse link na sua bio do Instagram, LinkedIn e onde mais quiser.

> Sempre que atualizar `config.json`, rode `node src/gerar.js` de novo, faça commit do
> `index.html` atualizado e push.

### Opção B — Vercel (recomendada: auto-deploy a cada push)

1. Acesse [vercel.com](https://vercel.com) e faça login com o GitHub.
2. **Add New → Project** → importe o repositório `link-em-bio`.
3. Em **Build & Output Settings**:
   - **Build Command:** `node src/gerar.js`
   - **Output Directory:** `.` (ponto — a raiz do projeto)
4. **Deploy**. A partir daí, a cada `git push` a Vercel reconstrói e publica sozinha.
5. Link: `https://link-em-bio-seuusuario.vercel.app`

Com a Vercel, você não precisa commitar o `index.html` — adicione-o ao `.gitignore`.

### README.md do projeto

O seu README precisa ter as seguintes seções:

- Título
- **Link do site publicado no GitHub Pages** (obrigatório — o teste verifica isso)
- Foto ou screenshot do site publicado
- Como usar (como preencher o `config.json` e rodar `node src/gerar.js`)
- Como publicar no GitHub Pages (passo a passo resumido)

## Correção

```bash
npm run corrigir-projeto -- 02 ../link-em-bio
```

Os testes verificam:

- Se todos os arquivos obrigatórios existem
- Se `package.json` tem `"type": "module"`, `name` e `description`
- Se `.gitignore` ignora `node_modules`
- Se `config.json` é um JSON válido com `nome` e pelo menos um link
- Se o README tem um título, o link do GitHub Pages e explica como usar
- Se `validarConfig` aceita configs válidas e rejeita configs inválidas com as mensagens certas
- Se as funções de `html.js` geram HTML correto, com escape de XSS
- Se `gerarPagina` retorna um documento HTML completo com `lang="pt-BR"`, charset e viewport

## Para ir além (opcional)

- Tema escuro/claro manual além do automático (com um botão na página)
- Contador de cliques salvo em JSON (Node analytics!)
- Múltiplos temas de cor configuráveis
- Ordenação dos links com drag and drop
- Gerar QR code para o link em bio diretamente no HTML

## O que falar na entrevista

"Fiz um gerador de página de link em bio que lê um arquivo JSON de configuração e gera um HTML
estático. Separei a geração de HTML em funções puras sem efeitos colaterais — assim dá para
testar sem o sistema de arquivos. Tratei XSS escapando todos os dados do usuário antes de inserir
no HTML. O site está publicado no GitHub Pages e uso como link em bio no LinkedIn."
