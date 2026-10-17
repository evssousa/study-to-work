# Projeto 01 — Site de portfólio pessoal

## O problema

Você precisa de um endereço para mandar a recrutadores e clientes: "Este sou eu, isto
é o que eu sei fazer, e aqui estão meus projetos". Um perfil do LinkedIn não mostra que
você sabe construir uma página. **O seu site mostra.**

Este site vai ser **usado de verdade** durante todo o curso: a cada projeto novo, você
acrescenta um card em "Projetos". Mais tarde (módulo 10), você vai reescrevê-lo em React.

## Requisitos

### Conteúdo
- **Topo** com o seu nome e um menu com links para as seções (`#sobre`, `#projetos`, `#contato`).
- **Apresentação**: o `<h1>` com seu nome e uma frase do que você faz/busca.
- **Sobre** (`<section id="sobre">`): sua história, sem enrolação.
- **Projetos** (`<section id="projetos">`): cada projeto em um `<article>` com `<h3>`,
  descrição e link. Neste momento entra o README de perfil (projeto 00) e o próprio portfólio.
- **Contato** (`<section id="contato">`): e-mail (`mailto:`), LinkedIn e GitHub.
- **Rodapé**.

### Qualidade (o que diferencia um site profissional)
- HTML semântico, um único `h1`, títulos sem pular nível.
- **Acessível**: link "Pular para o conteúdo" como primeiro link da página, `alt` em
  todas as imagens, foco visível (`:focus-visible`), nada de "clique aqui".
- **SEO e compartilhamento**: `meta description` e tags Open Graph (a prévia do link no LinkedIn/WhatsApp).
- **Favicon**.
- **Responsivo, mobile first** (media queries com `min-width`).
- **Tema escuro automático** com variáveis CSS (`prefers-color-scheme`).
- Imagens com `width` e `height` (evitam que a página "pule" ao carregar).
- Sem estilo inline e sem `!important`.
- Se usar animações, respeite `prefers-reduced-motion`.

### Entrega
- Repositório público no seu GitHub (ex.: `portfolio`).
- Site publicado no **GitHub Pages** (seção 9 da aula 01).
- `README.md` com: título, link do site publicado, um print da página e a lista de tecnologias.
- Atualize o README de perfil (projeto 00) com o link do site.

## Estrutura sugerida

```
portfolio/
├── index.html
├── css/
│   └── estilo.css
├── img/
│   ├── foto.webp
│   ├── og-imagem.png    # 1200 × 630 px, para a prévia do link
│   └── favicon.svg
└── README.md
```

## Correção

```bash
npm run corrigir-projeto -- 01 ../portfolio
```

Além dos testes automáticos, faça a **checagem manual**:
- Navegue pelo site **só com o teclado** (Tab, Shift+Tab, Enter). Dá para chegar em tudo?
- Abra o DevTools → **Lighthouse** → gere o relatório. Busque nota acima de 90 em
  Acessibilidade, Boas práticas e SEO.
- Abra no celular de verdade.
- Cole o link no WhatsApp e confira a prévia.

## O que falar na entrevista

"Meu portfólio é feito com HTML e CSS puros, mobile first, com tema escuro automático e
acessível por teclado. Usei variáveis CSS como um mini design system e publiquei no
GitHub Pages. No Lighthouse ele tem nota acima de 90 em acessibilidade e SEO."
