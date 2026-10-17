# Módulo 01 — HTML e CSS

> **Duração sugerida:** 4 a 5 semanas (ritmo regular).
> **Projeto do módulo:** o seu site de portfólio, publicado no GitHub Pages.

## Objetivos

- Estruturar páginas com **HTML semântico**, que navegadores, leitores de tela e o Google entendem.
- Construir formulários e páginas **acessíveis** para todas as pessoas.
- Preparar uma página para **SEO** e para aparecer bonita quando o link é compartilhado.
- Estilizar com **CSS**: seletores, cascata, box model, cores, fontes e variáveis.
- Montar layouts com **Flexbox** e **Grid**.
- Fazer sites **responsivos** pensando primeiro no celular (*mobile first*), com tema escuro automático.
- Organizar o CSS com a metodologia **BEM**.
- **Publicar** um site de graça no GitHub Pages.

### Como estudar este módulo

Abra a pasta de um exercício, clique com o botão direito no `index.html` → **Open with Live Server**.
O navegador abre e se atualiza sozinho cada vez que você salva. Deixe o editor de um lado
e o navegador do outro.

Os exercícios aparecem nos blocos **✏️ Pratique agora**, logo depois de cada assunto. Pare a
leitura, resolva o exercício e só então siga para o próximo tópico.

---

# Parte A — HTML

HTML (*HyperText Markup Language*) **não é uma linguagem de programação**: é uma linguagem
de **marcação**. Ela diz **o que cada coisa é** ("isto é um título", "isto é um parágrafo",
"isto é um botão"). A **aparência** é trabalho do CSS, e o **comportamento** é trabalho do JavaScript.

| Camada | Responsabilidade | Analogia com uma casa |
| --- | --- | --- |
| HTML | Estrutura e significado | Paredes, portas, cômodos |
| CSS | Aparência | Pintura, móveis, decoração |
| JavaScript | Comportamento | Eletricidade, interruptores |

## 1. Estrutura básica

Todo documento HTML começa assim:

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Meu primeiro site</title>
    <meta name="description" content="Página pessoal criada para praticar HTML." />
  </head>
  <body>
    <h1>Olá, mundo!</h1>
    <p>Meu nome é Ana e estou aprendendo desenvolvimento web.</p>
  </body>
</html>
```

Linha a linha:

| Código | Para que serve |
| --- | --- |
| `<!doctype html>` | Avisa o navegador que é HTML moderno (HTML5). Sem isso ele entra no "modo de compatibilidade" e se comporta de forma estranha. |
| `<html lang="pt-BR">` | A raiz do documento. O `lang` diz o idioma: o leitor de tela pronuncia corretamente, o Google sabe para quem mostrar e o navegador oferece tradução. |
| `<head>` | Informações **sobre** a página, que não aparecem no corpo. |
| `<meta charset="utf-8">` | A codificação de caracteres. Sem ela, "ção" pode virar "Ã§Ã£o". |
| `<meta name="viewport" ...>` | Diz ao celular para usar a largura real da tela. Sem ela, o celular finge ter 980px de largura e mostra o site minúsculo. |
| `<title>` | O texto da aba do navegador e o título azul no resultado do Google. |
| `<meta name="description">` | O resumo que aparece embaixo do título no Google. |
| `<body>` | Tudo o que aparece na tela. |

### Anatomia de uma tag

```html
<a href="https://github.com" target="_blank">Meu GitHub</a>
└┬┘ └──────────┬──────────┘ └──────┬──────┘ └───┬────┘└─┬┘
 │          atributo            atributo      conteúdo  │
tag de abertura                                     tag de fechamento
```

- **Elementos** geralmente têm abertura e fechamento: `<p>...</p>`.
- Alguns são **vazios** (não têm conteúdo): `<img />`, `<br />`, `<meta />`, `<input />`.
  A barra final é opcional no HTML5.
- **Atributos** dão informações extras: `nome="valor"`.
- Elementos podem ficar uns **dentro** dos outros (aninhamento). Feche na ordem inversa:
  `<p><strong>certo</strong></p>`, nunca `<p><strong>errado</p></strong>`.

**Comentários** não aparecem na página: `<!-- isto é um comentário -->`.

**Dica do VS Code:** num arquivo `.html` vazio, digite `!` e aperte **Tab**. O editor gera a estrutura
básica (é o *Emmet*). Mas, **nos primeiros exercícios, digite tudo à mão** para memorizar.
Troque `lang="en"` por `lang="pt-BR"`.

> ✏️ **Pratique agora — Exercício 01: estrutura básica**
>
> Pasta `exercicios/01-html-css/01-estrutura-basica/`. Abra o `index.html`, leia o enunciado no comentário e escreva a página inteira à mão.
>
> ```bash
> npm run exercicio -- 01-estrutura
> ```

## 2. Tags essenciais

### 2.1 Texto

```html
<h1>Título principal da página</h1>
<h2>Título de uma seção</h2>
<h3>Subtítulo dentro da seção</h3>

<p>Um parágrafo de texto. O <strong>strong</strong> indica importância e o
<em>em</em> indica ênfase (muda a entonação da frase).</p>

<p>Primeira linha<br />segunda linha (use br só quando a quebra faz parte do conteúdo, como num endereço).</p>

<blockquote>Uma citação longa.</blockquote>
<p>O atalho para copiar é <kbd>Ctrl</kbd> + <kbd>C</kbd> e o comando é <code>git status</code>.</p>
```

**Regras dos títulos (`h1` a `h6`):**

- **Um único `h1` por página**: o assunto principal.
- **Não pule níveis**: depois de um `h2` vem um `h3`, nunca um `h4`. Os títulos formam o
  "sumário" da página; quem usa leitor de tela navega por eles.
- **Não escolha o título pelo tamanho.** Se o `h2` parece grande demais, mude o tamanho com CSS.

`<strong>` e `<em>` têm **significado**. Já `<b>` e `<i>` só mudam a aparência; prefira os primeiros.

### 2.2 Listas

```html
<!-- Lista NÃO ordenada: a ordem não importa -->
<ul>
  <li>Farinha</li>
  <li>Ovos</li>
</ul>

<!-- Lista ORDENADA: a ordem importa (passos) -->
<ol>
  <li>Misture os ingredientes.</li>
  <li>Asse por 40 minutos.</li>
