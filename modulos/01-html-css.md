# Módulo 01 — HTML e CSS

**Duração:** 4–5 semanas · **Pré-requisito:** Módulo 00

## Objetivos

- Estruturar páginas com HTML semântico e acessível.
- Estilizar com CSS moderno: box model, Flexbox, Grid, responsividade.
- Transformar um layout (Figma ou imagem) em página real.

---

## Parte A — HTML

### 1. Estrutura básica

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Minha primeira página</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Olá, mundo!</h1>
    <p>Este é meu primeiro parágrafo.</p>
  </body>
</html>
```

- `<head>`: informações *sobre* a página (título, CSS, SEO). Não aparece na tela.
- `<body>`: o conteúdo visível.
- `meta viewport`: obrigatório para o site funcionar bem no celular.

### 2. Tags essenciais

```html
<h1>…<h6>      Títulos (use só um h1 por página, em ordem hierárquica)
<p>            Parágrafo
<a href="">    Link
<img src="" alt="descrição">   Imagem (alt é obrigatório para acessibilidade)
<ul>/<ol>/<li> Listas
<strong>/<em>  Ênfase forte / ênfase
<button>       Botão
<div>/<span>   Containers genéricos (bloco / em linha) — use só quando não houver tag semântica
```

### 3. HTML semântico

Tags semânticas dizem **o que** o conteúdo é. Ajudam leitores de tela, SEO e quem lê seu código.

```html
<body>
  <header>
    <nav>
      <a href="/">Início</a>
      <a href="/sobre">Sobre</a>
    </nav>
  </header>

  <main>
    <article>
      <h1>Título do post</h1>
      <p>Conteúdo…</p>
    </article>
    <aside>Posts relacionados</aside>
  </main>

  <footer>© 2026 Meu Site</footer>
</body>
```

### 4. Formulários

```html
<form action="/cadastro" method="post">
  <label for="nome">Nome</label>
  <input id="nome" name="nome" type="text" required minlength="2" />

  <label for="email">E-mail</label>
  <input id="email" name="email" type="email" required />

  <label for="plano">Plano</label>
  <select id="plano" name="plano">
    <option value="free">Gratuito</option>
    <option value="pro">Pro</option>
  </select>

  <label>
    <input type="checkbox" name="termos" required /> Aceito os termos
  </label>

  <button type="submit">Cadastrar</button>
