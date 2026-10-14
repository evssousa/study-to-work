# Módulo 02 — JavaScript: fundamentos e lógica de programação

**Duração:** 3–4 semanas · **Pré-requisito:** Módulo 00

## Objetivos

- Pensar como programador: quebrar problemas em passos (algoritmos).
- Dominar variáveis, tipos, operadores, condicionais, laços e funções.
- Rodar JavaScript no navegador e no Node.js.

> Neste módulo, rode o código com `node arquivo.js` no terminal. Assim você foca na lógica, sem
> se preocupar com a página.

---

## 1. Lógica de programação

Antes de programar, descreva a solução em português (pseudocódigo):

```
Problema: dizer se um aluno foi aprovado.
1. Ler as 3 notas
2. Calcular a média (soma ÷ 3)
3. Se média >= 7 → "Aprovado"
   Senão, se média >= 5 → "Recuperação"
   Senão → "Reprovado"
```

Só depois traduza para código. Esse hábito resolve metade dos bloqueios de iniciante.

## 2. Variáveis

```js
const nome = "Ana";      // não pode ser reatribuída — use por padrão
let idade = 25;          // pode mudar
idade = 26;

// var → forma antiga, evite (tem problemas de escopo que veremos no módulo 03)
```

Regra: **use `const` sempre; troque para `let` só quando precisar reatribuir.**
Nomes descritivos em camelCase: `precoTotal`, `usuarioLogado`, `listaDeCompras`.

## 3. Tipos de dados

```js
// Primitivos
const texto = "olá";           // string
const numero = 42;             // number (inteiros e decimais)
const decimal = 3.14;
const ativo = true;            // boolean
let vazio = null;              // ausência intencional de valor
let indefinido;                // undefined: ainda não recebeu valor
const grande = 9007199254740993n; // bigint
const id = Symbol("id");       // symbol (uso avançado)

// Objetos (tipos por referência)
const lista = [1, 2, 3];                   // array
const pessoa = { nome: "Ana", idade: 25 }; // object

console.log(typeof texto);  // "string"
console.log(typeof lista);  // "object"
console.log(Array.isArray(lista)); // true
```

### Strings

```js
const nome = "Ana";
const saudacao = `Olá, ${nome}! Você tem ${20 + 5} anos.`; // template literal

"JavaScript".length;           // 10
"JavaScript".toUpperCase();    // "JAVASCRIPT"
"  oi  ".trim();               // "oi"
"banana".includes("nan");      // true
"a,b,c".split(",");            // ["a", "b", "c"]
"JavaScript".slice(0, 4);      // "Java"
"ola mundo".replaceAll("o", "0"); // "0la mund0"
```

### Números

```js
10 / 3;                 // 3.3333…
10 % 3;                 // 1 (resto da divisão)
2 ** 3;                 // 8
Math.round(4.6);        // 5
Math.floor(4.6);        // 4
Math.random();          // entre 0 e 1
Number("42");           // 42
Number("abc");          // NaN (Not a Number)
(0.1 + 0.2).toFixed(2); // "0.30" — decimais têm imprecisão! Para dinheiro, trabalhe em centavos.
```

## 4. Operadores

```js
// Comparação: use SEMPRE === e !== (comparam valor E tipo)
5 === 5;     // true
5 === "5";   // false
5 == "5";    // true  ← conversão automática, fonte de bugs. Evite ==.

// Lógicos
true && false; // false (E)
true || false; // true  (OU)
!true;         // false (NÃO)

// Valores "falsy": false, 0, "", null, undefined, NaN. Todo o resto é "truthy".
const nomeExibido = nomeDigitado || "Visitante";   // padrão se falsy
const quantidade = valorInformado ?? 1;            // padrão só se null/undefined
```

## 5. Condicionais

```js
const media = 6.5;

if (media >= 7) {
  console.log("Aprovado");
} else if (media >= 5) {
  console.log("Recuperação");
} else {
  console.log("Reprovado");
}

// Ternário — para escolhas simples
const status = media >= 7 ? "Aprovado" : "Não aprovado";

// switch — para muitos valores fixos
switch (diaDaSemana) {
  case 0:
  case 6:
    console.log("Fim de semana");
    break;
  default:
    console.log("Dia útil");
}
```

## 6. Laços de repetição

