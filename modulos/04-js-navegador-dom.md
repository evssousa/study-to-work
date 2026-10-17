# Módulo 04 — JavaScript no navegador (DOM, eventos e armazenamento)

> **Duração sugerida:** 4 semanas (ritmo regular).
> **Pré-requisitos:** Módulos 01 (HTML e CSS) e 03 (JavaScript intermediário).
> **Projeto do módulo:** Racha-conta, um site que divide as despesas de uma viagem ou churrasco e diz quem paga quanto para quem.

## Objetivos

- Entender o **DOM**: a página como uma árvore de objetos que o JavaScript controla.
- Selecionar, criar, alterar e remover elementos **sem abrir brechas de segurança** (XSS).
- Reagir ao usuário com **eventos**: clique, digitação, teclado, envio de formulário.
- Usar **delegação de eventos** em listas que mudam.
- Validar formulários de forma **acessível**: mensagens ligadas aos campos, foco e leitores de tela.
- Guardar dados no navegador com `localStorage`, sem quebrar quando o dado estiver corrompido.
- Construir interfaces com o padrão **estado → render** (a base mental do React).
- Controlar o tempo com `setTimeout`, `setInterval` e `Date.now`.
- Trabalhar com URLs, parâmetros e links de compartilhamento.
- Organizar um aplicativo sem framework, **separando a lógica da tela**, para poder testá-lo.
- Depurar JavaScript com o DevTools.

> Os exercícios aparecem nos blocos **✏️ Pratique agora**, logo depois de cada assunto.
> Resolva cada um assim que chegar nele, antes de continuar a leitura.

---

## 0. Antes de começar: como o curso corrige código de navegador

Até aqui, seu JavaScript rodou no Node, no terminal. Agora ele vai mexer em páginas web. Mas
os testes do curso também rodam no Node, que não tem página nenhuma. Como corrigir, então?

O curso usa o **jsdom**, uma biblioteca que implementa o DOM dentro do Node: uma "página de
mentira" com os mesmos elementos, eventos e métodos de um navegador. O teste monta uma página,
chama a sua função e confere o resultado, **como se uma pessoa tivesse usado a tela**.

Para isso funcionar, o código dos exercícios segue uma regra que é também uma **boa prática
profissional**:

> **Seu código recebe a página (ou o elemento) por parâmetro, em vez de usar o `document`
> global.**

```js
// ❌ Só funciona dentro de um navegador de verdade
export function tituloDaPagina() {
  return document.querySelector("h1").textContent;
}

// ✅ Funciona em qualquer lugar: a página chega como parâmetro
export function tituloDaPagina(documento) {
  return documento.querySelector("h1").textContent;
}
```

No navegador real, quem chama a função passa o `document`. Nos testes, passa o de mentira.
Esse mesmo truque (chamado de **injeção de dependência**) vale para o `localStorage`, o relógio e
tudo o que "vem de fora": o código fica **testável**, e é isso que separa um projeto de portfólio
sério de um monte de scripts.

Quando uma função recebe um elemento (como `ul` ou `raiz`), você consegue o documento por
`elemento.ownerDocument`, por exemplo para criar elementos: `ul.ownerDocument.createElement("li")`.

### Vendo funcionando no navegador de verdade

Os testes dizem se está certo, mas **ver** funcionando é parte do aprendizado. Crie uma pasta
de rascunho **fora** de `exercicios/` (por exemplo, `rascunho-dom/`) com estes dois arquivos
e abra o `index.html` com o Live Server:

```html
<!-- rascunho-dom/index.html -->
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Rascunho</title>
    <script type="module" src="app.js"></script>
  </head>
  <body>
    <h1 id="titulo">Olá</h1>
    <button id="botao">Clique</button>
  </body>
</html>
```

```js
// rascunho-dom/app.js
import { tituloDaPagina } from "../exercicios/04-js-navegador-dom/01-selecionar.js";

console.log(tituloDaPagina(document)); // aparece no Console do navegador (F12)
```

Assim você usa as funções do exercício na página real. No navegador, o `console.log` aparece
na aba **Console** do DevTools (F12), não no terminal.

> O jsdom é fiel, mas não perfeito: ele não tem `matchMedia`, a área de transferência
> (`navigator.clipboard`), `<dialog>.showModal()` nem `innerText`. Por isso, nos exercícios
> essas coisas chegam por parâmetro, e usamos `textContent` (que é o mais seguro e rápido de qualquer jeito).

---

## 1. O DOM

### 1.1 O que é o DOM

Quando o navegador recebe o HTML, ele o transforma em uma **árvore de objetos**, o
**DOM** (*Document Object Model*). O JavaScript manipula essa árvore, e o navegador redesenha a tela.

```html
<body>
  <h1 id="titulo">Loja</h1>
  <ul class="lista">
    <li>Café</li>
    <li>Pão</li>
  </ul>
</body>
```

```
document
└── html
    └── body
        ├── h1#titulo ── "Loja"
        └── ul.lista
            ├── li ── "Café"
            └── li ── "Pão"
```

Cada item da árvore é um **nó**. Os mais importantes:

- **Elementos** (`<h1>`, `<li>`...): as tags.
- **Texto**: o conteúdo escrito dentro dos elementos.
- **`document`**: a raiz, que representa a página inteira.

Mudar o DOM muda a página **na hora**, mas não muda o arquivo HTML: se você recarregar (F5), a
página volta ao que estava no arquivo. Por isso a seção 4 mostra como guardar dados.

### 1.2 Carregando o JavaScript na página

```html
<script type="module" src="src/main.js"></script>
```

- `type="module"` permite `import`/`export` (módulos ES, que você viu no módulo 03).
- Scripts de módulo são carregados **sem travar** a página e só rodam **depois** que o HTML foi
  lido, então o `document.querySelector` já encontra os elementos. Com um `<script>` comum
  no `<head>`, o JavaScript rodaria antes de os elementos existirem e não os encontraria.
- Coloque o `<script>` no `<head>` com `type="module"`. É o padrão moderno.

> O navegador só aceita módulos por **HTTP** (Live Server, GitHub Pages...), nunca abrindo o
> arquivo com duplo clique (`file://`). Use sempre o Live Server.

### 1.3 Selecionando elementos

```js
document.querySelector("h1");              // o PRIMEIRO que combinar (ou null)
document.querySelector("#titulo");         // por id
document.querySelector(".lista li");       // qualquer seletor de CSS!
document.querySelectorAll(".item");        // TODOS (uma NodeList, vazia se nada combinar)
```

O argumento é **qualquer seletor de CSS** (módulo 01): classe, id, descendente, atributo, pseudo-classe.
Por isso você já sabe a sintaxe.

```js
const link = document.querySelector('nav a[href="/contato"]');
const primeiroItem = document.querySelector("li:first-child");
const marcados = document.querySelectorAll('input[type="checkbox"]:checked');
```

**`querySelector` retorna `null` quando não encontra.** Usar o resultado sem checar é o erro
número 1 de DOM:

```js
const titulo = document.querySelector("#nao-existe");
titulo.textContent = "Oi";   // ❌ TypeError: Cannot set properties of null

// Quando o elemento PODE não existir:
const texto = document.querySelector("#titulo")?.textContent ?? "sem título";
```

Se o elemento **deveria** existir, deixe estourar o erro: ele avisa que o HTML e o JavaScript estão
fora de sincronia (um id digitado errado, por exemplo).

**`querySelectorAll` devolve uma `NodeList`**, que parece um array mas não é: tem `length`,
`forEach` e `for...of`, mas **não tem `map`, `filter` nem `reduce`**. Converta quando precisar:

```js
const itens = document.querySelectorAll(".item");

const textos = [...itens].map((item) => item.textContent);    // spread
const mesmaCoisa = Array.from(itens).map((item) => item.textContent);

for (const item of itens) console.log(item.textContent);       // funciona direto
itens.length;                                                   // quantos
```

