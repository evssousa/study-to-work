# Módulo 02 — JavaScript: fundamentos e lógica de programação

> **Duração sugerida:** 3 a 4 semanas (ritmo regular).
> **Projeto do módulo:** Calculadora CLT × PJ, uma ferramenta de terminal para comparar propostas de trabalho.

## Objetivos

- Pensar como programador: quebrar um problema em passos (algoritmo).
- Usar variáveis, tipos de dados e operadores do JavaScript.
- Tomar decisões com condicionais e repetir tarefas com laços.
- Escrever funções pequenas, reutilizáveis e testáveis.
- Trabalhar com arrays e objetos, inclusive listas de objetos (o formato de quase todo dado real).
- Lidar com dinheiro sem erros de arredondamento.
- Criar um programa de terminal que recebe argumentos, separado em arquivos.
- Ler mensagens de erro e depurar código.

> **Regra deste módulo:** resolva todos os exercícios **sem IA e sem copiar**. A lógica de
> programação é um músculo; só cresce com o seu esforço.

---

## 0. Antes de começar: como os exercícios de JavaScript funcionam

Cada exercício é um arquivo com uma função **vazia** para você completar:

```js
export function celsiusParaFahrenheit(celsius) {
  // escreva seu código aqui
}
```

- `function celsiusParaFahrenheit(celsius)` declara uma **função** (seção 8): um bloco de código
  com nome, que recebe valores (os **parâmetros**, aqui `celsius`) e **devolve** um resultado com `return`.
- `export` deixa a função **visível para outros arquivos**. É assim que o arquivo de teste
  consegue chamá-la para conferir a resposta. Não apague o `export`.

O teste faz, por baixo dos panos, algo assim:

```js
import { celsiusParaFahrenheit } from "./01-celsius-para-fahrenheit.js";

expect(celsiusParaFahrenheit(100)).toBe(212);
// "espero que celsiusParaFahrenheit(100) seja 212"
```

**Atenção:** o teste confere o que a função **retorna** (`return`), não o que ela imprime com
`console.log`. Uma função que só imprime retorna `undefined`, e o teste mostra
`expected undefined to be 212`.

Para corrigir: `npm run exercicio -- 01-celsius` (detalhes no módulo 00, seção 3).

Os exercícios aparecem nos blocos **✏️ Pratique agora**, logo depois do assunto que eles praticam.
Resolva cada um assim que chegar nele, antes de continuar a leitura.

Você também pode testar à mão, criando um arquivo de rascunho (ex.: `rascunho.js` na raiz) e rodando `node rascunho.js`.

---

## 1. Lógica de programação

Programar é dar instruções **extremamente precisas** para alguém que não tem bom senso
nenhum: o computador. Um **algoritmo** é uma sequência finita de passos para resolver um problema.

Exemplo: "fazer café" para um robô.

```
1. Encher a chaleira com 500 ml de água.
2. Ligar o fogo.
3. Enquanto a água não ferver: esperar.
4. Colocar 3 colheres de pó no filtro.
5. Despejar a água sobre o pó.
6. Se for servir açúcar: adicionar 2 colheres.
```

Note os três elementos que aparecem em todo programa:

- **Sequência**: passos em ordem (1, 2, 4, 5).
- **Repetição**: "enquanto a água não ferver..." (seção 7).
- **Decisão**: "se for servir açúcar..." (seção 6).

### Como atacar qualquer exercício

1. **Entenda o problema.** Qual é a entrada? Qual é a saída esperada? Leia os exemplos.
2. **Resolva à mão** com um exemplo pequeno, no papel. Se você não sabe resolver sem computador,
   não vai saber explicar para ele.
3. **Escreva o pseudocódigo**: os passos em português.
4. **Traduza para JavaScript**, um passo de cada vez, testando a cada passo.
5. **Teste os casos extremos**: zero, negativo, vazio, o maior valor possível.

Exemplo, "verificar se um número é primo":

```
entrada: um número n
se n for menor que 2 → não é primo
para cada divisor de 2 até n - 1:
    se n dividido pelo divisor der resto 0 → não é primo
se nenhum divisor dividiu → é primo
```

Você vai transformar isso em código no exercício 05.

---

## 2. Rodando JavaScript

JavaScript nasceu para rodar **no navegador**. O **Node.js** permite rodá-lo **no terminal**
(e em servidores). Neste módulo usamos o Node.

Crie um arquivo `ola.js`:

```js
console.log("Olá, mundo!");
console.log(2 + 3);
```

E rode:

```bash
node ola.js
```

```
Olá, mundo!
5
```

`console.log(...)` imprime valores no terminal. É a sua principal ferramenta para **ver o que está
acontecendo** no código.

**Comentários** são ignorados pelo computador e servem para pessoas:

```js
// comentário de uma linha

/*
  comentário de
  várias linhas
*/
```

Comente o **porquê**, não o óbvio: `// soma 1 em i` não ajuda ninguém; `// o índice começa em 1 porque a primeira linha é o cabeçalho` ajuda.

---

## 3. Variáveis

Uma variável é uma **caixa com um nome** onde você guarda um valor para usar depois.

```js
const nome = "Ana";
let idade = 28;

console.log(nome);   // Ana
idade = 29;          // let pode receber um novo valor
console.log(idade);  // 29
```

| Palavra | Pode mudar de valor? | Quando usar |
| --- | --- | --- |
| `const` | **Não** | **Sempre que possível** (a maioria dos casos) |
| `let` | Sim | Quando o valor precisa mudar (contadores, acumuladores) |
| `var` | Sim | **Nunca**: é a forma antiga, com regras confusas. Você vai ver em código legado. |

```js
const pi = 3.14;
pi = 3;   // ❌ TypeError: Assignment to constant variable.
```

