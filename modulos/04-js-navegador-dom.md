# Módulo 04 — JavaScript no navegador (DOM, eventos e armazenamento)

**Duração:** 4 semanas · **Pré-requisitos:** Módulos 01 e 03

## Objetivos

- Selecionar, criar, alterar e remover elementos da página.
- Reagir a ações do usuário com eventos.
- Validar formulários com JavaScript.
- Persistir dados no navegador com `localStorage`.
- Organizar uma aplicação "vanilla" com estado e renderização (a base mental do React).

---

## 1. O DOM

O **DOM** (Document Object Model) é a representação do HTML como uma árvore de objetos que o
JavaScript pode manipular.

```html
<script type="module" src="app.js"></script>  <!-- módulos são carregados com defer automaticamente -->
```

### Selecionando elementos

```js
const titulo = document.querySelector("h1");            // primeiro que encontrar
const botoes = document.querySelectorAll(".botao");     // todos (NodeList)
const form = document.querySelector("#form-cadastro");

botoes.forEach((b) => console.log(b.textContent));
```

### Alterando elementos

```js
titulo.textContent = "Novo título";      // texto puro (seguro)
titulo.classList.add("ativo");
titulo.classList.toggle("escondido");
titulo.style.color = "tomato";           // prefira trocar classes a mexer em style
titulo.setAttribute("data-id", "42");
titulo.dataset.id;                       // "42"

// ⚠️ innerHTML com dados do usuário = vulnerabilidade XSS!
// elemento.innerHTML = textoDigitado;   ← NUNCA
```

### Criando e removendo

```js
const item = document.createElement("li");
item.textContent = "Comprar pão";
item.className = "tarefa";
document.querySelector("#lista").append(item);

item.remove();

// Templates HTML para estruturas maiores
// <template id="tpl-card"><article class="card"><h2></h2><p></p></article></template>
const tpl = document.querySelector("#tpl-card");
const card = tpl.content.cloneNode(true);
card.querySelector("h2").textContent = "Título";
document.body.append(card);
```

## 2. Eventos

```js
const botao = document.querySelector("#contador");
let cliques = 0;

botao.addEventListener("click", () => {
  cliques++;
  botao.textContent = `Cliques: ${cliques}`;
});

// O objeto evento
input.addEventListener("input", (evento) => {
  console.log(evento.target.value);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharModal();
});
```

Eventos comuns: `click`, `input`, `change`, `submit`, `keydown`, `focus`, `blur`,
`mouseenter`, `scroll`, `DOMContentLoaded`.

### Propagação e delegação de eventos

Eventos "sobem" do elemento clicado até o `document` (*bubbling*). Use isso para ouvir cliques em
itens criados dinamicamente com **um único listener** no pai:

```js
document.querySelector("#lista").addEventListener("click", (e) => {
  const botaoRemover = e.target.closest("[data-acao='remover']");
  if (!botaoRemover) return;
  const id = botaoRemover.closest("li").dataset.id;
  removerTarefa(id);
});
```

## 3. Formulários

```js
const form = document.querySelector("#form-cadastro");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // impede o recarregamento da página

  const dados = Object.fromEntries(new FormData(form));
  // { nome: "Ana", email: "ana@x.com" }

  const erros = validar(dados);
  if (Object.keys(erros).length > 0) {
    mostrarErros(erros);
    return;
  }

  salvar(dados);
  form.reset();
});

function validar({ nome, email }) {
  const erros = {};
  if (!nome || nome.trim().length < 2) erros.nome = "Nome muito curto";
  if (!/^\S+@\S+\.\S+$/.test(email)) erros.email = "E-mail inválido";
  return erros;
}
```

Acessibilidade: ligue a mensagem de erro ao campo com `aria-describedby` e marque
`aria-invalid="true"`.

## 4. Armazenamento no navegador

```js
// localStorage: guarda strings, sem expiração, ~5 MB por site
localStorage.setItem("tarefas", JSON.stringify(tarefas));
const salvas = JSON.parse(localStorage.getItem("tarefas")) ?? [];
localStorage.removeItem("tarefas");

// sessionStorage: igual, mas apaga ao fechar a aba
// Cookies: enviados ao servidor em toda requisição (veremos no módulo 12)
// IndexedDB: banco no navegador para muitos dados (uso avançado)
```

