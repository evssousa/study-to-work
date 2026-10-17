# Módulo 05 — JavaScript assíncrono, APIs e orientação a objetos

> **Duração sugerida:** 4 semanas (ritmo regular).
> **Pré-requisitos:** Módulos 03 e 04.
> **Projeto do módulo:** Painel de câmbio, que mostra cotações reais, converte valores, guarda o histórico e continua útil sem internet.

## Objetivos

- Entender o **event loop**: por que o JavaScript faz uma coisa por vez e mesmo assim não trava esperando a rede.
- Dominar **Promises** e **`async/await`**, em sequência e em paralelo, com tratamento de erros.
- Consumir **APIs** com `fetch`, tratando erros de rede, erros HTTP e respostas inesperadas.
- Resolver **condições de corrida** e cancelar requisições com `AbortController`.
- Construir telas com os **quatro estados** de quem busca dados: carregando, sucesso, erro e vazio.
- Modelar problemas com **classes**: campos privados, herança, polimorfismo e composição.
- Usar `Map`, `Set`, **geradores** e iteradores, e construir um **cache** de verdade.
- Trabalhar com **fuso horário** e timestamps de APIs.
- Entender o que o JavaScript faz **por baixo** (memória, vazamentos, coerção).

> Os exercícios aparecem nos blocos **✏️ Pratique agora**, logo depois de cada assunto.
> Resolva cada um assim que chegar nele, antes de continuar a leitura.

---

## 0. Como o curso corrige código assíncrono

Testar código que espera (rede, timers) parece difícil: o teste teria que esperar de verdade e dependeria da
internet. Os testes deste módulo usam três truques que você vai encontrar em qualquer equipe profissional:

1. **`fetch` falso.** Seu código recebe o `fetch` por parâmetro (como recebeu o `document` e o `storage` no
   módulo 04). O teste entrega uma função que devolve respostas fabricadas, no formato real da API. Nada de rede,
   nada de lentidão, sempre o mesmo resultado, e dá para simular uma API que falha ou atrasa.
2. **Relógio falso.** O Vitest troca `setTimeout`, `setInterval` e `Date` por versões que só andam quando o
   teste manda (`vi.advanceTimersByTime`). Três segundos passam em um instante.
3. **Promises "adiadas".** O teste cria uma promise que ele mesmo resolve na hora que quiser. Assim consegue
   provocar a situação mais perigosa: **a resposta B chegar antes da A**, e conferir se o seu código aguenta.

Por isso este módulo também ensina a **escrever código assíncrono testável**: tudo o que vem "de fora" (a rede, o
relógio, o armazenamento) entra por parâmetro.

---

## 1. O event loop

### 1.1 Uma coisa por vez

O JavaScript tem **uma única linha de execução** (*single thread*): executa **um** trecho de código por vez, do
começo ao fim, sem ser interrompido. Isso simplifica muito (você nunca tem duas partes do seu código mexendo na
mesma variável ao mesmo tempo), mas cria uma pergunta: se pedir uma página à internet leva 800 ms, o programa
fica parado esse tempo todo?

Não, graças ao **event loop**. A ideia é que o JavaScript **não espera**: ele *entrega* a tarefa lenta para o
ambiente (o navegador ou o Node, que fazem a parte pesada por conta própria) e segue em frente. Quando a tarefa
termina, o ambiente avisa, e a função que você deixou combinada ("faça isto quando terminar", o *callback*) volta
para a fila para ser executada.

### 1.2 As peças

```
        ┌──────────────────────────────┐
        │  Pilha de chamadas (stack)   │  ← o que está executando AGORA
        └──────────────┬───────────────┘
                       │ quando esvazia, o event loop pega a próxima tarefa de...
        ┌──────────────┴───────────────┐
        │  Fila de microtasks          │  ← promises (.then, await), queueMicrotask  [PRIORIDADE]
        ├──────────────────────────────┤
        │  Fila de macrotasks (tarefas)│  ← timers, eventos (cliques), respostas de rede
        └──────────────▲───────────────┘
                       │ entrega os callbacks quando terminam
        ┌──────────────┴───────────────┐
        │  O ambiente (navegador/Node) │  ← timers, rede, disco, DOM...
        └──────────────────────────────┘
```

- **Pilha (call stack):** o código que está rodando. Funciona "uma chamada em cima da outra": quando `a()` chama
  `b()`, `b` fica em cima; quando `b` termina, volta para `a`. Se a pilha ficar funda demais (recursão sem fim),
  estoura: `RangeError: Maximum call stack size exceeded`.
- **O ambiente** cuida de timers, rede e eventos **fora** da sua linha de execução.
- **Fila de macrotasks:** onde esperam os callbacks de `setTimeout`, de eventos (clique, tecla) e de respostas de rede.
- **Fila de microtasks:** onde esperam os callbacks das **promises** (`.then`, `.catch`, e o que vem depois de um `await`).
  Tem **prioridade**.

### 1.3 A regra de ouro da ordem

O event loop repete, sem parar:

1. Executa o código da pilha **até a pilha esvaziar**.
2. Executa **todas** as microtasks da fila (inclusive as que nascem durante essa fase), até a fila ficar vazia.
3. (No navegador, redesenha a tela se precisar.)
4. Pega **uma** macrotask e volta ao passo 1.

Veja na prática:

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

Saída: **A, D, C, B**. Passo a passo:

1. `console.log("A")` executa → imprime A.
2. `setTimeout` entrega o timer ao ambiente (o callback irá para a fila de macrotasks).
3. `Promise.resolve().then(...)` coloca o callback na fila de **microtasks**.
4. `console.log("D")` executa → imprime D. A pilha esvazia.
5. Microtasks têm prioridade: executa o callback → imprime C.
6. Por fim, a macrotask do timer → imprime B.

Por isso `setTimeout(fn, 0)` **não** significa "agora": significa "assim que for possível, **depois** de todo o código atual e das microtasks".

**O `async/await` nesse quadro:** o código antes do primeiro `await` roda **na hora** (síncrono). O `await` pausa a função
e entrega o controle de volta; o que vem depois do `await` continua como uma **microtask**.

```js
async function tarefa() {
  console.log("início da tarefa");   // roda na hora
  await null;                        // pausa aqui
  console.log("depois do await");    // vira microtask
}
console.log("antes");
tarefa();
console.log("depois");
// antes, início da tarefa, depois, depois do await
```

### 1.4 O pior pecado: bloquear o loop

Como só há uma linha de execução, um laço demorado **congela tudo**: no navegador, a página para de responder a
cliques e de se redesenhar; no Node, o servidor para de atender as pessoas.

```js
// ❌ trava a página por 3 segundos
const fim = Date.now() + 3000;
while (Date.now() < fim) {}
```

Regras: nunca faça trabalho pesado direto no loop principal. Divida em pedaços, use as APIs assíncronas do ambiente
(`fetch`, `setTimeout`), ou mova para um *Worker* (thread separada; fora do escopo do curso). Por isso, em Node, também
se prefere `fs/promises` (assíncrono) às versões `Sync` em servidores (as versões `Sync` que usamos no módulo 03
servem para scripts de terminal, onde bloquear não faz mal).

> ✏️ **Pratique agora — Exercício 01: em que ordem o código executa?**
>
> Abra `exercicios/05-js-assincrono/01-ordem-de-execucao.js`. Você **prevê** a saída de três trechos com timers,
> promises e `await`, e o teste executa os trechos de verdade para conferir a sua previsão.
>
> ```bash
> npm run exercicio -- 01-ordem
> ```

---

## 2. Promises

### 2.1 Do callback ao "callback hell"

A forma antiga de lidar com o assíncrono é o **callback**: você entrega uma função para ser chamada quando a
operação terminar. Com uma operação, é simples. Com várias, em sequência, vira uma escada:

```js
buscarUsuario(1, (erro, usuario) => {
  if (erro) return tratar(erro);
  buscarPedidos(usuario.id, (erro, pedidos) => {
    if (erro) return tratar(erro);
    buscarItens(pedidos[0].id, (erro, itens) => {
      if (erro) return tratar(erro);
      // ...mais um nível...
    });
  });
});
```