```js
for (let i = 1; i <= 10; i++) {
  console.log(`7 x ${i} = ${7 * i}`);
}

let tentativas = 0;
while (tentativas < 3) {
  tentativas++;
}

const frutas = ["maçã", "banana", "uva"];
for (const fruta of frutas) {   // percorre valores de um array
  console.log(fruta);
}

const carro = { marca: "Fiat", ano: 2020 };
for (const chave in carro) {    // percorre chaves de um objeto
  console.log(chave, carro[chave]);
}

// break interrompe o laço; continue pula para a próxima volta
```

## 7. Funções

Funções são blocos reutilizáveis que recebem **parâmetros** e devolvem um **retorno**.

```js
// Declaração
function calcularMedia(n1, n2, n3) {
  return (n1 + n2 + n3) / 3;
}

// Arrow function (muito usada)
const dobro = (n) => n * 2;

// Parâmetro com valor padrão
function saudar(nome = "visitante") {
  return `Olá, ${nome}`;
}

// Função que recebe outra função (callback)
function repetir(vezes, acao) {
  for (let i = 0; i < vezes; i++) acao(i);
}
repetir(3, (i) => console.log("volta", i));
```

**Boas práticas:** uma função faz **uma coisa só**, tem nome de verbo (`calcularFrete`,
`validarEmail`) e, sempre que possível, não altera nada fora dela (função pura).

## 8. Arrays e objetos — primeiro contato

```js
const notas = [8, 6.5, 9];
notas.push(7);        // adiciona no fim
notas.pop();          // remove do fim
notas.length;         // 3
notas[0];             // 8
notas.indexOf(9);     // 2

const aluno = {
  nome: "Ana",
  notas: [8, 6.5, 9],
  endereco: { cidade: "Recife" },
};
aluno.nome;              // "Ana"
aluno.endereco.cidade;   // "Recife"
aluno["nome"];           // "Ana"
aluno.email = "ana@x.com"; // adiciona propriedade
```

(Arrays e objetos serão aprofundados no módulo 03.)

## 9. Depuração básica

- Leia a mensagem de erro: ela diz **o tipo**, **a mensagem** e **a linha**.
- `console.log({ variavel })` mostra nome e valor.
- `console.table(arrayDeObjetos)` mostra em formato de tabela.
- Erros comuns: `ReferenceError` (variável não existe), `TypeError` (usar algo errado, como
  chamar `undefined()`), `SyntaxError` (código mal escrito).

---

## Exercícios (resolva todos sem ajuda de IA)

1. Converta temperatura de Celsius para Fahrenheit (`F = C × 9/5 + 32`).
2. Diga se um número é par ou ímpar, positivo ou negativo.
3. Calcule o IMC e mostre a classificação (abaixo do peso, normal, sobrepeso, obesidade).
4. Mostre a tabuada de 1 a 10 de qualquer número.
5. Some todos os números de 1 a 100. Depois, só os pares.
6. Verifique se um número é primo.
7. Mostre os 20 primeiros números da sequência de Fibonacci.
8. Inverta uma string sem usar `.reverse()`.
9. Verifique se uma palavra é palíndromo ("arara", "ovo").
10. Conte quantas vogais há em uma frase.
11. FizzBuzz: de 1 a 100, mostre "Fizz" para múltiplos de 3, "Buzz" para 5, "FizzBuzz" para ambos.
12. Encontre o maior e o menor valor de um array sem usar `Math.max`.
13. Calcule o fatorial de um número (com laço e depois com recursão).

## Projetos

### Projeto simples — Calculadora de terminal
Use o módulo `readline` do Node para ler dois números e uma operação (+, −, ×, ÷), validar a
entrada (não dividir por zero, rejeitar texto) e repetir até o usuário digitar "sair".

```js
import readline from "node:readline/promises";
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const resposta = await rl.question("Digite um número: ");
rl.close();
```
(Salve o arquivo como `.mjs` para usar `import` e `await` direto.)

### Projeto avançado — Jogo da forca no terminal
- Lista de palavras com dicas por categoria; sorteio aleatório.
- Mostra a palavra com `_` para letras não descobertas e o desenho da forca em ASCII.
- Não aceita letra repetida nem caracteres inválidos; ignora acentos e maiúsculas.
- Placar de vitórias/derrotas e opção de jogar de novo.
- Código dividido em funções pequenas (`sortearPalavra`, `exibirTabuleiro`, `processarLetra`…).

## Checklist para avançar

- [ ] Escrevo pseudocódigo antes de programar.
- [ ] Sei quando usar `const` e `let`, e por que usar `===`.
- [ ] Resolvo problemas com condicionais e laços.
- [ ] Crio funções pequenas, com parâmetros e retorno.
- [ ] Resolvi os 13 exercícios sozinho.