</ol>
```

Menus de navegação também são listas de links.

### 2.3 Links

```html
<a href="https://developer.mozilla.org">Documentação da MDN</a>   <!-- outro site -->
<a href="contato.html">Página de contato</a>                       <!-- arquivo do próprio site -->
<a href="#projetos">Ir para os projetos</a>                        <!-- seção da mesma página (id="projetos") -->
<a href="mailto:ana@exemplo.com">Me mande um e-mail</a>            <!-- abre o app de e-mail -->
<a href="tel:+5581999999999">Ligar</a>                             <!-- abre o discador no celular -->
```

**Abrindo em nova aba com segurança:**

```html
<a href="https://linkedin.com/in/ana" target="_blank" rel="noopener noreferrer">LinkedIn</a>
```

O `rel="noopener noreferrer"` impede que a página aberta tenha acesso à sua (uma brecha de
segurança chamada *tabnabbing*) e não envia o endereço de origem.

**O texto do link deve dizer para onde ele leva.** Leitores de tela permitem listar só os links
da página; uma lista com dez "clique aqui" é inútil.

```html
❌ <a href="/promocoes">Clique aqui</a> para ver as promoções.
✅ <a href="/promocoes">Ver as promoções da semana</a>
```

### 2.4 Imagens

```html
<img src="img/bolo.webp" alt="Bolo de cenoura fatiado com cobertura de chocolate"
     width="800" height="600" loading="lazy" />
```

| Atributo | Para que serve |
| --- | --- |
| `src` | O caminho da imagem. |
| `alt` | O **texto alternativo**: lido por leitores de tela, mostrado se a imagem não carregar e lido pelo Google. **Obrigatório.** |
| `width` e `height` | O tamanho original. O navegador reserva o espaço antes de baixar, e a página não "pula" (isso tem nome: *CLS*, e afeta a nota do Google). |
| `loading="lazy"` | Só baixa a imagem quando ela estiver perto de aparecer. Use nas imagens que ficam mais abaixo na página. |

**Como escrever um bom `alt`:** descreva o que a imagem **comunica**, como se contasse para alguém
ao telefone. Não comece com "imagem de".

- Foto de produto: `alt="Tênis de corrida azul, vista lateral"`.
- Imagem **decorativa**, que não acrescenta informação: `alt=""` (vazio, mas presente). O leitor de tela a ignora.
- Logo ao lado do nome escrito: `alt=""`, porque o nome já está no texto.

**Formatos:**

| Formato | Use para |
| --- | --- |
| **WebP** / **AVIF** | Fotos, no geral. São muito menores que JPG com a mesma qualidade. |
| **SVG** | Ícones e logos (vetorial: fica nítido em qualquer tamanho). |
| **PNG** | Imagens com transparência quando não der para usar WebP/SVG. |
| **JPG** | Fotos, quando WebP não for opção. |

Antes de colocar uma foto no site, **reduza o tamanho** (uma foto de celular tem 4000px;
o site precisa de uns 1200px).

> ✏️ **Pratique agora — Exercício 02: página de receita**
>
> Pasta `exercicios/01-html-css/02-receita/`. Use títulos, listas, imagem com `alt` e um link seguro para a fonte.
>
> ```bash
> npm run exercicio -- 02-receita
> ```

### 2.5 Tabelas

Tabelas são para **dados em linhas e colunas** (horários, preços, comparativos), **nunca para layout**.

```html
<table>
  <caption>Grade semanal de estudos</caption>
  <thead>
    <tr>
      <th scope="col">Dia</th>
      <th scope="col">Horário</th>
      <th scope="col">Assunto</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Segunda</th>
      <td>19h–21h</td>
      <td>HTML</td>
    </tr>
  </tbody>
</table>
```

- `<caption>`: o título da tabela.
- `<thead>` e `<tbody>`: o cabeçalho e o corpo.
- `<tr>`: uma linha. `<td>`: uma célula de dado. `<th>`: uma célula de **cabeçalho**.
- `scope="col"` / `scope="row"`: diz se o cabeçalho é da coluna ou da linha. O leitor de tela
  usa isso para ler "Segunda, Horário: 19h–21h".

> ✏️ **Pratique agora — Exercício 03: tabela de horários**
>
> Pasta `exercicios/01-html-css/03-tabela/`. Monte a sua grade semanal de estudos.
>
> ```bash
> npm run exercicio -- 03-tabela
> ```

## 3. HTML semântico

"Semântico" quer dizer "com significado". Compare:

```html
<!-- ❌ "Sopa de divs": o navegador não sabe o que é cada parte -->
<div class="topo">
  <div class="menu">...</div>
</div>
<div class="conteudo">...</div>
<div class="rodape">...</div>

<!-- ✅ Semântico: cada área diz o que é -->
<header>
  <nav>...</nav>
</header>
<main>...</main>
<footer>...</footer>
```

Visualmente os dois podem ficar idênticos, mas o semântico:
- permite ao leitor de tela pular direto para o conteúdo principal ou para o menu;
- ajuda o Google a entender a página;
- é mais fácil de ler e de manter.

| Tag | Significado |
| --- | --- |
| `<header>` | Cabeçalho (da página, ou de um artigo). Logo, título, menu. |
| `<nav>` | Um bloco de **navegação** principal (menu). |
| `<main>` | O conteúdo **principal** da página. **Só um** por página. |
| `<section>` | Uma seção temática, normalmente com um título (`h2`). |
| `<article>` | Um conteúdo **independente**, que faria sentido sozinho: um post, um card de produto, um comentário. |
| `<aside>` | Conteúdo **relacionado**, mas secundário: barra lateral, "posts populares". |
| `<footer>` | Rodapé (da página ou de um artigo). Direitos autorais, contatos. |
| `<figure>` + `<figcaption>` | Uma imagem (ou gráfico, código) com legenda. |
| `<time datetime="2026-10-15">` | Uma data ou hora, em formato que máquinas entendem. |
| `<address>` | Informações de contato. |

**E a `<div>`?** Ela continua existindo: é uma caixa **sem significado**, usada quando você
precisa agrupar elementos só para estilizar. A `<span>` é o mesmo, mas para pedaços de texto
dentro de uma linha. Regra prática: **procure uma tag semântica primeiro; se nenhuma servir, use `div`/`span`**.

Uma página de blog completa:

```html
<body>
  <header>
    <p>Blog do Dev</p>
    <nav>
      <ul>
        <li><a href="/">Início</a></li>
        <li><a href="/artigos">Artigos</a></li>
        <li><a href="/sobre">Sobre</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h1>Como estudar programação sem se perder</h1>
      <p>Publicado em <time datetime="2026-10-15">15 de outubro de 2026</time></p>
      <p>Introdução do post...</p>

      <section>
        <h2>Pratique todos os dias</h2>
        <p>...</p>
      </section>
    </article>
  </main>

  <aside>
    <h2>Posts populares</h2>
    <ul>...</ul>
  </aside>

  <footer>
    <p>© 2026 Blog do Dev</p>
  </footer>
