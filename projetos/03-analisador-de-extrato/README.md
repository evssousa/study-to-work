# Projeto 03 — Analisador de extrato bancário (terminal)

## O problema

"Para onde foi o meu dinheiro este mês?" O app do banco mostra uma lista enorme de transações,
mas não responde essa pergunta. Aplicativos de controle financeiro respondem, mas pedem acesso à
sua conta e guardam os seus dados nos servidores deles.

Você vai construir uma ferramenta que resolve isso **no seu computador**: ela lê o arquivo CSV
que todo banco permite exportar, separa os gastos em categorias com regras que **você** define e
mostra um relatório do mês. Os seus dados nunca saem da sua máquina.

```
$ node src/cli.js relatorio --arquivo outubro.csv --perfil generico --mes 2026-10

Extrato de 2026-10 (perfil: Genérico)

Receitas: R$ 5.000,00
Gastos: R$ 579,40
Saldo: R$ 4.420,60

Gastos por categoria:
  mercado             R$ 432,50   74,6%  (2)
  saude                R$ 58,00   10,0%  (1)
  transporte           R$ 48,90    8,4%  (2)
  outros               R$ 40,00    6,9%  (1)

Maiores gastos:
  05/10/2026  Mercado Bom Preço              R$ 420,10
  07/10/2026  Farmácia Pague Menos           R$ 58,00
  15/10/2026  Cinema                         R$ 40,00

Comparação com 2026-09:
  mercado             R$ 432,50  (+44,2%)
  saude                R$ 58,00  (novo)
  transporte           R$ 48,90  (+91,8%)

Linhas ignoradas: 2
  linha 10: Data inválida: 31/02/2026
  linha 11: Valor inválido: abc
```

## Estrutura (obrigatória: os testes procuram estes arquivos)

```
analisador-de-extrato/
├── package.json            # "type": "module", "name" e "description"
├── .gitignore              # node_modules/, *.csv e regras.json (seus dados não vão para o GitHub!)
├── README.md
├── regras.exemplo.json     # pelo menos 6 regras de exemplo, para quem baixar o projeto
└── src/
    ├── erros.js            # classes de erro
    ├── csv.js              # leitura de CSV
    ├── conversores.js      # texto → data ISO, texto → centavos
    ├── perfis.js           # como ler o CSV de cada banco
    ├── importar.js         # CSV → transações
    ├── categorizar.js      # transações → transações com categoria
    ├── relatorio.js        # cálculos do relatório (funções puras)
    ├── armazenamento.js    # carregarJson / salvarJson
    └── cli.js              # o programa de terminal
```

**Regra de ouro:** só o `cli.js` imprime (`console.log`) e lê arquivos de extrato. Todos os outros
módulos são funções que recebem dados e retornam dados. É isso que os torna testáveis e
reaproveitáveis: no módulo 04 você poderá usar os mesmos módulos numa página web.

**Dinheiro em centavos.** Toda transação guarda o valor em **centavos inteiros** (`valorCentavos: -4590`),
como você aprendeu no módulo 02. Só o relatório converte para reais na hora de mostrar.

## Requisitos de cada módulo

### `src/erros.js`

- `LinhaInvalidaError(linha, mensagem)`: estende `Error`, com `name = "LinhaInvalidaError"` e a propriedade `linha`.

### `src/csv.js`

- `lerLinhaCsv(linha, separador = ",")` → array de campos. Campos entre aspas podem conter o
  separador; `""` dentro de aspas vira `"`; campos vazios são mantidos. Os campos **não** são aparados (sem `trim`).
  ```js
  lerLinhaCsv('03/10/2026;"Padaria; Filial 2";-12,40', ";")   // ["03/10/2026", "Padaria; Filial 2", "-12,40"]
  lerLinhaCsv('"Loja ""Boa"" Vista";10', ";")                // ['Loja "Boa" Vista', "10"]
  ```
- `lerCsv(texto, separador = ",")` → array de linhas (cada uma, um array de campos), ignorando
  linhas em branco e aceitando `\r\n`.

