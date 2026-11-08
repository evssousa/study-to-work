# Projeto 03 — Cardápio Digital para Restaurantes

## O problema

Dona Maria tem uma pizzaria. O cardápio impresso fica desatualizado quando o preço muda — e ela
gasta dinheiro toda vez que manda imprimir de novo. As fotos ficam ruins na impressão. Ela ouviu
falar de QR code nas mesas, mas o serviço custa R$ 150 por mês. Colocar um PDF no Google Drive?
A experiência no celular é terrível.

Você vai construir um gerador gratuito de cardápio digital: ela preenche um arquivo JSON com os
itens do menu, você roda um comando, e o site é publicado no GitHub Pages. Um QR code nas mesas
aponta para o link. Clientes abrem no celular, rolam pelo menu, fazem o pedido.

```
┌─────────────────────────────────────────────┐
│   🍕 Pizzaria Bella Napoli                  │
│   Pizzas artesanais desde 1987              │
│   Seg-Sex: 18h às 23h | Sáb-Dom: 12h às 23h│
│                                             │
│   🔍 Buscar no cardápio...                  │
│                                             │
│   ⭐ HOJE: Pizza de frango grátis           │
│            a partir de R$ 50               │
│                                             │
│   ── Pizzas Tradicionais ───────────────    │
│   Margherita                   R$ 45,00    │
│   Molho de tomate, mussarela,              │
│   manjericão                               │
│                                             │
│   Calabresa                    R$ 48,00    │
│   Calabresa, cebola, azeitona              │
│                                             │
│   ── Bebidas ───────────────────────────    │
│   Coca-Cola 2L                 R$ 15,00    │
│   Suco de Laranja              R$  9,00    │
│   Natural, 300ml                           │
└─────────────────────────────────────────────┘
```

## O que você vai construir

Um script Node.js que lê `cardapio.json` e gera um `index.html` completo. Você faz o commit,
envia para o GitHub, ativa o GitHub Pages e o cardápio está no ar. O restaurante gera um QR
code apontando para esse link, imprime e cola nas mesas. Cada cliente que senta escaneou o QR
e está vendo o seu cardápio.

**Bônus:** você pode oferecer esse serviço para restaurantes locais e cobrar R$ 100–500 para
configurar e publicar. É um projeto com valor de mercado real.

### Exemplo de `cardapio.json`

```json
{
  "restaurante": "Pizzaria Bella Napoli",
  "descricao": "Pizzas artesanais desde 1987",
  "logo": "logo.png",
  "cor": "#c0392b",
  "whatsapp": "5511999999999",
  "horario": "Seg-Sex: 18h às 23h | Sáb-Dom: 12h às 23h",
  "categorias": [
    {
      "nome": "Pizzas Tradicionais",
      "itens": [
        {
          "nome": "Margherita",
          "descricao": "Molho de tomate, mussarela, manjericão",
          "preco": 4500,
          "tags": ["vegetariana"],
          "disponivel": true
        },
        {
          "nome": "Calabresa",
          "descricao": "Calabresa, cebola, azeitona",
          "preco": 4800,
          "disponivel": true
        }
      ]
    },
    {
      "nome": "Bebidas",
      "itens": [
        { "nome": "Coca-Cola 2L", "preco": 1500, "disponivel": true },
        { "nome": "Suco de Laranja", "descricao": "Natural, 300ml", "preco": 900, "disponivel": true }
      ]
    }
  ],
  "especial": {
    "segunda": { "descricao": "Pizza de frango grátis a partir de R$ 50", "destaque": true },
    "sexta": { "descricao": "Dobro de recheio nas pizzas grandes" }
  }
}
```

**Nota:** preços são armazenados em **centavos inteiros** (`4500` = R$ 45,00). Isso evita erros
de ponto flutuante com dinheiro — a mesma técnica que você aprendeu no módulo 02.

## Estrutura (obrigatória: os testes procuram estes arquivos)