</body>
```

> ✏️ **Pratique agora — Exercício 04: HTML semântico**
>
> Pasta `exercicios/01-html-css/04-semantica/`. Monte a página de um post de blog sem usar nenhuma `<div>`.
>
> ```bash
> npm run exercicio -- 04-semantica
> ```

## 4. Formulários

Formulários são a forma de o usuário **enviar dados**: login, cadastro, busca, compra.

```html
<form action="/inscricao" method="post">
  <label for="nome">Nome completo</label>
  <input type="text" id="nome" name="nome" required autocomplete="name" />

  <label for="email">E-mail</label>
  <input type="email" id="email" name="email" required autocomplete="email" />

  <label for="camiseta">Tamanho da camiseta</label>
  <select id="camiseta" name="camiseta">
    <option>P</option>
    <option>M</option>
    <option>G</option>
  </select>

  <fieldset>
    <legend>Modalidade</legend>
    <input type="radio" id="presencial" name="modalidade" value="presencial" />
    <label for="presencial">Presencial</label>
    <input type="radio" id="online" name="modalidade" value="online" />
    <label for="online">Online</label>
  </fieldset>

  <label for="mensagem">Comentários</label>
  <textarea id="mensagem" name="mensagem" rows="4"></textarea>

  <input type="checkbox" id="termos" name="termos" required />
  <label for="termos">Aceito os termos</label>

  <button type="submit">Inscrever</button>
</form>
```

### 4.1 As peças

| Elemento | Para que serve |
| --- | --- |
| `<form action method>` | Agrupa os campos. `action` é para onde os dados vão; `method` é o método HTTP (lembra do módulo 00?). |
| `<label for="id">` | O **rótulo** do campo. O `for` aponta para o `id` do campo. Clicar no rótulo foca o campo, e o leitor de tela lê o rótulo ao entrar no campo. |
| `<input>` | Campo de uma linha. O `type` muda tudo (tabela abaixo). |
| `name` | O nome com que o dado é enviado ao servidor: `email=ana@exemplo.com`. **Sem `name`, o campo não é enviado.** |
| `<select>` + `<option>` | Lista de opções. |
| `<input type="radio">` | Escolher **uma** opção. Rádios do mesmo grupo têm o mesmo `name`. |
| `<input type="checkbox">` | Marcar/desmarcar (pode marcar várias). |
| `<fieldset>` + `<legend>` | Agrupa campos relacionados com um título. Essencial para grupos de rádio: o leitor de tela lê "Modalidade, Presencial". |
| `<textarea>` | Texto de várias linhas. |
| `<button type="submit">` | Envia o formulário. Use `type="button"` para botões que **não** enviam. |

### 4.2 Tipos de `input`

| `type` | Para quê | Bônus |
| --- | --- | --- |
| `text` | Texto comum | |
| `email` | E-mail | Valida o formato; no celular, o teclado mostra o `@` |
| `password` | Senha | Esconde os caracteres |
| `tel` | Telefone | Teclado numérico no celular |
| `number` | Números (quantidade, idade) | Setinhas; aceita `min`, `max`, `step` |
| `date` | Data | Calendário nativo |
| `search` | Campo de busca | |
| `checkbox`, `radio` | Opções | |
| `file` | Envio de arquivo | |

### 4.3 Validação nativa

O navegador valida sozinho antes de enviar:

```html
<input type="text" name="cep" required pattern="\d{5}-?\d{3}" placeholder="00000-000" />
<input type="number" name="quantidade" min="1" max="10" />
<input type="password" name="senha" minlength="8" />
```

- `required`: obrigatório.
- `minlength` / `maxlength`: tamanho do texto.
- `min` / `max`: limites de números e datas.
- `pattern`: um formato (expressão regular, você vai aprender no módulo 03).

> ⚠️ **Validação no navegador é para a experiência do usuário, não para segurança.** Qualquer
> pessoa pode burlá-la. O servidor **sempre** valida de novo (módulo 12).

**`placeholder` não substitui `label`.** O placeholder some quando a pessoa começa a digitar,
tem pouco contraste e muitos leitores de tela o ignoram. Use-o só para um exemplo do formato.

> ✏️ **Pratique agora — Exercício 05: formulário de inscrição**
>
> Pasta `exercicios/01-html-css/05-formulario/`. Todo campo com `label`, o tipo de `input` certo e validação nativa.
>
> ```bash
> npm run exercicio -- 05-formulario
> ```

## 5. Acessibilidade (a11y)

Acessibilidade (abreviada **a11y**: "a", 11 letras, "y") é fazer o site funcionar para **todas**
as pessoas: quem é cego e usa leitor de tela, quem tem baixa visão, quem não usa mouse,
quem é daltônico, quem está com o braço quebrado ou no sol forte com o celular.

No Brasil, a **Lei Brasileira de Inclusão (Lei 13.146/2015)** exige acessibilidade em sites de
empresas e órgãos públicos. Além de ser certo, é requisito em muitos projetos.

### 5.1 As regras de ouro

1. **Use a tag certa.** Um `<button>` já vem acessível: recebe foco pelo Tab, funciona com Enter
   e Espaço e é anunciado como "botão". Uma `<div onclick>` não faz nada disso.

   ```html
   ❌ <div class="botao" onclick="comprar()">Comprar</div>
   ✅ <button type="button" onclick="comprar()">Comprar</button>
   ```

   Regra: **leva para outro lugar → `<a>`. Faz uma ação → `<button>`.**

2. **Todo campo tem `label`.**
3. **Toda imagem tem `alt`** (vazio se for decorativa).
4. **Títulos em ordem**, um único `h1`.
5. **Links com texto descritivo.**
6. **Contraste suficiente** entre texto e fundo (o DevTools avisa; a recomendação é razão de
   pelo menos 4.5:1 para texto normal).
7. **Não use só a cor para passar informação.** "Os campos em vermelho estão errados" não
   funciona para daltônicos. Acrescente um ícone ou um texto.
8. **Tudo funciona pelo teclado** e o foco é visível (Parte B, seção 7).
9. **Declare o idioma** (`lang="pt-BR"`).

### 5.2 O link "pular para o conteúdo"

Quem navega pelo teclado precisaria apertar Tab dezenas de vezes para passar pelo menu antes
de chegar ao conteúdo. A solução é colocar, como **primeiro elemento** da página, um link que
pula direto para o `<main>`:

```html
<body>
  <a class="pular" href="#conteudo">Pular para o conteúdo</a>
  <header>...menu...</header>
  <main id="conteudo">...</main>
