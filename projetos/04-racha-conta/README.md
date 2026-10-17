# Projeto 04 — Racha-conta (divida as despesas do grupo)

## O problema

Toda viagem, churrasco ou república tem a mesma cena no fim: alguém pagou o hotel, outra pessoa
pagou o mercado, e ninguém sabe **quem deve quanto para quem**. A planilha vira bagunça, a
conversa no grupo vira discussão e o "pix de acerto" sai errado.

Você vai construir um site que resolve isso, **usável de verdade**:

- cria-se um **racha** (ex.: "Viagem a Gramado"), adicionam-se as **pessoas** e as **despesas**
  (o que foi, quanto custou, quem pagou e quem divide);
- o site mostra o **saldo** de cada um e o **acerto de contas** com o **menor número de Pix possível**;
- um botão manda o resumo pronto para o **WhatsApp** do grupo;
- **não precisa de conta nem de servidor**: tudo fica no navegador (`localStorage`), funciona
  sem internet depois de aberto e os dados nunca saem do aparelho.

Publique no GitHub Pages e **mande o link para um grupo de amigos usar na próxima viagem**.
Esse é o melhor item de portfólio que existe: um produto com usuários reais.

```
Resumo (o que vai para o WhatsApp)

*Churrasco*
Total gasto: R$ 120,00

Acerto de contas:
• Carla paga R$ 45,00 para Ana
• Bruno paga R$ 15,00 para Ana
```

## Estrutura (obrigatória: os testes procuram estes arquivos)

```
racha-conta/
├── index.html
├── css/estilo.css
├── package.json         # "type": "module", "name" e "description"
├── .gitignore           # node_modules/
├── README.md
├── img/print.png        # um print do app funcionando
└── src/
    ├── dinheiro.js      # texto ↔ centavos ↔ "R$ 1.234,56"
    ├── racha.js         # regras de divisão e acerto (funções puras)
    ├── estado.js        # criar/alterar rachas, participantes e despesas (imutável)
    ├── armazenamento.js # salvar e carregar no localStorage
    ├── ui.js            # liga tudo à página: iniciarApp(raiz, opcoes)
    └── main.js          # 3 linhas: chama iniciarApp com o document e o localStorage reais
```

**As regras de arquitetura que os testes conferem:**

1. `dinheiro.js`, `racha.js`, `estado.js` e `armazenamento.js` **não conhecem a página**: nada de
   `document`, `window`, `querySelector` ou `localStorage`. São funções que recebem dados e
   devolvem dados. (Por isso dá para testá-las sem navegador.)
2. `ui.js` **não usa o `document` nem o `localStorage` globais**: recebe a `raiz` (o elemento
   `#app`) e o `storage` por parâmetro. Use `raiz.ownerDocument` para criar elementos.
3. **Nada de `innerHTML`** nem `insertAdjacentHTML`: os nomes e descrições são digitados pelas
   pessoas (XSS!).
4. Toda mudança é **imutável**: as funções de `estado.js` devolvem um racha novo.
5. **Dinheiro em centavos inteiros** em todos os cálculos (módulo 02).

## Requisitos de cada módulo

### `src/dinheiro.js`

| Função | O que faz |
| --- | --- |
| `textoParaCentavos(texto)` | `"1.234,56"` → `123456`. Aceita `R$` e espaços. Formatos válidos: `12`, `12,5`, `12,50`, `1.234`, `1.234,56`. O ponto só vale como separador de milhar (grupos de 3 dígitos). Qualquer outra coisa (`""`, `"abc"`, `"12,345"`, `"1.23"`, `"-5"`) lança `Error("Valor inválido: <texto original>")` |
| `formatarCentavos(centavos)` | `123456` → `"R$ 1.234,56"`. Troque o espaço inquebrável (` `) que o `toLocaleString` coloca por um **espaço comum** |
| `mascararReais(texto)` | A máscara do exercício 08 do módulo: `"123456"` → `"1.234,56"` |

### `src/racha.js`: as regras do negócio

Um **racha** é este objeto (é o formato que os testes usam):

```js
{
  id: "r1",
  nome: "Churrasco",
  participantes: [{ id: "a", nome: "Ana" }, { id: "b", nome: "Bruno" }],
  despesas: [
    { id: "d1", descricao: "Carne", valorCentavos: 9000, pagadorId: "a", participantesIds: ["a", "b"] },
  ],
}
```