Começar com `const` e só trocar para `let` quando precisar deixa o código mais fácil de entender:
quem lê sabe que aquele valor nunca muda.

### Nomes de variáveis

- Use **camelCase**: `salarioBruto`, `quantidadeDeItens`, `ehValido`.
- Nomes **descritivos**: `precoComDesconto` em vez de `p2` ou `x`.
- Booleanos (verdadeiro/falso) costumam começar com `eh`, `tem`, `pode`, `esta`: `ehPrimo`, `temDesconto`.
- Não podem começar com número nem ter espaços ou hífen. JavaScript diferencia maiúsculas: `nome` ≠ `Nome`.
- Pode usar acentos, mas evite: muitas equipes proíbem para não ter problema com teclados e ferramentas.

---

## 4. Tipos de dados

Todo valor tem um **tipo**. Os principais:

| Tipo | Exemplos | Para quê |
| --- | --- | --- |
| `string` | `"Ana"`, `'olá'`, `` `oi` `` | Texto |
| `number` | `42`, `3.14`, `-7` | Números (inteiros e decimais são o mesmo tipo) |
| `boolean` | `true`, `false` | Verdadeiro ou falso |
| `undefined` | `undefined` | "Ainda não tem valor" |
| `null` | `null` | "Sem valor, de propósito" |
| `object` | `{ nome: "Ana" }`, `[1, 2, 3]` | Coleções (seção 9) |

O operador `typeof` diz o tipo:

```js
typeof "Ana";     // "string"
typeof 42;        // "number"
typeof true;      // "boolean"
typeof undefined; // "undefined"
```

### 4.1 Strings (texto)

```js
const simples = 'aspas simples';
const duplas = "aspas duplas";
const nome = "Ana";
const saudacao = `Olá, ${nome}! Você tem ${20 + 8} anos.`;   // template literal
```