</body>
```

Com CSS, esse link fica escondido e só aparece quando recebe foco (você vai fazer isso na Parte B).

### 5.3 ARIA: só quando o HTML não dá conta

ARIA são atributos que dão informações extras para leitores de tela. A primeira regra do ARIA
é: **se existe uma tag HTML que faz isso, use a tag.** Dois usos comuns e seguros:

```html
<!-- Botão só com ícone: precisa de um nome -->
<button type="button" aria-label="Fechar">✕</button>

<!-- Link do GitHub que é só um ícone -->
<a href="https://github.com/ana" aria-label="GitHub da Ana">
  <img src="github.svg" alt="" width="24" height="24" />
</a>
```

### 5.4 Teste você mesmo

- Desconecte o mouse e navegue com **Tab**, **Shift+Tab**, **Enter** e **Espaço**.
  Você consegue usar tudo? Sempre sabe onde está o foco?
- DevTools → aba **Lighthouse** → marque *Accessibility* → *Analyze page load*.
- Ative o leitor de tela do seu sistema (NVDA no Windows é gratuito; VoiceOver no Mac/iPhone;
  TalkBack no Android) e ouça a sua página por um minuto.

> ✏️ **Pratique agora — Exercício 06: corrija a acessibilidade**
>
> Pasta `exercicios/01-html-css/06-acessibilidade/`. A página "funciona", mas tem sete problemas de acessibilidade. Encontre e corrija todos.
>
> ```bash
> npm run exercicio -- 06-acessibilidade
> ```

## 6. SEO e compartilhamento

**SEO** (*Search Engine Optimization*) é preparar a página para ser bem entendida pelo Google.
O HTML semântico já faz metade do trabalho. O resto fica no `<head>`:

```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Aparece no Google -->
  <title>Ana Souza — Desenvolvedora Web</title>
  <meta name="description" content="Portfólio da Ana Souza, desenvolvedora web. Projetos com HTML, CSS e JavaScript." />

  <!-- Open Graph: a prévia quando o link é colado no LinkedIn, WhatsApp, Discord... -->
  <meta property="og:title" content="Ana Souza — Desenvolvedora Web" />
  <meta property="og:description" content="Projetos e contato da Ana Souza." />
  <meta property="og:image" content="https://ana.github.io/portfolio/img/og-imagem.png" />
  <meta property="og:url" content="https://ana.github.io/portfolio/" />
  <meta property="og:type" content="website" />

  <!-- Ícone da aba -->
  <link rel="icon" href="img/favicon.svg" type="image/svg+xml" />

  <link rel="stylesheet" href="css/estilo.css" />
</head>
```

- **`title`**: até uns 60 caracteres, com o mais importante no começo.
- **`description`**: entre 50 e 160 caracteres. É o "anúncio" da sua página no Google.
- **`og:image`**: imagem de **1200 × 630 px**, com o endereço **completo** (`https://...`).
- **Favicon**: um SVG simples resolve. Pode ser só a sua inicial num círculo colorido.

---

# Parte B — CSS

CSS (*Cascading Style Sheets*) define a **aparência**. Ele é escrito em um arquivo separado
e ligado ao HTML no `<head>`:

```html
<link rel="stylesheet" href="css/estilo.css" />
```

Evite CSS **dentro** do HTML (`<p style="color: red">`): mistura responsabilidades, não pode ser
reaproveitado e ganha de quase todas as outras regras, o que gera dor de cabeça.

## 1. Seletores e cascata

### 1.1 Anatomia de uma regra

```css
seletor {
  propriedade: valor;
  outra-propriedade: valor;
}
```

```css
h1 {
  color: #4b2e1e;
  font-size: 2rem;
}
```

O **seletor** diz *quem* vai ser estilizado. As **declarações** dizem *como*.

### 1.2 Os seletores

| Seletor | Exemplo | Seleciona |
| --- | --- | --- |
| Tipo (tag) | `p` | Todos os `<p>` |
| Classe | `.preco` | Todos com `class="preco"` |
| ID | `#contato` | O elemento com `id="contato"` |
| Universal | `*` | Todos os elementos |
| Agrupado | `h1, h2` | Todos os `h1` **e** todos os `h2` |
| Descendente | `nav a` | Todo `a` que está **em qualquer nível** dentro de um `nav` |
| Filho direto | `.cardapio > li` | Só os `li` que são **filhos imediatos** de `.cardapio` |
| Combinado | `li.destaque` | `li` que **também** tem a classe `destaque` |
| Atributo | `a[target="_blank"]` | Links que abrem em nova aba |
| Pseudo-classe | `a:hover` | Link com o mouse em cima |
| | `button:focus-visible` | Botão com foco **pelo teclado** |
| | `li:first-child`, `li:last-child`, `li:nth-child(2n)` | Primeiro, último, pares... |
| Pseudo-elemento | `p::first-line`, `.icone::before` | Uma "parte" do elemento, ou conteúdo gerado |

Um elemento pode ter **várias classes**: `<li class="item destaque">`.

**Classes são a ferramenta principal.** Use IDs para âncoras (`href="#contato"`) e para ligar
`label` ao campo, não para estilizar.

### 1.3 A cascata: quem ganha quando duas regras brigam?

Imagine que um mesmo elemento recebe duas cores:

```css
.preco { color: black; }
.destaque .preco { color: #b00020; }
```

```html
<li class="destaque">Cappuccino <span class="preco">R$ 9,00</span></li>
```

O preço fica vermelho. O navegador decide o vencedor nesta ordem:

1. **Origem e importância**: `!important` vence tudo (e por isso **não use**: vira uma guerra
   de `!important` impossível de manter).
2. **Especificidade**: o seletor mais "específico" vence.
3. **Ordem**: com especificidade empatada, vence a regra que aparece **por último**.

**Calculando a especificidade.** Conte quantos de cada tipo o seletor tem, no formato (IDs, classes, tags):

| Seletor | IDs | Classes, atributos e pseudo-classes | Tags e pseudo-elementos | Especificidade |
| --- | --- | --- | --- | --- |
| `p` | 0 | 0 | 1 | (0, 0, 1) |
| `.preco` | 0 | 1 | 0 | (0, 1, 0) |
| `.destaque .preco` | 0 | 2 | 0 | (0, 2, 0) |
| `nav a:hover` | 0 | 1 | 2 | (0, 1, 2) |
| `#contato` | 1 | 0 | 0 | (1, 0, 0) |

