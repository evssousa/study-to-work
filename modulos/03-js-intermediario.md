# Módulo 03 — JavaScript intermediário

**Duração:** 3–4 semanas · **Pré-requisito:** Módulo 02

## Objetivos

- Manipular arrays e objetos com os métodos modernos (`map`, `filter`, `reduce`…).
- Entender escopo, hoisting, closures e `this`.
- Organizar código em módulos.
- Tratar erros corretamente.

---

## 1. Métodos de array (os mais usados no mercado)

```js
const produtos = [
  { nome: "Notebook", preco: 4500, categoria: "eletronicos", estoque: 3 },
  { nome: "Mouse", preco: 80, categoria: "eletronicos", estoque: 0 },
  { nome: "Cadeira", preco: 1200, categoria: "moveis", estoque: 5 },
  { nome: "Mesa", preco: 900, categoria: "moveis", estoque: 2 },
];

// map: transforma cada item → novo array do mesmo tamanho
const nomes = produtos.map((p) => p.nome);
// ["Notebook", "Mouse", "Cadeira", "Mesa"]

// filter: mantém os itens que passam no teste
const disponiveis = produtos.filter((p) => p.estoque > 0);

// find / findIndex: primeiro item que passa no teste
const mouse = produtos.find((p) => p.nome === "Mouse");

// some / every: algum? todos?
produtos.some((p) => p.estoque === 0);  // true
produtos.every((p) => p.preco > 50);    // true

// reduce: reduz o array a um único valor
const totalEmEstoque = produtos.reduce((soma, p) => soma + p.preco * p.estoque, 0);

// Agrupando com reduce
const porCategoria = produtos.reduce((grupos, p) => {
  (grupos[p.categoria] ??= []).push(p);
  return grupos;
}, {});
// Alternativa moderna: Object.groupBy(produtos, (p) => p.categoria)

// sort: CUIDADO — altera o array original. Use toSorted() para não alterar.
const maisBaratos = produtos.toSorted((a, b) => a.preco - b.preco);

// Encadeando
const nomesMoveisDisponiveis = produtos
  .filter((p) => p.categoria === "moveis" && p.estoque > 0)
  .map((p) => p.nome.toUpperCase());

// Outros úteis
[1, [2, [3]]].flat(Infinity);  // [1, 2, 3]
[1, 2, 3].includes(2);         // true
Array.from({ length: 5 }, (_, i) => i * 2); // [0, 2, 4, 6, 8]
[...new Set([1, 1, 2, 3, 3])]; // [1, 2, 3] — remove duplicados
```

## 2. Objetos a fundo

```js
const usuario = { nome: "Ana", idade: 25, endereco: { cidade: "Recife" } };

Object.keys(usuario);     // ["nome", "idade", "endereco"]
Object.values(usuario);   // ["Ana", 25, {...}]
Object.entries(usuario);  // [["nome","Ana"], ["idade",25], ...]
Object.fromEntries([["a", 1]]); // { a: 1 }

// Atalhos
const nome = "Bia", idade = 30;
const pessoa = { nome, idade, saudar() { return `Oi, ${this.nome}`; } };

// Chave dinâmica
const campo = "email";
const dados = { [campo]: "bia@x.com" };

// Optional chaining: evita erro quando algo é undefined
usuario.trabalho?.empresa;   // undefined (sem erro)
usuario.contatos?.[0]?.tel;
```

## 3. Desestruturação, spread e rest

```js
// Desestruturação de objeto
const { nome, endereco: { cidade }, telefone = "não informado" } = usuario;

// Desestruturação de array
const [primeiro, segundo, ...resto] = [10, 20, 30, 40];

// Em parâmetros de função (muito comum em React)
function criarCard({ titulo, descricao = "" }) { /* ... */ }

// Spread: copiar e combinar
const copia = { ...usuario };
const atualizado = { ...usuario, idade: 26 };   // imutabilidade: cria novo objeto
const todos = [...lista1, ...lista2];

// Rest: juntar "o resto" em um array
function somar(...numeros) {
  return numeros.reduce((a, b) => a + b, 0);
}
somar(1, 2, 3, 4); // 10
```

### Valor vs. referência (importantíssimo)

```js
let a = 10;
let b = a;
b = 20;           // a continua 10 (primitivos são copiados)

const obj1 = { x: 1 };
const obj2 = obj1;
obj2.x = 99;      // obj1.x agora é 99! (objetos são compartilhados por referência)

const copiaRasa = { ...obj1 };            // copia só o primeiro nível
const copiaProfunda = structuredClone(obj1); // copia tudo
```

## 4. Escopo, hoisting e closures

```js
// Escopo de bloco: let/const só existem dentro das chaves
if (true) {
  const dentro = 1;
}
// console.log(dentro); → ReferenceError

// Hoisting: declarações de função "sobem" — podem ser usadas antes de aparecerem
ola();
function ola() { console.log("oi"); }

// Closure: uma função "lembra" das variáveis do lugar onde foi criada
function criarContador() {
  let contador = 0;               // variável privada
  return {
    incrementar: () => ++contador,
    valor: () => contador,
  };
}
const c = criarContador();
c.incrementar();
c.incrementar();
c.valor(); // 2 — e ninguém de fora consegue alterar `contador` diretamente
```