É o *callback hell* (ou "pirâmide da perdição"): difícil de ler, e cada nível repete o tratamento de erro. Foi
para resolver isso que nasceram as **Promises**.

### 2.2 O que é uma Promise

Uma **Promise** é um objeto que representa **um valor que ainda não existe, mas vai existir** (ou a falha em obtê-lo).
Ela está sempre em um de três estados:

```
pending  (pendente)  ──▶  fulfilled (cumprida, com um valor)
                     └──▶  rejected  (rejeitada, com um erro)
```

Depois de cumprida ou rejeitada, **nunca mais muda**. Você *consome* uma promise com:

```js
const promessa = fetch("https://exemplo.com/dados");     // pendente...

promessa
  .then((resposta) => resposta.json())      // roda se cumprir; o retorno vira a próxima promise
  .then((dados) => console.log(dados))
  .catch((erro) => console.error(erro))     // roda se QUALQUER etapa acima falhar
  .finally(() => esconderIndicadorDeCarregamento());   // roda sempre, deu certo ou errado
```

Cada `.then` **retorna uma nova promise**, o que permite encadear. Se o callback do `.then` devolve outra promise,
a cadeia espera por ela. Se alguém lança um erro, a cadeia "pula" até o próximo `.catch`.

### 2.3 Criando uma Promise

Você cria uma com `new Promise`, recebendo duas funções: `resolve` (deu certo, com o valor) e `reject` (deu errado, com o erro).

```js
function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);         // chama resolve() depois de ms milissegundos
  });
}

esperar(1000).then(() => console.log("passou 1 segundo"));
```

Esse `esperar` é a "pausa" do mundo assíncrono e você vai usá-lo o tempo todo (`await esperar(500)`).

**Transformando um callback antigo em promise** (*promisificar*): é o jeito de "modernizar" código no estilo Node, em que
o último argumento é um callback `(erro, resultado) => {}`.

```js
function lerArquivoAntigo(caminho, callback) { /* ... */ }

function lerArquivo(caminho) {
  return new Promise((resolve, reject) => {
    lerArquivoAntigo(caminho, (erro, conteudo) => {
      if (erro) reject(erro);
      else resolve(conteudo);
    });
  });
}
```

**Atalhos** úteis: `Promise.resolve(valor)` cria uma promise já cumprida e `Promise.reject(erro)` uma já rejeitada.

### 2.4 Controlando o tempo: timeout

Uma operação que demora demais deve ser abandonada. O padrão é "corrida" entre a operação e um timer:

```js
function comTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Tempo esgotado")), ms);
    promise.then(
      (valor) => { clearTimeout(timer); resolve(valor); },   // terminou a tempo: cancela o timer
      (erro) => { clearTimeout(timer); reject(erro); },
    );
  });
}
```

Sempre **limpe o timer** quando a operação terminar antes: um timer esquecido mantém o programa vivo e é um pequeno
vazamento. (A forma moderna de fazer isso com `fetch` é `AbortSignal.timeout(ms)`, na seção 4.)

> ✏️ **Pratique agora — Exercício 02: Promises**
>
> Abra `exercicios/05-js-assincrono/02-promises.js`. Escreva `esperar`, `promisificar`, `comTimeout` e `emSequencia`.
>
> ```bash
> npm run exercicio -- 02-promises
> ```

---

## 3. `async` e `await`

### 3.1 O mesmo, lendo como código normal

`async/await` é uma sintaxe que faz código com Promises **parecer** código síncrono, sem mudar o que acontece por baixo:

```js
// Com .then
function carregarItens() {
  return buscarUsuario(1)
    .then((usuario) => buscarPedidos(usuario.id))
    .then((pedidos) => buscarItens(pedidos[0].id));
}

// Com async/await: a mesma coisa, legível
async function carregarItens() {
  const usuario = await buscarUsuario(1);
  const pedidos = await buscarPedidos(usuario.id);
  return buscarItens(pedidos[0].id);
}
```

As regras:

- Uma função `async` **sempre retorna uma Promise**: o valor que você retorna vira o resultado dela, e um erro lançado vira rejeição.
- `await promise` **pausa a função** até a promise terminar e entrega o valor (ou lança o erro, se rejeitada). Só funciona dentro de funções `async`,
  ou no nível de cima de um **módulo ES** (*top-level await*), como nos arquivos de teste do curso.
- Pausar a **função** não pausa o **programa**: enquanto ela espera, o event loop segue atendendo o resto.
- Esquecer o `await` é um erro clássico: você fica com uma promise pendente em vez do valor.

```js
const dados = buscarDados();          // ❌ dados é uma Promise, e não os dados
const dados = await buscarDados();    // ✅
```

### 3.2 Erros e tentar de novo

Com `async/await`, erros são tratados com o `try/catch` que você já conhece:

```js
async function carregarPerfil(id) {
  try {
    const usuario = await buscarUsuario(id);
    return usuario;
  } catch (erro) {
    console.error("Não consegui carregar:", erro.message);
    return null;
  } finally {
    esconderCarregando();      // roda sempre
  }
}
```

Atenção a um detalhe: para um erro da promise ser capturado **dentro** do `try`, você precisa do `await` **dentro** dele.
`return buscarUsuario(id)` (sem await) devolve a promise e o erro escapa do `catch`; use `return await buscarUsuario(id)`.

**Rejeições não tratadas.** Uma promise rejeitada que ninguém captura gera um erro "não tratado" (no Node recente, derruba o processo; no
navegador, aparece no console como `Uncaught (in promise)`). Toda cadeia ou função `async` precisa terminar em algum `catch`
(ou em quem a chamou).

#### Retry com backoff exponencial

Redes falham: o Wi-Fi oscila, o servidor reinicia, a API limita requisições. Muitas dessas falhas **somem sozinhas** em
instantes. A solução é **tentar de novo**, mas com inteligência:

- **Poucas vezes** (3 a 5), para não insistir para sempre.
- **Esperando entre as tentativas**, e esperando **mais a cada falha** (*backoff* exponencial: 100 ms, 200 ms, 400 ms...). Se mil clientes
  repetirem imediatamente uma API que está caindo, eles a derrubam de vez.
- **Só para falhas que podem passar**: erro de rede e erros 5xx do servidor. Um `404` ("não existe") ou `400` ("você mandou errado") **não** vão
  mudar na segunda tentativa: repetir só desperdiça tempo. Cancelamento (`AbortError`) também **nunca** se repete.

```js
const pausa = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function tentarNovamente(funcao, opcoes = {}) {
  const { tentativas = 3, esperaInicialMs = 100, fator = 2, tentarSe = () => true, esperar = pausa } = opcoes;
  let espera = esperaInicialMs;
  for (let tentativa = 1; ; tentativa++) {
    try {
      return await funcao(tentativa);
    } catch (erro) {
      const ultima = tentativa >= tentativas;
      if (ultima || !tentarSe(erro)) throw erro;     // desiste: lança o erro desta tentativa
      await esperar(espera);
      espera *= fator;                                // 100 → 200 → 400...
    }
  }
}
```

Repare no `esperar` **recebido por parâmetro**: nos testes, passamos uma função que não espera de verdade.

> ✏️ **Pratique agora — Exercício 03: tentar de novo**
>
> Abra `exercicios/05-js-assincrono/03-tentar-novamente.js`. Escreva o `tentarNovamente` com backoff exponencial e a opção de
> desistir de erros que não adianta repetir. Você vai reutilizá-lo no projeto.
>
> ```bash
> npm run exercicio -- 03-tentar
> ```

### 3.3 Sequencial ou paralelo?

Cada `await` **espera** antes de seguir. Se as operações não dependem uma da outra, esperar uma por uma desperdiça tempo:

```js
// ❌ Sequencial: leva 300 + 300 + 300 = 900 ms
const a = await buscarA();     // 300 ms
const b = await buscarB();     // 300 ms
const c = await buscarC();     // 300 ms

// ✅ Paralelo: leva ~300 ms (o tempo da mais lenta)
const [a, b, c] = await Promise.all([buscarA(), buscarB(), buscarC()]);
```