| Função | O que faz |
| --- | --- |
| `dividir(totalCentavos, quantidade)` | Divide em `quantidade` partes **inteiras** que somam exatamente o total; os centavos que sobram vão **um a um para as primeiras partes**. `dividir(1000, 3)` → `[334, 333, 333]`. Total inválido (não inteiro ou negativo): `Error("Total inválido")`. Quantidade menor que 1 ou não inteira: `Error("Quantidade inválida")` |
| `calcularSaldos(racha)` | `{ [idDoParticipante]: centavos }`. **Positivo = tem a receber, negativo = deve.** Para cada despesa: o pagador ganha o valor inteiro; cada participante da despesa perde a sua parte (`dividir`, na ordem de `participantesIds`). Todos os participantes do racha aparecem, mesmo com zero. A soma dos saldos é sempre 0 |
| `calcularAcerto(saldos)` | Lista de transferências `{ deId, paraId, valorCentavos }`. Algoritmo guloso, **repita até acabar**: pegue quem **mais deve** e quem **mais tem a receber**, faça o primeiro pagar ao segundo o menor dos dois valores, e atualize os saldos. **Empates desempatam pelo id em ordem alfabética.** Quem está em zero não participa. Se a soma dos saldos não for 0: `Error("Os saldos não fecham em zero")` |
| `totalGasto(racha)` | Soma das despesas |
| `resumoTexto(racha)` | O texto do WhatsApp (veja o exemplo no topo; sem dívidas, a linha é `Tudo certo: ninguém deve nada.`) |

Por que o guloso resolve? Cada passo zera pelo menos uma pessoa, então com `n` pessoas com saldo
são no máximo `n − 1` transferências. (Achar o mínimo *absoluto* é um problema difícil de ciência
da computação, e na prática o guloso é ótimo ou quase.)

### `src/estado.js`: criar e alterar (sempre devolvendo um racha novo)

- **`ValidacaoError`**: estende `Error`; `new ValidacaoError({ campo: "mensagem" })`; `name = "ValidacaoError"`;
  guarda o objeto em `.erros`; a `message` é a **primeira** mensagem do objeto. **Todo erro de regra
  de negócio deste módulo é um `ValidacaoError`**: é assim que a tela sabe separar "a pessoa
  digitou errado" (mostra o aviso) de "o programa tem um bug" (deixa estourar).

| Função | Regras |
| --- | --- |
| `criarRacha(nome, id = crypto.randomUUID())` | Nome sem espaços nas pontas; vazio → `ValidacaoError` `"Dê um nome ao racha"`. Começa sem participantes e sem despesas |
| `adicionarParticipante(racha, nome, id = ...)` | Nome vazio → `"Informe o nome do participante"`. Repetido, **ignorando maiúsculas** → `"Já existe um participante chamado <nome>"` (o nome sem espaços, como foi digitado) |
| `removerParticipante(racha, id)` | Não existe → `"Participante não encontrado"`. Está em alguma despesa (pagou ou divide) → `"Este participante está em despesas. Remova as despesas antes."` |
| `validarDespesa(racha, dados)` | `dados = { descricao, valorCentavos, pagadorId, participantesIds }`. Devolve `{}` se está tudo certo, ou um objeto só com os campos errados: `descricao: "Informe a descrição"`; `valorCentavos` (precisa ser inteiro maior que zero): `"Informe um valor maior que zero"`; `pagadorId` (precisa ser um participante): `"Escolha quem pagou"`; `participantesIds` vazio: `"Escolha pelo menos uma pessoa"`, com algum id inexistente: `"Participante inválido"` |
| `adicionarDespesa(racha, dados, id = ...)` | Valida (lança `ValidacaoError(erros)` se houver problema) e guarda a despesa com a descrição sem espaços nas pontas e `participantesIds` **na ordem do racha, sem repetir** |
| `removerDespesa(racha, id)` | Sem a despesa |

### `src/armazenamento.js`

- `CHAVE`: exporte a constante `"racha-conta:v1"`.
- `carregarEstado(storage)` → `{ rachas: [], ativoId: null }` se não houver nada, se o JSON estiver
  quebrado ou se o formato for inesperado. Rachas malformados (sem `id`, `nome`, `participantes`
  ou `despesas` como listas) são descartados e os bons, mantidos. Se o `ativoId` não existir mais,
  use o id do primeiro racha (ou `null`).