Compara-se da esquerda para a direita: (0, 2, 0) vence (0, 1, 0). Um único ID vence qualquer
quantidade de classes, outro motivo para não estilizar por ID.

> **Dica profissional:** mantenha a especificidade **baixa e parecida** (uma classe por seletor).
> É exatamente o que a metodologia BEM (seção 8) propõe.

### 1.4 Herança

Algumas propriedades são **herdadas** pelos filhos: `color`, `font-family`, `font-size`,
`line-height`. Por isso você define a fonte uma vez no `body` e ela vale para a página toda.
Outras, como `margin`, `padding`, `border` e `background`, **não** são herdadas.

### 1.5 Um bom começo para todo projeto

```css
*,
*::before,
*::after {
  box-sizing: border-box; /* explicado na próxima seção */
}

body {
  margin: 0;                                    /* o navegador coloca 8px por padrão */
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;                             /* texto mais fácil de ler */
}

img {
  max-width: 100%;   /* imagem nunca maior que o espaço disponível */
  height: auto;      /* mantém a proporção */
  display: block;
}
```

`system-ui` usa a fonte do sistema operacional da pessoa: bonita, rápida (não precisa baixar nada)
e familiar. A lista funciona como "tente a primeira; se não existir, a próxima".

> ✏️ **Pratique agora — Exercício 07: seletores e cascata**
>
> Pasta `exercicios/01-html-css/07-seletores-cascata/`. Não altere o HTML: escreva as regras pedidas no `estilo.css`.
>
> ```bash
> npm run exercicio -- 07-seletores
> ```

## 2. Box model

**Todo elemento é uma caixa.** Entender isto resolve 80% dos problemas de layout:

```
┌───────────────── margin (espaço FORA da borda) ─────────────────┐
│  ┌────────────── border (a borda) ───────────────────────────┐  │
│  │  ┌─────────── padding (espaço DENTRO da borda) ────────┐  │  │
│  │  │                                                     │  │  │
│  │  │                conteúdo (width × height)            │  │  │
│  │  │                                                     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

```css
.plano {
  padding: 1.5rem;              /* espaço interno, nos 4 lados */
  border: 1px solid #d0d0d0;    /* espessura, estilo, cor */
  border-radius: 12px;          /* cantos arredondados */
  margin-bottom: 1rem;          /* espaço externo, só embaixo */
  max-width: 320px;             /* nunca mais largo que isso */
}
```

**Valores com 1, 2, 3 ou 4 números** (vale para `margin` e `padding`, sempre em sentido horário
a partir do topo):

```css
padding: 10px;              /* todos os lados */
padding: 10px 20px;         /* em cima/embaixo 10, laterais 20 */
padding: 10px 20px 5px;     /* em cima 10, laterais 20, embaixo 5 */
padding: 10px 20px 5px 0;   /* em cima, direita, embaixo, esquerda */
margin: 0 auto;             /* centraliza horizontalmente um bloco com largura definida */
```

### 2.1 `box-sizing: border-box`

Por padrão, o `width` vale **só para o conteúdo**: uma caixa com `width: 300px` e `padding: 20px`
fica com 340px na tela. Isso confunde todo mundo. Com `box-sizing: border-box`, o `width` passa
a **incluir** padding e borda: 300px são 300px. Por isso ele vai no começo de todo projeto.

### 2.2 `display`: block, inline e inline-block

| `display` | Comportamento | Exemplos padrão |
| --- | --- | --- |
| `block` | Ocupa a linha inteira; aceita `width`, `height`, `margin` e `padding` em todos os lados | `div`, `p`, `h1`, `section`, `ul` |
| `inline` | Fica no meio do texto; **ignora** `width`, `height` e margens verticais | `a`, `span`, `strong` |
| `inline-block` | Fica no meio do texto, **mas** aceita tamanho e espaçamento | `button`, `input` |
| `none` | Some da página (e do leitor de tela) | |
| `flex` / `grid` | Ativa os sistemas de layout (seções 4 e 5) | |

Por isso um link estilizado como botão precisa de `display: inline-block`: sem isso, o
padding vertical não empurra nada e o "botão" fica torto.

### 2.3 Margens que "colapsam"

Margens **verticais** de blocos vizinhos não se somam: entre um elemento com `margin-bottom: 20px`
e o próximo com `margin-top: 30px`, o espaço fica 30px (o maior). Não é bug, é a regra.
Para evitar surpresas, muitos devs usam margem só em uma direção (por exemplo, só `margin-bottom`).

### 2.4 Use o DevTools

F12 → aba **Elements** → selecione um elemento → painel **Computed**. O desenho do box model
mostra os valores reais de margin, border, padding e conteúdo. Passe o mouse e veja as áreas
coloridas na página. Quando o layout estiver estranho, **comece por aqui**.

> ✏️ **Pratique agora — Exercício 08: box model**
>
> Pasta `exercicios/01-html-css/08-box-model/`. Estilize os cartões de planos de uma academia.
>
> ```bash
> npm run exercicio -- 08-box
> ```

## 3. Unidades, cores, fontes e variáveis

### 3.1 Unidades

| Unidade | O que é | Use para |
| --- | --- | --- |
| `px` | Pixel | Bordas, sombras, detalhes finos |
| `rem` | Múltiplo do tamanho da fonte raiz (normalmente 16px): `1rem` = 16px | **Tamanhos de fonte, espaçamentos**. Respeita quem aumentou a fonte nas configurações do sistema. |
| `em` | Múltiplo do tamanho da fonte do **próprio elemento** | Espaçamentos que devem crescer junto com o texto (ex.: padding de botão) |
| `%` | Porcentagem do elemento pai | Larguras fluidas |
| `vw` / `vh` | 1% da largura / altura da janela | Seções de tela cheia (`min-height: 100vh`) |
| `ch` | Largura do caractere "0" | Limitar a largura do texto: `max-width: 65ch` (linhas longas cansam a leitura) |
| `fr` | Fração do espaço livre (só no Grid) | Colunas |

**Funções úteis:**

```css
width: calc(100% - 2rem);                 /* contas misturando unidades */
font-size: clamp(1.5rem, 4vw, 3rem);      /* mínimo, ideal, máximo: fonte fluida */
width: min(100%, 960px);                  /* o menor dos dois */
```

### 3.2 Cores

```css
color: #1f2328;                 /* hexadecimal: #RRGGBB */
color: rgb(31 35 40);           /* vermelho, verde, azul (0–255) */
color: rgb(31 35 40 / 50%);     /* com 50% de transparência */
color: hsl(210 100% 40%);       /* matiz (0–360), saturação, luminosidade: fácil de ajustar */
background-color: transparent;
```

`hsl` é ótimo para criar variações: mesma matiz, luminosidade diferente → cor mais clara ou mais escura.

### 3.3 Texto e fontes

```css
body {
  font-family: system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: #1f2328;
}

