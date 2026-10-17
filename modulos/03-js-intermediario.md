# Módulo 03 — JavaScript intermediário

> **Duração sugerida:** 3 a 4 semanas (ritmo regular).
> **Pré-requisito:** Módulo 02.
> **Projeto do módulo:** Analisador de extrato bancário, que importa o CSV do seu banco e mostra para onde vai o seu dinheiro.

## Objetivos

- Tratar funções como valores e usar callbacks.
- Manipular listas com os métodos de array que o mercado usa todos os dias: `map`, `filter`, `find`, `reduce`, `sort`...
- Transformar objetos, usar métodos e entender o `this`.
- Usar desestruturação, spread e rest, e entender a diferença entre valor e referência.
- Escrever código **imutável** (base do React).
- Entender escopo e closures, e criar `memoizar` e `debounce`.
- Organizar código em módulos e tratar erros com classes personalizadas.
- Validar e formatar dados com expressões regulares (CEP, telefone, CPF).
- Trabalhar com datas sem cair nas armadilhas de fuso horário.
- Ler e gravar arquivos JSON e CSV.

> Os exercícios aparecem nos blocos **✏️ Pratique agora**, logo depois de cada assunto.
> Resolva cada um assim que chegar nele, antes de continuar a leitura.
> Neste módulo também vale a regra: **sem IA para resolver** os exercícios.

---

## 1. Funções são valores

No módulo 02 você usou funções como "blocos com nome". Mas em JavaScript uma função é um
**valor**, como um número ou uma string. Isso quer dizer que dá para:

```js
// 1. guardar uma função numa variável
const dobrar = (n) => n * 2;

// 2. passar uma função como argumento para outra
function aplicar(numero, transformacao) {
  return transformacao(numero);
}
aplicar(5, dobrar);              // 10
aplicar(5, (n) => n + 1);        // 6  ← função criada na hora, sem nome

// 3. retornar uma função de dentro de outra
function criarSaudacao(saudacao) {
  return (nome) => `${saudacao}, ${nome}!`;
}
const bomDia = criarSaudacao("Bom dia");
bomDia("Ana");                   // "Bom dia, Ana!"
```

### Callbacks

Uma função passada como argumento para outra é chamada de **callback** ("chamar de volta"):
você entrega a função e quem recebeu decide **quando** e **com quais valores** chamá-la.

```js
function repetir(vezes, acao) {
  for (let i = 0; i < vezes; i++) {
    acao(i);                     // quem decide chamar é o repetir
  }
}

repetir(3, (i) => console.log(`Volta ${i}`));
// Volta 0
// Volta 1
// Volta 2
```

Por que isso é útil? Porque separa **o que se repete** (percorrer a lista) **do que muda**
(o que fazer com cada item). Você escreve o laço uma vez e reaproveita com qualquer ação.

Funções que recebem ou retornam funções têm um nome: **funções de alta ordem**. Todos os
métodos de array da próxima seção são funções de alta ordem.

**Cuidado com os parênteses:**

```js
aplicar(5, dobrar);      // ✅ passa a FUNÇÃO
aplicar(5, dobrar());    // ❌ chama dobrar() agora (com undefined) e passa o RESULTADO
```

> ✏️ **Pratique agora — Exercício 01: funções como valores**
>
> Abra `exercicios/03-js-intermediario/01-funcoes-como-valores.js`. Você vai escrever funções
> que recebem outras funções, como as da seção.
>
> ```bash
> npm run exercicio -- 01-funcoes
> ```

---

## 2. Métodos de array

No módulo 02 você percorreu arrays com `for`. Funciona, mas repete sempre a mesma estrutura:
criar um array vazio, fazer o laço, dar `push`. Os **métodos de array** fazem isso por você.
Eles recebem um callback, que é chamado para cada item com três argumentos:
`(item, indice, arrayOriginal)`. Quase sempre você só usa o primeiro.

Vamos usar esta lista nos exemplos:

```js
const produtos = [
  { id: 1, nome: "Notebook", preco: 4500, categoria: "eletronicos", estoque: 3 },
  { id: 2, nome: "Mouse", preco: 80, categoria: "eletronicos", estoque: 0 },
  { id: 3, nome: "Cadeira", preco: 1200, categoria: "moveis", estoque: 5 },
  { id: 4, nome: "Mesa", preco: 900, categoria: "moveis", estoque: 2 },
];
```

### 2.1 `forEach` e `map`

**`forEach`** executa algo para cada item. Não retorna nada (é para efeitos, como imprimir):

```js
produtos.forEach((produto) => console.log(produto.nome));
```

**`map`** **transforma** cada item e retorna um **array novo do mesmo tamanho**:

```js
const nomes = produtos.map((produto) => produto.nome);
// ["Notebook", "Mouse", "Cadeira", "Mesa"]

const precosComImposto = produtos.map((p) => p.preco * 1.1);

const etiquetas = produtos.map((p, indice) => `${indice + 1}. ${p.nome}`);
// ["1. Notebook", "2. Mouse", ...]
```

Compare com o que você faria no módulo 02:

```js
const nomes = [];
for (const produto of produtos) {
  nomes.push(produto.nome);
}
```

O `map` diz a **intenção** ("transformar cada item") em uma linha.

### 2.2 `filter`

**`filter`** mantém só os itens para os quais o callback retorna `true`:

```js
const disponiveis = produtos.filter((p) => p.estoque > 0);
const moveis = produtos.filter((p) => p.categoria === "moveis");
const baratos = produtos.filter((p) => p.preco < 1000);
```

O array resultante pode ser menor (ou vazio), mas os itens são os mesmos objetos do original.

### 2.3 `find`, `findIndex` e `includes`

**`find`** retorna o **primeiro** item que satisfaz a condição, ou `undefined` se nenhum satisfizer:

```js
const mouse = produtos.find((p) => p.id === 2);          // { id: 2, nome: "Mouse", ... }
const geladeira = produtos.find((p) => p.nome === "Geladeira");   // undefined
const produtoOuNulo = produtos.find((p) => p.id === 99) ?? null;  // null
```

**`findIndex`** retorna a **posição** (ou `-1`). **`includes`** responde se um **valor** está
no array (bom para números e strings):

```js
produtos.findIndex((p) => p.id === 3);   // 2
["pix", "boleto"].includes("pix");       // true
```

**Busca sem diferenciar maiúsculas:** converta os dois lados para minúsculas.

```js
const termo = "MOU";
produtos.filter((p) => p.nome.toLowerCase().includes(termo.toLowerCase()));
```

### 2.4 `some` e `every`

```js
produtos.some((p) => p.estoque === 0);   // true:  ALGUM está esgotado?
produtos.every((p) => p.preco > 50);     // true:  TODOS custam mais de 50?
```

Os dois param assim que descobrem a resposta (o `some` para no primeiro `true`).

> ✏️ **Pratique agora — Exercício 02: catálogo de uma loja**
>
> Abra `exercicios/03-js-intermediario/02-loja.js`. Cada função se resolve com **um** método.
>
> ```bash
> npm run exercicio -- 02-loja
> ```

### 2.5 `reduce`: transformando a lista em um único valor

O `reduce` é o mais poderoso, e o que mais assusta no começo. Ele percorre a lista carregando
um **acumulador**, exatamente como o padrão acumulador do módulo 02:

```js
const numeros = [10, 20, 30];

const soma = numeros.reduce((acumulado, numero) => acumulado + numero, 0);
//                           ↑ acumulado  ↑ item atual                ↑ valor inicial
```

Passo a passo:

| Volta | `acumulado` | `numero` | Retorno (vira o próximo `acumulado`) |
| --- | --- | --- | --- |
| 1 | `0` (valor inicial) | 10 | 10 |
| 2 | 10 | 20 | 30 |
| 3 | 30 | 30 | **60** ← resultado final |

O **valor que o callback retorna** vira o acumulado da próxima volta. Esquecer o `return`
(em funções com chaves) é o erro número 1 com `reduce`.

O acumulador pode ser **qualquer coisa**: número, string, array, objeto.

**Total de um carrinho:**

```js
const itens = [
  { nome: "Café", preco: 20, quantidade: 3 },
  { nome: "Pão", preco: 1, quantidade: 10 },
];
const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);   // 70
```

**Contar por categoria** (o acumulador é um objeto):

```js
const contagem = produtos.reduce((resultado, produto) => {
  resultado[produto.categoria] = (resultado[produto.categoria] ?? 0) + 1;
  return resultado;                  // ← não esqueça!
}, {});
// { eletronicos: 2, moveis: 2 }
```

`resultado[produto.categoria]` usa colchetes porque a chave está numa variável (você viu isso
no módulo 02). Na primeira vez a chave não existe (`undefined`), e o `?? 0` resolve.

**Encontrar o maior** (o acumulador é o "campeão até agora"):

```js
const maisCaro = produtos.reduce((campeao, produto) => (produto.preco > campeao.preco ? produto : campeao));
```

Sem valor inicial, o `reduce` usa o **primeiro item** como acumulado e começa do segundo. Mas
num array **vazio** isso dá erro (`TypeError: Reduce of empty array with no initial value`).
Quando a lista pode estar vazia, passe um valor inicial (como `null`) e trate esse caso.

**Agrupar** (o acumulador é um objeto de arrays):

```js
const porCategoria = produtos.reduce((grupos, produto) => {
  grupos[produto.categoria] ??= [];      // se ainda não existe, cria o array
  grupos[produto.categoria].push(produto);
  return grupos;
}, {});
// { eletronicos: [Notebook, Mouse], moveis: [Cadeira, Mesa] }
```

O operador `??=` atribui **só se** o valor atual for `null` ou `undefined`. O JavaScript moderno
também tem um atalho pronto para agrupar: `Object.groupBy(produtos, (p) => p.categoria)`.

> ✏️ **Pratique agora — Exercício 03: reduce**
>
> Abra `exercicios/03-js-intermediario/03-reduce.js`.
>
> ```bash
> npm run exercicio -- 03-reduce
> ```

Agora que você conhece `map`, `filter` e `reduce`, vale a pena entender que não há mágica neles:
são laços `for` embrulhados numa função que recebe um callback.

> ✏️ **Pratique agora — Exercício 04: construa o seu próprio map, filter e reduce**
>
> Abra `exercicios/03-js-intermediario/04-meus-metodos.js`. É uma pergunta comum em entrevistas.
>
> ```bash
> npm run exercicio -- 04-meus
> ```

### 2.6 Ordenação: `sort` e `toSorted`

```js
const numeros = [10, 1, 5, 100];
numeros.sort();          // [1, 10, 100, 5]  ← ?!
```

Dois problemas:

1. Sem argumento, o `sort` ordena como **texto** ("100" vem antes de "5" porque "1" < "5").
2. O `sort` **altera o array original**. Isso é uma fonte enorme de bugs: outra parte do código
   que usava a lista de repente a encontra em outra ordem.

A solução: use **`toSorted`** (que retorna um array novo) com uma **função de comparação**:

```js
const crescente = numeros.toSorted((a, b) => a - b);     // [1, 5, 10, 100]
const decrescente = numeros.toSorted((a, b) => b - a);   // [100, 10, 5, 1]
// numeros continua [10, 1, 5, 100]
```

A função de comparação recebe dois itens e retorna:
- um número **negativo** se `a` deve vir antes de `b`;
- **positivo** se `b` deve vir antes de `a`;
- **zero** se tanto faz.

`a - b` faz exatamente isso para números. Para objetos, compare a propriedade:

```js
const maisBaratos = produtos.toSorted((a, b) => a.preco - b.preco);
```

**Textos em português:** use `localeCompare`, que conhece acentos e as regras do idioma:

```js
["banana", "Água", "abacate"].toSorted();   // ["Água", "abacate", "banana"]  ← maiúsculas primeiro, errado
["banana", "Água", "abacate"].toSorted((a, b) => a.localeCompare(b, "pt-BR"));
// ["abacate", "Água", "banana"]  ✅
```

**Ordenar por dois critérios** (por categoria e, empatando, por preço): se a primeira comparação
der 0, o `||` passa para a segunda:

```js
produtos.toSorted((a, b) => a.categoria.localeCompare(b.categoria, "pt-BR") || b.preco - a.preco);
```

**Os N primeiros:** `slice(inicio, fim)` copia um pedaço do array sem alterá-lo.

```js
const top3 = produtos.toSorted((a, b) => b.preco - a.preco).slice(0, 3);
```

> Antes do `toSorted` existir, o jeito era copiar antes: `[...produtos].sort(...)` (você vai
> entender o `...` na seção 4). Você vai ver isso em muito código por aí.

> ✏️ **Pratique agora — Exercício 05: ordenação sem efeitos colaterais**
>
> Abra `exercicios/03-js-intermediario/05-ordenacao.js`. O teste congela os arrays, então
> qualquer alteração no original vira erro.
>
> ```bash
> npm run exercicio -- 05-ordenacao
> ```

### 2.7 Encadeando métodos

Como `map`, `filter` e `toSorted` retornam arrays, dá para **encadear** um depois do outro,
como uma linha de montagem:

```js
const nomesDosMoveisDisponiveis = produtos
  .filter((p) => p.categoria === "moveis")       // [Cadeira, Mesa]
  .filter((p) => p.estoque > 0)                  // [Cadeira, Mesa]
  .toSorted((a, b) => a.preco - b.preco)         // [Mesa, Cadeira]
  .map((p) => p.nome.toUpperCase());             // ["MESA", "CADEIRA"]
```

Coloque cada método numa linha: fica fácil ler e comentar cada etapa.

Mais alguns métodos que aparecem o tempo todo:

```js
// join: junta os itens num texto
["Ana", "Bia", "Caio"].join(", ");        // "Ana, Bia, Caio"

// at: acessa por posição, aceitando negativos (do fim para o começo)
["a", "b", "c"].at(-1);                   // "c"

// flatMap: map que "achata" um nível — cada item pode virar VÁRIOS itens
const pedidos = [
  { cliente: "Ana", itens: ["Café", "Pão"] },
  { cliente: "Bia", itens: ["Leite"] },
];
pedidos.flatMap((pedido) => pedido.itens);   // ["Café", "Pão", "Leite"]

// Remover duplicados: um Set só guarda valores únicos (detalhes no módulo 05)
const cidades = ["Recife", "Natal", "Recife"];
[...new Set(cidades)];                    // ["Recife", "Natal"]
```

**Quando usar `for` e quando usar métodos?** Métodos para transformar, filtrar e resumir dados
(a maior parte dos casos). `for` quando precisar parar no meio de um jeito complexo, ou em código
em que a performance é crítica.

