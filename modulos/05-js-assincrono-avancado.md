# Módulo 05 — JavaScript assíncrono e avançado

**Duração:** 3–4 semanas · **Pré-requisito:** Módulo 04

## Objetivos

- Entender o event loop e por que JavaScript é assíncrono.
- Dominar callbacks, Promises e `async/await`.
- Consumir APIs com `fetch`, tratando carregamento, erros e cancelamento.
- Entender protótipos, classes e Programação Orientada a Objetos.
- Conhecer recursos avançados: iteradores, generators, Proxy, Map/Set.

---

## 1. O Event Loop

JavaScript executa **uma coisa por vez** (single thread). Tarefas demoradas (rede, timers,
arquivos) são entregues ao ambiente (navegador/Node) e, quando terminam, o callback volta para
uma **fila** e é executado assim que a pilha estiver livre.

```js
console.log("1");
setTimeout(() => console.log("2 - timeout"), 0);
Promise.resolve().then(() => console.log("3 - promise"));
console.log("4");

// Saída: 1, 4, 3 - promise, 2 - timeout
// Microtasks (promises) rodam antes das macrotasks (timers).
```

Assista: *"What the heck is the event loop anyway?"* — Philip Roberts (JSConf), e use o
[Loupe](http://latentflip.com/loupe/) para visualizar.

## 2. Callbacks → Promises → async/await

```js
// Callbacks aninhados ("callback hell")
buscarUsuario(1, (usuario) => {
  buscarPedidos(usuario.id, (pedidos) => {
    buscarItens(pedidos[0].id, (itens) => { /* ... */ });
  });
});

// Promise: um objeto que representa um valor futuro (pending → fulfilled | rejected)
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

buscarUsuario(1)
  .then((usuario) => buscarPedidos(usuario.id))
  .then((pedidos) => buscarItens(pedidos[0].id))
  .catch((erro) => console.error(erro))
  .finally(() => esconderLoading());

// async/await: o mesmo, mas lendo como código síncrono
async function carregarItens() {
  try {
    const usuario = await buscarUsuario(1);
    const pedidos = await buscarPedidos(usuario.id);
    return await buscarItens(pedidos[0].id);
  } catch (erro) {
    console.error(erro);
  } finally {
    esconderLoading();
  }
}
```

### Executando em paralelo

```js
// ❌ Sequencial sem necessidade (soma os tempos)
const a = await buscarA();
const b = await buscarB();

// ✔ Paralelo (tempo do mais lento)
const [a2, b2] = await Promise.all([buscarA(), buscarB()]);

Promise.allSettled([...]); // espera todas, mesmo as que falharem
Promise.race([...]);       // a primeira que terminar
Promise.any([...]);        // a primeira que der certo
```

## 3. Consumindo APIs com fetch

```js
async function buscarRepos(usuario, { signal } = {}) {
  const resposta = await fetch(`https://api.github.com/users/${usuario}/repos`, { signal });

  // fetch só rejeita em erro de rede. 404 e 500 precisam ser verificados!
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
  }
  return resposta.json();
}

// Enviando dados
await fetch("https://api.exemplo.com/tarefas", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ titulo: "Estudar" }),
});
```

### Os 4 estados de toda tela que busca dados

```js
async function render(usuario) {
  mostrar("carregando");                    // 1. loading
  try {
    const repos = await buscarRepos(usuario);
    if (repos.length === 0) mostrar("vazio"); // 2. vazio
    else mostrar("sucesso", repos);           // 3. sucesso
  } catch (e) {
    mostrar("erro", e.message);               // 4. erro (com botão "tentar novamente")
  }
}
```

### Cancelamento e condição de corrida

```js
let controller;
input.addEventListener("input", async (e) => {
  controller?.abort();                 // cancela a busca anterior
  controller = new AbortController();
  try {
    const dados = await buscarRepos(e.target.value, { signal: controller.signal });
    renderizar(dados);
  } catch (erro) {
    if (erro.name !== "AbortError") mostrarErro(erro);
  }
});
```

APIs públicas para praticar: GitHub, PokéAPI, ViaCEP, Open-Meteo, TMDB, JSONPlaceholder,
REST Countries.

## 4. Protótipos e classes (POO)

Todo objeto JS tem um **protótipo** de onde herda propriedades. Classes são uma sintaxe mais
clara sobre esse mecanismo.

```js
class Conta {
  #saldo = 0;            // campo privado
  static totalContas = 0;

  constructor(titular) {
    this.titular = titular;
    Conta.totalContas++;
  }