h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;          /* 400 = normal, 700 = negrito */
  letter-spacing: -0.02em;
}

.texto {
  max-width: 65ch;
  text-align: left;          /* evite "justify": cria buracos entre as palavras */
}
```

**Fontes da internet** (Google Fonts): escolha a fonte no site, copie o `<link>` para o `<head>` e
use o nome no `font-family`. Use no máximo duas famílias e só os pesos de que precisa: cada
fonte é um arquivo a mais para baixar.

### 3.4 Variáveis CSS (custom properties)

Imagine que a cor principal do site aparece em 40 lugares e o cliente pede para trocá-la.
Com **variáveis**, você muda em um lugar só:

```css
:root {
  --cor-fundo: #ffffff;
  --cor-texto: #1f2328;
  --cor-primaria: #0b6bcb;
  --espaco: 1rem;
  --raio: 8px;
}

body {
  background-color: var(--cor-fundo);
  color: var(--cor-texto);
}

.botao {
  background-color: var(--cor-primaria);
  padding: var(--espaco);
  border-radius: var(--raio);
}
```

- Variáveis começam com `--` e são lidas com `var(--nome)`.
- `:root` é o elemento raiz (o `<html>`): variáveis definidas ali valem na página toda.
- `var(--cor, blue)` usa `blue` se a variável não existir.

Esse conjunto de cores, espaçamentos e raios padronizados é o embrião de um **design system**,
o que empresas usam para manter centenas de telas consistentes.

### 3.5 Tema escuro automático

O sistema operacional da pessoa informa se ela prefere tema escuro. Com variáveis, basta
**redefinir as cores**, e o resto do CSS se adapta sozinho:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --cor-fundo: #0d1117;
    --cor-texto: #e6edf3;
  }
}
```

Para testar sem mudar o sistema: DevTools → `⋮` → *More tools* → **Rendering** → *Emulate CSS
media feature prefers-color-scheme* → `dark`.

> ✏️ **Pratique agora — Exercício 09: variáveis e tema escuro**
>
> Pasta `exercicios/01-html-css/09-variaveis-tema-escuro/`. Crie as variáveis de cor e espaço e o tema escuro automático, sem nenhuma cor "solta" fora do `:root`.
>
> ```bash
> npm run exercicio -- 09-variaveis
> ```

## 4. Flexbox: layouts em uma direção

Flexbox organiza itens em **uma linha ou uma coluna**. É a ferramenta para menus, barras,
alinhar ícone e texto, centralizar coisas e distribuir botões.

Você aplica `display: flex` no **pai** (o *container*), e os **filhos diretos** viram itens flexíveis:

```html
<header class="cabecalho">
  <a class="cabecalho__logo" href="/">Estúdio Pixel</a>
  <nav>...</nav>
</header>
```

```css
.cabecalho {
  display: flex;
  justify-content: space-between;  /* distribui no eixo principal */
  align-items: center;             /* alinha no eixo cruzado */
  gap: 1rem;                       /* espaço entre os itens */
}
```

### 4.1 Os dois eixos

```
flex-direction: row (padrão)

 eixo principal ───────────────────────────────▶
 ┌──────┐  ┌──────┐  ┌──────┐
 │  1   │  │  2   │  │  3   │      ▲
 └──────┘  └──────┘  └──────┘      │ eixo cruzado
                                   ▼
```

- `justify-content` alinha no **eixo principal**.
- `align-items` alinha no **eixo cruzado**.
- Com `flex-direction: column`, os eixos se invertem.

### 4.2 Propriedades do container

| Propriedade | Valores comuns | Efeito |
| --- | --- | --- |
| `flex-direction` | `row`, `column` | Linha ou coluna |
| `justify-content` | `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` | Distribuição no eixo principal |
| `align-items` | `stretch` (padrão), `center`, `flex-start`, `flex-end` | Alinhamento no eixo cruzado |
| `gap` | `1rem` | Espaço entre os itens (melhor que margens) |
| `flex-wrap` | `nowrap` (padrão), `wrap` | Deixa os itens quebrarem para a linha de baixo |

### 4.3 Propriedades dos itens

| Propriedade | Efeito |
| --- | --- |
| `flex: 1` | O item **cresce** para ocupar o espaço livre |
| `flex-shrink: 0` | O item **não encolhe** (bom para ícones e imagens) |
| `align-self: center` | Alinha só este item no eixo cruzado |
| `order: -1` | Muda a ordem **visual** (cuidado: o leitor de tela segue a ordem do HTML) |

### 4.4 Receitas prontas

**Centralizar qualquer coisa**, na horizontal e na vertical:

```css
.centro {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

**Menu horizontal sem marcadores:**

```css
.menu {
  display: flex;
  gap: 1.5rem;
  list-style: none;   /* tira as bolinhas da lista */
  padding: 0;
  margin: 0;
}
```

**Rodapé sempre no fim da tela** (*sticky footer*), mesmo com pouco conteúdo:

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
}

main {
  flex: 1;   /* o main cresce e empurra o rodapé para baixo */
}
```

> ✏️ **Pratique agora — Exercício 10: flexbox**
>
> Pasta `exercicios/01-html-css/10-flexbox/`. Cabeçalho com logo e menu, rodapé centralizado e o rodapé sempre no fim da tela.
>
> ```bash
> npm run exercicio -- 10-flexbox
> ```

## 5. Grid: layouts em duas direções

Grid organiza em **linhas e colunas ao mesmo tempo**. É a ferramenta para galerias, listas de
cards e o layout geral da página.

```css
.galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 colunas iguais */
  gap: 1rem;
}
```

- `1fr` = "uma fração do espaço livre". `1fr 2fr` faz a segunda coluna ter o dobro da primeira.
- `repeat(3, 1fr)` é o mesmo que `1fr 1fr 1fr`.
- `250px 1fr`: primeira coluna fixa, segunda ocupa o resto (layout com barra lateral).

### 5.1 Áreas nomeadas: desenhando o layout

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-areas:
    "topo    topo"
    "lateral conteudo"
    "rodape  rodape";
  min-height: 100vh;
}