> ✏️ **Pratique agora — Exercício 06: relatório de pedidos**
>
> Abra `exercicios/03-js-intermediario/06-encadeamento.js`. Faturamento, ticket médio, clientes
> e itens vendidos, combinando vários métodos.
>
> ```bash
> npm run exercicio -- 06-encadeamento
> ```

---

## 3. Objetos a fundo

### 3.1 Percorrendo objetos: `keys`, `values` e `entries`

Objetos não têm `map` nem `filter`. Para percorrê-los, transforme-os em arrays:

```js
const estoque = { cafe: 12, pao: 0, leite: 7 };

Object.keys(estoque);      // ["cafe", "pao", "leite"]
Object.values(estoque);    // [12, 0, 7]
Object.entries(estoque);   // [["cafe", 12], ["pao", 0], ["leite", 7]]
```

O `entries` dá pares `[chave, valor]`, que combinam com desestruturação de array (seção 4.2):

```js
for (const [produto, quantidade] of Object.entries(estoque)) {
  console.log(`${produto}: ${quantidade}`);
}

const totalDeItens = Object.values(estoque).reduce((soma, q) => soma + q, 0);   // 19
```

### 3.2 Transformando objetos com `fromEntries`

`Object.fromEntries` faz o caminho inverso: transforma pares em objeto. O padrão para
"`map`/`filter` em objetos" é: **entries → método de array → fromEntries**.

```js
// só os produtos com estoque
const comEstoque = Object.fromEntries(
  Object.entries(estoque).filter(([_produto, quantidade]) => quantidade > 0),
);
// { cafe: 12, leite: 7 }

// dobrar todas as quantidades
const dobrado = Object.fromEntries(Object.entries(estoque).map(([produto, q]) => [produto, q * 2]));
```

O `_` no começo de `_produto` é uma convenção para "esta variável existe, mas não vou usá-la".

### 3.3 Chaves dinâmicas e atalhos

```js
const campo = "email";
const valor = "ana@exemplo.com";

const usuario = { [campo]: valor };     // { email: "ana@exemplo.com" } — a chave vem da variável

const nome = "Ana";
const idade = 28;
const pessoa = { nome, idade };         // atalho do módulo 02: { nome: "Ana", idade: 28 }
```

**Contando ocorrências** é um uso clássico de chave dinâmica:

```js
const palavras = "o gato e o rato".split(" ");
const frequencia = {};
for (const palavra of palavras) {
  frequencia[palavra] = (frequencia[palavra] ?? 0) + 1;
}
// { o: 2, gato: 1, e: 1, rato: 1 }
```

### 3.4 Acessando com segurança: optional chaining (`?.`)

Dados reais vêm incompletos. Acessar uma propriedade de `undefined` derruba o programa:

```js
const usuario = { nome: "Ana" };               // sem endereço
usuario.endereco.cidade;                       // ❌ TypeError: Cannot read properties of undefined
```

O operador `?.` para a leitura se encontrar `null` ou `undefined`, e retorna `undefined` em vez de dar erro:

```js
usuario.endereco?.cidade;                      // undefined
usuario?.endereco?.cidade ?? "não informada";  // "não informada"

usuario.contatos?.[0];                         // também funciona com índices
usuario.saudar?.();                            // e com funções que talvez não existam
```

Use `?.` onde o dado **pode** faltar de verdade. Espalhar `?.` em tudo esconde bugs: se um dado
**deveria** existir, é melhor dar erro e descobrir o problema.

> ✏️ **Pratique agora — Exercício 07: objetos a fundo**
>
> Abra `exercicios/03-js-intermediario/07-objetos.js`.
>
> ```bash
> npm run exercicio -- 07-objetos
> ```

### 3.5 Métodos e `this`

Um objeto pode guardar funções. Uma função dentro de um objeto se chama **método**:

```js
const contador = {
  valor: 0,
  incrementar() {          // forma curta de escrever incrementar: function () { ... }
    this.valor++;
    return this.valor;
  },
};

contador.incrementar();    // 1
contador.incrementar();    // 2
```

**`this`** é "o objeto que chamou o método". Em `contador.incrementar()`, quem está antes do
ponto é `contador`, então lá dentro `this` é `contador`. É assim que o método acessa os dados
do **próprio** objeto, sem saber o nome da variável.

**Retornando `this` para encadear chamadas:**

```js
const pedido = {
  itens: [],
  adicionar(item) {
    this.itens.push(item);
    return this;           // devolve o próprio objeto
  },
};

pedido.adicionar("Café").adicionar("Pão").adicionar("Leite");
```

**As armadilhas do `this`:**

1. **Arrow functions não têm `this` próprio.** Não use arrow function para métodos:

   ```js
   const conta = {
     saldo: 100,
     ver: () => this.saldo,   // ❌ this aqui NÃO é a conta
   };
   ```

2. **O `this` é decidido na hora da chamada**, não onde a função foi escrita. Se você tira o
   método do objeto, ele perde a referência:

   ```js
   const incrementar = contador.incrementar;
   incrementar();             // ❌ TypeError: this é undefined (não tem "contador." antes)
   ```

Você vai usar `this` de verdade nas **classes** (módulo 05). Por ora, a regra prática: dentro
de um método escrito na forma curta, `this` é o objeto antes do ponto.

> ✏️ **Pratique agora — Exercício 08: conta bancária**
>
> Abra `exercicios/03-js-intermediario/08-conta-bancaria.js`. Um objeto com dados e métodos que
> usam `this`, com validações e encadeamento.
>
> ```bash
> npm run exercicio -- 08-conta
> ```

---

## 4. Desestruturação, spread e rest

### 4.1 Desestruturação de objetos

Você já viu o básico no módulo 02. Agora, os recursos completos:

```js
const usuario = {
  nome: "Ana",
  email: "ana@exemplo.com",
  endereco: { cidade: "Recife", uf: "PE" },
};

// pegar propriedades
const { nome, email } = usuario;

// renomear: a propriedade "nome" vira a variável "nomeCompleto"
const { nome: nomeCompleto } = usuario;

// valor padrão, usado quando a propriedade é undefined
const { telefone = "sem telefone" } = usuario;

// desestruturação aninhada: entra no endereço
const { endereco: { cidade } } = usuario;    // cidade = "Recife"
```

**Aninhada com padrão**, para quando o objeto de dentro pode não existir:

```js
function mostrarCidade({ endereco: { cidade = "não informada" } = {} }) {
  return cidade;
}

mostrarCidade({ endereco: { cidade: "Natal" } });   // "Natal"
mostrarCidade({});                                   // "não informada"
```

Leia de dentro para fora: "se não vier `endereco`, use `{}`; dentro dele, se não vier `cidade`,
use `"não informada"`".

### 4.2 Desestruturação de arrays

Em arrays, o que importa é a **posição**:

```js
const [primeiro, segundo] = ["ouro", "prata", "bronze"];   // "ouro", "prata"
const [, , terceiro] = ["ouro", "prata", "bronze"];        // pula posições com vírgulas

// trocar duas variáveis sem variável auxiliar
let a = 1;
let b = 2;
[a, b] = [b, a];

// muito usado com Object.entries e com split
const [dia, mes, ano] = "15/10/2026".split("/");
```

### 4.3 Spread (`...`) e rest (`...`)