A diferença é que, no segundo caso, as três operações **começam todas ao mesmo tempo** (as chamadas `buscarA()` etc. iniciam
a operação), e o `await` espera por todas. Os combinadores de promises:

| Combinador | Espera | Resultado | Se alguma falhar |
| --- | --- | --- | --- |
| `Promise.all([...])` | **todas** | array dos valores, na ordem original | rejeita **na hora** com o primeiro erro |
| `Promise.allSettled([...])` | **todas** | array de `{ status: "fulfilled", value }` ou `{ status: "rejected", reason }` | nunca rejeita |
| `Promise.race([...])` | a **primeira que terminar** (certo ou errado) | o resultado dela | se a primeira foi uma falha, rejeita |
| `Promise.any([...])` | a **primeira que der certo** | o valor dela | só rejeita se **todas** falharem (`AggregateError`) |

Quando usar cada um:

- **`all`**: precisa de tudo para seguir (uma tela que depende de usuário + pedidos + endereço).
- **`allSettled`**: quer o máximo possível e tolera falhas parciais (um painel em que cada cartão pode falhar sem derrubar os outros).
- **`race`**: timeout ("o que acabar primeiro: a busca ou o relógio").
- **`any`**: várias fontes redundantes ("pergunte a três servidores espelho e use o primeiro que responder").

```js
const resultados = await Promise.allSettled([buscarA(), buscarB(), buscarC()]);
const deuCerto = resultados.filter((r) => r.status === "fulfilled").map((r) => r.value);
const falharam = resultados.filter((r) => r.status === "rejected").map((r) => r.reason.message);
```

**Paralelismo tem limite.** Disparar 500 requisições de uma vez pode derrubar a API, ser bloqueado (*rate limit*, erro `429`)
ou travar o navegador. A solução é processar em **lotes**: um grupo de cada vez.

```js
async function emLotes(itens, tamanho, processar) {
  const resultados = [];
  for (let inicio = 0; inicio < itens.length; inicio += tamanho) {
    const lote = itens.slice(inicio, inicio + tamanho);
    resultados.push(...(await Promise.all(lote.map(processar))));   // o lote em paralelo, um lote por vez
  }
  return resultados;
}
```

> ✏️ **Pratique agora — Exercício 04: paralelismo**
>
> Abra `exercicios/05-js-assincrono/04-paralelismo.js`. Some em paralelo, separe sucessos e falhas, pegue a fonte mais rápida
> e processe em lotes. Os testes **medem o tempo** com o relógio falso.
>
> ```bash
> npm run exercicio -- 04-paralelismo
> ```

### 3.4 Armadilhas do `async/await`

**1. `forEach` não espera.** O `forEach` ignora a promise que o callback `async` devolve:

```js
itens.forEach(async (item) => {
  await salvar(item);            // ❌ o forEach não espera por isso
});
console.log("terminei");         // roda ANTES de salvar qualquer coisa

for (const item of itens) {
  await salvar(item);            // ✅ um de cada vez, esperando
}
await Promise.all(itens.map(salvar));   // ✅ todos em paralelo
```

**2. `await` dentro de laço é sequencial.** Às vezes é o que você quer (cada passo depende do anterior), às vezes é lentidão
desnecessária. Pergunte: "essas operações dependem umas das outras?".

**3. Retornar sem `await` dentro de `try/catch`** (seção 3.2): o erro escapa do catch.

**4. Promise não esperada.** Chamar uma função `async` sem `await` e sem `.catch` deixa os erros dela "soltos" (rejeição não tratada).

**5. Misturar `.then` e `await` no mesmo trecho** costuma confundir. Escolha um estilo por função; `async/await` é o padrão do mercado.

---

## 4. Consumindo APIs com `fetch`

Uma **API** (*Application Programming Interface*), no contexto web, é um servidor que entrega **dados** (normalmente em JSON) em vez de
páginas. É assim que apps de celular, sites e sistemas conversam. O `fetch` é a ferramenta do navegador (e do Node) para chamar APIs.

### 4.1 O primeiro GET

```js
const resposta = await fetch("https://viacep.com.br/ws/01001000/json/");
const endereco = await resposta.json();
console.log(endereco.logradouro);     // "Praça da Sé"
```

Duas etapas, ambas assíncronas: o `fetch` entrega a **resposta** assim que os cabeçalhos chegam; o `.json()` lê o **corpo** e o converte. (Existem
`.text()` para texto puro, `.blob()` para arquivos e `.formData()`.)

### 4.2 A pegadinha número 1: `fetch` não rejeita para erros HTTP

O `fetch` só **rejeita** quando a comunicação falha (sem internet, servidor fora do ar, bloqueio de CORS). Se o servidor responde,
**mesmo com "404 Não encontrado" ou "500 Erro interno"**, para o `fetch` isso é um **sucesso**:

```js
const resposta = await fetch("https://api.exemplo.com/nao-existe");
resposta.status;     // 404
resposta.ok;         // false  ← true só para status 200 a 299
```

Se você não conferir o `ok`, vai tentar ler como dados uma página de erro. Todo uso de `fetch` precisa de:

```js
if (!resposta.ok) throw new Error(`O servidor respondeu ${resposta.status}`);
```

### 4.3 Erros tipados e uma função de verdade

Uma função de qualquer app sério separa **três** tipos de problema, porque a tela reage a cada um de um jeito:

| Problema | Exemplo | Como a tela reage |
| --- | --- | --- |
| **Rede** | Sem internet; o `fetch` rejeita | "Sem conexão. Tente novamente." (vale repetir) |
| **HTTP** | 404, 400, 500, 503 | Depende: 404 "não encontrado"; 5xx "serviço indisponível" (vale repetir) |
| **Resposta inválida** | Status 200, mas o corpo não é JSON | "Resposta inesperada" |
| *(cancelamento)* | `AbortController.abort()` | Nada: foi de propósito |

Por isso criamos **classes de erro** (módulo 03) para cada um:

```js
export class HttpError extends Error {
  constructor(status) {
    super(`O servidor respondeu ${status}`);
    this.name = "HttpError";
    this.status = status;
  }
}

export class RedeError extends Error {
  constructor(causa) {
    super("Falha de rede. Verifique sua conexão.");
    this.name = "RedeError";
    this.causa = causa;            // guarda o erro original para quem quiser investigar
  }
}

export async function buscarJson(url, { fetch, signal, headers } = {}) {
  let resposta;
  try {
    resposta = await fetch(url, { signal, headers });
  } catch (erro) {
    if (erro.name === "AbortError") throw erro;   // cancelamento de propósito: não é falha de rede
    throw new RedeError(erro);
  }
  if (!resposta.ok) throw new HttpError(resposta.status);
  try {
    return await resposta.json();
  } catch {
    throw new Error("Resposta inválida do servidor");
  }
}
```

**Enviando dados** (POST, PUT, PATCH, DELETE) com JSON:

```js
await fetch("https://api.exemplo.com/tarefas", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ titulo: "Estudar" }),
});
```

- `Content-Type: application/json` avisa o servidor de que o corpo é JSON.
- `Authorization: Bearer <token>` é o jeito padrão de enviar um token de login (módulo 15).
- O `body` é **texto**: converta com `JSON.stringify`. Em `GET` e `DELETE` normalmente não há `body`.
- Resposta `204 No Content` não tem corpo: não chame `.json()` nela.

> ✏️ **Pratique agora — Exercício 05: `fetch` com erros bem tratados**
>
> Abra `exercicios/05-js-assincrono/05-fetch-basico.js`. Escreva `HttpError`, `RedeError`, `buscarJson` e `enviarJson`. O `fetch`
> chega por parâmetro e os testes usam respostas falsas feitas com a classe `Response` do próprio Node.
>
> ```bash
> npm run exercicio -- 05-fetch
> ```

### 4.4 Um cliente de API reutilizável