```
cardapio-digital/
├── cardapio.json          # dados do restaurante (você preenche)
├── package.json           # "type": "module", name, description
├── .gitignore             # node_modules/
├── README.md
└── src/
    ├── validar.js         # valida os dados do cardápio
    ├── formatar.js        # formatação de preços e utilitários de texto
    ├── agrupar.js         # agrupar, ordenar e filtrar itens do menu
    ├── html.js            # funções puras que geram strings HTML
    └── gerar.js           # CLI: lê cardapio.json, gera index.html
```

**Por que essa separação?**

`html.js` não sabe que existe um sistema de arquivos. `formatar.js` e `agrupar.js` recebem dados
e devolvem dados — sem I/O, sem console.log. Assim cada módulo é testável de forma isolada.
`gerar.js` é o único que conecta tudo: lê o arquivo, chama a validação e os agrupamentos, chama
a geração de HTML e escreve o resultado.

## Requisitos de cada módulo

### `cardapio.json` (você preenche — podem ser dados reais ou de um restaurante inventado)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `restaurante` | string | sim | Nome do restaurante. |
| `descricao` | string | não | Subtítulo (ex.: "Pizzas artesanais desde 1987"). |
| `logo` | string | não | Caminho relativo para a logo (ex.: `"logo.png"`). |
| `cor` | string | não | Cor principal em hexadecimal (ex.: `"#c0392b"`). |
| `whatsapp` | string | não | Número com código do país, sem símbolos (ex.: `"5511999999999"`). |
| `horario` | string | não | Horário de funcionamento. |
| `categorias` | array | sim | Lista de categorias, cada uma com `nome` e `itens`. |
| `categorias[].nome` | string | sim | Nome da categoria. |
| `categorias[].itens` | array | sim | Lista de itens. Pelo menos 1 por categoria. |
| `itens[].nome` | string | sim | Nome do prato ou bebida. |
| `itens[].descricao` | string | não | Ingredientes ou descrição. |
| `itens[].preco` | integer | sim | Preço em **centavos** inteiros (ex.: `4500` = R$ 45,00). |
| `itens[].tags` | array de strings | não | Ex.: `["vegetariana", "sem glúten"]`. |
| `itens[].disponivel` | boolean | sim | Se `false`, o item não aparece no cardápio. |
| `especial` | object | não | Promoções por dia da semana. Chaves: `"segunda"` a `"domingo"`. |
| `especial[dia].descricao` | string | sim (se tiver especial) | Texto da promoção do dia. |

### `src/validar.js`

Exporte a função **`validarCardapio(cardapio)`** → retorna o cardápio se válido; lança `Error`
com mensagem clara caso contrário.

| Situação | Mensagem do erro |
|----------|-----------------|
| `cardapio` não é um objeto | `"Cardápio deve ser um objeto"` |
| `restaurante` ausente ou vazio | `"Nome do restaurante obrigatório"` |
| `cor` fornecida mas não é hex válido | `"Cor deve ser um valor hexadecimal"` |
| `categorias` ausente ou não é array | `"Categorias deve ser uma lista"` |
| `categorias` vazia | `"Adicione pelo menos uma categoria"` |
| Alguma categoria sem `nome` | `"Toda categoria precisa de um nome"` |
| Alguma categoria sem `itens` ou com `itens` vazio | `"A categoria [nome] não tem itens"` |
| Algum item sem `nome` | `"Todo item precisa de um nome"` |
| Algum item com `preco` que não é inteiro positivo | `"Preço inválido no item [nome]: use centavos inteiros"` |

### `src/formatar.js`

| Função | Descrição |
|--------|-----------|
| `formatarPreco(centavos)` | Inteiro de centavos → string `"R$ 45,00"`. Exemplos: `4500` → `"R$ 45,00"`, `900` → `"R$ 9,00"`, `1234567` → `"R$ 12.345,67"`, `50` → `"R$ 0,50"`. |
| `escaparHtml(texto)` | Escapa `&`, `<`, `>`, `"`, `'` para inserção segura em HTML. |
| `slugificar(texto)` | Texto → slug URL-amigável: minúsculas, sem acentos, espaços e chars especiais viram hífens. |
| `diaDaSemana(data)` | Objeto `Date` → nome do dia em português minúsculo: `"segunda"`, `"terca"`, `"quarta"`, `"quinta"`, `"sexta"`, `"sabado"`, `"domingo"`. |

