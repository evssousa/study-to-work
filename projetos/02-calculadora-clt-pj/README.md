# Projeto 02 — Calculadora CLT × PJ (terminal)

## O problema

Toda pessoa que trabalha com tecnologia no Brasil chega nesta dúvida: *"Me ofereceram
R$ 9.000 como PJ. Isso é mais ou menos do que os R$ 7.000 CLT que eu ganho hoje?"*

A conta não é óbvia: no CLT existem INSS e Imposto de Renda descontados na folha, mas
também 13º salário, férias com um terço a mais, FGTS e benefícios. No PJ não existe
nada disso, e ainda há imposto da empresa e contador.

Você vai construir uma ferramenta de terminal que **responde essa pergunta**, e vai usá-la
você mesmo quando receber propostas.

```bash
$ node src/cli.js --salario 7000 --dependentes 1 --beneficios 900 --contador 200

Salário bruto: R$ 7.000,00
INSS: R$ ...
IRRF: R$ ...
Salário líquido CLT: R$ ...
Total anual CLT: R$ ...
Faturamento PJ equivalente: R$ ... por mês
```

## Requisitos

### Estrutura (obrigatória, porque os testes procuram estes arquivos)

```
calculadora-clt-pj/
├── package.json       # com "type": "module", "name" e "description"
├── .gitignore         # com node_modules
├── README.md
└── src/
    ├── calculos.js    # SÓ funções de cálculo, sem console.log
    ├── tabelas.js     # as tabelas oficiais do ano
    └── cli.js         # lê os argumentos, chama os cálculos e imprime
```

Por que separar? `calculos.js` não sabe que existe um terminal. Assim as mesmas funções
podem ser reaproveitadas num site (módulo 04) ou numa API (módulo 12), e podem ser testadas.

### `src/tabelas.js`

Exporte um objeto `tabelas` com este formato (os números você busca nas fontes oficiais):

```js
export const tabelas = {
  ano: 2026,
  fonte: "https://www.gov.br/...", // de onde você tirou os valores
  inss: {
    faixas: [
      { ate: 0, aliquota: 0 }, // ← preencha: limite da faixa e alíquota (7,5% = 0.075)
      // ...
    ],
  },
  irrf: {
    faixas: [
      { ate: 0, aliquota: 0, deducao: 0 }, // a última faixa usa ate: Infinity
      // ...
    ],
    deducaoPorDependente: 0,
    descontoSimplificado: 0,
    reducao: { isencaoTotalAte: 0, reducaoAte: 0, constante: 0, fator: 0 },
  },
  fgts: 0.08,
};
```

**Onde buscar** (pesquise pelos termos, porque os endereços mudam):
- INSS: "tabela de contribuição mensal INSS empregado" no site do INSS ou da Previdência (gov.br).
- IRRF: "tabela progressiva mensal IRPF" e "redução do imposto de renda mensal" no site da
  Receita Federal (gov.br). A partir de 2026 existe uma **redução** que zera o imposto para
  quem ganha até um certo valor e diminui o imposto numa faixa intermediária; os valores
  dessa regra vão em `reducao`.

Ler a regra oficial e transformá-la em código é exatamente o trabalho de um dev.

### `src/calculos.js`: as funções (e as regras de negócio)

| Função | O que faz |
| --- | --- |
| `arredondar(valor)` | Arredonda para 2 casas decimais (centavos). |
| `calcularINSS(salarioBruto, tabelaINSS)` | **Progressivo**: cada faixa cobra a sua alíquota só sobre a parte do salário que cai nela. Acima da última faixa (o teto), a contribuição não aumenta mais. |
| `calcularIRRF(salarioBruto, inss, dependentes, tabelaIRRF)` | Veja a regra abaixo. |
| `calcularSalarioLiquido({ salarioBruto, dependentes, outrosDescontos }, tabelas)` | Retorna `{ bruto, inss, irrf, outrosDescontos, liquido }`. `dependentes` e `outrosDescontos` valem 0 se não forem informados. |
| `calcularPacoteAnualCLT({ salarioBruto, dependentes, beneficiosMensais }, tabelas)` | Retorna `{ salarios, decimoTerceiro, tercoFerias, fgts, beneficios, total }`. |
| `calcularPJEquivalente(totalAnualCLT, { aliquotaImposto, custoContadorMensal, mesesFaturados })` | Quanto faturar por mês como PJ para receber o mesmo que no CLT. |