Espalhar `fetch` pelo código, cada um com sua URL base, seu token e seu tratamento de erro, é um convite a bugs. Empresas
criam **um cliente** que concentra tudo isso e expõe métodos simples (`api.get(...)`, `api.post(...)`):

```js
export function criarClienteApi({ baseUrl, fetch, token }) {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  function montarUrl(caminho, parametros = {}) {
    const query = new URLSearchParams();                   // codifica acentos, espaços e símbolos sozinho
    for (const [chave, valor] of Object.entries(parametros)) {
      if (valor !== undefined && valor !== null && valor !== "") query.set(chave, String(valor));
    }
    const texto = query.toString();
    return `${baseUrl}${caminho}${texto ? `?${texto}` : ""}`;
  }

  return {
    get: (caminho, parametros, { signal } = {}) => buscarJson(montarUrl(caminho, parametros), { fetch, signal, headers }),
    post: (caminho, dados) => enviarJson(`${baseUrl}${caminho}`, dados, { fetch, token, metodo: "POST" }),
    // ...
  };
}

const api = criarClienteApi({ baseUrl: "https://api.exemplo.com/v1", fetch, token });
const produtos = await api.get("/produtos", { categoria: "casa e jardim", pagina: 2 });
```

Vantagens: **um lugar só** para mudar a URL, o token ou a política de erros; os testes trocam o `fetch` e verificam o que foi enviado; e quem usa o
cliente nem sabe que existe `fetch` por baixo.

Note os parâmetros com `0` e `false`: eles **valem** e não podem ser descartados junto com os vazios (`!== undefined`, não `if (valor)`).

> ✏️ **Pratique agora — Exercício 06: cliente de API**
>
> Abra `exercicios/05-js-assincrono/06-cliente-api.js`. Monte o cliente reutilizando as funções do exercício 05.
>
> ```bash
> npm run exercicio -- 06-cliente
> ```

### 4.5 CORS: por que o navegador às vezes "bloqueia" a API

Por segurança, o navegador **só deixa uma página ler respostas de outro site** se esse site permitir (cabeçalho
`Access-Control-Allow-Origin` na resposta). Isso se chama **CORS**. Se a API não permitir, o `fetch` **rejeita** com um erro
genérico (`TypeError: Failed to fetch`), **igualzinho** a quando a internet está desligada. Você só descobre a diferença olhando o Console do
DevTools, que explica o bloqueio.

- A solução está **sempre no servidor** (a API precisa liberar a sua origem), nunca no seu `fetch`. Para APIs que não liberam, você cria o seu próprio servidor
  intermediário (um *proxy*, módulo 12) que chama a API no lugar do navegador. (Servidores não sofrem CORS.)
- As APIs usadas no curso (AwesomeAPI, ViaCEP) liberam CORS.
- **Nunca** coloque chaves secretas de API no JavaScript do navegador: qualquer pessoa vê no DevTools. Chaves secretas vivem no servidor.

### 4.6 `fetch` como dependência: o erro "Illegal invocation"

Como o seu código recebe o `fetch` por parâmetro, você pode ficar tentado a guardá-lo e chamá-lo como método:

```js
class Cliente {
  constructor({ fetch }) { this.fetch = fetch; }
  buscar(url) { return this.fetch(url); }       // ❌ no navegador: TypeError: Illegal invocation
}
```

O `fetch` do navegador precisa ser chamado com `this` sendo a `window`. Chamar `this.fetch(url)` troca o `this` para o objeto `Cliente`.
Duas soluções seguras: chamar como função solta (`const { fetch } = this; fetch(url)`) ou entregar um **embrulho** na hora de ligar o app:

```js
// main.js
iniciarPainel(raiz, { fetch: (...argumentos) => fetch(...argumentos) });
```

Setas ignoram o `this`, então o embrulho sempre funciona. (O projeto deste módulo usa os dois cuidados.)

### 4.7 Timeout e outras ferramentas do `AbortSignal`

```js
const resposta = await fetch(url, { signal: AbortSignal.timeout(5000) });     // cancela sozinho depois de 5 s
```

Um timeout cancelado lança um erro de nome `TimeoutError` (diferente do `AbortError` de um `abort()` manual).
Para cancelar por **qualquer um de vários motivos**, existe `AbortSignal.any([signalA, signalB])`.

### 4.8 APIs públicas para treinar

| API | Dados | Observação |
| --- | --- | --- |
| **ViaCEP** (viacep.com.br) | Endereço por CEP | Sem chave; CEP inexistente responde **200** com `{ "erro": "true" }` |
| **AwesomeAPI** (economia.awesomeapi.com.br) | Cotações de moedas | Sem chave; números como texto |
| **BrasilAPI** (brasilapi.com.br) | CEP, bancos, feriados, CNPJ | Sem chave |
| **IBGE Dados** (servicodados.ibge.gov.br) | Estados, municípios | Sem chave |
| **Open-Meteo** (open-meteo.com) | Previsão do tempo | Sem chave |
| **PokéAPI**, **REST Countries**, **JSONPlaceholder** | Pokémons, países, dados falsos para testes | Sem chave |

Antes de usar uma API: **leia a documentação**, veja um exemplo real de resposta no navegador (cole a URL na barra de endereço) e
anote as pegadinhas (números como texto, formatos de data, erros que vêm com status 200).

---

## 5. Telas que buscam dados

### 5.1 Os quatro estados

Toda tela que consome uma API passa por estados, e **cada um precisa estar desenhado**:

| Estado | Quando | O que mostrar |
| --- | --- | --- |
| **inicial** | Antes de buscar | Instrução ("Digite um CEP") |
| **carregando** | Esperando a resposta | Indicador de progresso; botões desabilitados |
| **sucesso** | Chegou | Os dados |
| **vazio** | Chegou, mas sem resultados | "Nenhum resultado" (diferente de erro!) |
| **erro** | Deu errado | Mensagem **útil** e uma forma de tentar de novo |

Mostrar o estado certo é o que faz um app parecer profissional. O pior caso é o botão que não faz nada visível por 3 segundos.

O padrão do código é manter o estado em **um lugar** (o atributo `data-estado` e o texto), e deixar o CSS pintar:

```js
function mostrar(nome, texto) {
  estado.dataset.estado = nome;      // "carregando" | "sucesso" | "erro"
  estado.textContent = texto;        // role="status": o leitor de tela anuncia a mudança
}
```

```css
#estado[data-estado="erro"] { color: #b00020; }
#estado[data-estado="carregando"]::before { content: "⏳ "; }
```

**Mensagens de erro úteis** dizem o que houve e o que fazer: "Sem conexão. Tente novamente." é melhor que "Erro 0"; "CEP não encontrado" é melhor que
"Erro". Mapeie cada **tipo** de erro (rede, HTTP, resposta inválida) para uma mensagem; e lembre da regra do módulo 03: erros **esperados** viram mensagem,
erros **inesperados** (bugs) devem subir.

### 5.2 Condição de corrida e cancelamento

Imagine uma busca que consulta o servidor a cada letra digitada:

```
digita "ja"   → requisição A (lenta: 900 ms)
digita "java" → requisição B (rápida: 200 ms)

chega B → tela mostra resultados de "java"  ✅
chega A → tela mostra resultados de "ja"    ❌  (a resposta velha sobrescreveu a nova!)
```

As respostas chegam **fora de ordem**. Isso é uma **condição de corrida** (*race condition*), e é um dos bugs mais comuns e mais difíceis de
reproduzir em apps reais (acontece só quando a rede está lenta, justamente quando o usuário reclama).

A solução tem duas partes:

1. **Cancelar** a requisição anterior quando começa uma nova, com `AbortController`:

   ```js
   let controlador = null;

   async function pesquisar(termo) {
     controlador?.abort();                       // cancela a busca anterior
     controlador = new AbortController();        // um controlador novo para esta busca
     const meu = controlador;

     try {
       const dados = await buscarJson(url(termo), { fetch, signal: meu.signal });
       if (meu !== controlador) return;          // 2. mesmo cancelada, a resposta pode ter chegado: ignore se não for a mais nova
       mostrar(dados);
     } catch (erro) {
       if (erro.name === "AbortError" || meu !== controlador) return;   // cancelamento não é erro
       mostrarErro(erro);
     }
   }
   ```