**Procurando dentro de um elemento:** qualquer elemento também tem `querySelector`, que
procura só dentro dele:

```js
const lista = document.querySelector(".lista");
const primeiro = lista.querySelector("li");         // só dentro da lista
const pai = primeiro.parentElement;                 // sobe um nível
const maisProximo = primeiro.closest("section");    // sobe até achar um ancestral que combine
```

`closest` é muito usado em eventos (seção 2.3). Para "andar" pela árvore também existem
`children`, `firstElementChild`, `lastElementChild`, `nextElementSibling` e `previousElementSibling`.

**Lendo atributos:** `elemento.getAttribute("href")` devolve o valor **como está escrito no HTML**
(`"/produtos"`), enquanto a propriedade `elemento.href` devolve a URL completa
(`"http://localhost/produtos"`). Os dois têm usos; escolha de caso a caso.

> ✏️ **Pratique agora — Exercício 01: selecionar elementos**
>
> Abra `exercicios/04-js-navegador-dom/01-selecionar.js`. Seis funções que leem informações de
> uma página usando `querySelector`, `querySelectorAll` e `getAttribute`.
>
> ```bash
> npm run exercicio -- 01-selecionar
> ```

### 1.4 Alterando elementos

**Texto:**

```js
const titulo = document.querySelector("h1");
titulo.textContent = "Novo título";    // troca o texto
titulo.textContent;                     // lê o texto
```

`textContent` trata tudo como **texto puro**: se você escrever `"<b>oi</b>"`, aparecem os
símbolos `<b>` na tela. Isso é exatamente o que queremos (seção 1.5 explica por quê).

**Classes**, a forma preferida de mudar a aparência (o CSS fica no arquivo de estilo, e o
JavaScript só liga e desliga classes):

```js
const caixa = document.querySelector(".caixa");

caixa.classList.add("ativa");                // adiciona
caixa.classList.remove("ativa");             // remove
caixa.classList.toggle("ativa");             // liga se estava desligada, desliga se estava ligada
caixa.classList.toggle("ativa", true);       // força: liga (ou desliga com false)
caixa.classList.contains("ativa");           // true/false
```

`toggle` **retorna** `true` se a classe ficou ligada. Evite `caixa.className = "..."`: ele
**substitui todas** as classes de uma vez.

**Atributos:**

```js
link.setAttribute("href", "/contato");       // define
link.getAttribute("href");                   // lê
link.removeAttribute("target");              // remove
link.hasAttribute("target");                 // existe?

input.setAttribute("aria-invalid", "true");  // atributos aria- são atributos como os outros
```

Atributos sempre guardam **texto**: `"true"`, `"false"`, `"3"`. Para botões de estado
(`aria-expanded`, `aria-pressed`), escreva `String(valor)`.

Muitos atributos têm também uma **propriedade** com o mesmo efeito, mais prática para booleanos:

```js
input.value = "Ana";          // o texto do campo
input.checked = true;         // caixa de seleção marcada
botao.disabled = true;        // botão desabilitado
elemento.hidden = true;       // esconde o elemento (atributo hidden)
```

**Atributos `data-*`:** são os seus atributos personalizados, perfeitos para guardar um id
ou uma ação no elemento. Acesse pelo `dataset` (note o camelCase):

```html
<li data-id="42" data-status-atual="pendente">...</li>
```

```js
li.dataset.id;                // "42" (sempre texto)
li.dataset.statusAtual;       // "pendente": data-status-atual vira statusAtual
li.dataset.id = "43";         // altera
delete li.dataset.id;         // remove
```

**Estilo.** Prefira classes. Quando precisar de um valor calculado (largura de uma barra de
progresso, uma cor escolhida pelo usuário), mude uma **variável CSS**:

```js
barra.style.setProperty("--progresso", "65%");   // e no CSS: width: var(--progresso)
```

**`hidden` x `display: none`:** o atributo `hidden` é a forma certa de esconder algo que não
deve aparecer para ninguém (nem leitor de tela). Cuidado: uma regra CSS que define `display`
no mesmo elemento (`.painel { display: grid }`) **vence** o `hidden`, e o elemento reaparece.

```css
[hidden] { display: none !important; } /* um dos poucos usos aceitáveis de !important */
```

> ✏️ **Pratique agora — Exercício 02: alterar elementos**
>
> Abra `exercicios/04-js-navegador-dom/02-alterar.js`. Troque textos, alterne temas, esconda e
> mostre elementos, ative abas com `aria-selected` e marque campos inválidos.
>
> ```bash
> npm run exercicio -- 02-alterar
> ```

### 1.5 Criando e removendo elementos

```js
const item = document.createElement("li");   // cria (ainda fora da página)
item.textContent = "Comprar pão";
item.className = "tarefa";
item.dataset.id = "7";

const lista = document.querySelector("#lista");
lista.append(item);                          // coloca no FIM da lista
```

Os métodos de inserção:

| Método | O que faz |
| --- | --- |
| `pai.append(a, b, ...)` | Coloca no **fim** do pai (aceita vários elementos e textos) |
| `pai.prepend(a)` | Coloca no **começo** |
| `elemento.before(a)` / `elemento.after(a)` | Coloca **antes**/**depois** do elemento |
| `pai.replaceChildren(a, b, ...)` | **Esvazia** o pai e coloca estes no lugar |
| `elemento.replaceWith(outro)` | Troca um elemento por outro |
| `elemento.remove()` | Tira da página |

Duas coisas importantes:

1. **Mover em vez de copiar.** Um elemento só existe em **um** lugar. Se você faz `lista.append(li)`
   com um `li` que já está na lista, ele é **movido** (vai para o fim). Para ter uma cópia: `li.cloneNode(true)`.
2. **`replaceChildren` é a forma mais simples de "redesenhar" uma lista:** troca todo o conteúdo de
   uma vez, sem sobrar item velho.

```js
function mostrarTarefas(ul, tarefas) {
  const documento = ul.ownerDocument;
  ul.replaceChildren(
    ...tarefas.map((tarefa) => {
      const li = documento.createElement("li");
      li.textContent = tarefa.texto;
      return li;
    }),
  );
}
```

#### O perigo do `innerHTML`: XSS

Existe um jeito aparentemente mais fácil de montar elementos:

```js
lista.innerHTML = `<li>${texto}</li>`;       // ❌ PERIGOSO se "texto" veio de uma pessoa
```

Se alguém digitar como nome de tarefa:

```
<img src="x" onerror="roubarSenha()">
```

o navegador **interpreta como HTML**, cria a imagem e executa o código malicioso. Isso se chama
**XSS** (*Cross-Site Scripting*), uma das falhas de segurança mais comuns da web. O ataque pode
roubar dados da pessoa que está vendo a página, inclusive outra pessoa que abra o mesmo
conteúdo guardado.

A regra é simples:

> **Dados que vêm de pessoas (digitados, de arquivos, de APIs) entram na página com
> `textContent` ou `createElement`, nunca com `innerHTML`.**

```js
const li = document.createElement("li");
li.textContent = '<img src="x" onerror="roubarSenha()">';   // ✅ aparece como texto, inofensivo
```

`innerHTML` só é aceitável com texto **seu**, escrito no código e sem nenhuma variável de fora.
Mesmo assim, neste curso evitamos: criar elementos com `createElement` é seguro **sempre**, e
os testes dos exercícios e do projeto conferem isso.

#### Templates: estruturas maiores sem `innerHTML`

Montar um cartão com vários elementos aninhados à mão é cansativo. O elemento `<template>`
guarda um pedaço de HTML que **não aparece** na página e serve de molde:

```html
<template id="molde-cartao">
  <article class="cartao">
    <h2></h2>
    <p></p>
  </article>
</template>
```

```js
const molde = document.querySelector("#molde-cartao");

function criarCartao({ titulo, descricao }) {
  const copia = molde.content.cloneNode(true);      // copia o conteúdo do template
  copia.querySelector("h2").textContent = titulo;    // preenche com TEXTO (seguro)
  copia.querySelector("p").textContent = descricao;
  return copia.firstElementChild;                    // o <article>
}

document.querySelector("main").append(criarCartao({ titulo: "Café", descricao: "Torrado na hora" }));
```

O HTML do molde fica no HTML (onde designers e você o enxergam melhor), e o JavaScript só preenche
os textos. É o melhor dos dois mundos.

> ✏️ **Pratique agora — Exercício 03: criar e remover elementos**
>
> Abra `exercicios/04-js-navegador-dom/03-criar-e-remover.js`. Itens de lista, cartões (com
> `createElement` e com `template`), remoção em lote e mover elementos. O teste tenta "injetar"
> HTML pelos textos: se você usar `innerHTML`, falha.
>
> ```bash
> npm run exercicio -- 03-criar
> ```

---

## 2. Eventos

### 2.1 Ouvindo eventos

Um **evento** é algo que acontece na página: um clique, uma tecla, o envio de um formulário. Você
registra uma função (um **callback**, como na aula 03) para ser chamada quando o evento ocorrer:

```js
const botao = document.querySelector("#curtir");
let curtidas = 0;

botao.addEventListener("click", () => {
  curtidas++;
  botao.textContent = `Curtir (${curtidas})`;
});
```

- `addEventListener(tipo, funcao)`: "quando acontecer `tipo` neste elemento, chame `funcao`".
- Um elemento pode ter **vários** listeners para o mesmo evento.
- A função **não** é chamada na hora: o navegador a chama depois, quando o evento ocorrer.
- O estado que o listener usa (como `curtidas`) vive numa **closure**, igual ao contador do módulo 03.

Para remover um listener, guarde a função numa variável e use `removeEventListener`:

```js
function aoClicar() { /* ... */ }
botao.addEventListener("click", aoClicar);
botao.removeEventListener("click", aoClicar);   // só funciona com a MESMA função
```

Um erro clássico, que já vimos na seção 1 do módulo 03:

```js
botao.addEventListener("click", enviar());    // ❌ chama enviar() AGORA e passa o resultado
botao.addEventListener("click", enviar);      // ✅ passa a função
botao.addEventListener("click", () => enviar(42));   // ✅ quando precisa de argumentos
```

### 2.2 O objeto do evento e os tipos mais usados

O navegador chama o seu listener passando um **objeto de evento**, com informações sobre o que aconteceu:

```js
campo.addEventListener("input", (evento) => {
  console.log(evento.target.value);   // evento.target = o elemento onde tudo aconteceu
});
```

| Evento | Quando acontece | Observação |
| --- | --- | --- |
| `click` | Clique do mouse, toque, ou Enter/Espaço em um botão | Funciona com teclado em `<button>` e `<a>` |
| `input` | A cada mudança no valor de um campo (a cada letra digitada) | Use para busca ao vivo, contadores, máscaras |
| `change` | O valor foi **confirmado**: o campo perdeu o foco, ou a caixa/seleção mudou | Para caixas de seleção, rádios e `<select>`, é o certo |
| `submit` | Um formulário foi enviado (botão ou Enter) | Escute no `<form>`, não no botão |
| `keydown` / `keyup` | Uma tecla foi pressionada / solta | `evento.key` diz qual |
| `focus` / `blur` | O elemento ganhou / perdeu o foco | |
| `DOMContentLoaded` | O HTML terminou de ser lido | Desnecessário com `type="module"` |

**`input` x `change` em campos de texto:** o `input` dispara a cada tecla; o `change` só ao sair
do campo. Para reagir enquanto a pessoa digita (contador de caracteres, filtro de lista), use `input`.

**`evento.target` x `evento.currentTarget`:** `target` é o elemento **onde o evento nasceu** (o
mais interno clicado); `currentTarget` é o elemento **em que o listener foi colocado**. Eles
são diferentes quando o clique acontece em um filho (seção 2.3).

**Estado do botão:** quando uma ação não faz sentido, desabilite o botão (`botao.disabled = true`)
em vez de deixar clicar e dar erro. Botões desabilitados não recebem cliques nem foco.

> ✏️ **Pratique agora — Exercício 04: eventos**
>
> Abra `exercicios/04-js-navegador-dom/04-eventos.js`. Um contador com botões que não deixa o
> número ficar negativo e um contador de caracteres ao vivo.
>
> ```bash
> npm run exercicio -- 04-eventos
> ```

### 2.3 Propagação e delegação de eventos

Imagine uma lista de tarefas, cada uma com um botão "remover". A primeira ideia é colocar um
listener em **cada botão**. Mas:

- tarefas criadas **depois** não têm listener (você teria que lembrar de registrá-lo);
- 500 tarefas = 500 listeners.

A solução está em como os eventos viajam. Um clique em um botão **sobe** (*bubbling*) pela
árvore: acontece no botão, depois no `li`, depois na `ul`, e assim até o `document`:

```
clique no ✕ ──▶ <button> ──▶ <li> ──▶ <ul> ──▶ <main> ──▶ document
                  (target)                  ↑
                                  um listener aqui ouve tudo o que acontece abaixo
```

A **delegação de eventos** usa isso: **um único listener no pai** que descobre, pelo
`evento.target`, qual filho foi clicado.

```js
const lista = document.querySelector("#lista");

lista.addEventListener("click", (evento) => {
  const botao = evento.target.closest('[data-acao="remover"]');   // o clique foi num botão de remover?
  if (!botao) return;                                              // não: ignora

  const item = botao.closest("li");                                // qual tarefa?
  item.remove();
});
```

- **`closest(seletor)`** procura o elemento clicado **e depois seus ancestrais**, até achar um
  que combine. É fundamental: o `target` pode ser um elemento **dentro** do botão (um ícone
  `<svg>`, um `<span>`), e `closest` resolve isso.
- O `return` antecipado ignora todo clique que não interessa.
- Funciona com itens criados depois, pois o listener está no pai, que sempre existe.

Para parar a subida do evento existe `evento.stopPropagation()`, mas **evite**: quase sempre
indica um problema de organização, e atrapalha outros listeners.

**`preventDefault()`** é outra coisa: cancela o **comportamento padrão** do navegador para aquele
evento (seguir um link, enviar e recarregar o formulário, rolar a página com a seta).

```js
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();   // sem isso, a página recarrega e você perde tudo
  // ...
});
```

> ✏️ **Pratique agora — Exercício 05: delegação de eventos**
>
> Abra `exercicios/04-js-navegador-dom/05-delegacao.js`. Uma lista com um único `addEventListener`
> que remove itens e os marca como feitos, inclusive os adicionados depois. O teste espia quantos
> listeners você registrou.
>
> ```bash
> npm run exercicio -- 05-delegacao
> ```

### 2.4 Eventos de teclado

```js
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") fecharModal();
  if (evento.key === "ArrowRight") proximaFoto();
});
```

- **`evento.key`** é o nome da tecla: `"Enter"`, `"Escape"`, `"ArrowLeft"`, `"ArrowDown"`, `"Home"`,
  `"End"`, `"a"`, `" "` (espaço). Use `key`, não os antigos `keyCode`/`which`.
- Modificadores: `evento.shiftKey`, `evento.ctrlKey`, `evento.altKey`, `evento.metaKey`.
- Numa página real, a tecla "nasce" no elemento que está com o **foco** (ou no `<body>`) e sobe até o
  `document`. Um listener no `document` ouve o teclado da página inteira.

**Cuidado com atalhos globais:** se você ouve `ArrowRight` no `document`, a seta do teclado
**dentro de um campo de texto** (que move o cursor) também dispara o seu atalho. Ignore quando a
pessoa estiver digitando:

```js
document.addEventListener("keydown", (evento) => {
  if (evento.target.matches("input, textarea, select")) return;   // matches: o elemento combina com o seletor?
  // ...atalhos...
});
```

**`preventDefault` em teclas:** setas e espaço fazem a página rolar. Se o seu atalho usa essas teclas,
chame `evento.preventDefault()` **só nas teclas que você tratou**. Bloquear todas as teclas deixaria
a pessoa sem conseguir digitar nem usar `Tab`.

**Acessibilidade e teclado:** quem usa o teclado depende de `Tab` (próximo elemento focável),
`Enter`/`Espaço` (ativar) e `Esc` (fechar). Se você cria algo clicável, use `<button>` ou `<a>`: eles já
funcionam com o teclado. Uma `<div onclick>` não funciona, e consertar isso dá muito mais trabalho do que usar a tag certa.

> ✏️ **Pratique agora — Exercício 06: galeria com teclado**
>
> Abra `exercicios/04-js-navegador-dom/06-teclado.js`. Uma galeria de fotos navegável com as
> setas, `Home`, `End` e `Esc`, que não atrapalha quem está digitando.
>
> ```bash
> npm run exercicio -- 06-teclado
> ```

---

## 3. Formulários

### 3.1 Enviando e lendo os dados

Um formulário dispara o evento **`submit`** quando a pessoa clica no botão de enviar **ou aperta Enter**
em um campo. Sempre escute o `submit` no `<form>` (e não o `click` no botão): assim o Enter funciona de graça.

```js
const form = document.querySelector("#cadastro");