Os mesmos três pontos fazem duas coisas opostas, dependendo de onde aparecem.

**Spread** ("espalhar") abre um array ou objeto **dentro de outro**:

```js
const frutas = ["maçã", "banana"];
const mais = [...frutas, "uva"];                  // ["maçã", "banana", "uva"]
const todas = [...frutas, ...["kiwi", "pera"]];

const padrao = { tema: "claro", idioma: "pt" };
const doUsuario = { tema: "escuro" };
const configuracao = { ...padrao, ...doUsuario }; // { tema: "escuro", idioma: "pt" }
// quem vem DEPOIS sobrescreve

const atualizado = { ...usuario, email: "novo@exemplo.com" };   // cópia com um campo trocado

Math.max(...[3, 9, 1]);                           // 9: espalha o array como argumentos
```

**Rest** ("o resto") **junta** vários valores em um array:

```js
// em parâmetros: aceita quantos argumentos vierem
function somar(...numeros) {
  return numeros.reduce((soma, n) => soma + n, 0);
}
somar(1, 2, 3, 4);   // 10
somar();             // 0

// em desestruturação: pega o que sobrou
const [campeao, ...demais] = ["Ana", "Bia", "Caio"];      // campeao = "Ana", demais = ["Bia", "Caio"]
const { senha, ...usuarioSemSenha } = { nome: "Ana", senha: "123" };   // remove a senha
```

Como saber qual é qual? **Do lado esquerdo do `=` ou nos parâmetros, é rest (junta).
Do lado direito ou nos argumentos, é spread (espalha).**

> ✏️ **Pratique agora — Exercício 09: desestruturação, spread e rest**
>
> Abra `exercicios/03-js-intermediario/09-desestruturacao.js`.
>
> ```bash
> npm run exercicio -- 09-desestruturacao
> ```

### 4.4 Valor, referência e imutabilidade

Este é um dos conceitos **mais importantes** do JavaScript, e a causa de muitos bugs.

**Tipos primitivos** (número, string, booleano) são **copiados**:

```js
let a = 10;
let b = a;
b = 20;
console.log(a);   // 10 — mudar b não muda a
```

**Objetos e arrays** são guardados por **referência**: a variável guarda o **endereço** do objeto,
não o objeto. Copiar a variável copia o endereço, e as duas apontam para o **mesmo** objeto:

```js
const original = { nome: "Ana" };
const outra = original;          // NÃO é uma cópia: é o mesmo objeto
outra.nome = "Bia";
console.log(original.nome);      // "Bia" 😱
```

```
original ──┐
           ├──▶ { nome: "Bia" }
outra ─────┘
```

O mesmo acontece quando você passa um objeto para uma função: a função recebe o endereço e
pode alterar o original sem você perceber.

```js
function aplicarDesconto(produto) {
  produto.preco = produto.preco * 0.9;   // ❌ altera o produto de quem chamou
  return produto;
}
```

**Comparação também é por referência:**

```js
{ a: 1 } === { a: 1 };   // false — são dois objetos diferentes, com o mesmo conteúdo
```

**Imutabilidade: não altere, crie um novo.** Em vez de mudar o objeto recebido, retorne uma
cópia com a mudança:

```js
function aplicarDesconto(produto) {
  return { ...produto, preco: produto.preco * 0.9 };   // ✅ o original fica intacto
}
```

As receitas imutáveis para arrays:

| Quero... | Mutável (evite) | Imutável |
| --- | --- | --- |
| Acrescentar | `lista.push(x)` | `[...lista, x]` |
| Remover | `lista.splice(i, 1)` | `lista.filter((item) => item.id !== id)` |
| Alterar um item | `lista[i].qtd = 5` | `lista.map((item) => item.id === id ? { ...item, qtd: 5 } : item)` |
| Ordenar | `lista.sort(...)` | `lista.toSorted(...)` |

Por que tanto cuidado? Porque código imutável é **previsível**: uma função não muda nada fora dela,
então você pode chamá-la sem medo. E no **React** (módulo 10) isso é obrigatório: a tela só se
atualiza quando o estado é um objeto **novo**.

**Cópias rasas e profundas.** O spread copia só o **primeiro nível**: objetos de dentro continuam
compartilhados.

```js
const usuario = { nome: "Ana", endereco: { cidade: "Recife" } };
const copia = { ...usuario };
copia.endereco.cidade = "Natal";
usuario.endereco.cidade;           // "Natal" — o endereço é o mesmo objeto!

const copiaProfunda = structuredClone(usuario);   // copia todos os níveis
```

**`Object.freeze`** congela um objeto: qualquer tentativa de alterá-lo dá erro (em módulos ES).
Os testes deste módulo usam isso para conferir se o seu código é imutável.

> ✏️ **Pratique agora — Exercício 10: carrinho de compras imutável**
>
> Abra `exercicios/03-js-intermediario/10-carrinho-imutavel.js`. Adicionar, remover e alterar
> itens sem tocar no carrinho original, exatamente como você vai fazer no React.
>
> ```bash
> npm run exercicio -- 10-carrinho
> ```

---

## 5. Escopo, hoisting e closures

### 5.1 Escopo

**Escopo** é "onde uma variável existe". `let` e `const` existem só dentro do bloco `{ }` onde
foram criadas, e blocos de dentro enxergam as variáveis dos blocos de fora:

```js
const global = "todo mundo vê";

function exemplo() {
  const daFuncao = "só dentro da função";
  if (true) {
    const doBloco = "só dentro do if";
    console.log(global, daFuncao, doBloco);   // ✅ vê tudo
  }
  console.log(doBloco);                       // ❌ ReferenceError
}
```

Quando o JavaScript procura uma variável, ele olha no bloco atual; se não achar, no bloco de
fora; e assim por diante até o topo. Isso se chama **cadeia de escopo**.

Evite variáveis "globais" (fora de qualquer função) que mudam de valor: qualquer parte do
código pode alterá-las, e os bugs ficam difíceis de rastrear.

### 5.2 Hoisting

**Declarações de função** (`function nome() {}`) podem ser usadas **antes** de aparecerem no
arquivo, porque o JavaScript as "içou" (*hoisting*) para o topo:

```js
saudar();                       // ✅ funciona
function saudar() { console.log("oi"); }
```

Já `const` e `let` **não** podem ser usadas antes da linha onde foram declaradas:

```js
dobrar(2);                      // ❌ ReferenceError: Cannot access 'dobrar' before initialization
const dobrar = (n) => n * 2;
```

Por isso, em módulos, deixe as funções auxiliares no topo ou use declarações `function`.

### 5.3 Closures

Uma **closure** é uma função que **lembra das variáveis do lugar onde foi criada**, mesmo
depois que aquele lugar "terminou":

```js
function criarContador() {
  let contagem = 0;                     // variável local de criarContador

  return function incrementar() {
    contagem++;                         // usa a variável de fora
    return contagem;
  };
}

const contar = criarContador();         // criarContador já terminou...
contar();   // 1
contar();   // 2                        // ...mas incrementar ainda lembra de "contagem"
contar();   // 3

const outro = criarContador();          // cada chamada cria uma "contagem" nova
outro();    // 1
```

O que acontece: cada vez que `criarContador` roda, nasce uma variável `contagem` nova. A
função retornada carrega uma "mochila" com essa variável. Ninguém de fora consegue acessar
`contagem` diretamente: ela é **privada**.