**Template literals** (com crase `` ` ``) permitem colocar valores dentro do texto com `${...}`.
Use sempre que for montar um texto com variáveis. É bem mais legível que `"Olá, " + nome + "!"`.

**Acessando caracteres.** Uma string é uma sequência de caracteres numerados a partir de **zero**:

```js
const palavra = "casa";
//               0123
palavra.length;                   // 4
palavra[0];                       // "c"
palavra[palavra.length - 1];      // "a" (o último)
```

**Métodos de string mais usados:**

```js
const frase = "  Olá, Mundo!  ";

frase.trim();                    // "Olá, Mundo!"         (tira espaços das pontas)
frase.toUpperCase();             // "  OLÁ, MUNDO!  "
frase.toLowerCase();             // "  olá, mundo!  "
frase.includes("Mundo");         // true                  (contém?)
"banana".indexOf("n");           // 2                     (posição da 1ª ocorrência; -1 se não achar)
"banana".startsWith("ba");       // true
"banana".slice(1, 4);            // "ana"                 (do índice 1 até o 4, sem incluir o 4)
"a-b-c".split("-");              // ["a", "b", "c"]       (quebra em um array)
"4500,50".replace(",", ".");     // "4500.50"             (troca a 1ª ocorrência)
"a,b,c".replaceAll(",", ";");    // "a;b;c"               (troca todas)
"5".padStart(3, "0");            // "005"
```

Métodos **não alteram** a string original; eles **retornam uma nova**:

```js
const nome = "ana";
nome.toUpperCase();    // "ANA"
console.log(nome);     // "ana", continua igual
const maiusculo = nome.toUpperCase();   // guarde o resultado se precisar dele
```

**Percorrendo cada caractere** com `for...of` (seção 7):

```js
for (const letra of "sol") {
  console.log(letra);   // s, depois o, depois l
}
```

**Comparando sem se importar com maiúsculas e acentos.** Para o computador, `"a"`, `"A"` e `"á"`
são caracteres diferentes. Dois truques resolvem:

1. `toLowerCase()` deixa tudo minúsculo.
2. `normalize("NFD")` **separa** a letra do acento: `"á"` vira `"a"` + `"´"` (dois caracteres).
   Depois basta ignorar o caractere do acento.

```js
const texto = "Ônibus".toLowerCase().normalize("NFD");
// texto agora é "o" + "^" + "nibus" (o acento virou um caractere separado)

let semAcento = "";
for (const caractere of texto) {
  if ("abcdefghijklmnopqrstuvwxyz".includes(caractere)) {
    semAcento += caractere;   // só guarda as letras de a até z
  }
}
console.log(semAcento);   // "onibus"
```

Você vai usar isso nos exercícios 07 (palíndromo) e 08 (vogais).

**Maiúscula ou minúscula?** Um caractere é letra maiúscula quando ele **muda** ao virar minúsculo:

```js
const c = "A";
c !== c.toLowerCase();   // true → é maiúscula
"7" !== "7".toLowerCase(); // false → números e símbolos não mudam
```

### 4.2 Números

```js
10 + 3;    // 13
10 - 3;    // 7
10 * 3;    // 30
10 / 3;    // 3.3333333333333335
10 % 3;    // 1   ← resto da divisão (módulo)
2 ** 3;    // 8   ← potência
```

O operador `%` (resto) é mais útil do que parece:

```js
7 % 2;     // 1 → ímpar (resto 1 na divisão por 2)
8 % 2;     // 0 → par
15 % 5;    // 0 → 15 é múltiplo de 5
```

**O objeto `Math`** tem as funções matemáticas:

```js
Math.round(2.5);     // 3     arredonda para o inteiro mais próximo
Math.round(2.4);     // 2
Math.floor(2.9);     // 2     arredonda para BAIXO
Math.ceil(2.1);      // 3     arredonda para CIMA
Math.abs(-5);        // 5     valor absoluto (sem sinal)
Math.sqrt(16);       // 4     raiz quadrada
Math.max(3, 9, 1);   // 9     o maior
Math.min(3, 9, 1);   // 1     o menor
Math.random();       // número aleatório entre 0 (incluído) e 1 (não incluído)
```

**Arredondar para N casas decimais:** multiplique, arredonde e divida.

```js
const imc = 22.857142;
Math.round(imc * 10) / 10;     // 22.9   (1 casa)
Math.round(imc * 100) / 100;   // 22.86  (2 casas)
```

**`Infinity`** é um número especial, maior que qualquer outro: `1000000 < Infinity` é `true`.
É útil em tabelas para dizer "daqui para cima, sem limite".

### 4.3 Convertendo texto em número

Tudo o que vem do terminal ou de um formulário chega como **texto**. Somar textos **junta** em vez de somar:

```js
"10" + "5";            // "105"  ← juntou!
Number("10") + Number("5");   // 15
```

```js
Number("42");      // 42
Number("3.5");     // 3.5
Number("3,5");     // NaN  ← o JavaScript usa PONTO como separador decimal
Number("abc");     // NaN
Number("");        // 0    ← cuidado!
String(42);        // "42"
```

**`NaN`** significa *Not a Number*: o resultado de uma conversão que não deu certo. Ele tem uma
característica estranha: `NaN === NaN` é `false`. Para testar, use:

```js
Number.isNaN(Number("abc"));   // true
Number.isInteger(5);           // true
Number.isInteger(5.5);         // false
```

### 4.4 `undefined` e `null`

```js
let endereco;
console.log(endereco);   // undefined: a variável existe, mas nunca recebeu valor

let telefone = null;     // null: "não tem telefone", de propósito
```

> ✏️ **Pratique agora — Exercício 01: Celsius para Fahrenheit**
>
> Abra `exercicios/02-js-fundamentos/01-celsius-para-fahrenheit.js`. É uma fórmula: basta retornar a conta.
> Lembre do `return` (seção 0).
>
> ```bash
> npm run exercicio -- 01-celsius
> ```

---

## 5. Operadores

### 5.1 Atribuição

```js
let total = 10;
total = total + 5;   // 15
total += 5;          // 20  (atalho para total = total + 5)
total -= 3;          // 17
total *= 2;          // 34
total++;             // 35  (soma 1)
total--;             // 34  (subtrai 1)
```

### 5.2 Comparação

```js
5 > 3;      // true
5 >= 5;     // true
5 < 3;      // false
5 === 5;    // true   (igual: mesmo valor E mesmo tipo)
5 !== 3;    // true   (diferente)
5 === "5";  // false  (number não é string)
5 == "5";   // true   ← o == converte os tipos antes de comparar
```

**Use sempre `===` e `!==`.** O `==` faz conversões automáticas cheias de pegadinhas
(`0 == ""` é `true`, `null == undefined` é `true`). Times profissionais proíbem o `==`.

### 5.3 Lógicos

| Operador | Nome | Resultado |
| --- | --- | --- |
| `a && b` | E | `true` se **os dois** forem verdadeiros |
| `a \|\| b` | OU | `true` se **pelo menos um** for verdadeiro |
| `!a` | NÃO | Inverte: `!true` é `false` |

```js
const idade = 20;
const temIngresso = true;

const podeEntrar = idade >= 18 && temIngresso;    // true
const ehFimDeSemana = dia === "sábado" || dia === "domingo";
const percentualInvalido = percentual < 0 || percentual > 100;
```

### 5.4 Truthy e falsy

Em uma condição, todo valor vira `true` ou `false`. Estes valores são **falsy** (contam como falso):

```
false   0   ""   null   undefined   NaN
```

Todo o resto é **truthy**, inclusive `"0"`, `"false"`, `[]` e `{}`.

```js
const nome = "";
if (!nome) {
  console.log("Nome é obrigatório");   // entra aqui, porque "" é falsy
}
```

### 5.5 Operador ternário

Um `if/else` em uma linha, para **escolher entre dois valores**:

```js
const situacao = media >= 7 ? "aprovado" : "reprovado";
//               condição   ? se verdade : se falso
```

Use para escolhas simples. Se ficar difícil de ler, use `if`.

### 5.6 Valor padrão com `??`

`a ?? b` retorna `a`, a não ser que `a` seja `null` ou `undefined`; aí retorna `b`:

```js
const dependentes = valorInformado ?? 0;
```

---

## 6. Condicionais

### 6.1 `if`, `else if`, `else`

```js
function classificarIMC(imc) {
  if (imc < 18.5) {
    return "abaixo do peso";
  } else if (imc < 25) {
    return "normal";
  } else if (imc < 30) {
    return "sobrepeso";
  } else {
    return "obesidade";
  }
}
```

As condições são testadas **de cima para baixo**, e só o **primeiro** bloco verdadeiro roda.
Por isso, no `else if (imc < 25)`, já sabemos que `imc >= 18.5`: não precisa repetir.

**Cuidado com os limites:** o enunciado diz "de 18.5 até menor que 25". 18.5 é "normal", então
a primeira condição é `< 18.5` (e não `<= 18.5`). Erros de limite (*off-by-one*) estão entre os bugs mais comuns que existem.

### 6.2 Retorno antecipado (*early return*)

Dentro de uma função, o `return` **encerra** a função na hora. Isso permite eliminar casos
especiais logo no começo e deixar o caminho principal limpo:

```js
function ehPrimo(numero) {
  if (numero < 2) return false;   // caso especial resolvido, função acaba aqui

  // daqui para baixo, sabemos que numero >= 2
  // ...
}
```

Quando o bloco do `if` tem só uma instrução, as chaves podem ser omitidas, como acima. Use isso
só em linhas curtas.

### 6.3 `switch`

Para comparar **uma variável** com vários valores exatos:

```js
function nomeDoDia(numero) {
  switch (numero) {
    case 0:
      return "domingo";
    case 6:
      return "sábado";
    default:
      return "dia útil";
  }
}
```

Se não usar `return`, coloque `break` no fim de cada `case`, senão o código "cai" no próximo.

> ✏️ **Pratique agora — Exercícios 02 e 03**
>
> Agora você já toma decisões. Faça um de cada vez:
>
> - **02-classificar-numero**: par ou ímpar, positivo ou negativo  
>   `npm run exercicio -- 02-classificar`
> - **03-imc**: calcular e classificar o IMC (atenção aos limites das faixas)  
>   `npm run exercicio -- 03-imc`

---

## 7. Laços de repetição

Laços repetem um bloco de código. Imagine imprimir a tabuada sem eles: dez linhas quase iguais.

### 7.1 `for`: quando você sabe quantas vezes

```js
for (let i = 1; i <= 10; i++) {
  console.log(`7 x ${i} = ${7 * i}`);
}
```

As três partes, separadas por `;`:

1. **Início**: `let i = 1` roda uma vez, antes de tudo.
2. **Condição**: `i <= 10` é testada **antes** de cada volta. Se for falsa, o laço acaba.
3. **Passo**: `i++` roda **depois** de cada volta.

Você pode contar de outros jeitos:

```js
for (let i = 2; i <= 10; i += 2) { }        // 2, 4, 6, 8, 10 (de 2 em 2)
for (let i = 10; i >= 1; i--) { }           // 10, 9, 8, ..., 1 (de trás para frente)
for (let i = texto.length - 1; i >= 0; i--) { }   // índices de uma string, do último ao primeiro
```

### 7.2 `while`: enquanto uma condição for verdadeira

```js
let saldo = 1000;
let meses = 0;
while (saldo < 2000) {
  saldo *= 1.01;   // rende 1% ao mês
  meses++;
}
console.log(`Dobrou em ${meses} meses`);
```

Use quando **não sabe** quantas voltas serão. Garanta que a condição vai ficar falsa um dia,
senão o laço é **infinito** e o programa trava (aperte `Ctrl+C` para interromper).

`do...while` é igual, mas roda **pelo menos uma vez**, porque testa no fim:

```js
let resposta;
do {
  resposta = perguntar();
} while (resposta !== "sair");
```

### 7.3 `for...of`: percorrer cada item

Para passar por cada elemento de um array ou cada caractere de uma string, sem se preocupar com índices:

```js
const notas = [8, 6.5, 9];
for (const nota of notas) {
  console.log(nota);
}
```

### 7.4 `break` e `continue`

```js
for (const numero of [3, 8, -1, 5]) {
  if (numero < 0) break;        // para o laço inteiro
  console.log(numero);          // 3, 8
}

for (let i = 1; i <= 5; i++) {
  if (i === 3) continue;        // pula só esta volta
  console.log(i);               // 1, 2, 4, 5
}
```

### 7.5 Os padrões que você vai usar sempre

**Acumulador**: somar valores:

```js
let soma = 0;                   // começa no "elemento neutro" da soma
for (let i = 1; i <= 100; i++) {
  soma += i;
}
// soma = 5050
```

Para multiplicar, o acumulador começa em **1** (multiplicar por 0 zeraria tudo).

**Contador**: contar quantos atendem a uma condição:

```js
let quantidade = 0;
for (const letra of "banana") {
  if (letra === "a") quantidade++;
}
// quantidade = 3
```

**Construtor de resultado**: montar um texto ou array aos poucos:

```js
let invertido = "";
for (let i = texto.length - 1; i >= 0; i--) {
  invertido += texto[i];
}

const linhas = [];
for (let i = 1; i <= 3; i++) {
  linhas.push(`linha ${i}`);
}
```

**Bandeira (flag)**: descobrir se **algum** item atende a uma condição:

```js
let temNumero = false;
for (const caractere of senha) {
  if ("0123456789".includes(caractere)) temNumero = true;
}
```

**Busca com retorno antecipado**: parar assim que encontrar:

```js
function calcularFrete(peso, tabela) {
  for (const faixa of tabela) {
    if (peso <= faixa.ate) return faixa.preco;   // achou: devolve e encerra a função
  }
  throw new Error("Peso acima do limite da tabela");   // percorreu tudo e não achou
}
```

**Maior/menor**: guardar o "campeão" até agora:

```js
let maior = numeros[0];
for (const numero of numeros) {
  if (numero > maior) maior = numero;
}
```

> ✏️ **Pratique agora — Exercícios 04 a 11**
>
> Laços são o assunto que mais precisa de prática. Faça em ordem, um de cada vez. Os últimos montam um array vazio com `push`, como no padrão "construtor de resultado" (7.5); arrays aparecem em detalhe na seção 9.
>
> - **04-somatorios**: acumuladores  
>   `npm run exercicio -- 04-somatorios`
> - **05-primo**: laço com retorno antecipado  
>   `npm run exercicio -- 05-primo`
> - **06-inverter-texto**: percorrer um texto de trás para frente  
>   `npm run exercicio -- 06-inverter`
> - **07-palindromo**: normalizar texto e comparar  
>   `npm run exercicio -- 07-palindromo`
> - **08-contar-vogais**: contador  
>   `npm run exercicio -- 08-contar`
> - **09-fizzbuzz**: o clássico de entrevista  
>   `npm run exercicio -- 09-fizzbuzz`
> - **10-tabuada**: laço montando um array de textos  
>   `npm run exercicio -- 10-tabuada`
> - **11-validar-senha**: flags e uma lista de mensagens de erro  
>   `npm run exercicio -- 11-validar`

---

## 8. Funções

Uma função é um **bloco de código com nome** que você pode chamar quantas vezes quiser.
Ela recebe **parâmetros** e **retorna** um resultado.

```js
function calcularIMC(pesoKg, alturaM) {
  const imc = pesoKg / (alturaM * alturaM);
  return Math.round(imc * 10) / 10;
}

const resultado = calcularIMC(70, 1.75);   // 22.9
//                            ↑     ↑
//                     argumentos (os valores passados)
```

- **Parâmetros** são as variáveis da definição (`pesoKg`, `alturaM`).
- **Argumentos** são os valores passados na chamada (`70`, `1.75`).
- `return` devolve o valor **e encerra** a função. Sem `return`, a função retorna `undefined`.

### 8.1 Arrow functions

Uma forma mais curta de escrever funções, muito usada no mercado:

```js
const dobrar = (numero) => numero * 2;    // retorno implícito: sem chaves, não precisa de return

const calcularArea = (largura, altura) => {
  const area = largura * altura;
  return area;                            // com chaves, precisa de return
};
```

Neste curso, use `function` para as funções principais e arrow functions para funções curtas.

### 8.2 Parâmetros com valor padrão

```js
function saudar(nome, saudacao = "Olá") {
  return `${saudacao}, ${nome}!`;
}

saudar("Ana");              // "Olá, Ana!"
saudar("Ana", "Bom dia");   // "Bom dia, Ana!"
```

### 8.3 Funções que usam funções

Funções pequenas se combinam para resolver problemas grandes:

```js
function calcularMedia(notas) { /* ... */ }

function situacao(aluno) {
  const media = calcularMedia(aluno.notas);   // reaproveita a outra função
  if (media >= 7) return "aprovado";
  return "reprovado";
}
```

### 8.4 Funções puras

Uma função é **pura** quando:
1. o resultado depende **só dos parâmetros** (mesma entrada → mesma saída, sempre);
2. ela **não altera nada fora dela** (não imprime, não muda variáveis externas, não grava arquivos).

```js
// ✅ pura: fácil de testar, de entender e de reaproveitar
function aplicarDesconto(valor, percentual) {
  return valor - (valor * percentual) / 100;
}

// ❌ impura: depende de uma variável de fora e imprime
let descontoAtual = 10;
function aplicarDesconto2(valor) {
  console.log("calculando...");
  return valor - (valor * descontoAtual) / 100;
}
```

Regras de negócio (cálculos de imposto, frete, desconto) devem ser **funções puras**. A parte
que conversa com o usuário (ler do teclado, imprimir) fica separada. Você vai aplicar isso no projeto.

### 8.5 Escopo

Uma variável criada **dentro** de um bloco `{ }` só existe ali dentro:

```js
function exemplo() {
  const dentro = 1;
  if (true) {
    const maisDentro = 2;
    console.log(dentro);       // 1, funciona: o bloco interno enxerga o externo
  }
  console.log(maisDentro);     // ❌ ReferenceError: maisDentro is not defined
}
```

### 8.6 Recursão

Uma função **recursiva** chama a si mesma. Ela precisa de:
1. um **caso base**, que para a recursão;
2. um **passo recursivo**, que resolve um problema **menor**.

```js
function fatorialRecursivo(n) {
  if (n === 0) return 1;                  // caso base: 0! = 1
  return n * fatorialRecursivo(n - 1);    // n! = n × (n-1)!
}
```

O que acontece em `fatorialRecursivo(3)`:

```
fatorialRecursivo(3) = 3 × fatorialRecursivo(2)
                           = 2 × fatorialRecursivo(1)
                                 = 1 × fatorialRecursivo(0)
                                       = 1   ← caso base
                                 = 1 × 1 = 1
                           = 2 × 1 = 2
                     = 3 × 2 = 6
```

Sem caso base, a função se chama para sempre até estourar a memória:
`RangeError: Maximum call stack size exceeded`.

### 8.7 Sinalizando erros com `throw`

O que uma função deve fazer quando recebe um valor impossível, como um desconto de 120%?
Retornar um número qualquer esconderia o problema. O certo é **lançar um erro**:

```js
function aplicarDesconto(valor, percentual) {
  if (percentual < 0 || percentual > 100) {
    throw new Error("Percentual de desconto inválido");
  }
  return valor - (valor * percentual) / 100;
}
```

`throw` interrompe a função na hora (como o `return`) e "sobe" o erro para quem chamou.
Se ninguém tratar, o programa para e mostra a mensagem.

Para **tratar** o erro, use `try...catch`:

```js
try {
  const preco = aplicarDesconto(100, 120);
  console.log(preco);                 // não chega aqui
} catch (erro) {
  console.log(erro.message);          // "Percentual de desconto inválido"
}
```

Divisão de responsabilidades: as funções de **regra** lançam erros; a parte que **conversa com o
usuário** captura e mostra uma mensagem amigável.

> ✏️ **Pratique agora — Exercício 12: fatorial**
>
> Abra `exercicios/02-js-fundamentos/12-fatorial.js`. Resolva duas vezes, com laço e com recursão, lançando erro para
> números negativos.
>
> ```bash
> npm run exercicio -- 12-fatorial
> ```

---

## 9. Arrays e objetos

### 9.1 Arrays: listas ordenadas

```js
const notas = [8, 6.5, 9];
//   índice:   0   1   2

notas[0];              // 8
notas.length;          // 3
notas[notas.length - 1]; // 9 (o último)
notas[5];              // undefined (não existe)

notas.push(10);        // adiciona no fim → [8, 6.5, 9, 10]
notas.pop();           // remove o último e o retorna → 10
notas.includes(9);     // true
notas.indexOf(6.5);    // 1 (ou -1 se não achar)

const vazio = [];
vazio.length === 0;    // true: é assim que se verifica se está vazio
```

`const` em um array impede trocar o array **inteiro**, mas permite mudar o conteúdo (`push`, `pop`).

Percorrendo:

```js
for (const nota of notas) {
  console.log(nota);
}

// quando você precisa do índice:
for (let i = 0; i < notas.length; i++) {
  console.log(`Nota ${i + 1}: ${notas[i]}`);
}
```

### 9.2 Objetos: dados com nome

Um objeto agrupa informações relacionadas, cada uma com um **nome** (chave):

```js
const aluno = {
  nome: "Ana",
  idade: 28,
  notas: [8, 6.5, 9],
  endereco: {
    cidade: "Recife",
    uf: "PE",
  },
};

aluno.nome;               // "Ana"
aluno.endereco.cidade;    // "Recife"
aluno["idade"];           // 28 (com colchetes: útil quando a chave está numa variável)
aluno.email;              // undefined (não existe)

aluno.idade = 29;         // altera
aluno.email = "ana@exemplo.com";   // adiciona uma propriedade nova
```

**Atalho de propriedade.** Quando a variável tem o mesmo nome da chave:

```js
const maior = 9;
const menor = 1;
return { maior, menor };    // mesmo que { maior: maior, menor: menor }
```

### 9.3 Arrays de objetos: o formato dos dados reais

Lista de produtos, de alunos, de pedidos, de faixas de imposto... quase todo dado de sistema é
um array de objetos:

```js
const turma = [
  { nome: "Ana", notas: [8, 6.5, 9] },
  { nome: "Bruno", notas: [5, 6, 4] },
  { nome: "Carla", notas: [10, 9.5, 9] },
];

for (const aluno of turma) {
  console.log(`${aluno.nome} tem ${aluno.notas.length} notas`);
}

turma[1].nome;      // "Bruno"
turma[0].notas[2];  // 9
```

**Uma tabela de faixas**, como as de frete ou de imposto:

```js
const tabelaDeFrete = [
  { ate: 1, preco: 15 },          // até 1 kg
  { ate: 5, preco: 25 },          // até 5 kg
  { ate: Infinity, preco: 60 },   // acima disso
];
```

Guardar regras como **dados** (em vez de vários `if` com números fixos no código) permite
atualizar a tabela sem mexer na lógica.

### 9.4 Desestruturação: tirando valores de um objeto

A desestruturação cria variáveis a partir das propriedades de um objeto:

```js
const pedido = { produto: "Teclado", quantidade: 2, preco: 199.9 };

const { produto, quantidade } = pedido;
console.log(produto);      // "Teclado"
console.log(quantidade);   // 2
```

É muito usada nos **parâmetros** de funções que recebem várias opções, inclusive com valores padrão:

```js
function calcularSalarioLiquido({ salarioBruto, dependentes = 0, outrosDescontos = 0 }) {
  // aqui dentro existem as variáveis salarioBruto, dependentes e outrosDescontos
}

calcularSalarioLiquido({ salarioBruto: 5000 });                   // dependentes = 0
calcularSalarioLiquido({ salarioBruto: 5000, dependentes: 2 });   // a ordem das chaves não importa
```

Vantagem: quem chama a função **vê o nome** de cada valor. Compare `calcular(5000, 2, 0, 12)`
(o que é cada número?) com `calcular({ salarioBruto: 5000, dependentes: 2 })`.

> ✏️ **Pratique agora — Exercícios 13 a 16**
>
> Arrays, objetos e arrays de objetos:
>
> - **13-fibonacci**: montar uma sequência acessando os elementos anteriores  
>   `npm run exercicio -- 13-fibonacci`
> - **14-maior-e-menor**: retornar um objeto `{ maior, menor }`  
>   `npm run exercicio -- 14-maior`
> - **15-boletim**: médias e situação de uma turma de alunos  
>   `npm run exercicio -- 15-boletim`
> - **16-tabela-de-frete**: encontrar a faixa certa em uma tabela (o mesmo padrão do projeto)  
>   `npm run exercicio -- 16-tabela`

---

## 10. Números decimais e dinheiro

Teste isto no Node:

```js
console.log(0.1 + 0.2);   // 0.30000000000000004
```

Não é bug do JavaScript: o computador guarda números em **binário**, e 0.1 não tem
representação exata em binário (assim como 1/3 não tem em decimal: 0,333...). Toda linguagem
tem esse problema. Em um sistema financeiro, centavos "perdidos" viram dinheiro de verdade.

### As soluções

**1. Trabalhar em centavos (números inteiros).** Inteiros são exatos:

```js
const precos = [0.1, 0.2];
let totalEmCentavos = 0;
for (const preco of precos) {
  totalEmCentavos += Math.round(preco * 100);   // 0.1 → 10 centavos; 0.2 → 20
}
const total = totalEmCentavos / 100;   // 0.3 exato
```

Use o `Math.round` na conversão, porque `0.07 * 100` dá `7.000000000000001`.

**2. Arredondar o resultado em centavos** depois de cada conta:

```js
function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

arredondar(59.9 * 0.9);   // 53.91
```

> Sistemas bancários de verdade guardam valores em centavos (inteiros) no banco de dados.
> Você vai ver isso de novo no módulo 13.

### Formatando para o usuário

```js
const valor = 1234.5;
valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });   // "R$ 1.234,50"
valor.toFixed(2);   // "1234.50" (texto com 2 casas, sem formatação brasileira)
```

O `toLocaleString` coloca o ponto de milhar, a vírgula decimal e o "R$". Detalhe: entre "R$" e o
número ele usa um **espaço especial** (espaço inquebrável, que impede a quebra de linha ali),
diferente do espaço comum.

**Formatar é a última coisa.** Faça todas as contas com números e só formate na hora de mostrar.
`"R$ 10,00" + 5` não é uma conta.

> ✏️ **Pratique agora — Exercícios 17 e 18**
>
> Dinheiro sem erro de arredondamento:
>
> - **17-dinheiro**: somar preços, formatar em reais e aplicar desconto  
>   `npm run exercicio -- 17-dinheiro`
> - **18-troco**: o caixa eletrônico que devolve o troco em cédulas e moedas  
>   `npm run exercicio -- 18-troco`

---

## 11. Programas de terminal de verdade

### 11.1 Dividindo o código em arquivos (módulos)

Programas reais têm vários arquivos, cada um com uma responsabilidade. Um arquivo **exporta** o
que quer compartilhar, e outro **importa**:

```js
// src/calculos.js
export function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