form.addEventListener("submit", (evento) => {
  evento.preventDefault();                       // senão a página recarrega

  const dados = Object.fromEntries(new FormData(form));
  // { nome: "Ana", email: "ana@exemplo.com", aceito: "on" }
});
```

**`FormData`** lê todos os campos do formulário de uma vez, usando o atributo `name` de cada um. O
`Object.fromEntries` (do módulo 03) transforma o resultado em um objeto comum.

Pegadinhas que pegam todo mundo:

- **Campo sem `name` não aparece** no `FormData`.
- **Caixa de seleção (`checkbox`) desmarcada não aparece**; marcada vira `"on"` (ou o `value` dela).
  Por isso, `dados.aceito === "on"` é "marcada" e `undefined` é "desmarcada".
- Vários checkboxes com o mesmo `name` viram **um só** valor no `Object.fromEntries`. Para ler todos:
  `form.querySelectorAll('input[name="participantes"]:checked')` ou `formData.getAll("participantes")`.
- Tudo chega como **texto**, até `type="number"`. Converta com `Number()`.

Acessando campos direto: `form.elements.nome` é o campo com `name="nome"` (e `form.elements` também aceita o `id`).

```js
form.elements.email.value;         // o texto do campo
form.elements.aceito.checked;      // true/false
form.reset();                      // volta cada campo ao valor inicial do HTML
```

### 3.2 Validação

O HTML já valida sozinho (`required`, `type="email"`, `minlength`, módulo 01), mas a mensagem
padrão do navegador é genérica e difícil de estilizar. Em aplicações reais, você valida em JavaScript
para mostrar mensagens claras. O formulário usa o atributo `novalidate` para desligar a validação
nativa e deixar a sua no comando:

```html
<form id="cadastro" novalidate>...</form>
```

O padrão que dá certo é separar **duas funções**:

```js
// 1. PURA, sem DOM: recebe os dados e devolve os erros. Fácil de testar.
export function validarCadastro({ nome = "", email = "", senha = "" }) {
  const erros = {};
  if (nome.trim().length < 2) erros.nome = "Informe seu nome (mínimo 2 letras)";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.email = "E-mail inválido";
  if (senha.length < 8) erros.senha = "A senha deve ter pelo menos 8 caracteres";
  return erros;     // {} = tudo certo
}

// 2. Liga a função pura ao formulário (mexe no DOM).
form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const erros = validarCadastro(Object.fromEntries(new FormData(form)));
  mostrarErros(form, erros);
  // ...
});
```

Isso é a **separação entre regra e tela**, e você a verá no resto do curso. A validação do
navegador serve à experiência da pessoa; **a validação de verdade, a que protege seu sistema, é a do servidor**
(módulo 12): qualquer um consegue contornar o JavaScript do navegador.

### 3.3 Erros acessíveis

Mostrar um texto vermelho embaixo do campo não basta: uma pessoa que usa leitor de tela não saberia
que o campo está com erro nem qual é. O padrão correto liga a mensagem ao campo:

```html
<label for="email">E-mail</label>
<input id="email" name="email" type="email" aria-invalid="true" aria-describedby="erro-email" />
<p id="erro-email" class="erro">E-mail inválido</p>
```

- **`aria-invalid="true"`** avisa que o campo está inválido.
- **`aria-describedby="erro-email"`** liga o campo à mensagem: o leitor de tela lê "E-mail, inválido, E-mail inválido".
- **Foco no primeiro campo com erro** (`campo.focus()`): quem usa teclado ou leitor de tela vai direto ao problema.
- **Limpe tudo** quando o campo ficar correto: `removeAttribute("aria-invalid")` (não deixe `"false"`) e esvazie a mensagem.

```js
function mostrarErro(campo, elementoDoErro, mensagem) {
  elementoDoErro.textContent = mensagem ?? "";
  if (mensagem) {
    campo.setAttribute("aria-invalid", "true");
    campo.setAttribute("aria-describedby", elementoDoErro.id);
  } else {
    campo.removeAttribute("aria-invalid");
  }
}
```

E para avisar de ações concluídas ("Despesa adicionada") sem tirar o foco de onde a pessoa está, use
uma **região live**: um elemento que o leitor de tela lê sempre que o texto dentro dele muda.

```html
<p id="status" role="status" aria-live="polite"></p>
```

```js
document.querySelector("#status").textContent = "Despesa adicionada: Hotel";
```

> ✏️ **Pratique agora — Exercício 07: formulário com validação acessível**
>
> Abra `exercicios/04-js-navegador-dom/07-formulario.js`. Uma função pura de validação e a ligação
> dela a um formulário real, com `aria-invalid`, `aria-describedby` e foco no primeiro erro.
>
> ```bash
> npm run exercicio -- 07-formulario
> ```

### 3.4 Máscaras de entrada

Uma **máscara** formata o texto enquanto a pessoa digita: `81999990000` vira `(81) 99999-0000`. A
receita é sempre a mesma:

1. Uma função **pura** que recebe qualquer texto e devolve o texto formatado (fácil de testar).
2. Um listener de `input` que aplica a função ao campo:

```js
function mascararCEP(texto) {
  const digitos = texto.replace(/\D/g, "").slice(0, 8);          // só números, no máximo 8
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
}

