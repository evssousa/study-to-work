# Projeto 05 — Painel de câmbio (cotações e conversor de moedas)

## O problema

Quem compra online no exterior, viaja, trabalha como freelancer recebendo em dólar ou investe
acompanha o câmbio todo dia. O Google mostra *uma* cotação, mas não resolve o dia a dia:

- "Quanto fica R$ 1.500 em euro **agora**?"
- "O dólar subiu ou caiu na última semana?"
- "Estou sem sinal no aeroporto. Qual era a última cotação que eu vi?"

Você vai construir um painel que responde isso, com **dados reais e atualizados**, e que continua
útil quando a internet cai: ele guarda a última cotação no aparelho.

```
Cotações em reais                         Atualizado em 15/10/2026 18:08   [Atualizar agora]

Moeda  Nome               Cotação     Variação no dia
USD    Dólar Americano    R$ 5,0931   +0,90%
EUR    Euro               R$ 5,7156   +1,26%
GBP    Libra Esterlina    R$ 6,5874   -0,43%

Conversor:  [ 100,00 ]  [ USD ]  [ Moeda para real ]
            USD 100,00 = R$ 509,31

Histórico (USD)
15/10/2026: R$ 5,0912
14/10/2026: R$ 5,0479
13/10/2026: R$ 5,0266
```

Este é o primeiro projeto que **conversa com um serviço de verdade**. Aqui moram os problemas
que separam um app de curso de um app profissional: a internet falha, a API demora, as respostas
chegam fora de ordem, o formato dos dados é estranho. O seu código precisa lidar com tudo isso.

## A API que você vai usar: AwesomeAPI