Simplificação aceita: campos entre aspas **não** precisam suportar quebra de linha dentro deles.

### `src/conversores.js`

- `converterData(texto, formato)` → data ISO `"AAAA-MM-DD"`. Formatos: `"DD/MM/AAAA"` e `"AAAA-MM-DD"`.
  Ignora espaços nas pontas. Datas que não existem (31/02, mês 13, 29/02 em ano não bissexto) lançam
  `Error("Data inválida: <texto original>")`. Formato desconhecido lança `Error("Formato de data desconhecido: <formato>")`.
  Dica: monte a data em UTC e confira se `toISOString()` devolve o mesmo dia.
- `converterValor(texto, decimal)` → **centavos inteiros**. `decimal` é `","` (1.234,56) ou `"."` (1,234.56).
  Ignora `R$` e espaços. Texto inválido (inclusive vazio) lança `Error("Valor inválido: <texto original>")`.
  ```js
  converterValor("-R$ 1.234,56", ",")   // -123456
  converterValor("1,234.56", ".")       // 123456
  ```

### `src/perfis.js`

Cada banco exporta o CSV de um jeito. Um **perfil** descreve como ler o arquivo:

```js
export const perfis = {
  generico: {
    nome: "Genérico",
    separador: ";",
    temCabecalho: true,
    colunas: { data: 0, descricao: 1, valor: 2 },   // em que posição está cada informação
    formatoData: "DD/MM/AAAA",
    decimal: ",",
    gastosPositivos: false,
  },
  // + pelo menos UM perfil de um banco real
};
```

- O perfil `generico` deve ser **exatamente** o de cima (os testes usam ele).
- Acrescente pelo menos um perfil real: exporte o extrato (ou a fatura do cartão) do **seu** banco,
  abra o CSV no VS Code e descubra o separador, a ordem das colunas, o formato da data e do valor.
- `gastosPositivos: true` serve para faturas de cartão, em que as compras costumam vir com valor
  **positivo**: o sinal é invertido na importação, para que gastos sejam sempre negativos.

### `src/importar.js`

- `importarExtrato(texto, perfil)` → `{ transacoes, erros }`.
  - Cada transação: `{ data, descricao, valorCentavos }`, ordenadas por data.
  - A descrição fica sem espaços nas pontas e sem espaços repetidos.
  - Pula o cabeçalho quando `perfil.temCabecalho` é `true`.
  - **Uma linha com problema não derruba a importação:** vira um item em `erros`:
    `{ linha, mensagem }`. `linha` é a posição da linha no arquivo **sem contar as linhas em branco**
    (o cabeçalho é a linha 1). Mensagens: a do conversor que falhou, ou `"Colunas faltando"`.
  - Use `LinhaInvalidaError` internamente e relance qualquer outro erro (seção 7 da aula).

### `src/categorizar.js`

- `categorizar(transacoes, regras)` → **um array novo** em que cada transação ganha a propriedade `categoria`.
  Não altera o array recebido nem as transações (os testes congelam tudo).
  - `regras`: `[{ categoria: "transporte", padrao: "uber|99 ?pop" }, ...]`. O `padrao` é uma
    expressão regular, testada **sem diferenciar maiúsculas e ignorando acentos** da descrição.
  - Valores positivos são sempre `"receitas"`.
  - A **primeira** regra que combinar vence; nenhuma combinou: `"outros"`.
  - Padrão inválido lança `Error("Regra inválida para a categoria <categoria>: <padrao>")`.

### `src/relatorio.js`: funções puras