campo.addEventListener("input", () => {
  campo.value = mascararCEP(campo.value);
});
```

A função começa **removendo tudo que não é dígito**. Assim ela funciona para qualquer entrada: digitando,
colando, ou apagando (se você apagar o hífen, a função o recoloca).

**Máscara de dinheiro, no estilo dos apps de banco:** a pessoa digita só números e o valor "cresce"
da direita para a esquerda, como centavos:

```
digita 1       → 0,01
digita 12      → 0,12
digita 123     → 1,23
digita 123456  → 1.234,56
```

```js
function mascararReais(texto) {
  const digitos = texto.replace(/\D/g, "");
  if (digitos === "") return "";
  return (Number(digitos) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
```

Bônus: use também os atributos de HTML que ajudam no celular, como `inputmode="numeric"`
(teclado numérico) e `autocomplete="tel"` / `"postal-code"` (preenchimento automático).

> ✏️ **Pratique agora — Exercício 08: máscaras**
>
> Abra `exercicios/04-js-navegador-dom/08-mascaras.js`. Telefone, CEP e dinheiro, e a função que
> liga qualquer máscara a um campo. O de dinheiro você vai usar no projeto.
>
> ```bash
> npm run exercicio -- 08-mascaras
> ```

---

## 4. Armazenamento no navegador

Recarregou a página, perdeu tudo. Para guardar dados no aparelho da pessoa existem algumas opções:

| Recurso | Para quê | Limites |
| --- | --- | --- |
| **`localStorage`** | Preferências e dados pequenos que devem **durar** | Só texto; ~5 MB por site; síncrono |
| **`sessionStorage`** | Dados que só valem enquanto a **aba** estiver aberta | Igual ao localStorage, mas apaga ao fechar a aba |
| **Cookies** | Enviados ao servidor em toda requisição (login, módulo 15) | ~4 KB; configuração delicada |
| **IndexedDB** | Muitos dados, arquivos e consultas (apps offline grandes) | API complexa; usada via bibliotecas |

Neste módulo usamos o **`localStorage`**, cuja API é mínima:

```js
localStorage.setItem("tema", "escuro");     // grava (sempre TEXTO)
localStorage.getItem("tema");               // "escuro" — ou null se a chave não existir
localStorage.removeItem("tema");            // apaga uma chave
localStorage.clear();                       // apaga TUDO deste site
```

Para guardar objetos e listas, converta para **JSON** (módulo 03):

```js
localStorage.setItem("tarefas", JSON.stringify([{ id: 1, texto: "Estudar", feita: false }]));

const tarefas = JSON.parse(localStorage.getItem("tarefas"));   // ❌ se a chave não existe: JSON.parse(null) → null
```

### Guardar com segurança

O que está no `localStorage` **pode ser alterado** (a pessoa abre o DevTools e edita), pode estar
**corrompido** ou em um formato **antigo** de uma versão anterior do seu app. Dado inesperado não pode
derrubar a página inteira:

```js
function carregar(storage, chave, valorPadrao) {
  const texto = storage.getItem(chave);
  if (texto === null) return valorPadrao;          // nunca foi salvo
  try {
    return JSON.parse(texto);
  } catch {
    return valorPadrao;                            // texto quebrado: recomeça do zero, sem erro
  }
}

function salvar(storage, chave, dados) {
  try {
    storage.setItem(chave, JSON.stringify(dados));
    return true;
  } catch {
    return false;                                  // cota cheia ou modo privado: o app segue funcionando
  }
}
```

Boas práticas:

- **Receba o `storage` por parâmetro** (e no `main.js` passe o `localStorage` de verdade). Assim os testes usam um de mentira.
- **Teste `=== null`**, não `!valor`: `0`, `false` e `""` são valores guardados válidos.
- **Valide o formato** do que leu antes de usar (é uma lista? tem os campos esperados?).
- Coloque um **prefixo e versão** na chave (`"racha-conta:v1"`): evita conflito com outros apps do mesmo
  endereço e permite migrar dados quando o formato mudar.
- **Nunca guarde senhas, tokens sensíveis ou dados pessoais** no localStorage: qualquer script da página consegue lê-los (e um XSS leria tudo).
- O `localStorage` é **por site e por navegador**: não sincroniza entre aparelhos.

### Tema escuro que lembra a escolha

Um clássico que junta tudo: respeitar a preferência do sistema na primeira visita, e lembrar a escolha depois.

```js
export function lerTema(storage, prefereEscuro) {
  const guardado = storage.getItem("tema");
  if (guardado === "claro" || guardado === "escuro") return guardado;
  return prefereEscuro() ? "escuro" : "claro";
}

// No navegador de verdade:
const prefereEscuro = () => matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.dataset.tema = lerTema(localStorage, prefereEscuro);
```

Repare no `prefereEscuro` como **função recebida por parâmetro**: o `matchMedia` só existe no
navegador, então injetá-lo deixa o código testável.

> ✏️ **Pratique agora — Exercício 09: armazenamento**
>
> Abra `exercicios/04-js-navegador-dom/09-armazenamento.js`. Um módulo de armazenamento que
> resiste a dados corrompidos e a falhas, e a lógica do tema escuro.
>
> ```bash
> npm run exercicio -- 09-armazenamento
> ```

---

## 5. Estado → render

### 5.1 O problema: a página vira uma bagunça

Em um app que cresce, mexer na página "à mão" em cada evento vira um pesadelo:

```js
// Adicionou uma tarefa: atualizo a lista... o contador... a mensagem de "vazio"... o localStorage...
// Removeu: atualizo a lista... o contador... a mensagem de "vazio"... o localStorage...
```

Cada novo evento precisa lembrar de atualizar **cinco lugares**, e esquecer um deles gera bugs
difíceis de achar. A solução é uma ideia simples, a base de React, Vue e de toda interface moderna:

> **A interface é uma função do estado:  `tela = render(estado)`**

1. Existe **um** objeto de **estado** com tudo o que o app sabe.
2. Existe **uma** função `render()` que **desenha a tela inteira** a partir do estado.
3. Os eventos **não mexem na tela**: eles só **mudam o estado** e chamam `render()`.

```js
const estado = {
  tarefas: [],
  filtro: "todas",
};

function render() {
  const visiveis = estado.tarefas.filter(/* de acordo com estado.filtro */);
  lista.replaceChildren(...visiveis.map(criarItem));
  contador.textContent = /* calculado a partir de estado.tarefas */;
  vazio.hidden = visiveis.length > 0;
}

function mudar(parcial) {
  Object.assign(estado, parcial);   // atualiza o estado
  salvar(estado.tarefas);           // persiste
  render();                         // e redesenha TUDO
}

botaoAdicionar.addEventListener("click", () => {
  mudar({ tarefas: [...estado.tarefas, novaTarefa] });   // só muda o estado
});
```

Redesenhar tudo parece desperdício, mas para listas de dezenas ou centenas de itens é
imperceptível, e o ganho em simplicidade é enorme: **a tela nunca fica fora de sincronia com o
estado**, porque ela é sempre calculada a partir dele. (Frameworks como o React otimizam esse
redesenho para telas gigantes. A ideia é a mesma.)

Duas regras que sustentam o padrão:

- **O estado é a única fonte da verdade.** Nunca "leia" o estado olhando para a tela (`li.classList.contains("feita")`): leia do objeto de estado.
- **Estado imutável** (seção 4.4 do módulo 03): crie um estado novo em vez de alterar o antigo.
  É assim que você consegue comparar versões e é exigência do React.

### Uma store: avisando quem precisa saber

Quando o app tem várias partes interessadas em saber que o estado mudou (a lista, o contador, o salvamento no
`localStorage`), vale encapsular o estado numa **store** com um sistema de "assinantes":

```js
export function criarStore(estadoInicial) {
  let estado = estadoInicial;
  const ouvintes = [];

  return {
    obterEstado: () => estado,

    atualizar(mudanca) {
      const parte = typeof mudanca === "function" ? mudanca(estado) : mudanca;
      estado = { ...estado, ...parte };          // estado NOVO, sem mexer no antigo
      ouvintes.forEach((ouvinte) => ouvinte(estado));
      return estado;
    },

    assinar(ouvinte) {
      ouvintes.push(ouvinte);
      return () => ouvintes.splice(ouvintes.indexOf(ouvinte), 1);   // devolve a função "cancelar assinatura"
    },
  };
}

// Uso:
const loja = criarStore({ tarefas: [] });
loja.assinar((estado) => render(estado));
loja.assinar((estado) => salvar(estado.tarefas));
loja.atualizar({ tarefas: [{ id: 1, texto: "Estudar", feita: false }] });   // dispara os dois
```

É um padrão chamado **publish/subscribe** (ou *observer*), e é o coração do Redux, do Zustand
(que você vai usar no módulo 10), dos eventos do Node e de muita coisa mais.

> ✏️ **Pratique agora — Exercício 10: store**
>
> Abra `exercicios/04-js-navegador-dom/10-store.js`. Construa a sua loja de estado com
> assinantes e atualizações imutáveis.
>
> ```bash
> npm run exercicio -- 10-store
> ```

### 5.2 Juntando tudo: a lista de tarefas

O primeiro aplicativo completo do curso reúne **tudo** o que você viu: criar elementos, eventos,
delegação, formulário, `localStorage` e estado → render. A estrutura que funciona:

```js
export function iniciarTarefas(raiz, storage) {
  const documento = raiz.ownerDocument;
  const lista = raiz.querySelector("#lista");
  // ... demais elementos que o app usa ...

  const estado = { tarefas: carregar(storage), filtro: "todas" };

  function criarItem(tarefa) { /* monta o <li> com createElement */ }

  function render() { /* desenha TUDO a partir de "estado" */ }

  function mudarTarefas(tarefas) {
    estado.tarefas = tarefas;
    storage.setItem("tarefas", JSON.stringify(tarefas));
    render();
  }

  // 1 listener por "tipo de coisa que o usuário faz":
  form.addEventListener("submit", ...);          // adicionar
  lista.addEventListener("change", ...);         // marcar/desmarcar (delegação)
  lista.addEventListener("click", ...);          // remover (delegação)
  filtros.addEventListener("click", ...);        // trocar filtro (delegação)
  limpar.addEventListener("click", ...);

  render();                                      // primeira pintura
}
```

Repare no desenho:

- **Uma função de entrada** que recebe a `raiz` e o `storage`: nada global, tudo testável.
- Os **handlers só alteram o estado** (e chamam `mudarTarefas`); quem desenha é o `render`.
- O `render` é **idempotente**: chamá-lo duas vezes seguidas dá o mesmo resultado.
- Os ids vêm de `crypto.randomUUID()`: identificadores únicos sem precisar de contador.

**Dicas práticas:**

- A tarefa é identificada pelo `data-id` do `<li>`. No `change` do checkbox: `evento.target.closest("li").dataset.id`.
- O `change` de um checkbox "sobe" até a lista (assim como o `click`), então a delegação funciona também para ele.
- Depois de adicionar, `campo.value = ""` e `campo.focus()` deixam a pessoa adicionando várias seguidas.
- O contador conta as pendentes do **estado completo**, não da lista filtrada.

> ✏️ **Pratique agora — Exercício 11: lista de tarefas completa**
>
> Abra `exercicios/04-js-navegador-dom/11-lista-de-tarefas.js`. É o maior exercício do módulo:
> adicionar, marcar, remover, filtrar, contar, limpar e persistir, tudo no padrão estado → render.
> Reserve tempo e vá passando os testes um grupo por vez.
>
> ```bash
> npm run exercicio -- 11-lista
> ```

---

## 6. Interações acessíveis

Componentes interativos (menus, abas, acordeões, modais) são onde a acessibilidade mais falha, e onde
ela mais conta. A boa notícia: os padrões se repetem.

### 6.1 Contar o estado para quem não vê a tela

Um leitor de tela não enxerga que uma seção "abriu". Você conta isso com atributos ARIA que **espelham** o estado:

| Atributo | Significa | Usado em |
| --- | --- | --- |
| `aria-expanded="true/false"` | Este botão controla algo que está aberto/fechado | Acordeão, menu, dropdown |
| `aria-controls="id"` | Este botão controla o elemento com este id | Acordeão, abas |
| `aria-pressed="true/false"` | Botão que liga/desliga (como "negrito") | Filtros, alternar tema |
| `aria-selected="true/false"` | Item selecionado em um grupo | Abas |
| `aria-current="page"` | O item atual de uma lista de navegação | Menu da página atual |
| `aria-hidden="true"` | Esconda isto do leitor de tela (é decorativo) | Ícones |
| `aria-live="polite"` / `role="status"` | Leia o texto desta região quando ele mudar | Mensagens de sucesso |
| `aria-label="..."` | Dá nome a um elemento que não tem texto | Botão só com ícone ✕ |

A regra de ouro do ARIA (já vista no módulo 01): **use a tag HTML certa primeiro** (`<button>`,
`<details>`, `<dialog>`); só use ARIA para o que o HTML não consegue dizer. E **o ARIA não muda
o comportamento**: `aria-expanded="true"` não abre nada, só avisa. Quem abre e fecha é o seu JavaScript, e ele precisa
manter o ARIA e a tela **sempre em sincronia**:

```js
function definirAberto(botao, aberto) {
  botao.setAttribute("aria-expanded", String(aberto));          // avisa
  document.getElementById(botao.getAttribute("aria-controls")).hidden = !aberto;   // mostra/esconde
}
```

### 6.2 Gerenciando o foco

O **foco** é "onde o teclado está". Interações bem feitas movem o foco de forma previsível:

```js
campo.focus();                          // coloca o foco num elemento (funciona em botões, campos, links)
document.activeElement;                 // quem tem o foco agora
```

Quando mover o foco:

- Depois de **adicionar** algo, volte ao campo para a pessoa adicionar o próximo.
- Depois de um **erro de formulário**, vá ao primeiro campo com erro.
- Ao **abrir um modal**, o foco vai para dentro dele; ao fechar, **volta** ao botão que o abriu.
- Dentro de **listas de botões** (abas, acordeão, menu), as **setas** movem o foco entre eles (seção 6.3).

Só elementos "focáveis" recebem foco: links com `href`, botões, campos de formulário. Para tornar
outra coisa focável **por código** (sem entrar na ordem do `Tab`), use `tabindex="-1"`. Evite
`tabindex` positivo (`tabindex="3"`): bagunça a ordem natural.

### 6.3 O acordeão (FAQ)

Um acordeão exibe uma pergunta por vez. A estrutura acessível:

```html
<h3><button class="acordeao__botao" aria-expanded="false" aria-controls="p1">Como funciona?</button></h3>
<div class="acordeao__painel" id="p1" hidden>Resposta...</div>
```

O botão dentro do título (`<h3>`) deixa os leitores de tela navegarem pelas perguntas como títulos.
O comportamento que você vai programar:

- Clicar abre o painel e fecha os outros (só um aberto por vez).
- As **setas** movem o foco entre os botões, com `Home`/`End` para as pontas (é o padrão
  recomendado pelo guia de acessibilidade da W3C).
- `Enter` e `Espaço` já funcionam: um `<button>` os trata de graça.

Com **delegação**, dois listeners na raiz resolvem tudo, sem listener em cada botão.

> ✏️ **Pratique agora — Exercício 12: acordeão acessível**
>
> Abra `exercicios/04-js-navegador-dom/12-acordeao.js`. Estado inicial coerente, abrir/fechar
> com `aria-expanded` e `hidden`, e navegação por setas com gerenciamento de foco.
>
> ```bash
> npm run exercicio -- 12-acordeao
> ```

### 6.4 Modais: o elemento `<dialog>`

Para janelas modais, o HTML tem um elemento pronto que cuida de quase tudo (fundo escurecido, foco
preso dentro, `Esc` para fechar, devolver o foco):

```html
<dialog id="confirmacao">
  <p>Excluir o racha?</p>
  <button id="sim">Excluir</button>
  <button id="nao">Cancelar</button>
</dialog>
```

```js
const dialogo = document.querySelector("#confirmacao");
dialogo.showModal();     // abre como modal
dialogo.close();         // fecha
dialogo.addEventListener("close", () => { /* a pessoa fechou (Esc, botão...) */ });
```

Prefira o `<dialog>` a montar um modal "na mão" com `div`, `z-index` e `position: fixed`: você ganha a
acessibilidade pronta. (O jsdom, que os testes usam, não implementa `showModal`; por isso o
projeto deste módulo usa a função `confirm()` do navegador, recebida por parâmetro. Num projeto
seu, prefira o `<dialog>`.)

---

## 7. Tempo: timers e relógios

### 7.1 `setTimeout` e `setInterval`

Você usou o `setTimeout` no `debounce` do módulo 03. Os dois timers do navegador:

```js
const id = setTimeout(() => console.log("passou 1 segundo"), 1000);   // roda UMA vez, depois de 1000 ms
clearTimeout(id);                                                      // cancela antes de rodar

const repeticao = setInterval(() => console.log("tique"), 1000);       // roda a CADA 1000 ms
clearInterval(repeticao);                                              // para
```

- Os dois **não travam** o programa: o resto do código continua rodando, e o navegador chama a função
  depois (você vai entender o mecanismo no módulo 05, o *event loop*).
- **Sempre guarde o id** quando precisar parar. Um `setInterval` esquecido continua rodando para sempre, gastando bateria e memória
  (um *vazamento*). Funções que iniciam um timer costumam **retornar uma função `parar()`**.
- O tempo é um **mínimo**, não uma garantia: se o navegador estiver ocupado ou a aba em segundo plano, a chamada atrasa.

### 7.2 O erro clássico do cronômetro

```js
// ❌ Conta "ticks": cada intervalo soma 10 ms.
let ms = 0;
setInterval(() => { ms += 10; mostrar(ms); }, 10);
```

Como os intervalos **atrasam** (e abas em segundo plano chegam a rodar uma vez por segundo), esse
cronômetro fica errado, e quanto mais tempo passa, pior. O jeito certo é usar o **relógio**: guarde o
instante em que começou e, a cada tique, **calcule a diferença**:

```js
const inicio = Date.now();                 // milissegundos desde 1970
setInterval(() => mostrar(Date.now() - inicio), 10);
```

Agora o tique só serve para **atualizar a tela**; a verdade do tempo vem do relógio. Para pausar e
continuar, guarde o tempo **acumulado** até a pausa e some o trecho em andamento:

```js
tempo = acumulado + (Date.now() - inicioDoTrechoAtual);
```

(Para animações visuais suaves existe o `requestAnimationFrame`, que chama a sua função antes de cada
quadro da tela, ~60 vezes por segundo. É a ferramenta de jogos e animações em JavaScript.)

### 7.3 Testando código com tempo

Esperar 3 segundos reais em um teste seria lento e frágil. O Vitest oferece **relógio falso**:
`vi.useFakeTimers()` substitui `setTimeout`, `setInterval` e `Date` por versões que **só andam quando o
teste manda** (`vi.advanceTimersByTime(3000)`). É o que os testes deste exercício fazem: três segundos passam em milissegundos.

Formatar o tempo é um exercício de `padStart` e de contas com `Math.floor` e `%`:

```js
const doisDigitos = (n) => String(n).padStart(2, "0");
const segundos = Math.floor(ms / 1000) % 60;       // % 60: o que sobra depois dos minutos
const minutos = Math.floor(ms / 60000);
```

> ✏️ **Pratique agora — Exercício 13: cronômetro e relógio**
>
> Abra `exercicios/04-js-navegador-dom/13-tempo.js`. Formatar tempo, um cronômetro com pausa, voltas
> e precisão (baseado em `Date.now`), e um relógio digital que se pode parar.
>
> ```bash
> npm run exercicio -- 13-tempo
> ```

---

## 8. URLs e outras APIs do navegador

### 8.1 `URL` e `URLSearchParams`

Montar URLs concatenando texto é fonte de bugs (esqueceu de codificar um espaço, um `&`...). O
navegador (e o Node) trazem ferramentas prontas:

```js
const parametros = new URLSearchParams("?categoria=casa+e+jardim&pagina=2");

parametros.get("categoria");          // "casa e jardim" (já decodificado!)
parametros.get("ordem");              // null (não existe)
parametros.has("pagina");             // true

const novos = new URLSearchParams();
novos.set("busca", "cama, mesa & banho");
novos.set("pagina", "3");
novos.toString();                     // "busca=cama%2C+mesa+%26+banho&pagina=3"  (tudo codificado)
```

- Valores sempre chegam como **texto** (`get("pagina")` é `"2"`): converta e **valide**. `Number("")` é `0` e `Number("abc")` é `NaN`.
- `URL` quebra uma URL inteira em partes: `const url = new URL("https://loja.com/produtos?x=1#topo")` →
  `url.hostname`, `url.pathname`, `url.searchParams`, `url.hash`. É a versão em código da "anatomia de uma URL" do módulo 00.

**Codificação para links.** Texto com espaços, acentos e símbolos precisa ser codificado para entrar
em uma URL: `encodeURIComponent("Olá, tudo bem?")` → `"Ol%C3%A1%2C%20tudo%20bem%3F"`.

**Link de WhatsApp** (muito pedido em projetos de freelancer): abre uma conversa com a mensagem pronta.

```js
`https://wa.me/5581999990000?text=${encodeURIComponent("Olá! Vi seu site.")}`
// wa.me/<número com DDI e DDD, só dígitos>?text=<mensagem codificada>
// Sem número (wa.me/?text=...), a pessoa escolhe o contato ou o grupo.
```

### 8.2 A URL como estado

Guardar filtros e página na URL (`?categoria=moveis&pagina=2`) tem vantagens enormes: a pessoa pode
**favoritar e compartilhar** a tela do jeito que está, o botão **voltar** funciona e recarregar não perde
o lugar. Todo site sério de loja ou listagem faz isso. A receita são duas funções puras:

- `lerFiltros(busca)`: da query string para um objeto, **com valores padrão** para tudo o que faltar ou vier inválido;
- `montarBusca(filtros)`: do objeto para a query string, **omitindo o que é padrão** (URLs mais limpas).

No navegador, `location.search` dá a query string atual, e `history.pushState` muda a URL **sem recarregar**:

```js
const filtros = lerFiltros(location.search);

history.pushState(null, "", montarBusca(novosFiltros) || location.pathname);
```

### 8.3 Outras APIs úteis (conhecer, não decorar)

| API | Para quê | Observação |
| --- | --- | --- |
| `matchMedia("(prefers-color-scheme: dark)").matches` | Saber a preferência do sistema, ou o tamanho da tela | Receba por parâmetro, para testar |
| `navigator.clipboard.writeText(texto)` | Copiar para a área de transferência | **Assíncrona**: módulo 05 |
| `navigator.share({ title, text, url })` | Abrir o menu de compartilhar do celular | Só em alguns navegadores e HTTPS |
| `IntersectionObserver` | Saber quando um elemento aparece na tela (carregar imagens, animar ao rolar) | Substitui ouvir `scroll` |
| `crypto.randomUUID()` | Gerar ids únicos | Também existe no Node |
| `structuredClone(objeto)` | Cópia profunda | Módulo 03 |
| `fetch(url)` | Buscar dados de APIs | **Módulo 05** |
| `Notification`, `Geolocation` | Notificações e localização | Pedem permissão do usuário |
| `window.print()` | Imprimir | Combine com CSS `@media print` |

> ✏️ **Pratique agora — Exercício 14: URLs, filtros e WhatsApp**
>
> Abra `exercicios/04-js-navegador-dom/14-url.js`. Ler e montar parâmetros de busca com
> validação e padrões, e gerar o link de WhatsApp.
>
> ```bash
> npm run exercicio -- 14-url
> ```

---

## 9. Depurando no navegador

O DevTools (F12) é a sua melhor ferramenta de trabalho. As abas que você vai usar o tempo todo:

| Aba | Para quê |
| --- | --- |
| **Console** | Ver `console.log`, erros e executar JavaScript na hora (digite `document.querySelector("h1")` e veja o elemento) |
| **Elements** | Ver o DOM **ao vivo** (já alterado pelo JavaScript, não o HTML original), editar atributos, ver os **event listeners** de cada elemento e o CSS aplicado |
| **Sources** | Colocar **breakpoints** (clique no número da linha), executar passo a passo (F10, F11), ver o valor das variáveis |
| **Application** | Ver e **editar o localStorage**, cookies e dados guardados |
| **Network** | Ver as requisições (módulo 00) |
| **Lighthouse** | Notas de acessibilidade, SEO, performance |

### Um roteiro para quando "não funciona"

1. **Abra o Console.** Há um erro vermelho? Leia a mensagem **inteira** e clique no link para ir à linha.
2. `Cannot read properties of null (reading 'addEventListener')` quer dizer que o `querySelector` não achou o elemento:
   id errado? Script rodando antes do HTML existir?
3. **O listener rodou?** Coloque um `console.log("entrei aqui")` (ou um breakpoint) no início do handler.
4. **O estado está certo?** `console.log({ estado })` mostra o conteúdo; `console.table(lista)` desenha um array de objetos como tabela.
5. **A página mostra algo diferente do estado?** Aba **Elements**: o DOM realmente contém o que você acha?
6. **Os dados guardados estão corretos?** Aba **Application → Local Storage**: veja (e apague) a chave.
7. Para **testar o tema escuro**, **dispositivos móveis** e **movimento reduzido** use as ferramentas de emulação do DevTools (módulo 01).

Dica: escreva `debugger;` em uma linha do código. Com o DevTools aberto, o navegador **pausa nessa linha**.

---

## 10. Organizando um aplicativo sem framework

Você vai escrever um app de verdade no projeto. A organização que separa um projeto "de curso" de
um projeto profissional é a que torna o código **testável e fácil de mudar**: separar camadas.

```
src/
├── dinheiro.js        ← formatação e conversão (funções puras)
├── racha.js           ← REGRAS do negócio (funções puras)
├── estado.js          ← criar/alterar os dados (imutável; lança erros de validação)
├── armazenamento.js   ← salvar/carregar (recebe o storage por parâmetro)
├── ui.js              ← liga tudo à página (único lugar com eventos e DOM)
└── main.js            ← 3 linhas: junta o app com o navegador de verdade
```

As regras:

1. **Camadas de dentro para fora.** As regras de negócio (cálculos, validações) **não sabem** que
   existe uma página, um `localStorage` ou um navegador. Só recebem dados e devolvem dados.
2. **Só a camada de interface mexe no DOM** e registra eventos. Ela **chama** as outras camadas, nunca o contrário.
3. **Tudo que vem de fora entra por parâmetro**: a raiz da página, o `storage`, a função `confirmar`,
   o relógio. O `main.js` é o único arquivo que usa os globais do navegador (`document`, `localStorage`, `confirm`):

   ```js
   // main.js
   import { iniciarApp } from "./ui.js";

   iniciarApp(document.querySelector("#app"), {
     storage: localStorage,
     confirmar: (mensagem) => confirm(mensagem),
   });
   ```

4. **Erros esperados e erros de bug são diferentes.** As regras lançam um tipo próprio de erro quando a *pessoa*
   errou (`ValidacaoError`: dado inválido, repetido, em branco); a interface captura **só esse tipo** e
   mostra a mensagem. Qualquer outro erro é um bug do programa e **deve estourar** (módulo 03, seção 7):

   ```js
   try {
     trocarRacha(adicionarParticipante(racha, nome));
   } catch (erro) {
     if (!(erro instanceof ValidacaoError)) throw erro;    // bug: não esconda!
     mostrarErro(campo, erro.message);
   }
   ```

5. **Ordem de trabalho:** primeiro as regras (com testes, sem tela nenhuma), depois a interface. É muito mais
   fácil acertar a lógica do que depurar a lógica *e* a tela ao mesmo tempo.

### Como a tela é testada

Os testes do projeto abrem o **seu `index.html`** num navegador de mentira, chamam
`iniciarApp(raiz, { storage, confirmar })` e usam a tela como uma pessoa: digitam nos campos, clicam em
botões, enviam formulários e conferem o que aparece. Por isso os **ids do HTML são um contrato**: o teste procura
`#form-racha`, `#lista-despesas`... Em equipes, isso é normal: designers, devs e testadores combinam nomes (em
projetos reais costuma-se usar `data-testid`, um atributo só para testes).

---

## Projeto do módulo — Racha-conta

Enunciado completo: [projetos/04-racha-conta/README.md](../projetos/04-racha-conta/README.md).

Um site para dividir as despesas de uma viagem, churrasco ou república: cria-se um racha, adicionam-se
participantes e despesas, e o app mostra o **saldo** de cada um e o **acerto de contas** com o menor número de
transferências, com um botão para mandar o resumo para o **WhatsApp**. Funciona **sem conta e sem
internet**: os dados ficam no navegador. Você vai publicá-lo no GitHub Pages e mandar o link para um grupo de amigos usar de verdade.

O coração do projeto é a **regra de acerto**: quem mais deve paga a quem mais tem a receber, repetidamente.
Com `n` pessoas, sobram no máximo `n − 1` transferências. E o desafio das regras: dividir centavos que não
fecham exatamente (R$ 10,00 por 3 pessoas) **sem perder um centavo**.

```bash
npm run corrigir-projeto -- 04 ../racha-conta
```

---

## Resumo dos exercícios

Você já fez todos ao longo da aula. Confira com `npm run progresso`.

| # | Arquivo | Assunto | Seção |
| --- | --- | --- | --- |
| 01 | `01-selecionar.js` | `querySelector`, `querySelectorAll`, `getAttribute` | 1.3 |
| 02 | `02-alterar.js` | texto, classes, `dataset`, `hidden`, ARIA | 1.4 |
| 03 | `03-criar-e-remover.js` | `createElement`, `replaceChildren`, `template`, XSS | 1.5 |
| 04 | `04-eventos.js` | `addEventListener`, `click`, `input`, closures | 2.1–2.2 |
| 05 | `05-delegacao.js` | um listener, `closest`, itens dinâmicos | 2.3 |
| 06 | `06-teclado.js` | `keydown`, `evento.key`, `preventDefault` | 2.4 |
| 07 | `07-formulario.js` | `submit`, `FormData`, validação, `aria-invalid` | 3.1–3.3 |
| 08 | `08-mascaras.js` | telefone, CEP e dinheiro enquanto se digita | 3.4 |
| 09 | `09-armazenamento.js` | `localStorage` à prova de dados corrompidos, tema | 4 |
| 10 | `10-store.js` | estado imutável e assinantes | 5.1 |
| 11 | `11-lista-de-tarefas.js` | o app completo (estado → render) | 5.2 |
| 12 | `12-acordeao.js` | ARIA, foco e teclado | 6.3 |
| 13 | `13-tempo.js` | cronômetro preciso, relógio, timers | 7 |
| 14 | `14-url.js` | `URLSearchParams`, filtros e WhatsApp | 8 |

---

## Checklist para avançar

- [ ] Seleciono elementos com `querySelector`/`querySelectorAll`, converto `NodeList` em array e trato o `null`.
- [ ] Altero texto, classes, atributos e `data-*` sem recorrer a `innerHTML`.
- [ ] Sei explicar o que é XSS e por que uso `textContent` e `createElement` com dados de pessoas.
- [ ] Registro eventos com `addEventListener` e diferencio `input`, `change` e `submit`.
- [ ] Uso delegação de eventos com `closest` em listas que mudam.
- [ ] Trato teclado (`evento.key`) sem atrapalhar quem digita.
- [ ] Valido formulários com função pura e mostro os erros com `aria-invalid`, `aria-describedby` e foco.
- [ ] Guardo e leio dados do `localStorage` sem quebrar com dado corrompido.
- [ ] Construo telas com o padrão **estado → render** e sei explicar por que ele evita bugs.
- [ ] Mantenho `aria-expanded`/`hidden` em sincronia e gerencio o foco em componentes interativos.
- [ ] Faço um cronômetro preciso usando `Date.now`, e sempre dou um jeito de parar meus timers.
- [ ] Leio e monto URLs com `URLSearchParams` e `encodeURIComponent`.
- [ ] Separo regras de negócio (puras) da interface e injeto `document`, `storage` e `confirmar` por parâmetro.
- [ ] Depuro com o Console, o Elements, breakpoints no Sources e o Application.
- [ ] Os 14 exercícios passam (`npm run progresso`).
- [ ] O Racha-conta passou na correção, está publicado no GitHub Pages, e um grupo de amigos o usou de verdade.