Isso permite criar objetos com estado escondido:

```js
function criarCofre(senhaCorreta) {
  let saldo = 0;
  return {
    depositar(valor) {
      saldo += valor;
    },
    ver(senha) {
      return senha === senhaCorreta ? saldo : "Senha incorreta";
    },
  };
}

const cofre = criarCofre("1234");
cofre.depositar(100);
cofre.saldo;          // undefined: não existe propriedade saldo, ele está guardado na closure
cofre.ver("1234");    // 100
```

**Fábricas de funções** também são closures:

```js
const criarMultiplicador = (fator) => (numero) => numero * fator;
const dobro = criarMultiplicador(2);
const triplo = criarMultiplicador(3);
dobro(10);    // 20
triplo(10);   // 30
```

Closures estão por trás de muita coisa que você vai usar: os hooks do React (`useState`),
middlewares de servidores, `memoizar`, `debounce`...

> ✏️ **Pratique agora — Exercício 11: closures**
>
> Abra `exercicios/03-js-intermediario/11-closures.js`. Contador com estado privado, gerador de
> ids e uma função que só executa uma vez.
>
> ```bash
> npm run exercicio -- 11-closures
> ```

### 5.4 Dois clássicos: `memoizar` e `debounce`

**Memoização** é guardar o resultado de uma conta cara para não refazer:

```js
function memoizar(funcao) {
  const cache = {};                     // fica guardado na closure
  return (argumento) => {
    if (!(argumento in cache)) {        // "in" diz se a chave existe no objeto
      cache[argumento] = funcao(argumento);
    }
    return cache[argumento];
  };
}
```

Por que `in` e não `if (!cache[argumento])`? Porque se o resultado guardado for `0`, `""` ou
`false` (valores falsy), o `if` acharia que não calculou ainda.

**Agendando com `setTimeout`.** `setTimeout(funcao, ms)` agenda a função para rodar depois de
um tempo e retorna um identificador. `clearTimeout(identificador)` cancela o agendamento:

```js
const agendamento = setTimeout(() => console.log("passou 1 segundo"), 1000);
clearTimeout(agendamento);   // cancelado: a mensagem nunca aparece
```

(Você vai entender **como** o JavaScript espera sem travar no módulo 05. Por ora, basta saber usar.)

**Debounce** é "esperar a pessoa parar". Imagine uma busca que consulta o servidor a cada letra
digitada: "j", "ja", "jav", "java"... quatro consultas, três inúteis. Com debounce, a consulta só
acontece quando a pessoa **para de digitar** por um tempo:

```
digita:   j    a    v    a  ···········(300ms parado)··· → busca("java")
timer:    ▲ cancela ▲ cancela ▲ cancela ▲ ─────────────────▶ dispara
```

A cada chamada, o debounce **cancela o agendamento anterior** e agenda de novo. Só o último
sobrevive. A variável com o agendamento fica guardada... numa closure.

> ✏️ **Pratique agora — Exercício 12: memoizar e debounce**
>
> Abra `exercicios/03-js-intermediario/12-memoizar-debounce.js`. Os testes usam um "relógio falso"
> para controlar o tempo, então eles rodam instantaneamente.
>
> ```bash
> npm run exercicio -- 12-memoizar
> ```

---

## 6. Módulos a fundo

No módulo 02 você usou `export function` e `import { ... } from`. Existem mais formas:

### Exportações nomeadas e padrão

```js
// texto.js — exportações NOMEADAS (um arquivo pode ter várias)
export function capitalizar(texto) { /* ... */ }
export const LIMITE = 100;
```

```js
// moeda.js — exportação PADRÃO (no máximo uma por arquivo)
export default function formatarMoeda(valor) { /* ... */ }
```

```js
// app.js
import formatarMoeda from "./moeda.js";              // padrão: sem chaves, você escolhe o nome
import { capitalizar, LIMITE } from "./texto.js";    // nomeadas: com chaves, nome exato
import { capitalizar as cap } from "./texto.js";     // renomeando
import * as texto from "./texto.js";                 // tudo como um objeto: texto.capitalizar(...)
```

**Qual usar?** Muitos times preferem **só exportações nomeadas**: o nome é sempre o mesmo em
todo o projeto, o editor consegue renomear em todos os lugares e o autocompletar funciona melhor.
A exportação padrão aparece muito em React (um componente por arquivo).

### Reexportando: o arquivo "índice"

Uma biblioteca costuma ter um arquivo de entrada que **reúne** o que os outros exportam, para quem usa
importar tudo de um lugar só:

```js
// index.js
export { default as formatarMoeda } from "./moeda.js";   // reexporta o padrão com um nome
export * from "./texto.js";                              // reexporta todas as nomeadas
export const VERSAO = "1.0.0";
```

```js
import { formatarMoeda, capitalizar, VERSAO } from "./biblioteca/index.js";
```

### Como organizar um projeto em módulos

- **Um arquivo, uma responsabilidade**: `csv.js` lê CSV, `relatorio.js` faz os cálculos do relatório.
- **Funções puras** nos módulos de regra; a entrada e a saída (terminal, arquivos) ficam nas pontas.
- Evite **dependências circulares** (`a.js` importa `b.js`, que importa `a.js`): é sinal de que
  as responsabilidades estão misturadas.

> ✏️ **Pratique agora — Exercício 13: módulos**
>
> Pasta `exercicios/03-js-intermediario/13-modulos/`. Três arquivos: um com exportação padrão,
> um com nomeadas e o `index.js` que reexporta tudo.
>
> ```bash
> npm run exercicio -- 13-modulos
> ```

---

## 7. Tratamento de erros

### 7.1 `try`, `catch` e `finally`

Você já usou `try`/`catch` no módulo 02. O bloco `finally` roda **sempre**, deu erro ou não. É o
lugar para "arrumar a casa": fechar arquivos, esconder um indicador de "carregando", registrar o fim.

```js
function processar() {
  console.log("início");
  try {
    return calcularAlgo();           // mesmo com return...
  } catch (erro) {
    console.error("Falhou:", erro.message);
    throw erro;
  } finally {
    console.log("fim");              // ...o finally roda antes de sair
  }
}
```

### 7.2 Os tipos de erro do JavaScript

| Tipo | Quando o JavaScript lança |
| --- | --- |
| `Error` | O tipo genérico (o que você usa com `throw new Error(...)`) |
| `TypeError` | Usar um valor do jeito errado: `undefined.nome`, chamar algo que não é função |
| `ReferenceError` | Variável que não existe |
| `SyntaxError` | Código mal escrito, ou `JSON.parse` com texto inválido |
| `RangeError` | Valor fora do permitido (recursão infinita, `toFixed(200)`) |

Todo erro tem `erro.name` (o tipo), `erro.message` (a mensagem) e `erro.stack` (onde aconteceu).

### 7.3 Criando os seus próprios tipos de erro

Para tratar erros de forma diferente conforme o problema, crie **classes de erro**. Uma classe é
um "molde" para criar objetos (você vai estudar classes a fundo no módulo 05); aqui basta este formato:

```js
export class SaldoInsuficienteError extends Error {      // "extends Error": é um tipo de erro
  constructor(saldo, valor) {                             // roda quando você faz new SaldoInsuficienteError(...)
    super(`Saldo de ${saldo} insuficiente para sacar ${valor}`);   // super: monta a mensagem do Error
    this.name = "SaldoInsuficienteError";                 // o nome que aparece no erro
    this.saldo = saldo;                                   // dados extras que ajudam a tratar
    this.valor = valor;
  }
}

throw new SaldoInsuficienteError(100, 250);
```

E para saber **qual** erro aconteceu, use **`instanceof`**:

```js
try {
  sacar(100, 250);
} catch (erro) {
  if (erro instanceof SaldoInsuficienteError) {
    console.log(`Faltam ${erro.valor - erro.saldo} reais.`);   // erro esperado: mensagem amigável
  } else {
    throw erro;                                                // erro inesperado: deixe subir!
  }
}
```

### 7.4 Regras de ouro

1. **Não engula erros.** Um `catch` vazio (`catch {}`) esconde bugs que vão aparecer muito
   depois, longe da causa. Só trate os erros que você **sabe** tratar; relance os outros.
2. **Mensagens úteis**: diga o que deu errado **e** com qual valor (`"Data inválida: 31/02/2026"`
   ajuda muito mais que `"Erro"`).
3. **Erro esperado ≠ bug.** Um usuário digitar uma data errada é esperado: trate e mostre uma
   mensagem. Um `TypeError` no seu código é um bug: deixe aparecer para você corrigir.
4. **Coletar em vez de parar**, quando faz sentido. Ao importar mil linhas, uma linha com problema
   não deve impedir as outras 999: guarde o erro numa lista e continue.

   ```js
   const validas = [];
   const erros = [];
   linhas.forEach((linha, indice) => {
     try {
       validas.push(converter(linha));
     } catch (erro) {
       erros.push({ linha: indice + 1, mensagem: erro.message });
     }
   });
   ```

> ✏️ **Pratique agora — Exercício 14: erros personalizados**
>
> Abra `exercicios/03-js-intermediario/14-erros.js`. Classes de erro, tratamento com `instanceof`,
> relançamento de bugs e `finally`.
>
> ```bash
> npm run exercicio -- 14-erros
> ```

---

## 8. Expressões regulares (regex)

Uma expressão regular é um **padrão** para encontrar, validar ou substituir trechos de texto.
Parece hieróglifo no começo, mas você só precisa de algumas peças para resolver 90% dos casos.

### 8.1 Criando e testando

```js
const padrao = /\d{5}-\d{3}/;           // um regex fica entre barras
padrao.test("CEP 50000-000");           // true: o texto CONTÉM o padrão
```

### 8.2 As peças

| Peça | Significa | Exemplo | Combina com |
| --- | --- | --- | --- |
| `abc` | O texto literal | `/uber/` | "uber" |
| `\d` | Um dígito (0–9) | `/\d\d/` | "42" |
| `\w` | Letra, dígito ou `_` (sem acento) | `/\w+/` | "dev_web" |
| `\s` | Espaço, tab ou quebra de linha | `/a\sb/` | "a b" |
| `\D`, `\W`, `\S` | O **contrário** de cada um | `/\D/` | qualquer coisa que não seja dígito |
| `.` | Qualquer caractere | `/a.c/` | "abc", "a-c" |
| `[abc]` | Um dos caracteres da lista | `/[aeiou]/` | uma vogal |
| `[a-z]`, `[0-9]` | Um caractere do intervalo | `/[a-z0-9]/` | letra minúscula ou número |
| `[^abc]` | Qualquer um, **exceto** os da lista | `/[^0-9]/` | um não-dígito |
| `x?` | x é opcional (0 ou 1 vez) | `/99 ?pop/` | "99pop", "99 pop" |
| `x*` | 0 ou mais vezes | `/a*/` | "", "aaa" |
| `x+` | 1 ou mais vezes | `/\d+/` | "7", "2026" |
| `x{3}`, `x{2,4}` | Exatamente 3 / de 2 a 4 vezes | `/\d{5}/` | "50000" |
| `^` e `$` | Início e fim do texto | `/^\d{5}$/` | **só** "50000", e não "a50000b" |
| `a\|b` | a **ou** b | `/uber\|99/` | "uber" ou "99" |
| `( )` | Grupo (para capturar ou aplicar `?`, `+`) | `/(\d{2})\/(\d{2})/` | "15/10" |
| `\.`, `\/`, `\(` | O caractere literal (escapado) | `/\./` | um ponto de verdade |

**`^` e `$` fazem toda a diferença em validações:**

```js
/\d{5}-?\d{3}/.test("abc50000-000xyz");    // true  ← contém um CEP, mas não É um CEP
/^\d{5}-?\d{3}$/.test("abc50000-000xyz");  // false ✅
/^\d{5}-?\d{3}$/.test("50000000");         // true  (o hífen é opcional por causa do ?)
```

### 8.3 Flags

Letras depois da barra final mudam o comportamento:

- **`i`**: ignora maiúsculas/minúsculas. `/uber/i` combina com "UBER *TRIP".
- **`g`**: global, encontra **todas** as ocorrências (sem ela, só a primeira).

### 8.4 Substituindo com `replace`

```js
"(81) 99999-0000".replace(/\D/g, "");          // "81999990000" — remove tudo que não é dígito
"a  b   c".replace(/\s+/g, " ");               // "a b c" — espaços repetidos viram um só
"--olá--".replace(/^-+|-+$/g, "");             // "olá" — tira hífens das pontas
```

**Grupos de captura** permitem reorganizar o texto: cada `( )` vira `$1`, `$2`... na substituição:

```js
"81999990000".replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");   // "(81) 99999-0000"
"2026-10-15".replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");     // "15/10/2026"
```

### 8.5 Extraindo com `match` e `matchAll`

```js
const resultado = "15/10/2026".match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
// resultado[0] = "15/10/2026" (tudo), resultado[1] = "15", [2] = "10", [3] = "2026"
// se não combinar, match retorna null

const texto = "Amo #JS e #Node";
[...texto.matchAll(/#(\w+)/g)].map((encontrado) => encontrado[1]);   // ["JS", "Node"]
```

### 8.6 Removendo acentos

Você viu no módulo 02 que `normalize("NFD")` separa a letra do acento. Os acentos separados
ficam numa faixa de caracteres especiais, que um regex remove de uma vez:

```js
"Promoção de Verão".normalize("NFD").replace(/[̀-ͯ]/g, "");   // "Promocao de Verao"
```

### 8.7 Criando um regex a partir de um texto

Quando o padrão vem de um arquivo de configuração ou do usuário, use `new RegExp(texto, flags)`.
Se o texto não for um regex válido, ele lança `SyntaxError`, então trate:

```js
const padraoDoUsuario = "uber|99 ?pop";
const regex = new RegExp(padraoDoUsuario, "i");
regex.test("99 POP");   // true

try {
  new RegExp("(abc", "i");        // parêntese sem fechar
} catch {
  console.log("Padrão inválido");
}
```

### 8.8 Um aviso honesto

Regex é ótimo para **formatos** (CEP, telefone, datas). Mas não tente validar tudo com regex:
um e-mail 100% correto pela especificação exige um regex monstruoso, e mesmo assim não garante
que o e-mail existe. Na prática: um regex simples + mandar um e-mail de confirmação.

E quando um regex ficar difícil de ler, comente cada parte ou divida em passos.