- `salvarEstado(storage, { rachas, ativoId })` → grava `JSON.stringify({ versao: 1, ativoId, rachas })`
  na `CHAVE`; retorna `true`, ou `false` se o storage lançar erro.

### `index.html` e `src/ui.js`: a tela

O `index.html` é seu, mas **os ids abaixo são obrigatórios** (os testes encontram os elementos
por eles). Tudo fica dentro de `<main id="app">`:

| Elemento | O que é |
| --- | --- |
| `select#seletor-racha` | Os rachas salvos (cada `<option>` tem `value` = id do racha e o nome como texto) |
| `button#btn-excluir-racha` | Exclui o racha atual (pede confirmação) |
| `form#form-racha` com `input[name=nome]` e `p#erro-racha` | Cria um racha |
| `div#painel` | Tudo o que depende de existir um racha. Fica com `hidden` quando não há racha ativo |
| `form#form-participante` com `input[name=nome]` e `p#erro-participante` | Adiciona participante |
| `ul#lista-participantes` | Cada `li[data-id]` tem `span.nome` e `button[data-acao="remover-participante"]` com `aria-label="Remover <nome>"` |
| `form#form-despesa` | Campos `input[name=descricao]`, `input[name=valor]` (com a máscara de reais) e `select[name=pagador]`, mais `div#opcoes-participantes` |
| `#erro-descricao`, `#erro-valor`, `#erro-pagador`, `#erro-participantes` | Mensagens de erro da despesa |
| `p#sem-despesas` | "Nenhuma despesa ainda." (escondido quando há despesas) |
| `ul#lista-despesas` | Cada `li[data-id]` mostra descrição, valor e quem pagou, com `button[data-acao="remover-despesa"]` e `aria-label="Remover despesa <descrição>"` |
| `p#total` | `Total gasto: R$ 120,00` |
| `ul#lista-saldos` | Um `li` por participante, na ordem do racha: `Ana: recebe R$ 60,00`, `Bruno: deve R$ 15,00` ou `Carla: está quite` |
| `ul#lista-acerto` | Um `li` por transferência: `Carla paga R$ 45,00 para Ana` |
| `p#acerto-vazio` | "Tudo certo: ninguém deve nada." (escondido quando há transferências) |
| `a#link-whatsapp` | `href="https://wa.me/?text=<resumoTexto codificado com encodeURIComponent>"` |
| `p#status` com `role="status"` | Avisos de ação concluída |

`iniciarApp(raiz, { storage, confirmar })` (em `ui.js`) deixa tudo funcionando. `confirmar` é uma
função que recebe uma mensagem e devolve `true`/`false`; se não for passada, use
`globalThis.confirm?.(mensagem) ?? true`. O `main.js` passa `localStorage` e `confirm`.

**Comportamento:**

- Ao iniciar, carrega o estado do `storage`. Sem racha ativo, `#painel` fica escondido.
- **Criar racha** (`#form-racha`): cria, seleciona, grava, limpa o campo e avisa em `#status`:
  `Racha "Viagem a Gramado" criado`. Erro: mensagem em `#erro-racha`, `aria-invalid="true"` e
  `aria-describedby="erro-racha"` no campo, foco no campo. Ao dar certo de novo, limpa tudo isso.
- **Trocar de racha** (evento `change` do `#seletor-racha`) e **excluir** (se `confirmar` disser
  `true`; depois passa para o primeiro que sobrar; avisa `Racha excluído: <nome>`).
- **Participantes**: adicionar (`Participante adicionado: Ana`; limpa o campo e devolve o foco a
  ele; erro em `#erro-participante` com `aria-invalid` no campo) e remover (`Participante
  removido: Ana`; se `removerParticipante` recusar, mostre a mensagem em `#erro-participante`).
- **Formulário de despesa**:
  - `select[name=pagador]`: primeira opção `value=""` com o texto `Escolha quem pagou`, depois um
    `<option>` por participante (`value` = id);
  - `#opcoes-participantes`: um `<label>` com `<input type="checkbox" name="participantes" value="<id>">`
    e o nome, para cada participante, **todos marcados** por padrão;
  - o campo de valor aplica `mascararReais` a cada digitação (`input`);
  - ao enviar, converta o valor com `textoParaCentavos` (texto inválido = valor inválido), chame
    `adicionarDespesa`, e:
    - **erro** (`ValidacaoError`): mostre cada mensagem no seu elemento (`descricao` → `#erro-descricao`,
      `valorCentavos` → `#erro-valor`, `pagadorId` → `#erro-pagador`, `participantesIds` →
      `#erro-participantes`), marque os campos com `aria-invalid`/`aria-describedby` e **dê foco ao
      primeiro campo com erro**; mensagens de campos corretos ficam vazias;
    - **sucesso**: grave, limpe o formulário (descrição, valor, pagador de volta ao "Escolha...", todos
      marcados de novo) e avise `Despesa adicionada: Carne`.
  - Qualquer erro que **não** seja `ValidacaoError` é um bug: **não engula**, deixe estourar.