export function aplicarDesconto(valor, percentual) {
  return arredondar(valor - (valor * percentual) / 100);
}
```

```js
// src/cli.js
import { aplicarDesconto } from "./calculos.js";

console.log(aplicarDesconto(100, 15));   // 85
```

- O caminho do `import` começa com `./` (a mesma pasta) e **inclui** a extensão `.js`.
- Também dá para exportar variáveis: `export const tabelas = { ... };`.

Para o Node aceitar `import`/`export`, o projeto precisa de um `package.json` dizendo que usa
**módulos ES**. Crie com `npm init -y` e adicione a linha `"type": "module"`:

```json
{
  "name": "calculadora-clt-pj",
  "version": "1.0.0",
  "description": "Compara propostas CLT e PJ pelo terminal",
  "type": "module"
}
```

O `package.json` é a "carteira de identidade" do projeto: nome, descrição, versão e, mais adiante
(módulo 06), as dependências e os scripts.

### 11.2 Recebendo argumentos

Quando você roda `node cli.js --salario 7000`, o texto depois do nome do arquivo chega ao programa em
`process.argv`:

```js
console.log(process.argv);
// [ "/caminho/do/node", "/caminho/cli.js", "--salario", "7000" ]
```

Interpretar isso à mão é trabalhoso. O Node já vem com o `parseArgs`, que faz isso por você:

```js
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    salario: { type: "string" },                      // obrigatório (sem default)
    dependentes: { type: "string", default: "0" },    // opcional, com valor padrão
    "aliquota-pj": { type: "string", default: "6" },  // nomes com hífen vão entre aspas
  },
});