> ✏️ **Pratique agora — Exercícios 15, 16 e 17**
>
> - **15-regex**: validar CEP e e-mail, formatar telefone, extrair hashtags
>   `npm run exercicio -- 15-regex`
> - **16-slug**: transformar títulos em endereços amigáveis ("Promoção de Verão" → "promocao-de-verao")
>   `npm run exercicio -- 16-slug`
> - **17-cpf**: validar CPF de verdade, com os dígitos verificadores
>   `npm run exercicio -- 17-cpf`

---

## 9. Datas

Datas são uma das partes mais traiçoeiras de qualquer linguagem. Vamos direto às armadilhas e
a um jeito seguro de trabalhar.

### 9.1 O objeto `Date`

```js
const agora = new Date();                         // data e hora atuais
const data = new Date("2026-10-15T14:30:00Z");    // a partir de um texto ISO
```

Por dentro, uma data é só um número: os **milissegundos desde 1º de janeiro de 1970, em UTC**.
Por isso, subtrair duas datas dá a diferença em milissegundos:

```js
const inicio = new Date("2026-10-01T00:00:00Z");
const fim = new Date("2026-10-15T00:00:00Z");
const UM_DIA = 24 * 60 * 60 * 1000;
(fim - inicio) / UM_DIA;   // 14
```

### 9.2 As armadilhas

**1. O mês começa em zero** nos métodos de `Date`:

```js
new Date(2026, 0, 15);   // 15 de JANEIRO (0 = janeiro, 11 = dezembro)
data.getMonth();          // 9 para outubro
```

**2. Fuso horário.** `new Date("2026-10-15")` é meia-noite **em UTC**, que no Brasil (UTC−3)
ainda é dia **14** às 21h. Mostrar essa data com os métodos "locais" dá o dia errado:

```js
new Date("2026-10-15").getDate();   // 14 no Brasil 😱
```

### 9.3 O jeito seguro: datas como texto ISO e contas em UTC

Para datas **sem hora** (vencimento, data de uma transação, aniversário):

1. **Guarde e passe as datas como texto ISO `"AAAA-MM-DD"`**. É o formato de bancos de dados e APIs,
   e strings ISO podem ser **comparadas e ordenadas como texto**: `"2026-09-30" < "2026-10-01"`.
2. Quando precisar calcular, converta para `Date` **em UTC** e use só os métodos `UTC`:

```js
const paraData = (iso) => new Date(`${iso}T00:00:00Z`);   // o Z diz: isto é UTC
const paraIso = (data) => data.toISOString().slice(0, 10);

const data = paraData("2026-12-30");
data.setUTCDate(data.getUTCDate() + 3);    // soma 3 dias (vira o mês e o ano sozinho)
paraIso(data);                             // "2027-01-02"

paraData("2026-10-15").getUTCDay();        // 4 = quinta-feira (0 = domingo, 6 = sábado)
```

Métodos UTC: `getUTCFullYear()`, `getUTCMonth()` (0–11!), `getUTCDate()` (dia do mês),
`getUTCDay()` (dia da semana), e os `setUTC...` correspondentes.

**Pegando partes direto do texto** muitas vezes é o mais simples:

```js
const [ano, mes, dia] = "2026-10-15".split("-");         // ["2026", "10", "15"]
const mesDoAno = "2026-10-15".slice(0, 7);               // "2026-10"
"2026-10-15".startsWith("2026-10");                      // true: é de outubro de 2026
```

### 9.4 Formatando para o usuário

```js
const data = new Date("2026-10-15T00:00:00Z");

data.toLocaleDateString("pt-BR", { timeZone: "UTC" });                      // "15/10/2026"
data.toLocaleDateString("pt-BR", { weekday: "long", timeZone: "UTC" });     // "quinta-feira"
data.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
// "15 de outubro de 2026"
```

O `timeZone: "UTC"` é essencial aqui pelo mesmo motivo da armadilha 2.

> Para sistemas com muitas regras de data (agendamentos com horário, fusos de vários países),
> o mercado usa bibliotecas como **date-fns** ou **Day.js**, e o JavaScript está ganhando uma API
> nova e melhor chamada **Temporal**. Mas entender o `Date` é obrigatório: você vai encontrá-lo em todo lugar.

> ✏️ **Pratique agora — Exercício 18: datas**
>
> Abra `exercicios/03-js-intermediario/18-datas.js`. Formatar, calcular diferenças, somar dias,
> dia da semana, dia útil e idade.
>
> ```bash
> npm run exercicio -- 18-datas
> ```

---

## 10. JSON, arquivos e CSV

### 10.1 JSON

**JSON** (*JavaScript Object Notation*) é o formato de troca de dados mais usado do mundo: APIs,
arquivos de configuração (como o `package.json`), bancos de dados. Ele parece um objeto JavaScript,
mas é **texto**, com regras mais rígidas:

```json
{
  "nome": "Ana",
  "idade": 28,
  "ativo": true,
  "tags": ["dev", "front"],
  "endereco": null
}
```

- Chaves **sempre** entre aspas **duplas**.
- Valores: string, número, `true`/`false`, `null`, array ou objeto. **Não** existe `undefined`,
  função, data nem comentário.
- Sem vírgula depois do último item.

Convertendo nos dois sentidos:

```js
const objeto = { nome: "Ana", tags: ["dev"] };

const texto = JSON.stringify(objeto);              // '{"nome":"Ana","tags":["dev"]}'
const bonito = JSON.stringify(objeto, null, 2);    // com quebras de linha e 2 espaços de indentação

const devolta = JSON.parse(texto);                 // objeto de novo
JSON.parse("{ nome: 'Ana' }");                     // ❌ SyntaxError: não é JSON válido
```

### 10.2 Lendo e gravando arquivos

O módulo `node:fs` (*file system*) do Node lê e grava arquivos. Neste módulo usamos as versões
**síncronas** (terminam com `Sync`), que esperam a operação acabar antes de seguir. No módulo 05
você vai conhecer as versões assíncronas.

```js
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

writeFileSync("notas.txt", "Primeira linha\n");          // cria (ou sobrescreve) o arquivo
const conteudo = readFileSync("notas.txt", "utf8");       // lê como texto ("utf8" é obrigatório para vir texto)
existsSync("notas.txt");                                  // true
mkdirSync("dados/2026", { recursive: true });             // cria a pasta e as pastas de cima, se faltarem
```