### `src/agrupar.js`

| Função | Descrição |
|--------|-----------|
| `itensPorCategoria(categorias)` | Retorna as categorias com apenas os itens disponíveis (`disponivel: true`), ordenados por preço crescente. **Não altera o array original.** |
| `buscarItens(categorias, termo)` | Retorna itens que combinam com o `termo`. Busca no `nome` e na `descricao`, case-insensitive, ignorando acentos. Retorna `[{ categoria, item }]`. Regex inválida do usuário **não pode derrubar** a função: retorne `[]` silenciosamente. |
| `especialDoDia(especial, data)` | Dado o objeto `especial` e um `Date`, retorna o especial do dia da semana atual, ou `null` se não houver. Retorna `null` se `especial` for `null` ou `undefined`. |
| `totalItensDisponiveis(categorias)` | Conta apenas os itens com `disponivel: true` em todas as categorias. |

### `src/html.js`

Funções puras — sem `console.log`, sem `fs`, sem `process`, sem `new Date()` (receba a data
como parâmetro quando necessário).

> **Regra de segurança:** todo texto que vem do `cardapio.json` deve passar por `escaparHtml()`
> antes de aparecer no HTML. Isso protege contra XSS.

| Função | Descrição |
|--------|-----------|
| `gerarCabecalho(cardapio)` | HTML do cabeçalho: nome do restaurante, descrição, horário, logo (se fornecida). Logo usa `<img>` com atributo `alt`. |
| `gerarCardItem(item, nomeDaCategoria)` | HTML do card de um item: nome, descrição, preço formatado, tags (se houver). Escape XSS em todos os textos. |
| `gerarSecaoCategoria(categoria, itensOrdenados)` | HTML de uma seção de categoria com todos os seus cards. |
| `gerarEspecialDoDia(especial)` | HTML do banner de promoção do dia. Retorna string vazia se `especial` for `null`. |
| `gerarPagina(cardapio, { itens, especialDoDia })` | Documento HTML completo. Deve ter: `lang="pt-BR"`, `charset UTF-8`, `viewport`, meta description, `<title>` com o nome do restaurante, CSS inline com variáveis de cor, layout responsivo (mobile-first), campo de busca. A busca é implementada como um `<script>` inline no HTML gerado (já que não há DOM no Node). |

### `src/gerar.js`

**Uso:**
```bash
node src/gerar.js           # gera index.html a partir de cardapio.json
node src/gerar.js --ajuda   # mostra como usar
```

**Passos:**

1. Se `--ajuda` for passado, imprime as instruções e encerra.
2. Lê `cardapio.json` do diretório atual.
   - Se não encontrar: imprime mensagem útil e sai com código 1.
3. Faz o parse do JSON.
   - Se JSON inválido: imprime mensagem e sai com código 1.
4. Chama `validarCardapio()`.
   - Se lançar erro: imprime a mensagem e sai com código 1.
5. Chama `itensPorCategoria()` e `especialDoDia()` passando `new Date()`.
6. Chama `gerarPagina()`.
7. Escreve o resultado em `index.html`.
8. Imprime: `"✓ Cardápio gerado! Arquivos: index.html. Faça commit e publique no GitHub Pages."`

## Deploy (obrigatório)

O projeto vai em um **repositório próprio no GitHub**. Publique no **GitHub Pages** ou na
**Vercel** — ambos gratuitos.

### Opção A — GitHub Pages