console.log(values.salario);          // "7000" (sempre string!)
console.log(values.dependentes);      // "0" se não foi informado
console.log(values["aliquota-pj"]);   // com hífen, acesse com colchetes
```

```bash
node cli.js --salario 7000 --dependentes 2
```

- Os valores chegam como **texto**: converta com `Number(...)` (seção 4.3).
- Uma opção não informada e sem `default` vem como `undefined`.
- Uma opção desconhecida (ex.: `--salari`) faz o `parseArgs` lançar um erro, e isso é bom: o usuário descobre que digitou errado.

**Aceitando vírgula decimal**, como o brasileiro digita:

```js
function lerNumero(texto) {
  return Number(texto.replace(",", "."));
}

lerNumero("4500,50");   // 4500.5
lerNumero("abc");       // NaN → a validação vai pegar
```

### 11.3 Saídas e códigos de saída

```js
console.log("Resultado normal");     // saída padrão
console.error("Algo deu errado");    // saída de ERRO (aparece no terminal igual, mas pode ser separada)
process.exit(1);                     // encerra o programa com código 1
```

Todo programa de terminal termina com um **código de saída**: `0` significa sucesso; qualquer
outro número, erro. Scripts, ferramentas de automação e pipelines de CI (módulo 17) dependem disso
para saber se um comando funcionou.

### 11.4 O padrão de um programa de terminal

```js
// src/cli.js
import { parseArgs } from "node:util";
import { aplicarDesconto } from "./calculos.js";