2. **Ignorar** qualquer resposta que não seja da busca mais recente (o `if (meu !== controlador)`). O cancelamento sozinho **não basta**: uma resposta
   pode ter chegado antes do `abort()`, ou a função de busca pode nem respeitar o `signal`.

O `AbortController` funciona assim: `controlador.signal` é entregue ao `fetch`; chamar `controlador.abort()` faz o `fetch` rejeitar com um erro de nome `AbortError`.
O cancelamento também **economiza dados e bateria**, porque o navegador interrompe a requisição.

O mesmo padrão resolve: busca ao vivo, troca rápida de abas que carregam dados, "carregar mais" clicado várias vezes e navegação entre páginas.

> ✏️ **Pratique agora — Exercício 07: busca cancelável**
>
> Abra `exercicios/05-js-assincrono/07-busca-cancelavel.js`. Construa a função que cancela a busca antiga e ignora respostas velhas.
> Os testes provocam a situação de propósito: a resposta nova chega **antes** da velha.
>
> ```bash
> npm run exercicio -- 07-busca
> ```

### 5.3 Juntando tudo: a busca de CEP

Um formulário de endereço que se preenche sozinho a partir do CEP é um dos recursos mais úteis em sites brasileiros. Ele exercita tudo o que você
viu até aqui: validação local antes de gastar uma requisição, estados de tela, tratamento de cada tipo de erro, desabilitar o botão durante a busca,
e a condição de corrida se a pessoa corrigir o CEP durante a espera.

Uma pegadinha comum de APIs: a **ViaCEP responde `200` com `{ "erro": "true" }`** quando o CEP não existe. Para o `fetch`, isso é sucesso;
o seu código tem que olhar o **conteúdo**.

> ✏️ **Pratique agora — Exercício 08: busca de CEP**
>
> Abra `exercicios/05-js-assincrono/08-busca-cep.js`. É o maior exercício da primeira metade do módulo: estados da tela, mensagens por tipo de erro, botão
> desabilitado e proteção contra a condição de corrida.
>
> ```bash
> npm run exercicio -- 08-busca-cep
> ```

---

## 6. Classes e programação orientada a objetos

### 6.1 Para que servem

Até aqui você agrupou dados e comportamento em **funções que retornam objetos** (como `criarContador`, no módulo 03). Uma **classe** é outra forma
de fazer isso, mais adequada quando você precisa de **várias instâncias** do mesmo "tipo" de coisa, cada uma com o seu estado interno e o seu conjunto de comportamentos:
uma conta bancária, um carrinho, um cliente de API, um cache, um emissor de eventos.

### 6.2 A sintaxe

```js
class Conta {
  #saldo = 0;                          // campo PRIVADO: só existe dentro da classe
  static totalContas = 0;              // campo ESTÁTICO: da classe, e não de cada objeto

  constructor(titular) {               // roda em "new Conta(...)"
    this.titular = titular;            // campo público
    Conta.totalContas++;
  }

  get saldo() {                        // getter: lido como propriedade (conta.saldo), sem parênteses
    return this.#saldo;
  }

  depositar(valor) {                   // método
    if (valor <= 0) throw new Error("Valor inválido");
    this.#saldo += valor;
    return this;                       // permite encadear: conta.depositar(10).depositar(20)
  }

  static comSaldo(titular, saldo) {    // método ESTÁTICO: chamado na classe (Conta.comSaldo(...))
    return new Conta(titular).depositar(saldo);
  }
}

const conta = new Conta("Ana");        // "new" cria uma instância
conta.depositar(100);
conta.saldo;                            // 100
conta.#saldo;                           // ❌ SyntaxError: campo privado
conta instanceof Conta;                 // true
```

As peças:

| Peça | O que é |
| --- | --- |
| `constructor` | Inicializa cada nova instância; roda em `new` |
| `this` | A instância que está executando o método |
| **Campos públicos** (`titular`) | Visíveis e alteráveis por qualquer um |
| **Campos privados** (`#saldo`) | Só acessíveis **dentro** da classe: **encapsulamento de verdade** (o que se esconde não pode ser quebrado de fora) |
| **Getters/setters** (`get saldo()`, `set nome(v)`) | Propriedades "calculadas"; um getter sem setter é **somente leitura** |
| **Métodos** | Funções da instância (ficam compartilhadas, num protótipo) |
| **`static`** | Pertence à classe: fábricas, constantes, contadores |
| **Métodos privados** (`#validar() {}`) | Funções internas inacessíveis de fora |

**Por que privados?** Se `saldo` fosse público, qualquer parte do código poderia fazer `conta.saldo = 999999` e pular as validações. Com `#saldo`, a **única** forma
de mudar é pelos métodos (`depositar`, `sacar`), que aplicam as regras. A classe protege a própria **consistência**. Você escolhe o que fica visível: esse conjunto de
métodos e getters públicos é a **interface** da classe.

**Validação no construtor.** Um objeto nunca deve nascer inválido. Se faltar o nome, ou o preço for negativo, lance o erro **ali**: assim, qualquer `Produto` que exista no
programa é garantidamente válido.

**Retornar cópias.** Um getter que devolve o array interno (`get itens() { return this.#itens; }`) deixa qualquer um mexer nele por fora. Devolva uma **cópia** (`[...this.#itens]`).

### 6.3 `toJSON` e voltar do JSON

Instâncias de classe com campos privados viram `{}` em `JSON.stringify` (os campos privados não aparecem). Para controlar a conversão, defina `toJSON()`; e para
o caminho de volta, um método estático:

```js
class Produto {
  #id; #nome;
  constructor({ id, nome }) { this.#id = id; this.#nome = nome; }
  toJSON() { return { id: this.#id, nome: this.#nome }; }
  static deObjeto(objeto) { return new Produto(objeto); }
}

const texto = JSON.stringify(new Produto({ id: 1, nome: "Café" }));   // '{"id":1,"nome":"Café"}'
const volta = Produto.deObjeto(JSON.parse(texto));
```

> ✏️ **Pratique agora — Exercício 09: Produto e Carrinho**
>
> Abra `exercicios/05-js-assincrono/09-classes.js`. Modele um produto e um carrinho com campos privados, getters, métodos estáticos,
> validação e desconto por cupom.
>
> ```bash
> npm run exercicio -- 09-classes
> ```

### 6.4 Herança

Uma classe pode **estender** outra, herdando seus campos e métodos, e acrescentando ou trocando o que for diferente:

```js
class ContaPoupanca extends Conta {
  #taxaMensal;

  constructor(titular, taxaMensal) {
    super(titular);                    // OBRIGATÓRIO antes de usar "this": chama o construtor da classe pai
    this.#taxaMensal = taxaMensal;
  }

  renderJuros() {
    this.depositar(Math.round(this.saldo * this.#taxaMensal));
    return this;
  }
}

const poupanca = new ContaPoupanca("Bia", 0.01);
poupanca.depositar(10000);             // herdado de Conta
poupanca instanceof ContaPoupanca;     // true
poupanca instanceof Conta;             // true — uma poupança É UMA conta
```

- `extends` diz "é um tipo de". `super(...)` no construtor chama o construtor do pai; `super.metodo()` chama a versão do pai de um método que você sobrescreveu.
- **Sobrescrever** (*override*): declarar na filha um método com o mesmo nome do pai.
- Campos **privados (`#`) do pai não são visíveis na filha**. A filha usa os getters/métodos públicos do pai (`this.saldo`, `this.depositar(...)`) ou
  métodos "protegidos" por convenção, com nome começando por `_` (`_podeSacar`), que o pai oferece justamente para as filhas ajustarem.

### 6.5 Polimorfismo e composição

**Polimorfismo** ("muitas formas") é tratar objetos de tipos diferentes pela **mesma interface**, cada um respondendo ao seu jeito:

```js
function sacarDeTodas(contas, valor) {
  return contas.map((conta) => {
    try {
      conta.sacar(valor);                 // cada tipo de conta tem a sua regra de saque
      return `${conta.titular} (${conta.tipo}): ok`;
    } catch (erro) {
      return `${conta.titular} (${conta.tipo}): ${erro.message}`;
    }
  });
}
```

Quem chama `sacarDeTodas` **não precisa saber** se a conta é comum, poupança ou corrente: cada uma tem o seu `sacar`. Note a ausência de
`if (conta instanceof ContaCorrente)`. Quando você sente vontade de escrever uma cadeia de `if tipo === ...`, é sinal de que o polimorfismo resolveria melhor.

**Composição** diz que um objeto **tem** outros, em vez de **ser** um tipo deles:

```js
class Banco {
  #contas = [];
  abrir(conta) { this.#contas.push(conta); return conta; }
  get patrimonioCentavos() { return this.#contas.reduce((soma, c) => soma + c.saldo, 0); }
}
```

Um `Banco` **tem** contas; não é uma conta. A regra de bolso dos programadores experientes é **"prefira composição a herança"**:

- Hierarquias profundas (`A extends B extends C extends D`) ficam frágeis: mudar o `A` quebra tudo abaixo.
- Herança só vale quando a relação "é um" é verdadeira e estável (uma poupança **é uma** conta).
- Para compartilhar comportamento sem "é um", combine objetos pequenos.

Os **quatro pilares** da POO, para entrevistas:

| Pilar | Em uma frase | No código |
| --- | --- | --- |
| **Encapsulamento** | Esconder detalhes e proteger o estado | campos `#privados` + métodos públicos |
| **Abstração** | Expor só o essencial | a interface pública (`depositar`, `sacar`) |
| **Herança** | Reaproveitar um tipo especializando-o | `extends`, `super` |
| **Polimorfismo** | Mesma chamada, comportamentos diferentes | `conta.sacar()` em tipos diferentes |

> ✏️ **Pratique agora — Exercício 10: herança, polimorfismo e composição**
>
> Abra `exercicios/05-js-assincrono/10-heranca.js`. Contas comum, poupança e corrente; uma função polimórfica; e um `Banco` por composição.
>
> ```bash
> npm run exercicio -- 10-heranca
> ```

### 6.6 Classes que avisam: o EventEmitter

O padrão *publish/subscribe* do módulo 04 (a store) ganha uma forma clássica em classe: o **EventEmitter**. Ele é a base de quase tudo no Node (servidores
HTTP, streams, processos) e conceitualmente o mesmo `addEventListener` do navegador:

```js
const pedidos = new EventEmitter();

const cancelar = pedidos.on("novo", (pedido) => console.log("Cozinha recebeu", pedido));
pedidos.once("novo", () => console.log("primeiro pedido do dia!"));   // roda só uma vez

pedidos.emit("novo", { id: 1 });
cancelar();                                                            // para de ouvir
```

Dois detalhes que mostram maturidade:

- `emit` itera sobre uma **cópia** da lista de ouvintes. Senão, um ouvinte que se remove durante a emissão (como o `once`) faria o ouvinte seguinte ser pulado.
- `on` devolve a função que **cancela** a assinatura: é o jeito mais seguro de evitar vazamentos (ouvintes esquecidos, vivos para sempre).

> ✏️ **Pratique agora — Exercício 11: seu EventEmitter**
>
> Abra `exercicios/05-js-assincrono/11-event-emitter.js`. Construa `on`, `once`, `off`, `emit` e `listenerCount` com um `Map` privado.
>
> ```bash
> npm run exercicio -- 11-event
> ```

### 6.7 O `this` e os métodos soltos

O `this` de um método é decidido **na hora da chamada**. Se você tira o método do objeto e o passa como callback, ele perde o contexto:

```js
class Contador {
  valor = 0;
  incrementar() { this.valor++; }
}

const c = new Contador();
botao.addEventListener("click", c.incrementar);       // ❌ this vira o botão (ou undefined): não é o Contador
botao.addEventListener("click", () => c.incrementar()); // ✅ arrow: chama como método de "c"
botao.addEventListener("click", c.incrementar.bind(c)); // ✅ bind fixa o this
```

Uma terceira saída é declarar o método como **campo com arrow function**, que já carrega o `this` da instância (ao custo de uma cópia da função por instância):

```js
class Contador {
  valor = 0;
  incrementar = () => { this.valor++; };
}
```

### 6.8 Por baixo das classes: protótipos

`class` é uma sintaxe mais clara sobre o mecanismo real do JavaScript: a **herança por protótipos**. Todo objeto tem um protótipo (outro objeto) para o qual
"pergunta" quando não encontra uma propriedade:

```js
const conta = new Conta("Ana");
Object.getPrototypeOf(conta) === Conta.prototype;     // true: os métodos ficam em Conta.prototype, compartilhados
typeof Conta;                                          // "function": a classe é uma função
```

`conta.depositar(...)` → o JavaScript procura `depositar` no objeto, não acha, procura no protótipo (`Conta.prototype`), acha. Se não achasse, subiria para o protótipo do protótipo
(a *cadeia de protótipos*) até `Object.prototype`. Entender isso explica `instanceof`, `extends` e muitos comportamentos estranhos da linguagem.

### 6.9 Quando **não** usar classes

Classes não são obrigatórias. O ecossistema JavaScript moderno (React com funções, por exemplo) prefere **funções e objetos simples**. Use classes quando:

- há **estado interno** que precisa de proteção e **identidade** (cada instância é "uma coisa"): conta, carrinho, cache, cliente;
- você precisa de **muitas instâncias** com o mesmo comportamento;
- a **hierarquia "é um"** é natural e estável.

Para transformações de dados (calcular, validar, formatar), use **funções puras**: são mais simples de testar e de combinar. O projeto deste módulo usa as
duas coisas, cada uma onde faz sentido: classes para o cliente da API e para o cache, funções puras para as regras de conversão.

---

## 7. `Map`, `Set` e caches

### 7.1 `Map`

Um `Map` guarda pares chave → valor. Diferente de um objeto comum, a chave pode ser de **qualquer tipo** (número, objeto, função), ele **lembra a ordem de inserção**,
conhece o próprio tamanho (`map.size`) e não tem as propriedades "herdadas" que fazem de um objeto uma má tabela (`{}["toString"]` existe!).

```js
const visitas = new Map();
visitas.set("/home", 10);
visitas.set("/sobre", 3);

visitas.get("/home");            // 10
visitas.get("/contato");         // undefined
visitas.has("/sobre");           // true
visitas.delete("/sobre");        // true
visitas.size;                    // 1

for (const [pagina, total] of visitas) console.log(pagina, total);    // percorre em ordem de inserção
[...visitas.keys()];  [...visitas.values()];  [...visitas.entries()];
new Map(Object.entries({ a: 1 }));   Object.fromEntries(visitas);      // vai e volta com objetos
```

**Objeto ou Map?** Objeto para dados com formato conhecido e fixo (um usuário: `{ nome, email }`); `Map` para coleções que crescem e mudam, com chaves
desconhecidas ou que não são texto (contagens, agrupamentos, caches).

**Contar e agrupar** são usos clássicos:

```js
const frequencia = new Map();
for (const palavra of palavras) frequencia.set(palavra, (frequencia.get(palavra) ?? 0) + 1);

const grupos = new Map();
for (const item of itens) {
  const chave = item.categoria;
  if (!grupos.has(chave)) grupos.set(chave, []);
  grupos.get(chave).push(item);
}
```

### 7.2 `Set`

Um `Set` guarda **valores únicos**. Adicionar o que já existe não faz nada. É a ferramenta para remover duplicados e para perguntas "este item está no grupo?"
**muito rápidas** (`set.has(x)` é praticamente instantâneo; `array.includes(x)` percorre a lista toda).

```js
const tags = new Set(["js", "css", "js"]);
tags.size;           // 2
tags.add("html");  tags.has("css");  tags.delete("css");
[...new Set([3, 1, 3, 2, 1])];       // [3, 1, 2] — remove duplicados mantendo a ordem

const emB = new Set(b);
const interseccao = a.filter((x) => emB.has(x));       // elementos de a que também estão em b
const diferenca = a.filter((x) => !emB.has(x));        // elementos de a que NÃO estão em b
```