Closures estão por trás de React Hooks, middlewares, debounce, memoização e muito mais.

## 5. `this` — o contexto de execução

```js
const pessoa = {
  nome: "Ana",
  falar() { return `Sou ${this.nome}`; },           // this = pessoa
  falarArrow: () => `Sou ${this?.nome}`,             // arrow NÃO tem this próprio
  falarDepois() {
    setTimeout(() => console.log(this.nome), 100);   // arrow herda o this de fora ✔
  },
};

const falar = pessoa.falar;
falar(); // this perdido → erro ou undefined

const falarLigado = pessoa.falar.bind(pessoa); // fixa o this
```

Regra prática: o `this` é definido **por quem chama** a função (exceto em arrow functions,
que usam o `this` de onde foram criadas).

## 6. Funções de alta ordem e programação funcional

```js
// Função que retorna função
const multiplicarPor = (fator) => (n) => n * fator;
const triplo = multiplicarPor(3);
triplo(5); // 15

// Composição
const pipe = (...fns) => (valor) => fns.reduce((acc, fn) => fn(acc), valor);
const limparTexto = pipe(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replaceAll(" ", "-"),
);
limparTexto("  Olá Mundo  "); // "olá-mundo"
```

## 7. Módulos ES

```js
// matematica.js
export const PI = 3.14159;
export function somar(a, b) { return a + b; }
export default function multiplicar(a, b) { return a * b; }

// app.js
import multiplicar, { somar, PI } from "./matematica.js";
```

No Node, adicione `"type": "module"` no `package.json` para usar `import`/`export`.

## 8. Tratamento de erros

```js
function sacar(saldo, valor) {
  if (valor <= 0) throw new Error("Valor deve ser positivo");
  if (valor > saldo) throw new SaldoInsuficienteError(saldo, valor);
  return saldo - valor;
}

class SaldoInsuficienteError extends Error {
  constructor(saldo, valor) {
    super(`Saldo ${saldo} insuficiente para sacar ${valor}`);
    this.name = "SaldoInsuficienteError";
  }
}

try {
  sacar(100, 500);
} catch (erro) {
  if (erro instanceof SaldoInsuficienteError) {
    console.log("Mostre mensagem amigável:", erro.message);
  } else {
    throw erro; // não engula erros que você não sabe tratar
  }
} finally {
  console.log("sempre executa");
}
```

## 9. Datas, JSON e expressões regulares

```js
// Datas
const agora = new Date();
agora.toLocaleDateString("pt-BR"); // "14/10/2026"
new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(1999.9);
// "R$ 1.999,90"

// JSON: formato de troca de dados entre front e back
const json = JSON.stringify({ nome: "Ana", ativo: true }); // '{"nome":"Ana","ativo":true}'
const objeto = JSON.parse(json);

// Regex: validar e extrair padrões
const cepValido = /^\d{5}-?\d{3}$/.test("50000-000"); // true
"Tel: (81) 99999-0000".replace(/\D/g, "");            // "81999990000"
```

---

## Exercícios

Com o array `produtos` acima (ou um maior que você criar):
1. Liste os nomes dos produtos com preço acima de R$ 1.000, em ordem alfabética.
2. Calcule o preço médio por categoria.
3. Aplique 10% de desconto em todos os eletrônicos **sem alterar o array original**.
4. Retorne um objeto `{ nomeDoProduto: preco }`.
5. Crie a função `debounce(fn, ms)` usando closure.
6. Crie a função `memoizar(fn)` que guarda resultados já calculados.
7. Implemente sua própria versão de `map`, `filter` e `reduce` (sem usar os originais).
8. Escreva `validarCPF(cpf)` com regex + cálculo dos dígitos verificadores, lançando erros
   personalizados para cada tipo de problema.
9. Separe os exercícios acima em módulos (`produtos.js`, `utils.js`, `index.js`).

## Projetos

### Projeto simples — Gerenciador de notas de alunos (terminal)
Cadastrar alunos e notas, calcular média, situação, ranking da turma e estatísticas
(maior/menor média, aprovados por percentual) usando apenas métodos de array.

### Projeto avançado — Sistema de biblioteca em memória
- Entidades: livros, usuários, empréstimos (arrays de objetos).
- Funcionalidades: cadastrar livro, buscar por título/autor (sem diferenciar maiúsculas/acentos),
  emprestar, devolver, calcular multa por atraso, listar livros mais emprestados.
- Regras: usuário com multa não pega livro; no máximo 3 empréstimos simultâneos.
- Erros personalizados (`LivroIndisponivelError`, `LimiteEmprestimosError`).
- Código organizado em módulos, funções puras sempre que possível e dados salvos em um arquivo
  JSON com `node:fs/promises` (`readFile`/`writeFile`).

## Checklist para avançar

- [ ] Uso `map`, `filter`, `reduce`, `find`, `some` naturalmente.
- [ ] Uso desestruturação, spread e rest, e entendo valor vs. referência.
- [ ] Sei explicar closure com um exemplo meu.
- [ ] Sei prever o valor de `this` nos casos comuns.
- [ ] Organizo código em módulos e trato erros com classes personalizadas.