const { values } = parseArgs({
  options: {
    valor: { type: "string" },
    desconto: { type: "string", default: "0" },
  },
});

if (values.valor === undefined) {
  console.log("Uso: node src/cli.js --valor 100 [--desconto 10]");
  process.exit(1);
}

try {
  const resultado = aplicarDesconto(Number(values.valor), Number(values.desconto));
  console.log(`Valor final: ${resultado}`);
} catch (erro) {
  console.error(erro.message);
  process.exit(1);
}
```

1. Ler e validar os argumentos; se faltar algo, mostrar o **uso** e sair com erro.
2. Chamar as **funções puras** que fazem os cálculos.
3. Mostrar o resultado.
4. Se algo der errado, mostrar uma mensagem clara (nada de despejar o erro técnico na cara do usuário) e sair com código 1.

---

## 12. Depuração (debugging)

Bugs fazem parte do trabalho, e todo dev passa boa parte do dia investigando. O que muda com a
experiência é o **método**.

### 12.1 Leia a mensagem de erro (inteira)

```
file:///projeto/src/calculos.js:12
  return valor * percentual / 100 - descont;
                                    ^
ReferenceError: descont is not defined
    at aplicarDesconto (file:///projeto/src/calculos.js:12:37)
    at file:///projeto/src/cli.js:5:13
```

- **Tipo do erro**: `ReferenceError`.
- **Mensagem**: `descont is not defined`, ou seja, essa variável não existe (erro de digitação!).
- **Onde**: `calculos.js:12:37`, arquivo, linha 12, coluna 37.
- **Pilha de chamadas** (*stack trace*): quem chamou quem, de baixo para cima.

Os tipos mais comuns:

| Erro | Significa | Causa típica |
| --- | --- | --- |
| `ReferenceError: x is not defined` | A variável não existe | Erro de digitação, variável fora do escopo |
| `TypeError: x is not a function` | Você tentou chamar algo que não é função | Nome errado, import faltando |
| `TypeError: Cannot read properties of undefined (reading 'nome')` | Você fez `algo.nome`, mas `algo` é `undefined` | Índice errado no array, propriedade com nome errado |
| `SyntaxError: Unexpected token` | O código está mal escrito | Parêntese/chave faltando, vírgula sobrando |
| `RangeError: Maximum call stack size exceeded` | Recursão infinita | Faltou o caso base |

### 12.2 `console.log` estratégico

```js
console.log({ salarioBruto, inss, base });   // as chaves mostram o nome junto com o valor
// { salarioBruto: 5000, inss: 497.5, base: 4400 }
```

Coloque logs **antes e depois** do ponto suspeito e compare com o que você esperava. Depois de
achar o bug, **apague os logs**.

### 12.3 O debugger do VS Code

O debugger permite **pausar** o programa em uma linha e ver o valor de cada variável:

1. Clique à esquerda do número da linha para criar um **breakpoint** (bolinha vermelha).
2. Abra um **JavaScript Debug Terminal** (`Ctrl+Shift+P` → *Debug: JavaScript Debug Terminal*).
3. Nesse terminal, rode o programa normalmente (`node src/cli.js --salario 5000`) ou um teste
   (`npm run exercicio -- 06-primo`).
4. A execução para no breakpoint. Use **F10** (próxima linha), **F11** (entrar na função) e **F5**
   (continuar). Passe o mouse sobre as variáveis para ver os valores.

Vale ouro em laços: você vê o valor de `i` e do acumulador a cada volta.

### 12.4 Quando travar

1. Leia a mensagem de erro até o fim.
2. Reproduza com o **menor exemplo possível**.
3. Explique o código em voz alta, linha por linha (a técnica do "patinho de borracha", que
   funciona de verdade).
4. Pesquise a mensagem de erro exata.
5. Consulte a documentação ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)).
6. Só então peça ajuda, explicando **o que tentou**.

---

## Resumo dos exercícios

Você já fez todos ao longo da aula. Confira com `npm run progresso`.

| # | Arquivo | Assunto | Seções |
| --- | --- | --- | --- |
| 01 | `01-celsius-para-fahrenheit.js` | fórmula simples | 4 |
| 02 | `02-classificar-numero.js` | par/ímpar, sinal | 5, 6 |
| 03 | `03-imc.js` | arredondamento e faixas | 4, 6 |
| 04 | `04-somatorios.js` | acumuladores | 7 |
| 05 | `05-primo.js` | laço com retorno antecipado | 6, 7 |
| 06 | `06-inverter-texto.js` | percorrer string de trás para frente | 4, 7 |
| 07 | `07-palindromo.js` | normalizar texto (acentos, pontuação) | 4, 7 |
| 08 | `08-contar-vogais.js` | contador | 4, 7 |
| 09 | `09-fizzbuzz.js` | o clássico de entrevista | 5, 6, 7 |
| 10 | `10-tabuada.js` | laço montando um array | 4, 7 |
| 11 | `11-validar-senha.js` | flags e lista de erros | 4, 5, 7 |
| 12 | `12-fatorial.js` | laço, recursão e `throw` | 7, 8 |
| 13 | `13-fibonacci.js` | sequência num array | 7, 9 |
| 14 | `14-maior-e-menor.js` | retornar um objeto | 7, 9 |
| 15 | `15-boletim.js` | arrays de objetos | 8, 9 |
| 16 | `16-tabela-de-frete.js` | buscar faixa em tabela | 6, 7, 9 |
| 17 | `17-dinheiro.js` | centavos e formatação | 10 |
| 18 | `18-troco.js` | caixa eletrônico de troco | 5, 7, 9, 10 |

Treino extra (recomendado, uma vez por semana): resolva problemas de nível fácil no
[Beecrowd](https://judge.beecrowd.com/) ou no [Exercism](https://exercism.org/tracks/javascript).

---

## Projeto do módulo — Calculadora CLT × PJ

Enunciado completo: [projetos/02-calculadora-clt-pj/README.md](../projetos/02-calculadora-clt-pj/README.md).

Uma ferramenta de terminal que calcula o salário líquido CLT (INSS e IRRF progressivos, com as
tabelas oficiais), o pacote anual (13º, férias, FGTS, benefícios) e quanto faturar como PJ para
ganhar o mesmo. Um problema real, que você mesmo vai usar ao receber propostas.

```bash
npm run corrigir-projeto -- 02 ../calculadora-clt-pj
```

---

## Checklist para avançar

- [ ] Escrevo pseudocódigo antes de programar problemas novos.
- [ ] Uso `const` por padrão, `let` quando preciso, e nunca `var`.
- [ ] Uso sempre `===` e sei o que é truthy e falsy.
- [ ] Converto texto em número e trato `NaN`.
- [ ] Escolho o laço certo (`for`, `while`, `for...of`) e conheço os padrões acumulador, contador e flag.
- [ ] Escrevo funções pequenas e puras, com `return`, e lanço erros com `throw`.
- [ ] Manipulo arrays de objetos e uso desestruturação nos parâmetros.
- [ ] Faço contas com dinheiro sem erro de arredondamento.
- [ ] Separo o código em arquivos com `import`/`export`.
- [ ] Leio uma mensagem de erro e encontro a linha do problema; já usei o debugger.
- [ ] Os 18 exercícios passam sem ajuda de IA (`npm run progresso`).
- [ ] A calculadora CLT × PJ passou na correção e está no meu GitHub com um bom README.