1. Preencha `cardapio.json` com os dados do restaurante.
2. Rode `node src/gerar.js` para gerar o `index.html`.
3. Faça commit de tudo (incluindo `index.html`) e push para o GitHub.
4. No repositório: **Settings → Pages → Source: Deploy from a branch → main / root → Save**.
5. Aguarde 1–2 minutos. Link: `https://seu-usuario.github.io/cardapio-digital/`
6. Use esse link para gerar o QR code.

### Opção B — Vercel (recomendada: reconstrói o menu a cada push)

1. Acesse [vercel.com](https://vercel.com) e faça login com o GitHub.
2. **Add New → Project** → importe o repositório `cardapio-digital`.
3. Em **Build & Output Settings**:
   - **Build Command:** `node src/gerar.js`
   - **Output Directory:** `.` (raiz)
4. **Deploy**. A cada atualização no `cardapio.json` + push, a Vercel reconstrói sozinha.
5. Link: `https://cardapio-digital-seuusuario.vercel.app`

Com a Vercel você não precisa commitar o `index.html` gerado — adicione-o ao `.gitignore`.

## Como gerar o QR code

O QR code é simplesmente o link convertido em imagem. Use qualquer gerador online:

- [QR Code Monkey](https://www.qrcode-monkey.com/)
- [qr.io](https://qr.io/)
- [goqr.me](https://goqr.me/)

Cole o link do GitHub Pages, ajuste as cores se quiser, baixe o PNG ou SVG e mande imprimir.
Uma folha A4 com vários QR codes custa R$ 2 e dura meses na mesa plastificada.

## Instruções para o restaurante

1. Envie o link do GitHub Pages para o dono do restaurante.
2. Imprima o QR code (tamanho mínimo: 3cm × 3cm para funcionar bem no celular).
3. Cole nas mesas, no cardápio impresso ou no balcão.
4. Quando o preço de algum item mudar, atualize o `cardapio.json`, rode `node src/gerar.js`,
   faça o commit e o push. O site atualiza em segundos — sem reimprimir nada.

### README.md do projeto

Precisa ter:

- Título
- **Link do site publicado no GitHub Pages** (obrigatório — o teste verifica isso)
- Como usar (como preencher `cardapio.json`, rodar `node src/gerar.js`, fazer o deploy)
- Como gerar o QR code
- Instruções para o restaurante (como colocar o QR code nas mesas)

## Correção

```bash
npm run corrigir-projeto -- 03 ../cardapio-digital
```

Os testes verificam:

- Se todos os arquivos obrigatórios existem
- Se `package.json` tem `"type": "module"`, `name` e `description`
- Se `.gitignore` ignora `node_modules`
- Se `cardapio.json` é um JSON válido com `restaurante` e ao menos uma categoria
- Se o README tem um título, o link do GitHub Pages e explica como usar
- Se `validarCardapio` aceita cardápios válidos e rejeita inválidos com as mensagens certas
- Se `formatarPreco` converte centavos corretamente em todos os casos
- Se `itensPorCategoria` filtra indisponíveis e ordena por preço sem alterar o original
- Se `buscarItens` funciona com regex inválida sem derrubar a aplicação
- Se `gerarPagina` retorna HTML completo com `lang="pt-BR"`, charset, viewport e nome do restaurante

## Para ir além (opcional)

- Fotos dos pratos (tags `<img>` no HTML gerado)
- Modo escuro automático
- Integração com WhatsApp (link pré-preenchido com o pedido)
- Gerar QR code em SVG diretamente no `index.html`
- Suporte a múltiplos idiomas (português + inglês)
- CSS para impressão com `@media print`
- Oferecer o serviço para restaurantes locais e cobrar para configurar!

## O que falar na entrevista

"Fiz um gerador de cardápio digital: lê um JSON e gera um site estático. Usei funções puras para
cada transformação de dados — validação, formatação de preços em centavos, agrupamento e ordenação
de itens por categoria, busca com regex. Separei a geração de HTML do acesso ao sistema de
arquivos, então dá para testar tudo sem I/O. O site está publicado no GitHub Pages com QR code
em um bar aqui perto."
