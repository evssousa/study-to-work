# Exercício 07 — Escreva bons testes (e prove que eles pegam defeitos)

Até agora **o curso** escreveu os testes e você fez o código passar. Aqui os papéis se invertem: o
código está pronto e é **você** quem escreve os testes. É a habilidade que mais valoriza um dev em
uma equipe, porque um teste fraco passa mesmo quando o código está errado.

## O código a testar

[`frete.js`](frete.js) (não altere!) exporta `calcularFrete({ pesoKg, cep, valorDoPedido })`:

- peso precisa ser maior que zero → senão `Error("Peso inválido")`;
- CEP com 8 dígitos, com ou sem hífen → senão `Error("CEP inválido")`;
- peso acima de 30 kg → `Error("Peso acima do limite")`;
- preço por faixa: até 1 kg = 15, até 5 kg = 25, até 30 kg = 60;
- CEPs que começam com 6, 7, 8 ou 9 pagam 20% a mais;
- pedidos de R$ 200 ou mais: frete grátis (`0`).

## Escreva os testes em `frete.spec.js`

Usando o **test runner do Node** (nada para instalar):

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { calcularFrete } from "./frete.js";

test("peso de até 1 kg custa 15", () => {
  assert.equal(calcularFrete({ pesoKg: 1, cep: "50000-000", valorDoPedido: 50 }), 15);
});

test("peso zero é inválido", () => {
  assert.throws(() => calcularFrete({ pesoKg: 0, cep: "50000000", valorDoPedido: 50 }), /Peso inválido/);
});
```

- `test("descrição", () => { ... })` declara um teste. Dê nomes que digam a **regra**.
- `assert.equal(atual, esperado)` compara valores primitivos (com `/strict`, usa `===`).
- `assert.deepEqual` compara objetos e arrays.
- `assert.throws(() => código, /texto da mensagem/)` confere que o código lança um erro.
- Para rodar à mão: `node --test exercicios/06-ferramentas/07-testes-node/frete.spec.js`.

(O arquivo se chama `.spec.js` aqui só para o Vitest do curso não confundir os testes; no seu projeto
use o padrão `nome.test.js`.)

## Como a correção funciona: teste de mutação

A correção faz duas coisas:

1. Roda os seus testes no `frete.js` **correto**: todos devem passar, e você precisa ter **pelo menos
   10 testes**.
2. Planta **defeitos de propósito** em cópias do `frete.js` (os *mutantes*: trocar um `<=` por `<`, mudar
   um número, tirar uma validação...) e roda os seus testes em cada uma. **Cada defeito precisa fazer pelo
   menos um dos seus testes falhar.** Se todos passam, a correção diz qual defeito os seus testes não
   perceberam.

Isso é *mutation testing*, usado em empresas para medir se uma suíte de testes é de verdade. Para
matar todos os mutantes, **teste os limites**: o valor exato da fronteira (1 kg, 5 kg, 30 kg, R$ 200), logo
abaixo e logo acima; cada caso de erro; entradas com e sem máscara; e **confira os valores**, não só se
"não deu erro".