(Navegadores e Node recentes trazem também `a.intersection(b)`, `a.union(b)` e `a.difference(b)` nos próprios Sets.)

### 7.3 `WeakMap` e `WeakSet`

Mantêm **referências fracas**: as chaves precisam ser objetos, e se mais ninguém usar o objeto, o coletor de lixo pode apagar a entrada. Servem para
associar dados a objetos **sem impedir que eles sejam liberados da memória**. Você os verá em bibliotecas; conhecer o conceito basta por enquanto.

### 7.4 Um cache de verdade: TTL e LRU

**Cache** é guardar o resultado de algo caro (uma chamada de rede, uma conta pesada) para não repeti-lo. Um cache ingênuo (`{}` que só cresce) tem dois problemas
sérios: os dados ficam **velhos** e a memória **só aumenta**. O cache de produção resolve os dois:

- **TTL** (*time to live*): cada valor tem **prazo de validade**. Depois dele, é descartado e busca-se de novo.
- **LRU** (*least recently used*): quando enche, descarta o **menos recentemente usado**. Itens populares ficam, os esquecidos saem.

O truque do `Map` é que ele **lembra a ordem de inserção**. Para marcar um item como "usado agora", você o apaga e o insere de novo (vai para o fim). O
**primeiro** item do `Map` é sempre o menos recente:

```js
class CacheComTTL {
  #entradas = new Map();      // chave → { valor, guardadoEm }
  #ttlMs; #limite; #agora;

  constructor({ ttlMs, limite = Infinity, agora = Date.now }) {   // "agora" por parâmetro: o teste controla o tempo
    this.#ttlMs = ttlMs; this.#limite = limite; this.#agora = agora;
  }

  set(chave, valor) {
    this.#entradas.delete(chave);                                 // se já existia, sai (para reentrar no fim)
    this.#entradas.set(chave, { valor, guardadoEm: this.#agora() });
    while (this.#entradas.size > this.#limite) {
      this.#entradas.delete(this.#entradas.keys().next().value);  // descarta o primeiro: o menos recente
    }
    return this;
  }
  // get: confere se venceu (agora - guardadoEm >= ttl); se não, move para o fim e devolve
}
```

Detalhes que importam:

- **Valores falsy** (`0`, `""`, `false`, `null`) são valores válidos de cache. Cheque `entrada === undefined`, não `if (!valor)`.
- **Nunca guarde erros** no cache: uma falha momentânea ficaria "grudada" até o TTL vencer.
- **Chaves bem formadas**: a chave precisa conter *tudo* que muda o resultado (URL completa com parâmetros).
- Esse é exatamente o mecanismo por trás de bibliotecas como o TanStack Query (módulo 10) e dos caches de navegadores e CDNs.

> ✏️ **Pratique agora — Exercício 12: Map, Set e o cache**
>
> Abra `exercicios/05-js-assincrono/12-map-set-cache.js`. Frequência, conjuntos, agrupamento e a classe `CacheComTTL` (que o projeto reutiliza).
>
> ```bash
> npm run exercicio -- 12-map
> ```

---

## 8. Iteradores e geradores

### 8.1 O protocolo do iterável

Tudo que funciona com `for...of` e com `...` (arrays, strings, `Map`, `Set`) segue o mesmo **protocolo**: o objeto tem um método `[Symbol.iterator]()` que devolve um
**iterador**, um objeto com um método `next()` que devolve `{ value, done }` a cada chamada:

```js
const iterador = [10, 20][Symbol.iterator]();
iterador.next();     // { value: 10, done: false }
iterador.next();     // { value: 20, done: false }
iterador.next();     // { value: undefined, done: true }
```

Você pode fazer **qualquer** objeto seu ser iterável implementando `[Symbol.iterator]`. A forma mais fácil de escrever iteradores é com **geradores**.

### 8.2 Geradores: funções que pausam

Um **gerador** (`function*`) é uma função que pode **pausar** no meio com `yield` e continuar depois, entregando valores **um de cada vez, sob demanda**:

```js
function* contar() {
  yield 1;
  yield 2;
  yield 3;
}

for (const n of contar()) console.log(n);     // 1, 2, 3
[...contar()];                                 // [1, 2, 3]
```

Chamar `contar()` **não executa nada**: devolve um iterador. O código só avança até o próximo `yield` quando alguém pede o valor seguinte.
Isso permite coisas impossíveis com arrays:

```js
function* naturais() {
  let n = 1;
  while (true) yield n++;              // INFINITO, mas inofensivo: só calcula o que for pedido
}

function* pegar(iteravel, quantidade) {
  if (quantidade <= 0) return;
  let entregues = 0;
  for (const item of iteravel) {
    yield item;
    if (++entregues >= quantidade) return;      // encerra o gerador (e para de consumir a fonte)
  }
}

[...pegar(naturais(), 5)];             // [1, 2, 3, 4, 5]
```

Isso é **avaliação preguiçosa** (*lazy*): calcular só quando necessário. Bom para sequências enormes ou infinitas, para ler arquivos grandes linha a linha e
para paginar APIs. `yield*` delega para outro iterável: `yield* [1, 2, 3]`.

Para tornar uma **classe** iterável, o método `*[Symbol.iterator]()` é um gerador:

```js
class Fila {
  #itens = [];
  enfileirar(item) { this.#itens.push(item); return this; }
  *[Symbol.iterator]() { yield* this.#itens; }       // for (const x of fila) funciona
}
```

### 8.3 Geradores assíncronos: paginação

Muitas APIs entregam os dados **em páginas**. Um gerador **assíncrono** (`async function*`) combina `await` com `yield`, e se consome com **`for await...of`**:

```js
async function* paginas(buscarPagina) {
  let numero = 1;
  let temMais = true;
  while (temMais) {
    const pagina = await buscarPagina(numero);       // espera a rede
    yield pagina.itens;                               // entrega a página
    temMais = pagina.temMais;
    numero++;
  }
}

for await (const itens of paginas(buscarPagina)) {
  mostrar(itens);
  if (jaTenhoOSuficiente) break;                      // parar aqui NÃO busca as próximas páginas
}
```

A grande vantagem: o consumidor controla o ritmo. Se ele parar (`break`), nenhuma página a mais é buscada. É a base de "carregar mais" e do scroll infinito.

> ✏️ **Pratique agora — Exercício 13: geradores**
>
> Abra `exercicios/05-js-assincrono/13-geradores.js`. `intervalo`, `pegar`, `naturais`, uma `Fila` iterável e a paginação assíncrona.
>
> ```bash
> npm run exercicio -- 13-geradores
> ```

---

## 9. Timestamps e fuso horário

APIs de verdade enviam datas como **timestamps**, e mostrar a data certa para a pessoa é mais traiçoeiro do que parece.

### 9.1 O que é um timestamp

Um timestamp é um **instante** no tempo: a quantidade de segundos (ou milissegundos) desde 1º de janeiro de 1970 em UTC. Ele **não tem fuso horário**:
é o mesmo número para o mundo todo. Cuidado com a unidade:

| Fonte | Unidade | Para o `Date` do JavaScript |
| --- | --- | --- |
| `Date.now()`, `new Date().getTime()` | milissegundos | direto |
| Muitas APIs (AwesomeAPI, Unix, JWT) | **segundos** | multiplique por 1000: `new Date(ts * 1000)` |

Esquecer o `× 1000` mostra datas em janeiro de 1970.

### 9.2 O fuso aparece na hora de mostrar

O **mesmo instante** é uma data/hora diferente em cada lugar. `1792098492` é `2026-10-15 21:08:12` em UTC e **`18:08:12` em Brasília**. Pior: perto da
meia-noite, o **dia** muda. Um instante às 01:30 UTC de 16/10 ainda é **15/10 às 22:30** no Brasil. Se você mostrar a data em UTC, a pessoa vê o dia errado.

Por isso, escolha o fuso **explicitamente** ao formatar:

```js
const data = new Date(1792098492 * 1000);

data.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });           // "15/10/2026, 18:08:12" (pontuação pode variar com a versão)
data.toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });       // "2026-10-15"
data.toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" });           // "2026-10-15 18:08:12"
```

**O truque do `sv-SE`:** o formato da Suécia coincide com o ISO (`AAAA-MM-DD HH:mm:ss`), estável entre versões. É um jeito simples de obter as partes de uma data
em um fuso específico, sem bibliotecas:

```js
const [dia, hora] = data.toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).split(" ");
const [ano, mes, d] = dia.split("-");
`${d}/${mes}/${ano} ${hora.slice(0, 5)}`;       // "15/10/2026 18:08"
```

O nome do fuso (`"America/Sao_Paulo"`) vem da base de dados IANA e já sabe das regras de horário de verão do passado. O Brasil não usa horário de verão desde 2019, mas dados de anos anteriores ainda precisam disso.

### 9.3 Regras de bolso

1. **Guarde** datas como instantes em UTC (timestamp ou texto ISO com `Z`: `2026-10-15T21:08:12Z`).
2. **Converta para o fuso da pessoa só na hora de mostrar** (`toLocaleString` com `timeZone`).
3. Para datas **sem hora** (aniversário, vencimento), use o texto `AAAA-MM-DD` e evite criar `Date` (módulo 03, seção 9).
4. Em sistemas com agendamentos e vários países, use bibliotecas (**date-fns**, **Luxon**) ou a nova API **Temporal** do JavaScript.

---

## 10. Como o JavaScript funciona por baixo

Entender o ambiente de execução separa quem *usa* a linguagem de quem a *domina*. Os pontos que mais aparecem em entrevistas e em bugs reais:

**Pilha e memória.** A pilha guarda os dados das funções em execução (variáveis locais, onde voltar). Objetos, arrays e funções ficam no **heap**
(memória grande e desorganizada); as variáveis guardam **referências** para eles (por isso o valor/referência do módulo 03).

**Coleta de lixo (*garbage collection*).** O JavaScript libera sozinho a memória de tudo o que se tornou **inalcançável**: nenhuma variável, closure ou estrutura aponta mais para aquilo.
Você não libera memória à mão, mas **pode impedir a liberação sem querer**, causando **vazamentos de memória** (*memory leaks*). Os suspeitos de sempre:

| Vazamento | Por quê | Como evitar |
| --- | --- | --- |
| `setInterval` esquecido | O timer mantém a função (e tudo que ela referencia) viva para sempre | Guarde o id e dê `clearInterval`; retorne uma função `parar()` |
| Listeners que nunca saem | O alvo guarda a função, que guarda o resto | `removeEventListener`; funções de "cancelar assinatura" |
| Cache que só cresce | Nada o esvazia | TTL + limite, como o `CacheComTTL` |
| Globais e variáveis de módulo que acumulam | Vivem enquanto o programa viver | Guarde só o necessário; limpe |
| Closures segurando objetos grandes | A closure referencia tudo que usa | Não capture o que não precisa |

O DevTools tem a aba **Memory** para investigar (tire dois *snapshots* e compare).

**Coerção de tipos.** O JavaScript converte tipos automaticamente em certas operações, com resultados famosos:

```js
"5" + 3;        // "53"  (com + e uma string, vira concatenação)
"5" - 3;        // 2     (com - converte para número)
[] + {};        // "[object Object]"
[] == false;    // true
null == undefined;   // true — e por isso se usa ===
```

O objetivo não é decorar, e sim **entender por que usar `===`**, converter explicitamente (`Number(texto)`) e desconfiar de operações entre tipos diferentes.

**Contexto de execução e escopo.** Cada chamada de função cria um *contexto* com as suas variáveis e uma ligação com o escopo de fora (a cadeia de escopo). É daí que as closures tiram o
poder de "lembrar".

**Leitura recomendada** (gratuita): a série *You Don't Know JS Yet* (Kyle Simpson, no GitHub) e o site [javascript.info](https://javascript.info/) (as seções *Promises, async/await* e *Classes*).

---

## Projeto do módulo — Painel de câmbio

Enunciado completo: [projetos/05-painel-cambio/README.md](../projetos/05-painel-cambio/README.md).

Um painel com as **cotações reais** de dólar, euro e outras moedas em reais (AwesomeAPI), um **conversor** nos dois sentidos, o **histórico** dos últimos 7 dias e
**atualização automática**. Quando a internet cai, ele mostra a **última cotação salva** com um aviso, em vez de uma tela quebrada.

É o primeiro projeto que conversa com um serviço de verdade, e por isso concentra os problemas reais de qualquer app conectado: **retry** só para
falhas que podem passar, **cache** com prazo de validade, **cancelamento** da requisição antiga, **estados** de tela e dados que chegam em formatos estranhos
(números como texto, timestamps em segundos, datas em fuso diferente).

```bash
npm run corrigir-projeto -- 05 ../painel-cambio
```

---

## Resumo dos exercícios

Você já fez todos ao longo da aula. Confira com `npm run progresso`.

| # | Arquivo | Assunto | Seção |
| --- | --- | --- | --- |
| 01 | `01-ordem-de-execucao.js` | event loop, microtasks e macrotasks | 1 |
| 02 | `02-promises.js` | `esperar`, `promisificar`, `comTimeout`, sequência | 2 |
| 03 | `03-tentar-novamente.js` | retry com backoff exponencial | 3.2 |
| 04 | `04-paralelismo.js` | `all`, `allSettled`, `any` e lotes | 3.3 |
| 05 | `05-fetch-basico.js` | `fetch`, erros tipados, POST com JSON | 4.1–4.3 |
| 06 | `06-cliente-api.js` | cliente de API reutilizável | 4.4 |
| 07 | `07-busca-cancelavel.js` | `AbortController` e condição de corrida | 5.2 |
| 08 | `08-busca-cep.js` | os estados de uma tela com API (ViaCEP) | 5 |
| 09 | `09-classes.js` | classes, privados, getters, `static` | 6.1–6.3 |
| 10 | `10-heranca.js` | herança, polimorfismo e composição | 6.4–6.5 |
| 11 | `11-event-emitter.js` | seu próprio EventEmitter | 6.6 |
| 12 | `12-map-set-cache.js` | `Map`, `Set` e `CacheComTTL` | 7 |
| 13 | `13-geradores.js` | geradores, iteradores e paginação assíncrona | 8 |

---

## Checklist para avançar

- [ ] Prevejo a ordem de execução de código com timers, promises e `await`, e explico microtasks e macrotasks.
- [ ] Explico por que bloquear o event loop é um problema e como evitar.
- [ ] Crio, encadeio e converto Promises; uso `async/await` com `try/catch/finally`.
- [ ] Escolho entre sequencial e paralelo, e entre `all`, `allSettled`, `race` e `any`.
- [ ] Escrevo retry com backoff e sei **quais** erros não valem a pena repetir.
- [ ] Uso `fetch` conferindo `resposta.ok` e separo erros de rede, HTTP e resposta inválida.
- [ ] Sei o que é CORS e por que não se põe chave secreta no JavaScript do navegador.
- [ ] Cancelo requisições com `AbortController` e ignoro respostas velhas (condição de corrida).
- [ ] Desenho os estados carregando, sucesso, vazio e erro de uma tela que busca dados.
- [ ] Modelo problemas com classes: campos privados, getters, `static`, herança e composição, e sei quando **não** usar classe.
- [ ] Explico polimorfismo sem cadeias de `if` por tipo.
- [ ] Uso `Map` e `Set`, e construí um cache com TTL e descarte LRU.
- [ ] Escrevo geradores e consumo APIs paginadas com `for await`.
- [ ] Sei converter timestamps em segundos e mostrar a data no fuso certo.
- [ ] Reconheço os vazamentos de memória mais comuns (timers, listeners e caches sem fim).
- [ ] Os 13 exercícios passam (`npm run progresso`).
- [ ] O painel de câmbio passou na correção, está publicado no GitHub Pages e foi testado com a rede lenta e desligada no DevTools.