</form>
```

- Todo `input` precisa de um `label` ligado pelo `for`/`id`.
- `type="email"`, `required`, `minlength` dão validação nativa de graça.

### 5. Acessibilidade (a11y) — desde o começo

- Use a tag certa: `<button>` para ações, `<a>` para navegação.
- Imagens com `alt` descritivo (ou `alt=""` se for decorativa).
- Navegue pela sua página **só com o teclado** (Tab, Shift+Tab, Enter). Tudo deve funcionar.
- Contraste de cores suficiente (teste no DevTools → Lighthouse).

---

## Parte B — CSS

### 1. Seletores e cascata

```css
p { color: #333; }                 /* tag */
.destaque { font-weight: bold; }   /* classe — use na maioria das vezes */
#topo { height: 80px; }            /* id — evite para estilo */
nav a { text-decoration: none; }   /* descendente */
button:hover { opacity: 0.8; }     /* pseudo-classe */
input:focus-visible { outline: 2px solid blue; }
li:nth-child(odd) { background: #f5f5f5; }
```

**Especificidade** (quem vence): `id` > `classe/pseudo-classe` > `tag`. Em empate, vence a regra
que aparece por último. Evite `!important`.

### 2. Box model

Todo elemento é uma caixa: **conteúdo → padding → border → margin**.

```css
*, *::before, *::after {
  box-sizing: border-box; /* largura passa a incluir padding e border — use sempre */
}

.card {
  width: 300px;
  padding: 16px;
  border: 1px solid #ddd;
  margin: 0 auto 24px;  /* topo | laterais | baixo */
  border-radius: 8px;
}
```

### 3. Unidades e cores

- `px` (fixo), `%` (relativo ao pai), `rem` (relativo à fonte raiz — use para fontes e espaçamentos),
  `vw`/`vh` (relativo à tela).
- Cores: `#1e90ff`, `rgb(30 144 255)`, `hsl(210 100% 56%)`.
- **Variáveis CSS**:

```css
:root {
  --cor-primaria: hsl(210 100% 50%);
  --espaco: 1rem;
}
.botao { background: var(--cor-primaria); padding: var(--espaco); }
```

### 4. Flexbox — layouts em uma direção

```css
.navbar {
  display: flex;
  justify-content: space-between; /* eixo principal */
  align-items: center;            /* eixo cruzado */
  gap: 1rem;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.cards > .card { flex: 1 1 250px; } /* cresce, encolhe, base de 250px */
```

**Pratique:** jogue o [Flexbox Froggy](https://flexboxfroggy.com/) até o fim.

### 5. Grid — layouts em duas direções

```css
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}
header  { grid-area: header; }
aside   { grid-area: sidebar; }
main    { grid-area: main; }
footer  { grid-area: footer; }
```

**Pratique:** jogue o [Grid Garden](https://cssgridgarden.com/).

### 6. Responsividade (mobile first)

Escreva primeiro o CSS do celular, depois adapte para telas maiores:

```css
.layout { display: grid; grid-template-columns: 1fr; }

@media (min-width: 768px) {
  .layout { grid-template-columns: 250px 1fr; }
}
```

Imagens fluidas: `img { max-width: 100%; height: auto; }`.

### 7. Posicionamento, transições e animações

```css
.badge { position: absolute; top: 8px; right: 8px; } /* relativo ao pai com position: relative */
.header { position: sticky; top: 0; }

.botao { transition: transform 0.2s ease; }
.botao:hover { transform: scale(1.05); }

@keyframes aparecer { from { opacity: 0; } to { opacity: 1; } }
.modal { animation: aparecer 0.3s ease-out; }
```

### 8. Organização: metodologia BEM

```html
<div class="card card--destaque">
  <h2 class="card__titulo">…</h2>
  <button class="card__botao">…</button>
</div>
```

`bloco__elemento--modificador` evita conflitos de nomes em projetos grandes.

---

## Exercícios

1. Recrie a página de um currículo seu só com HTML semântico (sem CSS). Valide no
   [W3C Validator](https://validator.w3.org/).
2. Estilize o currículo usando variáveis CSS e a fonte do Google Fonts.
3. Crie uma barra de navegação que vira menu vertical no celular (só CSS).
4. Crie uma galeria de 12 imagens com Grid que mostra 1, 2, 3 ou 4 colunas conforme a tela.
5. Recrie o layout de um card de produto de algum e-commerce real.
6. Faça um formulário de cadastro completo com validação nativa e estilos de `:invalid`.

## Projetos

### Projeto simples — Página de perfil (link na bio)
Foto, nome, descrição e lista de links estilizados. Responsiva, com efeito de hover.
Publique no **GitHub Pages**.

### Projeto avançado — Landing page de um produto
A partir de um layout pronto (procure "landing page" no [Frontend Mentor](https://www.frontendmentor.io/)
ou na comunidade do Figma):
- Header fixo com menu responsivo, seção hero, seção de recursos (grid), depoimentos, preços,
  FAQ (use `<details>`/`<summary>`) e rodapé.
- Mobile first, nota **90+ no Lighthouse** em performance e acessibilidade.
- Publicada no GitHub Pages ou Netlify.

## Checklist para avançar

- [ ] Escrevo HTML semântico e acessível sem consultar o tempo todo.
- [ ] Entendo box model, especificidade e cascata.
- [ ] Construo qualquer layout com Flexbox e Grid.
- [ ] Faço sites responsivos mobile first.
- [ ] Transformo um design em página fiel ao original.