  get saldo() { return this.#saldo; }

  depositar(valor) {
    if (valor <= 0) throw new Error("Valor inválido");
    this.#saldo += valor;
    return this;          // permite encadear: conta.depositar(10).depositar(20)
  }

  sacar(valor) {
    if (valor > this.#saldo) throw new Error("Saldo insuficiente");
    this.#saldo -= valor;
    return this;
  }
}

class ContaPoupanca extends Conta {
  constructor(titular, taxa) {
    super(titular);
    this.taxa = taxa;
  }
  renderJuros() {
    this.depositar(this.saldo * this.taxa);
  }
}
```

**Os 4 pilares da POO:**
- **Encapsulamento**: esconder detalhes internos (`#saldo`).
- **Abstração**: expor só o necessário (`depositar`, `sacar`).
- **Herança**: reaproveitar (`extends`). Use com moderação — prefira **composição**.
- **Polimorfismo**: objetos diferentes respondendo ao mesmo método de formas diferentes.

## 5. Map, Set, WeakMap

```js
const visitas = new Map();          // chaves de qualquer tipo, mantém ordem
visitas.set("/home", 10);
visitas.get("/home");               // 10
visitas.has("/sobre");              // false

const tags = new Set(["js", "css", "js"]); // valores únicos
tags.size;                                  // 2
```

## 6. Iteradores, generators e outros recursos avançados

```js
// Generator: função que pausa e retoma
function* idGenerator() {
  let id = 1;
  while (true) yield id++;
}
const ids = idGenerator();
ids.next().value; // 1
ids.next().value; // 2

// Iteração assíncrona — útil para paginação
async function* paginas(url) {
  let proxima = url;
  while (proxima) {
    const res = await fetch(proxima).then((r) => r.json());
    yield res.itens;
    proxima = res.proximaPagina;
  }
}
for await (const itens of paginas("/api/produtos?page=1")) { /* ... */ }

// Proxy: interceptar operações em um objeto (base de reatividade em frameworks)
const estado = new Proxy({ contador: 0 }, {
  set(alvo, chave, valor) {
    alvo[chave] = valor;
    render();
    return true;
  },
});
estado.contador++; // chama render() automaticamente
```

## 7. Como o JavaScript funciona por baixo

Estude (leitura e vídeos):
- Contexto de execução, call stack e heap.
- Garbage collection e vazamentos de memória (listeners e timers esquecidos).
- Coerção de tipos (`[] + {}`, `"5" * "2"`) — para entender, não para usar.
- Leitura recomendada: série *You Don't Know JS Yet* (Kyle Simpson), gratuita no GitHub.

---

## Exercícios

1. Escreva `esperar(ms)` e use-a para mostrar uma contagem regressiva com `async/await`.
2. Escreva `comTimeout(promise, ms)` que rejeita se a promise demorar mais que `ms`.
3. Escreva `tentarNovamente(fn, tentativas)` com espera crescente entre tentativas (retry com backoff).
4. Busca de CEP (ViaCEP) que preenche o formulário de endereço automaticamente.
5. Liste 151 Pokémon da PokéAPI com paginação ("carregar mais") e scroll infinito.
6. Busque 5 usuários do GitHub em paralelo e mostre quem tem mais repositórios.
7. Modele com classes: `Produto`, `Carrinho` (adicionar, remover, total, cupom de desconto).
8. Implemente uma mini biblioteca de eventos `EventEmitter` (`on`, `off`, `emit`, `once`).

## Projetos

### Projeto simples — App de clima
Busca por cidade (com geocodificação da Open-Meteo), clima atual e previsão de 7 dias, ícones,
uso da geolocalização do navegador, histórico de buscas no localStorage, os 4 estados
(loading/vazio/sucesso/erro).

### Projeto avançado — Catálogo de filmes (TMDB)
- Lista de populares com scroll infinito; busca com debounce e cancelamento (AbortController).
- Página de detalhes (use a URL com `?id=` ou hash `#/filme/123` para criar um mini roteador).
- Lista de favoritos persistida; filtro por gênero e ano.
- Cache em memória das respostas (`Map`) para não repetir requisições.
- Tratamento de erros com retry e mensagens amigáveis.
- Skeleton loading e imagens com `loading="lazy"`.

## Checklist para avançar

- [ ] Sei prever a ordem de execução de código com timers e promises.
- [ ] Uso `async/await` com `try/catch` e sei executar promises em paralelo.
- [ ] Trato os 4 estados de uma tela que consome dados.
- [ ] Cancelo requisições antigas para evitar condição de corrida.
- [ ] Modelo problemas com classes, campos privados e composição.