> Nunca guarde senhas ou dados sensíveis no localStorage.

## 5. Padrão estado → render (preparação para React)

Em vez de mexer no DOM em vários lugares, mantenha **um estado** e uma função que desenha a tela
a partir dele:

```js
const estado = {
  tarefas: JSON.parse(localStorage.getItem("tarefas")) ?? [],
  filtro: "todas", // "todas" | "pendentes" | "concluidas"
};

function atualizar(mudancas) {
  Object.assign(estado, mudancas);
  localStorage.setItem("tarefas", JSON.stringify(estado.tarefas));
  render();
}

function render() {
  const lista = document.querySelector("#lista");
  const visiveis = estado.tarefas.filter((t) =>
    estado.filtro === "todas" ? true :
    estado.filtro === "concluidas" ? t.feita : !t.feita
  );

  lista.replaceChildren(
    ...visiveis.map((t) => {
      const li = document.createElement("li");
      li.dataset.id = t.id;
      li.className = t.feita ? "feita" : "";
      li.textContent = t.texto;
      return li;
    })
  );
}

function adicionarTarefa(texto) {
  atualizar({
    tarefas: [...estado.tarefas, { id: crypto.randomUUID(), texto, feita: false }],
  });
}

render();
```

Essa ideia — **a interface é uma função do estado** — é exatamente o que o React faz.

## 6. APIs úteis do navegador

```js
// Timers
const id = setTimeout(() => console.log("depois de 1s"), 1000);
clearTimeout(id);
setInterval(atualizarRelogio, 1000);

// Navegação e URL
const params = new URLSearchParams(location.search);
params.get("busca");

// Observadores
const observer = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => e.isIntersecting && e.target.classList.add("visivel"));
});
document.querySelectorAll(".animar").forEach((el) => observer.observe(el));

// Outras: Clipboard, Geolocation, Notifications, matchMedia (tema escuro), <dialog>
```

## 7. DevTools para JavaScript

- **Console**: testar código e ver erros.
- **Sources**: coloque *breakpoints*, execute linha a linha, inspecione variáveis.
  Ou escreva `debugger;` no código.
- **Elements**: veja o DOM ao vivo e os listeners de eventos.
- **Application**: veja e edite o localStorage.

---

## Exercícios

1. Contador com botões +, −, e reset; não deixe ficar negativo.
2. Alternador de tema claro/escuro que lembra a escolha (localStorage) e respeita
   `prefers-color-scheme` na primeira visita.
3. Modal acessível com `<dialog>` que fecha com Esc e com clique fora.
4. Accordion (FAQ) em que só um item fica aberto por vez.
5. Busca que filtra uma lista de 100 nomes enquanto o usuário digita (com debounce).
6. Formulário de cadastro com validação em tempo real e máscara de telefone e CEP.
7. Galeria de imagens com lightbox e navegação pelas setas do teclado.
8. Relógio digital e cronômetro (iniciar, pausar, zerar, voltas).

## Projetos

### Projeto simples — Lista de tarefas (To-do)
Adicionar, editar (duplo clique), concluir, remover, filtrar (todas/pendentes/concluídas),
contador de pendentes, limpar concluídas e persistência em localStorage. Use o padrão estado → render.

### Projeto avançado — Quadro Kanban
- Colunas "A fazer", "Fazendo" e "Feito"; criar colunas personalizadas.
- Cartões com título, descrição, prioridade, prazo e etiquetas coloridas.
- **Arrastar e soltar** entre colunas (Drag and Drop API) **e** alternativa por teclado.
- Busca e filtro por etiqueta/prioridade; destaque de cartões atrasados.
- Exportar e importar o quadro em JSON.
- Código organizado em módulos: `estado.js`, `render.js`, `eventos.js`, `armazenamento.js`.
- Publicado online.

## Checklist para avançar

- [ ] Seleciono, crio, altero e removo elementos com segurança (sem XSS).
- [ ] Uso delegação de eventos.
- [ ] Valido formulários com JS e acessibilidade.
- [ ] Persisto dados no localStorage.
- [ ] Construo uma interface a partir de um estado único.
- [ ] Uso breakpoints no DevTools para depurar.