- **Remover despesa**: `Despesa removida: Carne`.
- A cada mudança, **grave no `storage`** (`salvarEstado`) e **redesenhe** tudo a partir do estado
  (padrão estado → render do módulo): lista de participantes, opções do formulário, despesas,
  total, saldos, acerto e o link do WhatsApp.
- Um ouvinte por tipo de lista (delegação) para os botões de remover.

### `index.html`, `css/estilo.css` e acessibilidade

Tudo o que você aprendeu no módulo 01 conta (os testes conferem): `lang="pt-BR"`, `viewport`,
`title`, `meta description` de 50 a 160 caracteres, um único `h1`, títulos sem pular nível,
**todo campo com `label`** (inclusive os criados pelo JavaScript), botões com nome acessível,
sem estilo ou JavaScript inline, `<script type="module" src="src/main.js">`, variáveis CSS
(3 ou mais), tema escuro automático, foco visível e media queries `min-width`.

**Armadilha com `hidden`:** o atributo `hidden` esconde o elemento, **mas** uma regra CSS como
`#painel { display: grid }` vence o `hidden` e o elemento reaparece. Não defina `display` nos
elementos que usam `hidden` (`#painel`, `#sem-despesas`, `#acerto-vazio`), ou acrescente
`[hidden] { display: none !important }`.

### README.md do projeto

Título, **link do site publicado no GitHub Pages**, um **print** (`img/print.png`), seções **Como
usar**, **Tecnologias** e **Decisões técnicas** (fale do dinheiro em centavos, do algoritmo de
acerto e de por que a lógica não conhece a página), e um parágrafo sobre **privacidade** (os
dados ficam só no navegador).

## Correção

```bash
npm run corrigir-projeto -- 04 ../racha-conta
```

Os testes abrem o **seu** `index.html` num navegador de mentira, usam a tela como uma pessoa
usaria (digitam, clicam, enviam) e conferem o que aparece. Se falhar um `existe o elemento #x`,
o id está faltando no seu HTML.

Depois da correção, a checagem **humana**:

- Abra no celular. Dá para usar com uma mão? Os botões são fáceis de tocar?
- Navegue só com o teclado (Tab, Enter, setas no select). O foco aparece o tempo todo?
- Rode o Lighthouse: Acessibilidade e Boas práticas acima de 90.
- Desligue a internet depois de abrir a página: continua funcionando?
- **Use em uma viagem de verdade** ou na próxima divisão de conta com amigos. Anote o que
  incomodou e melhore. Isso vira ótima história de entrevista.

## Para ir além (opcional)

- **Divisão desigual** (cada pessoa com um peso, ou valores específicos).
- **Editar** uma despesa (reaproveite o formulário).
- **Exportar e importar** o racha em JSON (assim dá para passar o racha de um celular para outro).
- **Copiar o resumo** para a área de transferência (`navigator.clipboard.writeText`; é assíncrono,
  você aprende no módulo 05) e **instalar como app** com um *service worker* e um *manifest* (PWA).
- Gerar um **QR Code** com o link do racha.

## O que falar na entrevista

"Fiz um site que divide despesas de grupo e calcula o menor número de transferências para quitar
as dívidas, e meus amigos usaram na viagem. Separei a lógica da tela: as regras são funções puras
em módulos que não conhecem o DOM, e a tela é um render a partir do estado, com um único
conjunto de listeners por lista (delegação). Tudo em centavos inteiros para não ter erro de
arredondamento, e a divisão distribui os centavos que sobram. Os dados ficam no localStorage, com
tratamento para JSON corrompido. Cuidei de acessibilidade: erros ligados aos campos com
aria-describedby, foco no primeiro erro e um aviso em região live. E nada usa innerHTML, então
nomes digitados pelos usuários não permitem XSS."