O módulo `node:path` monta caminhos do jeito certo em qualquer sistema (Windows usa `\`, Linux usa `/`):

```js
path.join("dados", "2026", "regras.json");    // "dados/2026/regras.json"
path.dirname("dados/2026/regras.json");       // "dados/2026" (a pasta do arquivo)
path.basename("dados/2026/regras.json");      // "regras.json"
```

Caminhos relativos (`"notas.txt"`) são relativos à **pasta de onde o comando `node` foi rodado**,
não à pasta do arquivo `.js`.

### 10.3 O padrão "carregar e salvar"

Juntando JSON e arquivos, você tem um "banco de dados" simples, ótimo para ferramentas pessoais:

```js
export function carregarJson(caminho, valorPadrao) {
  if (!existsSync(caminho)) return valorPadrao;         // primeira execução: ainda não existe
  try {
    return JSON.parse(readFileSync(caminho, "utf8"));
  } catch {
    throw new Error(`Arquivo JSON inválido: ${caminho}`);   // mensagem útil, em vez do SyntaxError cru
  }
}

export function salvarJson(caminho, dados) {
  mkdirSync(path.dirname(caminho), { recursive: true });
  writeFileSync(caminho, JSON.stringify(dados, null, 2));
}
```

O fluxo de qualquer alteração vira: **carregar → criar a versão nova (imutável!) → salvar**.

> ✏️ **Pratique agora — Exercício 19: JSON e arquivos**
>
> Abra `exercicios/03-js-intermediario/19-json-arquivos.js`. Uma lista de tarefas que continua
> lá depois que o programa fecha.
>
> ```bash
> npm run exercicio -- 19-json
> ```

### 10.4 CSV

**CSV** (*Comma-Separated Values*) é o formato de exportação de planilhas e de **extratos bancários**.
É texto puro: cada linha é um registro, e os campos são separados por um caractere (vírgula, ou
ponto e vírgula nos programas brasileiros, porque a vírgula já é o separador decimal):

```csv
Data;Descrição;Valor
01/10/2026;Salário;5.000,00
02/10/2026;Uber;-30,00
```

Lendo o caso simples:

```js
const texto = readFileSync("extrato.csv", "utf8");
const linhas = texto
  .split(/\r?\n/)                         // quebra em linhas ("\r\n" no Windows, "\n" no resto)
  .filter((linha) => linha.trim() !== ""); // ignora linhas em branco
const [cabecalho, ...registros] = linhas;
const campos = registros.map((linha) => linha.split(";"));
```

**O caso difícil: campos entre aspas.** E se uma descrição contiver o próprio separador?

```csv
03/10/2026;"Padaria; Filial 2";-12,40
```

O `split(";")` quebraria a descrição em dois. A regra do CSV: um campo **entre aspas** pode conter
o separador, e uma aspa dentro dele é escrita dobrada (`""`). Para tratar isso, não há atalho:
é preciso percorrer a linha **caractere por caractere**, lembrando se você está dentro ou fora
das aspas (o padrão "flag" do módulo 02). Você vai fazer isso no projeto.

> ✏️ **Pratique agora — Exercício 20: CSV**
>
> Abra `exercicios/03-js-intermediario/20-csv.js`. Converter CSV em objetos e objetos em CSV.
>
> ```bash
> npm run exercicio -- 20-csv
> ```

### 10.5 Ferramentas de terminal com subcomandos

Ferramentas como o `git` têm **subcomandos**: `git status`, `git commit`, `git push`. O `parseArgs`
do módulo 02 aceita isso com `allowPositionals: true`: os textos soltos (sem `--`) vão para `positionals`.

```js
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    arquivo: { type: "string" },
  },
});

// node cli.js relatorio --arquivo extrato.csv
// positionals = ["relatorio"], values.arquivo = "extrato.csv"
```

Em vez de uma escada de `if`, use um **objeto de comandos** (funções como valores, seção 1!):

```js
const comandos = {
  relatorio: gerarRelatorio,
  regras: listarRegras,
};

const comando = comandos[positionals[0]];
if (!comando) {
  console.log("Uso: node cli.js <relatorio|regras> [opções]");
  process.exit(1);
}

try {
  comando();
} catch (erro) {
  console.error(erro.message);
  process.exit(1);
}
```

Para acrescentar um comando novo, basta uma linha no objeto.

**Dados pessoais e o `.gitignore`.** Ferramentas que leem arquivos pessoais (extratos, planilhas)
nunca devem versioná-los. Coloque os padrões no `.gitignore` **antes** do primeiro commit:

```gitignore
*.csv
regras.json
```

---

## Projeto do módulo — Analisador de extrato bancário

Enunciado completo: [projetos/03-analisador-de-extrato/README.md](../projetos/03-analisador-de-extrato/README.md).

Uma ferramenta de terminal que **importa o CSV exportado pelo seu banco**, separa os gastos em categorias por regras
que você mesmo define (regex), e mostra o relatório do mês: quanto entrou, quanto saiu, gastos por categoria,
maiores gastos e a comparação com o mês anterior. Tudo no seu computador, sem enviar os seus dados para lugar nenhum.

```bash
npm run corrigir-projeto -- 03 ../analisador-de-extrato
```

---

## Resumo dos exercícios

Você já fez todos ao longo da aula. Confira com `npm run progresso`.

| # | Arquivo | Assunto | Seção |
| --- | --- | --- | --- |
| 01 | `01-funcoes-como-valores.js` | callbacks e funções de alta ordem | 1 |
| 02 | `02-loja.js` | map, filter, find, some, every | 2.1–2.4 |
| 03 | `03-reduce.js` | somar, contar, agrupar, encontrar o maior | 2.5 |
| 04 | `04-meus-metodos.js` | implementar map, filter e reduce | 2.1–2.5 |
| 05 | `05-ordenacao.js` | toSorted, localeCompare, dois critérios | 2.6 |
| 06 | `06-encadeamento.js` | relatório de pedidos | 2.7 |
| 07 | `07-objetos.js` | entries, fromEntries, chave dinâmica, `?.` | 3.1–3.4 |
| 08 | `08-conta-bancaria.js` | métodos e `this` | 3.5 |
| 09 | `09-desestruturacao.js` | desestruturação, spread e rest | 4.1–4.3 |
| 10 | `10-carrinho-imutavel.js` | imutabilidade | 4.4 |
| 11 | `11-closures.js` | estado privado com closures | 5.3 |
| 12 | `12-memoizar-debounce.js` | memoização e debounce | 5.4 |
| 13 | `13-modulos/` | exportação padrão, nomeada e reexportação | 6 |
| 14 | `14-erros.js` | classes de erro, `instanceof`, `finally` | 7 |
| 15 | `15-regex.js` | CEP, e-mail, telefone, hashtags | 8 |
| 16 | `16-slug.js` | endereços amigáveis | 8 |
| 17 | `17-cpf.js` | validação de CPF | 8 |
| 18 | `18-datas.js` | datas em UTC | 9 |
| 19 | `19-json-arquivos.js` | lista de tarefas persistente | 10.1–10.3 |
| 20 | `20-csv.js` | CSV para objetos e vice-versa | 10.4 |

---

## Checklist para avançar

- [ ] Passo funções como argumento sem confundir `fn` com `fn()`.
- [ ] Uso `map`, `filter`, `find`, `some`, `every` e `reduce` sem consultar.
- [ ] Ordeno com `toSorted` e função de comparação, inclusive textos em português.
- [ ] Transformo objetos com `Object.entries` e `Object.fromEntries`.
- [ ] Explico o que é `this` dentro de um método e por que arrow functions não servem como métodos.
- [ ] Uso desestruturação, spread e rest, e sei a diferença entre os dois `...`.
- [ ] Explico a diferença entre valor e referência e escrevo funções imutáveis.
- [ ] Explico closure com um exemplo meu e sei escrever um `debounce`.
- [ ] Organizo um projeto em módulos com responsabilidades claras.
- [ ] Crio classes de erro e só trato os erros que sei tratar.
- [ ] Escrevo regex para validar e formatar dados brasileiros.
- [ ] Trabalho com datas ISO em UTC sem errar o dia.
- [ ] Leio e gravo JSON e CSV.
- [ ] Os 20 exercícios passam (`npm run progresso`).
- [ ] O analisador de extrato passou na correção, eu o usei com o extrato do meu banco e ele está no meu GitHub.