**Regra do IRRF:**
1. Deduções = o **maior** valor entre (INSS + dependentes × dedução por dependente) e o desconto simplificado.
2. Base de cálculo = salário bruto − deduções.
3. Encontre a faixa em que a base cabe (`base <= ate`): imposto = base × alíquota − dedução da faixa.
4. Redução (se a tabela tiver `reducao`):
   - salário bruto até `isencaoTotalAte` → imposto zero;
   - salário bruto até `reducaoAte` → imposto − (`constante` − `fator` × salário bruto);
   - acima disso, sem redução.
5. O imposto nunca é negativo. Arredonde em centavos.

**Regra do pacote anual CLT** (cada parte arredondada em centavos):
- `salarios` = líquido mensal × 12
- proporção = líquido mensal ÷ bruto (quanto "sobra" de cada real bruto)
- `decimoTerceiro` = bruto × proporção
- `tercoFerias` = (bruto ÷ 3) × proporção
- `fgts` = alíquota do FGTS × bruto × (13 + 1/3), porque o FGTS incide sobre os 12 salários, o 13º e o terço de férias
- `beneficios` = benefícios mensais × 12 (vale-refeição, plano de saúde...)
- `total` = soma de tudo

**Regra do PJ equivalente:**
`(totalAnualCLT ÷ mesesFaturados + custoContadorMensal) ÷ (1 − aliquotaImposto)`, arredondado.
`mesesFaturados` permite simular o PJ que tira um mês de férias sem receber (11 meses).

**Validações** (lançar `Error` com estas mensagens):
- salário não numérico, zero ou negativo → `"Salário bruto inválido"`
- dependentes negativo ou com casas decimais → `"Número de dependentes inválido"`
- alíquota de imposto PJ menor que 0 ou maior/igual a 1 → `"Alíquota de imposto inválida"`

### `src/cli.js`: a interface

Opções (use `parseArgs` do Node, seção 11 da aula):

| Opção | Padrão | Exemplo |
| --- | --- | --- |
| `--salario` | obrigatório | `--salario 7000` ou `--salario 4500,50` (aceite vírgula!) |
| `--dependentes` | 0 | `--dependentes 2` |
| `--beneficios` | 0 | `--beneficios 900` |
| `--aliquota-pj` | 6 | `--aliquota-pj 15.5` (em %) |
| `--contador` | 0 | `--contador 250` |
| `--meses` | 12 | `--meses 11` |

Saída: exatamente estas linhas (valores com `toLocaleString` em reais):

```
Salário bruto: R$ ...
INSS: R$ ...
IRRF: R$ ...
Salário líquido CLT: R$ ...
Total anual CLT: R$ ...
Faturamento PJ equivalente: R$ ... por mês
```

- Sem `--salario`: imprimir uma mensagem começando com `Uso:` e sair com `process.exit(1)`.
- Se algum cálculo lançar erro: imprimir a mensagem do erro (`console.error`) e sair com código 1.

### README.md do projeto

Precisa ter: título, seção **Como usar** com exemplo de comando (`--salario`), exemplo da
saída, as **fontes** das tabelas (links gov.br) e uma seção explicando as **simplificações**
(por exemplo: o 13º tem tributação própria na vida real, e aqui usamos uma aproximação).
Ser honesto sobre as limitações é sinal de maturidade profissional.

## Correção

```bash
npm run corrigir-projeto -- 02 ../calculadora-clt-pj
```

Os testes usam **tabelas fictícias** (números redondos) para conferir a lógica. As suas
tabelas reais só têm o formato verificado. Confira os valores contra um simulador
oficial ou contra o seu próprio contracheque.

## Para ir além (opcional)

- Modo interativo: se nenhum argumento for passado, perguntar os valores com `readline`.
- Comparar duas propostas lado a lado.
- Publicar no npm para qualquer pessoa usar com `npx` (você vai aprender no módulo 06).

## O que falar na entrevista

"Fiz uma CLI em Node que compara propostas CLT e PJ. Separei as regras de cálculo da
interface, então as funções são puras e testáveis. As tabelas de INSS e IR ficam num
arquivo de configuração, porque mudam todo ano. Tratei arredondamento em centavos, já que
ponto flutuante dá erro com dinheiro."
