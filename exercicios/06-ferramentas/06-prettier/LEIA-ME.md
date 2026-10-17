# Exercício 06 — Configurando o Prettier

O Prettier reescreve o código no estilo configurado, e acaba com as discussões de "aspas simples ou duplas?"
nos Pull Requests. A configuração fica em um arquivo na raiz do projeto: `.prettierrc.json`.

O teste roda o **Prettier de verdade** com a configuração que você escrever em
[`.prettierrc.json`](.prettierrc.json) (hoje vazia: `{}`) e compara o resultado.

## O estilo que o seu time combinou

| Decisão | Opção do Prettier | Valor |
| --- | --- | --- |
| Sem ponto e vírgula no fim das linhas | `semi` | `false` |
| Aspas simples nos textos | `singleQuote` | `true` |
| Linhas de até 60 caracteres | `printWidth` | `60` |
| Indentar com 4 espaços | `tabWidth` | `4` |
| Vírgula no fim de listas multilinha, em todo lugar | `trailingComma` | `"all"` |
| Setas sem parênteses quando há um só parâmetro: `n => n * 2` | `arrowParens` | `"avoid"` |

Documentação de todas as opções: https://prettier.io/docs/options

## Código de entrada (como foi escrito, bagunçado)

```js
const produtos = [{nome: "Café", preco: 25}, {nome: "Pão", preco: 4.5}, {nome: "Leite", preco: 6}]
function total(lista) { return lista.reduce((soma, item) => soma + item.preco, 0); }
const dobrar = (n) => n * 2;
console.log("Total:", total(produtos), "e o dobro é", dobrar(total(produtos)));
```

## O que o Prettier deve produzir

```js
const produtos = [
    { nome: 'Café', preco: 25 },
    { nome: 'Pão', preco: 4.5 },
    { nome: 'Leite', preco: 6 },
]
function total(lista) {
    return lista.reduce(
        (soma, item) => soma + item.preco,
        0,
    )
}
const dobrar = n => n * 2
console.log(
    'Total:',
    total(produtos),
    'e o dobro é',
    dobrar(total(produtos)),
)
```

Repare no que cada opção faz: sem `;`, aspas simples, quebra de linha em 60 colunas, indentação de 4
espaços, vírgula depois do último item (`0,` e `dobrar(total(produtos)),`) e `n =>` sem parênteses.

## Como fazer

1. Abra o `.prettierrc.json` e escreva as seis opções no formato JSON.
2. Rode a correção: `npm run exercicio -- 06-prettier`.

**Para ver o Prettier funcionando no seu editor:** instale a extensão *Prettier – Code formatter*
e ative *Format on Save*. Para testar na linha de comando, em um arquivo qualquer:
`npx prettier --config exercicios/06-ferramentas/06-prettier/.prettierrc.json --check arquivo.js`.