| Função | Retorna |
| --- | --- |
| `filtrarPorMes(transacoes, "2026-10")` | As transações do mês |
| `mesAnterior("2026-01")` | `"2025-12"` |
| `totais(transacoes)` | `{ receitasCentavos, gastosCentavos, saldoCentavos }`. Gastos como número **positivo** |
| `resumirPorCategoria(transacoes)` | Só gastos: `[{ categoria, totalCentavos, quantidade, percentual }]`, do maior total para o menor (empate: ordem alfabética). `percentual` com 1 casa decimal |
| `maioresGastos(transacoes, n)` | Os `n` maiores gastos, do maior para o menor |
| `compararMeses(transacoes, mes)` | Para cada categoria de gasto do mês **ou** do mês anterior: `{ categoria, atualCentavos, anteriorCentavos, variacaoPercentual }`. Variação com 1 casa, `null` se o anterior for 0. Ordenado como o resumo, pelo valor atual |
| `formatarCentavos(centavos)` | `"R$ 1.234,56"` |

### `src/armazenamento.js`

- `carregarJson(caminho, valorPadrao)` e `salvarJson(caminho, dados)`, como no exercício 19.

### `src/cli.js`: os comandos

```bash
node src/cli.js relatorio --arquivo extrato.csv --perfil generico [--mes 2026-10] [--regras regras.json]
node src/cli.js regras [--regras regras.json]
node src/cli.js adicionar-regra --categoria lazer --padrao "cinema|teatro" [--regras regras.json]
```

- `--perfil` vale `generico` por padrão; `--regras` vale `regras.json` por padrão (na pasta atual).
- `relatorio` sem `--mes` usa o mês da transação mais recente.
- A saída do `relatorio` deve conter (veja o exemplo no topo):
  - `Receitas: R$ ...`, `Gastos: R$ ...` e `Saldo: R$ ...`
  - a seção `Gastos por categoria`, com uma linha por categoria **começando pelo nome da categoria**
    (espaços antes são permitidos), contendo o total e o percentual no formato `74,6%`
  - a seção `Maiores gastos`, com a data no formato brasileiro e a descrição
  - a seção `Comparação com <mês anterior>`, com a variação no formato `+44,2%` (ou `novo` quando não havia gasto)
  - se houver, `Linhas ignoradas` com uma linha `linha N: mensagem` para cada erro
  - Para o percentual com uma casa: `numero.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })`
- `regras` lista as regras; `adicionar-regra` grava a regra nova no arquivo e imprime
  `Regra adicionada: <categoria>`. Padrão inválido: mensagem de erro e **nada é gravado**.
- Erros (perfil desconhecido, arquivo não encontrado, regra inválida): mensagem clara e `process.exit(1)`.
  - `Perfil desconhecido: <perfil>. Disponíveis: generico, ...`
  - `Arquivo não encontrado: <caminho>`
- Sem comando: mensagem começando com `Uso:` e código de saída 1.

### README.md do projeto

Título, seção **Como usar** (com o comando `relatorio`), uma seção explicando **como exportar o
extrato** do(s) banco(s) que você suporta, um exemplo da saída (`Gastos por categoria`) e uma
seção sobre **privacidade** (por que os dados não saem do computador e por que o `.gitignore`
ignora os CSVs).

## Correção

```bash
npm run corrigir-projeto -- 03 ../analisador-de-extrato
```

Depois, **use de verdade**: exporte os últimos meses do seu banco, crie as suas regras com
`adicionar-regra` e rode o relatório. Ajuste até as categorias fazerem sentido para você.

## Para ir além (opcional)

- Comando `exportar`, que grava as transações categorizadas num CSV novo (para abrir numa planilha).
- Orçamento por categoria (`orcamento.json`) com alerta quando um gasto passar do limite.
- Importar vários arquivos de uma vez e juntar as transações sem duplicar.

## O que falar na entrevista

"Fiz uma ferramenta que importa extratos bancários em CSV e gera um relatório mensal por
categoria. Escrevi o parser de CSV do zero, tratando campos entre aspas. As regras de categoria
são expressões regulares que o usuário cadastra, e o formato de cada banco fica num perfil de
configuração, então suportar um banco novo não exige mudar código. Linhas com erro não derrubam
a importação: elas são coletadas e mostradas no fim. Valores ficam em centavos inteiros, e todas
as regras são funções puras com testes."