.layout__topo     { grid-area: topo; }
.layout__lateral  { grid-area: lateral; }
.layout__conteudo { grid-area: conteudo; }
.layout__rodape   { grid-area: rodape; }
```

O `grid-template-areas` é literalmente um desenho do layout: cada texto entre aspas é uma linha
e cada palavra é uma coluna. Repetir o nome faz a área ocupar várias células.

### 5.2 Grid responsivo sem media query

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
```

"Coloque quantas colunas couberem, cada uma com **no mínimo 250px**, dividindo o espaço que sobrar."
No celular fica uma coluna; no monitor, quatro ou cinco.

### 5.3 Imagens em grade

```css
.galeria img {
  width: 100%;
  aspect-ratio: 1 / 1;   /* quadrada */
  object-fit: cover;     /* preenche cortando as bordas, sem distorcer */
}
```

### 5.4 Flexbox ou Grid?

| Situação | Use |
| --- | --- |
| Itens em uma linha (menu, barra de botões, ícone + texto) | **Flexbox** |
| Centralizar algo | **Flexbox** |
| Linhas **e** colunas alinhadas (galeria, cards, tabela de preços) | **Grid** |
| Layout geral da página | **Grid** |

Na prática, você vai usar os dois juntos: Grid no layout, Flexbox dentro de cada card.

> ✏️ **Pratique agora — Exercício 11: grid**
>
> Pasta `exercicios/01-html-css/11-grid/`. O layout de uma galeria com áreas nomeadas e as fotos em grade.
>
> ```bash
> npm run exercicio -- 11-grid
> ```

## 6. Responsividade (mobile first)

Mais da metade dos acessos à internet no Brasil vem do celular. Um site **responsivo** se
adapta a qualquer tamanho de tela.

### 6.1 Os pilares

1. A **meta viewport** no HTML (sem ela, nada funciona no celular).
2. **Larguras fluidas**: `%`, `fr`, `max-width` no lugar de larguras fixas.
3. **Imagens fluidas**: `img { max-width: 100%; height: auto; }`.
4. **Media queries** para ajustar o layout em telas maiores.

### 6.2 Media queries

Uma media query aplica regras **só quando uma condição é verdadeira**:

```css
@media (min-width: 768px) {
  /* só vale em telas com 768px de largura ou mais */
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 6.3 Mobile first: comece pelo celular

Escreva primeiro o CSS do celular, **sem media query**, e vá **acrescentando** para telas maiores
com `min-width`:

```css
/* 1. Celular (base) */
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* 2. Tablet */
@media (min-width: 768px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 3. Desktop */
@media (min-width: 1024px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Por que assim?
- O celular, que costuma ter processador e internet piores, carrega o CSS mais simples.
- Pensar no espaço pequeno primeiro **obriga a priorizar** o conteúdo.
- O CSS fica menor: telas grandes só **acrescentam** coisas.

Os pontos de quebra (*breakpoints*) mais usados: **640px, 768px, 1024px e 1280px**. Mas o certo
é colocar o breakpoint **onde o seu layout quebra**: diminua a janela devagar e veja onde fica feio.

### 6.4 Container centralizado

```css
.container {
  max-width: 1200px;
  margin: 0 auto;      /* centraliza */
  padding: 0 1rem;     /* respiro nas laterais no celular */
}
```

### 6.5 Testando

DevTools → ícone de celular (*Toggle device toolbar*, `Ctrl+Shift+M`) → escolha um aparelho ou
arraste a largura. E **teste no seu celular de verdade**: com o Live Server, acesse pelo IP do
computador na mesma rede Wi-Fi; no Codespaces, use o endereço da porta encaminhada (aba *Ports*).

> ✏️ **Pratique agora — Exercício 12: mobile first**
>
> Pasta `exercicios/01-html-css/12-responsivo/`. Uma lista de cursos com 1, 2 e 3 colunas conforme a largura da tela.
>
> ```bash
> npm run exercicio -- 12-responsivo
> ```

## 7. Posicionamento, transições, animações e foco

### 7.1 `position`

| Valor | Comportamento |
| --- | --- |
| `static` | O padrão: segue o fluxo normal. |
| `relative` | Segue o fluxo, mas pode ser deslocado com `top`/`left`. Principal uso: servir de **referência** para filhos `absolute`. |
| `absolute` | Sai do fluxo e se posiciona em relação ao ancestral `relative` mais próximo. Selos ("Promoção") no canto de um card. |
| `fixed` | Fixo em relação à **janela**: não sai do lugar ao rolar. Botão de WhatsApp flutuante. |
| `sticky` | Rola normalmente até encostar no limite definido, então gruda. Cabeçalho que fica no topo. |

```css
.card { position: relative; }

.card__selo {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.topo {
  position: sticky;
  top: 0;
  z-index: 10;   /* fica por cima do conteúdo que passa embaixo */
}
```

### 7.2 Transições

Uma **transição** anima a mudança de uma propriedade, por exemplo ao passar o mouse:

```css
.botao {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.botao:hover,
.botao:focus-visible {
  transform: translateY(-2px);
}
```

`transition: propriedade duração curva`. Prefira animar `transform` e `opacity`: o navegador
as anima de forma muito mais leve que `width`, `top` ou `margin`.

### 7.3 Animações com `@keyframes`

```css
@keyframes pulsar {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}

.notificacao {
  animation: pulsar 1.5s ease-in-out infinite;
  /* nome, duração, curva, repetição */
}
```

### 7.4 Movimento reduzido

Para algumas pessoas (com labirintite, enxaqueca ou epilepsia, por exemplo), movimento na tela
causa mal-estar. O sistema operacional permite pedir "reduzir movimento", e o CSS deve respeitar:

```css
@media (prefers-reduced-motion: reduce) {
  .botao {
    transition: none;
  }

  .notificacao {
    animation: none;
  }
}
```

### 7.5 Foco visível

Quem navega pelo teclado precisa **ver** onde está. Nunca escreva `outline: none` sem colocar
outra coisa no lugar. O `:focus-visible` aplica o estilo só quando o foco veio do teclado (não
aparece ao clicar com o mouse):

```css
a:focus-visible,
button:focus-visible {
  outline: 3px solid var(--cor-primaria);
  outline-offset: 2px;
}
```

**O link "pular para o conteúdo"** (Parte A, seção 5.2), escondido até receber foco:

```css
.pular {
  position: absolute;
  left: 1rem;
  top: -100px;          /* fora da tela */
}

.pular:focus-visible {
  top: 1rem;            /* aparece quando recebe foco pelo Tab */
}
```

> ✏️ **Pratique agora — Exercício 13: transições e animações**
>
> Pasta `exercicios/01-html-css/13-transicoes-animacoes/`. Botão com efeito no hover e no foco, uma notificação pulsando e o respeito ao movimento reduzido.
>
> ```bash
> npm run exercicio -- 13-transicoes
> ```

## 8. Organização: a metodologia BEM

Num projeto grande, nomes como `.titulo` ou `.botao` começam a colidir. O BEM é uma convenção de
nomes que deixa claro **a que componente cada classe pertence**:

- **Bloco**: o componente independente → `.produto`
- **Elemento**: uma parte do bloco, separada por **dois sublinhados** → `.produto__nome`, `.produto__preco`
- **Modificador**: uma variação, separada por **dois hífens** → `.produto--promocao`, `.produto__preco--promocao`

```html
<article class="produto produto--promocao">
  <img class="produto__imagem" src="teclado.webp" alt="Teclado mecânico com luzes" width="400" height="300" />
  <h2 class="produto__nome">Teclado mecânico</h2>
  <p class="produto__preco produto__preco--promocao">R$ 199,90</p>
  <button class="produto__botao" type="button">Comprar</button>
</article>
```

```css
.produto { padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }
.produto__nome { font-size: 1.25rem; }
.produto__preco { font-weight: bold; }
.produto__botao { padding: 0.5rem 1rem; }

.produto--promocao { border-color: #e0a800; }
.produto__preco--promocao { color: #b00020; }
```

As regras do BEM:

1. Nomes em **minúsculas**, palavras separadas por **hífen**: `.lista-de-compras__item`.
2. O modificador **sempre acompanha** a classe base: `class="produto produto--promocao"`.
3. **Uma classe por seletor**, sem aninhar: `.produto__nome`, e não `.produto h2` nem
   `.produto .produto__nome`. Assim a especificidade fica sempre igual (0, 1, 0) e não há brigas.
4. Não existe "neto": é `.produto__nome`, nunca `.produto__cabecalho__nome`.

> ✏️ **Pratique agora — Exercício 14: componente com BEM**
>
> Pasta `exercicios/01-html-css/14-bem/`. Desta vez você escreve o HTML **e** o CSS de dois cartões de produto.
>
> ```bash
> npm run exercicio -- 14-bem
> ```

## 9. Publicando no GitHub Pages

O GitHub hospeda sites estáticos (HTML, CSS, JS) **de graça** com o GitHub Pages.

1. Coloque o projeto em um repositório **público** no GitHub, com o `index.html` na raiz.
2. No repositório: **Settings → Pages**.
3. Em *Build and deployment*, escolha *Source: Deploy from a branch*, *Branch: `main`* e pasta
   `/ (root)`. Salve.
4. Em um ou dois minutos o site estará em `https://seu-usuario.github.io/nome-do-repositorio/`.

Cada `git push` na `main` atualiza o site automaticamente.

> **Cuidado com caminhos.** Como o site fica dentro de `/nome-do-repositorio/`, um caminho que
> começa com `/` (como `/css/estilo.css`) aponta para a raiz do domínio e quebra. Use caminhos
> **relativos**: `css/estilo.css`.

## 10. Ferramentas de qualidade: DevTools e Lighthouse

- **Elements**: inspecione e **edite CSS ao vivo** para experimentar (depois copie para o arquivo).
- **Computed**: o valor final de cada propriedade e de onde ele veio (cascata).
- **Lighthouse**: gera notas de 0 a 100 para Performance, Acessibilidade, Boas Práticas e SEO,
  com a lista do que corrigir. Rode em **modo anônimo** (extensões atrapalham a medição).

Meta para todos os seus projetos: **90+ em Acessibilidade, Boas Práticas e SEO.**

---

## Resumo dos exercícios

Você já fez todos ao longo da aula. Confira com `npm run progresso`.

| # | Pasta | Assunto | Seção |
| --- | --- | --- | --- |
| 01 | `01-estrutura-basica` | doctype, lang, meta tags, title | A1 |
| 02 | `02-receita` | títulos, listas, imagem com alt, link seguro | A2 |
| 03 | `03-tabela` | tabela com caption, thead, th scope | A2.5 |
| 04 | `04-semantica` | header, nav, main, article, section, aside, footer, time | A3 |
| 05 | `05-formulario` | formulário completo e acessível | A4 |
| 06 | `06-acessibilidade` | **corrigir** uma página cheia de problemas | A5 |
| 07 | `07-seletores-cascata` | seletores, agrupamento, especificidade | B1 |
| 08 | `08-box-model` | box-sizing, padding, border, display | B2 |
| 09 | `09-variaveis-tema-escuro` | variáveis CSS e tema escuro automático | B3 |
| 10 | `10-flexbox` | cabeçalho, menu e sticky footer | B4 |
| 11 | `11-grid` | layout com áreas nomeadas e galeria | B5 |
| 12 | `12-responsivo` | mobile first com media queries | B6 |
| 13 | `13-transicoes-animacoes` | transição, keyframes, foco, movimento reduzido | B7 |
| 14 | `14-bem` | componente com BEM (HTML + CSS) | B8 |

---

## Projeto do módulo — Site de portfólio

Enunciado completo: [projetos/01-portfolio/README.md](../projetos/01-portfolio/README.md).

O seu site pessoal, **usado de verdade**: apresentação, sobre, projetos e contato. Acessível,
responsivo, com tema escuro automático, pronto para compartilhar no LinkedIn e publicado no GitHub Pages.

```bash
npm run corrigir-projeto -- 01 ../portfolio
```

---

## Checklist para avançar

- [ ] Escrevo a estrutura básica de uma página sem consultar.
- [ ] Escolho a tag semântica certa para cada parte da página.
- [ ] Faço formulários com label em todos os campos e o tipo de input correto.
- [ ] Sei escrever um bom `alt` e quando deixá-lo vazio.
- [ ] Explico a especificidade e por que evitar IDs e `!important` no CSS.
- [ ] Entendo o box model e uso `box-sizing: border-box`.
- [ ] Monto layouts com Flexbox e com Grid e sei quando usar cada um.
- [ ] Faço sites mobile first, com variáveis CSS e tema escuro.
- [ ] Navego no meu site só pelo teclado e o foco está sempre visível.
- [ ] Os 14 exercícios passam (`npm run progresso`).
- [ ] Meu portfólio está publicado no GitHub Pages e passou na correção.
- [ ] O Lighthouse dá 90+ em Acessibilidade, Boas Práticas e SEO no meu portfólio.