Gratuita, sem cadastro e sem chave, feita no Brasil. Documentação: pesquise por *AwesomeAPI
economia* (https://docs.awesomeapi.com.br/api-de-moedas).

**Cotações atuais** (várias moedas contra o real, numa chamada só):

```
GET https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL
```
```json
{
  "USDBRL": {
    "code": "USD", "codein": "BRL", "name": "Dólar Americano/Real Brasileiro",
    "high": "5.097", "low": "5.0375", "varBid": "0.0452", "pctChange": "0.895418",
    "bid": "5.0931", "ask": "5.0942", "timestamp": "1792098492", "create_date": "2026-10-15 18:08:12"
  },
  "EURBRL": { "code": "EUR", "name": "Euro/Real Brasileiro", "bid": "5.7156", "...": "..." }
}
```

**Histórico diário** (os últimos N dias, do **mais recente** para o mais antigo):

```
GET https://economia.awesomeapi.com.br/json/daily/USD-BRL/7
```
```json
[
  { "code": "USD", "codein": "BRL", "name": "Dólar Americano/Real Brasileiro", "high": "5.0975",
    "low": "5.0375", "pctChange": "0.857778", "bid": "5.0912", "timestamp": "1792097277",
    "create_date": "2026-10-15 17:47:57" },
  { "high": "5.0539", "low": "5.0179", "pctChange": "0.423748", "bid": "5.0479", "timestamp": "1792013384" }
]
```

**As armadilhas desta API** (e de muitas APIs reais):

1. **Todos os números são TEXTO** (`"5.0931"`). Converta com `Number()`.
2. A chave do objeto junta os códigos: `USDBRL`, não `USD-BRL`.
3. O `timestamp` está em **segundos** (JavaScript usa milissegundos). Multiplique por 1000.
4. No histórico, **só o primeiro item** tem `code`, `name` e `create_date`. Os outros trazem só os números.
5. Moeda inexistente (`/json/last/USD-XXX`) responde **404**.
6. O `timestamp` é um instante universal; a **data** que a pessoa entende é a de **Brasília**
   (um instante às 01:30 UTC de 16/10 ainda é dia 15/10 no Brasil). Veja a seção 9 da aula.
7. A API pode ficar fora do ar, lenta ou limitar requisições. Não existe API que nunca falha.

## Estrutura (obrigatória: os testes procuram estes arquivos)

```
painel-cambio/
├── index.html
├── css/estilo.css
├── package.json         # "type": "module", "name" e "description"
├── .gitignore           # node_modules/
├── README.md
├── img/print.png
└── src/
    ├── http.js          # buscarJson e os erros (exercício 05)
    ├── tentar.js        # tentarNovamente (exercício 03)
    ├── cache.js         # CacheComTTL (exercício 12)
    ├── conversao.js     # funções puras: dinheiro, taxas, datas, formatação
    ├── cambio.js        # class ClienteCambio: fala com a AwesomeAPI
    ├── armazenamento.js # a última cotação, no localStorage
    ├── ui.js            # iniciarPainel(raiz, opcoes)
    └── main.js          # liga o painel ao navegador de verdade
```

Você **já escreveu** boa parte disso nos exercícios: copie `tentarNovamente` (03), `buscarJson` e as
classes de erro (05), `CacheComTTL` (12), e `textoParaCentavos` e `mascararReais` (projeto 04 e
exercício 08 do módulo 04). Reaproveitar o que já funciona também é uma habilidade profissional.

**Regras de arquitetura que os testes conferem:**

1. `http.js`, `tentar.js`, `cache.js`, `conversao.js`, `cambio.js` e `armazenamento.js` **não conhecem a
   página**: nada de `document`, `window`, `querySelector`, `addEventListener` ou `localStorage`.
2. **O `fetch` sempre chega por parâmetro.** Os testes trocam o `fetch` global por uma função que
   dá erro se alguém a chamar: só o `main.js` pode usar o `fetch` de verdade.
3. `ui.js` não usa `document` nem `localStorage` globais: recebe a `raiz` e o `storage`.
4. Nada de `innerHTML`: os nomes das moedas vêm de fora (de uma API!), e dado de fora nunca é HTML.
5. Dinheiro em **centavos inteiros**; as taxas de câmbio são números decimais (`5.0931`) e só entram em
   uma conta no momento da conversão, que arredonda em centavos.
6. `ClienteCambio` e `CacheComTTL` são **classes** com campos privados (`#`); o cliente usa `async/await`.

## Requisitos de cada módulo

### `src/http.js`

- `HttpError(status)`, `RedeError(causa)` (como no exercício 05) e `RespostaInvalidaError`:
  estende `Error`, `name = "RespostaInvalidaError"`, `message = "Resposta inválida do servidor"`.
- `buscarJson(url, { fetch, signal, headers })`: igual ao exercício 05, mas quando o corpo não é um
  JSON válido lança `RespostaInvalidaError` (um tipo próprio, para a tela saber que é um erro esperado).

### `src/tentar.js` e `src/cache.js`

Exatamente os dos exercícios 03 (`tentarNovamente`) e 12 (`CacheComTTL`).

### `src/conversao.js`: funções puras

| Função | O que faz |
| --- | --- |
| `textoParaCentavos(texto)` | `"1.234,56"` → `123456` (as regras do projeto 04; inválido: `Error("Valor inválido: <texto>")`) |
| `mascararReais(texto)` | A máscara de dinheiro do módulo 04: `"10000"` → `"100,00"` |
| `converterParaReais(valorCentavos, taxa)` | `Math.round(valor × taxa)`. Valor precisa ser inteiro ≥ 0 (`Error("Valor inválido")`); taxa precisa ser um número finito > 0 (`Error("Taxa inválida")`) |
| `converterDeReais(valorCentavos, taxa)` | `Math.round(valor ÷ taxa)`, com as mesmas validações |
| `formatarValor(centavos, moeda)` | `BRL` → `"R$ 509,31"`; outras → o código e o número: `"USD 100,00"`, `"EUR 1.234.567,89"` |
| `formatarTaxa(taxa)` | De 2 a 4 casas: `5.0931` → `"R$ 5,0931"`, `5.1` → `"R$ 5,10"` |
| `formatarVariacao(percentual)` | Arredonda em 2 casas, com sinal: `0.895418` → `"+0,90%"`, `-1.261425` → `"-1,26%"`; `0` e o que arredonda para 0 → `"0,00%"` (sem sinal) |
| `tendencia(percentual)` | `"alta"`, `"baixa"` ou `"estavel"` (usando o valor arredondado em 2 casas) |
| `dataDoTimestamp(segundos)` | A data ISO (`"2026-10-15"`) **no horário de Brasília**. Dica: `toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" })` devolve `AAAA-MM-DD` |
| `formatarData(iso)` | `"2026-10-15"` → `"15/10/2026"` |
| `formatarDataHora(segundos)` | `"15/10/2026 18:08"`, no horário de Brasília. Dica: `toLocaleString("sv-SE", { timeZone })` devolve `"2026-10-15 18:08:12"` |

### `src/cambio.js`: `class ClienteCambio`

```js
const cliente = new ClienteCambio({ fetch, baseUrl, cache, tentativas, esperar });
```

| Opção | Padrão |
| --- | --- |
| `fetch` | (obrigatório) o fetch por parâmetro |
| `baseUrl` | `"https://economia.awesomeapi.com.br"` |
| `cache` | `null`: um `CacheComTTL` opcional |
| `tentativas` | `3` |
| `esperar` | a pausa real; os testes passam uma que não espera, para não demorar |

**`async cotacoes(moedas, { signal, ignorarCache = false } = {})`**
- `moedas` é uma lista de códigos (`["USD", "EUR"]`). Vazia ou que não seja lista → `Error("Informe ao menos uma moeda")`.
  Cada código precisa ter 3 a 5 letras **maiúsculas**, senão `Error("Moeda inválida: <código>")` (**antes** de chamar a rede).
  Códigos repetidos são ignorados.
- Faz **uma** chamada: `${baseUrl}/json/last/USD-BRL,EUR-BRL`.
- Devolve uma lista na **ordem pedida**, uma por moeda que a API devolveu (moeda ausente na resposta é omitida):
  ```js
  { moeda: "USD", nome: "Dólar Americano", taxa: 5.0931, variacaoPercentual: 0.895418,
    maxima: 5.097, minima: 5.0375, timestamp: 1792098492 }
  ```
  `nome` é só a parte antes da `/` do `name`; todos os números convertidos com `Number`.
- Resposta que não seja um objeto (lista, `null`, texto...) → `RespostaInvalidaError`.

**`async historico(moeda, dias = 7, { signal, ignorarCache = false } = {})`**
- `moeda` válida como acima; `dias` inteiro de 1 a 30, senão `Error("Dias deve ser um inteiro entre 1 e 30")`.
- Chama `${baseUrl}/json/daily/USD-BRL/7`. Resposta que não seja lista → `RespostaInvalidaError`.
- Devolve do **mais antigo para o mais recente**: `[{ data: "2026-10-13", taxa: 5.0266 }, ...]`,
  com a data pelo horário de Brasília (`dataDoTimestamp`).

**Erros, tentativas e cache (valem para os dois métodos):**
- Use `tentarNovamente` com o número de `tentativas`. **Só repita** falhas que podem passar sozinhas:
  `RedeError` e `HttpError` com status **500 ou mais**. Um 404 (moeda inexistente) **não** se repete.
  O cancelamento (`AbortError`) **nunca** se repete e passa direto, sem virar `RedeError`.
- O `signal` vai para o `fetch`.
- Se houver `cache` e `ignorarCache` for `false`: uma chamada idêntica dentro do prazo **não vai à rede**.
  Guarde só os **sucessos** (erros nunca entram no cache). Chamadas diferentes (outras moedas, outros
  dias, cotações × histórico) têm chaves diferentes.

### `src/armazenamento.js`

- `CHAVE = "painel-cambio:v1"`.
- `carregarSalvo(storage)` → `{ cotacoes: [], moeda: "USD" }` se não houver nada ou se o JSON/formato
  estiver quebrado. Descarte cotações malformadas (precisam ter `moeda` de 3 a 5 letras maiúsculas,
  `nome` texto, `taxa` número > 0, `variacaoPercentual` e `timestamp` números). Moeda salva inválida → `"USD"`.
- `salvarParcial(storage, parcial)` → mescla `parcial` com o que já estava salvo e grava
  `{ versao: 1, cotacoes, moeda }`. Retorna `true`, ou `false` se o storage lançar erro.

### `index.html` e `src/ui.js`: a tela

Os ids abaixo são **obrigatórios** (os testes encontram os elementos por eles), dentro de `<main id="app">`:

| Elemento | O que é |
| --- | --- |
| `p#estado-cotacoes` com `role="status"` e `data-estado` | O estado das cotações |
| `button#btn-atualizar` | "Atualizar agora" |
| `table#tabela-cotacoes` (com `<caption>`, `<thead>` com `<th scope="col">` e `<tbody>`) | Cada moeda é um `tr[data-moeda="USD"]` com as células `.moeda`, `.nome`, `.taxa` e `.variacao` |
| `form#form-conversor` com `input[name=valor]`, `select[name=moeda]` e `select[name=direcao]` | O conversor. `direcao` tem exatamente duas opções: `para-brl` ("Moeda para real") e `de-brl` ("Real para moeda") |
| `p#resultado-conversao` com `aria-live="polite"` | O resultado |
| `p#estado-historico` com `role="status"` e `data-estado` | O estado do histórico |
| `ul#lista-historico` | Um `li` por dia |

`iniciarPainel(raiz, { fetch, storage, agora = Date.now, intervaloMs = 60000, moedas = ["USD","EUR","GBP","ARS","CAD","AUD"], esperar })`
retorna um objeto com `parar()` (para o timer e cancela requisições pendentes). Internamente cria
`new CacheComTTL({ ttlMs: 5 * 60_000, limite: 20, agora })` e um `ClienteCambio` com esse cache.

**Cotações** (o `data-estado` e o texto de `#estado-cotacoes`):

| Situação | `data-estado` | Texto |
| --- | --- | --- |
| Buscando, sem nada para mostrar | `carregando` | `Carregando cotações...` |
| Buscando, já mostrando dados (salvos ou anteriores) | `carregando` | `Atualizando...` |
| Deu certo | `sucesso` | `Atualizado em 15/10/2026 18:08` (a data/hora da cotação **mais recente** da lista) |
| Falhou e há dados para mostrar | `desatualizado` | `Sem atualização. Mostrando a cotação de 15/10/2026 18:08.` |
| Falhou e não há nada | `erro` | `Não foi possível carregar as cotações.` |

- Ao iniciar: lê o `storage` e **mostra na hora** as cotações salvas (só das `moedas` configuradas, na ordem delas);
  em seguida busca as novas. (Isso se chama *stale-while-revalidate*: mostre o velho enquanto busca o novo.)
- A cada sucesso, grave as cotações com `salvarParcial`.
- As buscas de cotações **sempre vão à rede** (`ignorarCache: true`): quem clica em "Atualizar" quer o dado fresco.
- Atualiza sozinho a cada `intervaloMs` (`setInterval`) e quando clicam em `#btn-atualizar`.
- **Condição de corrida:** uma nova atualização **cancela** a anterior (`AbortController`) e a resposta
  atrasada da anterior **nunca** sobrescreve a mais nova.
- Só trate como "erro de tela" os erros **esperados** (`HttpError`, `RedeError`, `RespostaInvalidaError`) e o
  cancelamento (que é ignorado). Qualquer outro erro é um bug: **não esconda**, relance.
- Cada `.variacao` ganha a classe do `tendencia` (`alta`, `baixa` ou `estavel`) e o texto do `formatarVariacao`.
  `.taxa` usa `formatarTaxa`.

**Conversor:**

- As opções do `select[name=moeda]` são as `moedas` (valor e texto = o código). Começa na moeda salva (se ainda existir na lista) ou na primeira.
- O campo de valor usa `mascararReais` a cada digitação. O resultado é recalculado ao digitar, ao trocar a moeda,
  ao trocar a direção **e quando chegam cotações novas**.
- Texto de `#resultado-conversao`:
  - sem cotação da moeda escolhida ainda: `Aguardando cotações...`
  - valor vazio ou inválido: `Digite um valor para converter`
  - `para-brl`: `USD 100,00 = R$ 509,31`
  - `de-brl`: `R$ 100,00 = USD 19,63`
- Trocar a moeda grava a escolha com `salvarParcial`.
- O formulário não recarrega a página (`submit` com `preventDefault`).

**Histórico** (de `#estado-historico` e `#lista-historico`), para a moeda selecionada, **7 dias**:

| Situação | `data-estado` | Texto |
| --- | --- | --- |
| Buscando | `carregando` | `Carregando histórico...` (a lista é esvaziada) |
| Deu certo | `sucesso` | `Últimos 7 dias de USD` |
| Falhou | `erro` | `Não foi possível carregar o histórico.` |

- Cada dia é um `li` com `15/10/2026: R$ 5,0912`, do **mais recente** ao mais antigo.
- Carrega ao iniciar e a cada troca de moeda. Voltar a uma moeda já vista usa o **cache** (sem nova chamada).
- Trocar de moeda rápido **cancela** a busca anterior; a resposta atrasada não mistura os dados.
- Um erro no histórico **não afeta** as cotações, e vice-versa.

### `src/main.js`

```js
import { iniciarPainel } from "./ui.js";

iniciarPainel(document.querySelector("#app"), {
  fetch: (...argumentos) => fetch(...argumentos),
  storage: localStorage,
});
```

Por que o `fetch` embrulhado numa função? Guardar o `fetch` em um objeto/classe e chamá-lo como método
(`this.fetch(url)`) faz o navegador lançar `TypeError: Illegal invocation`. Com a função de embrulho, funciona sempre.

### `index.html`, `css/estilo.css` e acessibilidade

Tudo o que você aprendeu no módulo 01 conta e os testes conferem: `lang="pt-BR"`, `viewport`, `title`,
`meta description` de 50 a 160 caracteres, um único `h1`, títulos sem pular nível, **todo campo com `label`**,
tabela acessível, sem estilo ou JavaScript inline, `<script type="module" src="src/main.js">`, variáveis CSS
(3 ou mais), tema escuro automático, foco visível, media queries `min-width`, e regras de CSS para `.alta` e
`.baixa`. Use também o `data-estado` no CSS (`#estado-cotacoes[data-estado="erro"]`) para dar cores aos estados.

### README.md do projeto

Título, **link do site publicado no GitHub Pages**, um **print**, seções **Como usar**, **Tecnologias** e
**Decisões técnicas** (fale do retry com backoff, do cache com TTL, do cancelamento de requisições antigas e
de por que a última cotação fica salva), e a **fonte dos dados** (a AwesomeAPI, com o link).

## Correção

```bash
npm run corrigir-projeto -- 05 ../painel-cambio
```

Os testes **não acessam a internet**: eles trocam o `fetch` por um falso que responde no formato real da
AwesomeAPI (e que falha, atrasa e responde fora de ordem quando o teste manda). Por isso a correção é
rápida e sempre igual.

Depois, a checagem **humana**, com a internet de verdade:

- Abra o site publicado. As cotações batem com o Google?
- Abra o DevTools → aba **Network** e veja as requisições. Quantas foram? O histórico foi pedido de novo
  ao voltar a uma moeda?
- DevTools → Network → **Offline** → recarregue a página. Aparece a última cotação, com o aviso
  "Sem atualização"? E o conversor segue funcionando?
- Network → **Slow 3G**: os estados "Carregando..." aparecem?
- Troque de moeda muito rápido e confira se o histórico final é o da moeda escolhida.
- Lighthouse: Acessibilidade e Boas práticas acima de 90.

## Para ir além (opcional)

- Um **gráfico** do histórico em SVG (criado com `document.createElementNS`) ou com uma biblioteca.
- Mais moedas, **criptomoedas** (a API tem `BTC-BRL`) e a opção de o usuário escolher quais ver.
- Alertas: "me avise quando o dólar passar de R$ 5,20", guardados no `localStorage`.
- **Copiar** o resultado para a área de transferência com `navigator.clipboard.writeText(...)`, que retorna uma Promise.
- Instalar como app (PWA) com *service worker*, para abrir até sem internet.

## O que falar na entrevista

"Fiz um painel de câmbio que consome uma API pública. Isolei a comunicação com a API numa classe com o
`fetch` injetado, então consigo testar tudo com respostas falsas, sem rede. Tratei os problemas reais:
retry com backoff exponencial só para falhas transitórias (não para um 404), cache com TTL e descarte do
menos recentemente usado, e cancelamento com AbortController para a resposta atrasada de uma busca antiga
nunca sobrescrever a mais recente, que é uma condição de corrida clássica. A tela tem estados claros de
carregando, sucesso, erro e desatualizado, e guarda a última cotação no localStorage para continuar útil
sem internet. Também cuidei do fuso horário: a API entrega um timestamp universal e eu mostro a data de
Brasília."
