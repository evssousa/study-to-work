# Módulo 00 — Como a Web funciona, ambiente de trabalho, terminal, Git e Markdown

> **Duração sugerida:** 1 a 2 semanas (ritmo regular).
> **Projeto do módulo:** README de perfil do GitHub, a sua vitrine para recrutadores.

## Objetivos

Ao final deste módulo, você vai conseguir:

- Explicar o que acontece entre digitar um endereço no navegador e a página aparecer.
- Ler e escrever requisições HTTP: métodos, códigos de status e cabeçalhos.
- Montar o seu ambiente de trabalho no VS Code, no seu computador ou no GitHub Codespaces.
- Usar o terminal para navegar, criar, copiar, mover e apagar arquivos.
- Versionar código com Git: commits, branches, merge e envio para o GitHub.
- Escrever documentação em Markdown.
- Rodar os exercícios deste curso e entender a correção automática.

---

## 1. O ambiente de trabalho

Você vai programar no **VS Code**, o editor mais usado do mercado. Há dois caminhos;
escolha **um**.

### Caminho A: GitHub Codespaces (recomendado para começar)

O Codespaces é um VS Code completo **rodando no navegador**, num computador Linux na nuvem
do GitHub. Vantagens: não precisa instalar nada, funciona até em computador fraco ou emprestado,
e o ambiente fica **igual ao de todos os alunos**. O GitHub oferece uma cota mensal de horas
gratuitas (confira o valor atual em *Settings → Billing* da sua conta).

1. Crie uma conta em [github.com](https://github.com) (use um nome de usuário profissional,
   porque ele vai aparecer no seu currículo).
2. Abra a página deste curso no GitHub e clique em **Fork** para criar a sua cópia.
3. Na **sua** cópia, clique em **Code → Codespaces → Create codespace on main**.
4. Espere alguns minutos. O arquivo `.devcontainer/devcontainer.json` do curso instala
   sozinho o Node.js, as extensões e as dependências (`npm install`).

> **Economize horas:** o Codespaces desliga sozinho depois de um tempo parado, mas você
> pode pará-lo manualmente em [github.com/codespaces](https://github.com/codespaces).

### Caminho B: no seu computador

Instale, nesta ordem:

1. **VS Code**: [code.visualstudio.com](https://code.visualstudio.com/).
2. **Node.js**, versão **LTS** (*Long Term Support*, a versão estável): [nodejs.org](https://nodejs.org/pt).
   O Node permite rodar JavaScript fora do navegador e traz o `npm`, o instalador de pacotes.
3. **Git**: [git-scm.com](https://git-scm.com/). No Windows, aceite as opções padrão, que já
   incluem o **Git Bash** (um terminal no estilo Linux).

Confira se deu tudo certo abrindo um terminal e digitando:

```bash
node --version    # deve mostrar v24 ou superior
npm --version
git --version
```

Depois faça o fork do curso (passos 1 e 2 do caminho A), clone o seu fork (seção 5.6) e,
dentro da pasta do curso, rode:

```bash
npm install
```

**Windows:** no VS Code, abra o terminal e escolha **Git Bash** como terminal padrão
(*Ctrl+Shift+P → Terminal: Select Default Profile → Git Bash*). Assim os comandos deste
curso funcionam igual no Windows, no Linux, no Mac e no Codespaces.

### 1.1 Um passeio pelo VS Code

| Área | Atalho | Para que serve |
| --- | --- | --- |
| Explorador de arquivos | `Ctrl+Shift+E` | Ver e abrir os arquivos do projeto |
| Busca global | `Ctrl+Shift+F` | Procurar um texto em todos os arquivos |
| Controle de versão | `Ctrl+Shift+G` | Ver as mudanças do Git |
| Extensões | `Ctrl+Shift+X` | Instalar extensões |
| Terminal | `` Ctrl+` `` | Abrir/fechar o terminal integrado |
| Paleta de comandos | `Ctrl+Shift+P` | **Todos** os comandos do editor, por nome |
| Abrir arquivo pelo nome | `Ctrl+P` | O jeito mais rápido de navegar |

No Mac, troque `Ctrl` por `Cmd`.

Atalhos de edição que vão te poupar horas:

| Atalho | O que faz |
| --- | --- |
| `Alt+↑` / `Alt+↓` | Move a linha para cima/baixo |
| `Shift+Alt+↓` | Duplica a linha |
| `Ctrl+D` | Seleciona a próxima ocorrência da palavra (edição múltipla) |
| `Ctrl+/` | Comenta/descomenta a linha |
| `F2` | Renomeia uma variável em todos os lugares |
| `Ctrl+Z` / `Ctrl+Shift+Z` | Desfazer / refazer |

**Extensões recomendadas** (o curso já sugere quando você abre a pasta):

- **Vitest**: mostra os testes na barra lateral (ícone de tubo de ensaio) e permite rodá-los com um clique.
- **Live Server** (Microsoft): abre o seu HTML no navegador e atualiza sozinho a cada salvamento.

Ative também o salvamento automático: *File → Auto Save*.

---

## 2. O terminal

O terminal é uma forma de dar ordens ao computador **digitando**. Parece antiquado, mas
todo dev usa o tempo todo: para rodar programas, instalar pacotes, usar o Git, acessar servidores.

### 2.1 Lendo o terminal

Ao abrir, você vê algo como:

```
ana@notebook MINGW64 ~/projetos/study-to-work (main)
$
```

- `ana@notebook`: usuário e nome do computador.
- `~/projetos/study-to-work`: a **pasta atual** (o `~` é a sua pasta pessoal).
- `(main)`: a branch do Git (seção 5).
- `$`: o **prompt**, que indica "pode digitar".

### 2.2 Caminhos: absolutos e relativos

- **Caminho absoluto** começa da raiz: `/home/ana/projetos/site/index.html`.
- **Caminho relativo** parte da pasta atual: `site/index.html`.
- `.` significa "a pasta atual" e `..` significa "a pasta de cima".

```
projetos/
├── site/
│   └── index.html
└── api/
    └── servidor.js
```

Se você está em `projetos/site`, o caminho relativo para `servidor.js` é `../api/servidor.js`.

### 2.3 Os comandos essenciais

| Comando | O que faz | Exemplo |
| --- | --- | --- |
| `pwd` | Mostra a pasta atual (*print working directory*) | `pwd` |
| `ls` | Lista os arquivos da pasta | `ls` |
| `ls -la` | Lista tudo, inclusive arquivos ocultos, com detalhes | `ls -la` |
| `cd pasta` | Entra em uma pasta | `cd exercicios` |
| `cd ..` | Volta uma pasta | `cd ..` |
| `cd ~` | Vai para a sua pasta pessoal | `cd ~` |
| `mkdir pasta` | Cria uma pasta | `mkdir site` |
| `mkdir -p a/b/c` | Cria pastas aninhadas de uma vez | `mkdir -p site/css` |
| `touch arquivo` | Cria um arquivo vazio | `touch index.html` |
| `echo "texto" > arquivo` | Cria (ou **sobrescreve**) um arquivo com o texto | `echo "# Título" > README.md` |
| `echo "texto" >> arquivo` | **Acrescenta** o texto no fim do arquivo | `echo "mais" >> notas.txt` |
| `cat arquivo` | Mostra o conteúdo do arquivo | `cat README.md` |
| `cp origem destino` | Copia | `cp index.html backup.html` |
| `mv origem destino` | Move **ou renomeia** | `mv backup.html antigo.html` |
| `rm arquivo` | Apaga um arquivo (**não vai para a lixeira!**) | `rm antigo.html` |
| `rm -r pasta` | Apaga uma pasta e tudo dentro dela | `rm -r rascunhos` |
| `clear` | Limpa a tela | `clear` |
| `code .` | Abre a pasta atual no VS Code | `code .` |
| `node arquivo.js` | Executa um programa JavaScript | `node src/index.js` |

> ⚠️ `rm` não pede confirmação e não tem lixeira. Confira **duas vezes** o que vai apagar,
> principalmente com `rm -r`.

Aspas importam: `echo 'console.log("Olá");' > index.js` usa aspas **simples** por fora, para
que as aspas duplas de dentro sejam gravadas no arquivo.

### 2.4 Truques que todo dev usa

- **Tab** completa nomes de arquivos e pastas. Digite `cd exe` + Tab.
- **Seta para cima** repete os comandos anteriores.
- **Ctrl+C** interrompe um programa que está rodando (ou travado).
- **Ctrl+L** limpa a tela.
- Arrastar um arquivo do explorador para o terminal cola o caminho dele.

### 2.5 Uma sessão de exemplo

```bash
$ pwd
/workspaces/study-to-work
$ mkdir -p rascunho/src
$ cd rascunho
$ echo 'console.log("funcionou");' > src/teste.js
$ node src/teste.js
funcionou
$ cd ..
$ rm -r rascunho
```

---

## 3. Como funcionam os exercícios deste curso

Todo exercício tem um **arquivo onde você resolve** e um **arquivo de teste** que corrige,
como um professor que confere a sua resposta na hora.

Os exercícios aparecem **ao longo da aula**, logo depois do assunto que eles praticam, num
bloco como o da seção 3.4. Pare a leitura, faça o exercício e só então continue. O projeto
do módulo fica para o final, quando você já praticou tudo.

```
exercicios/
└── 02-js-fundamentos/
    ├── 01-celsius-para-fahrenheit.js        ← você escreve aqui
    └── 01-celsius-para-fahrenheit.test.js   ← o "professor" (não altere!)
```

### 3.1 Rodando a correção

Na raiz do curso, no terminal:

```bash
npm run exercicio -- 01-celsius
```

(Esse é um exemplo do módulo 02; aqui no módulo 00 o primeiro exercício é o `01-terminal`.)
O texto depois do `--` é um pedaço do nome do arquivo. O Vitest roda os testes e **fica
observando**: cada vez que você salva o arquivo, ele corrige de novo. Para sair, aperte `q`
ou `Ctrl+C`.

Lendo o resultado:

```
 ✓ 0 °C é o ponto de congelamento da água: 32 °F
 × 100 °C é o ponto de ebulição da água: 212 °F
   → expected 180 to be 212

 Tests  1 failed | 4 passed (5)
```

- `✓` passou, `×` falhou.
- `expected 180 to be 212` quer dizer: "o seu código **retornou 180**, mas o esperado era **212**".
  Leia sempre o nome do teste: ele diz qual regra não foi cumprida.

Outros comandos:

```bash
npm test             # roda TODOS os exercícios uma vez
npm run progresso    # mostra uma barra de progresso por módulo
```

Com a extensão **Vitest** instalada, você também pode rodar os testes pelo ícone de tubo de
ensaio na barra lateral do VS Code.

### 3.2 Regras do jogo

1. **Não altere os arquivos `.test.js`.** Fazer o teste passar mudando o teste é como apagar
   a pergunta da prova.
2. **Digite o código**, não copie e cole. A memória está nos dedos.
3. A pasta `gabaritos/` tem as soluções. Só abra **depois** de resolver (para comparar) ou se
   estiver travado há mais de uma hora, tentando de verdade.
4. **IA como tutor, não como resolvedor.** Nos módulos 00 a 06, peça à IA explicações ("o que
   significa esse erro?"), nunca a resposta. Você vai aprender a programar **com** IA no módulo 22,
   e só aproveita bem quem sabe programar sem ela.

### 3.3 Os projetos

Os projetos de portfólio **não** ficam dentro deste repositório. Cada um fica em um
**repositório próprio** no seu GitHub, porque é isso que o recrutador vai abrir. Aqui no curso
ficam o enunciado (`projetos/NN-nome/README.md`) e os testes de correção.

Para corrigir um projeto, rode na raiz do curso, informando a pasta do seu projeto:

```bash
npm run corrigir-projeto -- 00 ../seu-usuario
```

Organize as pastas lado a lado:

```
pasta-de-estudos/          (no Codespaces: /workspaces)
├── study-to-work/         ← o curso
├── seu-usuario/           ← projeto 00
├── portfolio/             ← projeto 01
└── calculadora-clt-pj/    ← projeto 02
```

### 3.4 O seu primeiro exercício

> ✏️ **Pratique agora — Exercício 01: terminal**
>
> Pratique os comandos da seção 2. As instruções estão em `exercicios/00-ambiente-web-git/01-terminal/LEIA-ME.md`.
> Faça tudo pelo terminal e, no fim, rode a correção na raiz do curso:
>
> ```bash
> npm run exercicio -- 01-terminal
> ```

---

## 4. Como a Web funciona

### 4.1 Cliente e servidor: a analogia do restaurante

Pense em um restaurante:

- **Você (cliente)** olha o cardápio e faz um pedido.
- **O garçom** leva o pedido até a cozinha e traz o prato de volta.
- **A cozinha (servidor)** prepara o que foi pedido.
- **A despensa (banco de dados)** guarda os ingredientes.

Na Web é igual:

| Restaurante | Web                                                                 |
| ----------- | ------------------------------------------------------------------- |
| Cliente     | O **navegador** (Chrome, Firefox, o app do celular)                 |
| Pedido      | A **requisição** (*request*)                                        |
| Garçom      | O protocolo **HTTP**, que define como pedido e resposta são escritos |
| Cozinha     | O **servidor**, um computador ligado 24 horas rodando um programa   |
| Prato       | A **resposta** (*response*): uma página HTML, uma imagem, dados...  |
| Despensa    | O **banco de dados**                                                |

Isso nos dá as três grandes áreas do desenvolvimento web:

- **Front-end**: tudo o que roda no navegador (o que o usuário vê e toca). HTML, CSS e JavaScript.
- **Back-end**: os programas que rodam no servidor (regras de negócio, segurança, acesso ao banco).
- **Banco de dados**: onde as informações ficam guardadas de forma permanente.

Quem trabalha nas três camadas é chamado de **fullstack**, que é o objetivo deste curso.

### 4.2 Internet não é a mesma coisa que Web

- **Internet** é a rede física e lógica que liga computadores no mundo todo (cabos, roteadores, antenas).
- **Web** é *um dos serviços* que funcionam sobre a internet: páginas ligadas por links,
  acessadas pelo navegador. E-mail, jogos online e o WhatsApp também usam a internet, mas não são "a Web".

### 4.3 IP, domínio e DNS

Todo computador conectado tem um **endereço IP**, como `142.250.79.46`. Decorar números é difícil,
por isso existem os **domínios**: `google.com`, `meusite.com.br`.

O **DNS** (*Domain Name System*) é a "agenda de contatos" da internet: ele traduz o domínio para o IP.

```
Você digita: minhaloja.com.br
       │
       ▼
DNS: "minhaloja.com.br fica no IP 203.0.113.10"
       │
       ▼
O navegador conecta no IP 203.0.113.10
```

### 4.4 Anatomia de uma URL

Uma URL (o "endereço") tem várias partes. Vamos dissecar esta:

```
https://loja.exemplo.com.br:8080/produtos/tenis?cor=azul&tamanho=42#avaliacoes
└─┬─┘   └───────┬─────────┘ └┬─┘└─────┬──────┘ └────────┬────────┘ └───┬────┘
protocolo    domínio       porta   caminho       query string       fragmento
```

| Parte | Exemplo | Para que serve |
| --- | --- | --- |
| **Protocolo** | `https` | As "regras da conversa". `https` é o HTTP com criptografia. |
| **Domínio** | `loja.exemplo.com.br` | Qual servidor. `loja` é um **subdomínio** de `exemplo.com.br`. |
| **Porta** | `8080` | Qual "porta" do servidor. Quase sempre fica escondida: o HTTPS usa a **443** e o HTTP a **80** por padrão. |
| **Caminho** (*path*) | `/produtos/tenis` | Qual recurso dentro do servidor. |
| **Query string** | `?cor=azul&tamanho=42` | Parâmetros extras, no formato `chave=valor`, separados por `&`. Muito usada em buscas e filtros. |
| **Fragmento** | `#avaliacoes` | Um ponto **dentro** da página. Não é enviado ao servidor; o navegador só rola até ele. |

> ✏️ **Pratique agora — Exercício 02: as partes de uma URL**
>
> Abra `exercicios/00-ambiente-web-git/02-url/respostas.js` e troque cada `null` pela parte certa da URL.
>
> ```bash
> npm run exercicio -- 02-url
> ```

### 4.5 O caminho completo de uma requisição

O que acontece quando você digita `https://minhaloja.com.br/produtos` e aperta Enter:

1. O navegador pergunta ao **DNS** qual é o IP de `minhaloja.com.br`.
2. Ele abre uma conexão com esse IP na porta 443 e faz o "aperto de mão" do **TLS**,
   a criptografia do HTTPS (é o cadeado na barra de endereço).
3. Envia a **requisição HTTP**: `GET /produtos`.
4. O **servidor** recebe, roda o código do back-end, que talvez busque os produtos no **banco de dados**.
5. O servidor devolve a **resposta**: código `200 OK` e um documento **HTML**.
6. O navegador lê o HTML e percebe que precisa de mais arquivos (CSS, JavaScript, imagens).
   Para **cada um** deles, faz uma nova requisição.
7. Com tudo em mãos, o navegador **desenha** a página na tela (*render*).

> Uma página comum faz dezenas de requisições. Você vai ver isso com os próprios olhos na seção 4.10.

### 4.6 HTTP: a conversa entre cliente e servidor

HTTP é texto. Uma requisição tem esta cara:

```http
POST /pedidos HTTP/1.1
Host: minhaloja.com.br
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{ "produtoId": 42, "quantidade": 2 }
```

| Parte | No exemplo | O que é |
| --- | --- | --- |
| **Método** | `POST` | A **ação** desejada. |
| **Caminho** | `/pedidos` | Sobre qual recurso. |
| **Cabeçalhos** (*headers*) | `Host`, `Content-Type`, `Authorization` | Informações extras sobre a requisição, no formato `Nome: valor`. |
| **Corpo** (*body*) | `{ "produtoId": 42, ... }` | Os dados enviados. `GET` normalmente não tem corpo. |

E a resposta:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{ "id": 1001, "status": "aguardando pagamento" }
```

Uma resposta tem o **código de status** (`201`), cabeçalhos e corpo.

### 4.7 Métodos HTTP

Os métodos dizem **o que** você quer fazer com o recurso. Usando uma loja virtual como exemplo:

| Método | Significado | Exemplo na loja |
| --- | --- | --- |
| `GET` | **Buscar** dados. Nunca deve alterar nada. | `GET /produtos` lista os produtos |
| `POST` | **Criar** algo novo | `POST /pedidos` cria um pedido |
| `PUT` | **Substituir** um recurso inteiro | `PUT /produtos/42` troca todos os dados do produto 42 |
| `PATCH` | **Atualizar parte** de um recurso | `PATCH /pedidos/1001` muda só o endereço de entrega |
| `DELETE` | **Remover** | `DELETE /carrinho/itens/7` tira um item do carrinho |

A diferença entre `PUT` e `PATCH` cai muito em entrevista: o `PUT` manda o objeto **completo**
(o que não for enviado se perde), enquanto o `PATCH` manda **só os campos que mudam**.

### 4.8 Códigos de status

O código de status é um número de três dígitos. O **primeiro dígito** diz a família:

| Família | Significado | Pense em... |
| --- | --- | --- |
| **2xx** | Sucesso | "Deu certo." |
| **3xx** | Redirecionamento | "Procure em outro lugar." |
| **4xx** | Erro **do cliente** | "Você pediu errado." |
| **5xx** | Erro **do servidor** | "Nós erramos." |

Os que você vai ver todos os dias:

| Código | Nome | Quando acontece |
| --- | --- | --- |
| `200` | OK | A requisição deu certo (ex.: a lista de produtos voltou). |
| `201` | Created | Algo foi **criado** (ex.: o pedido foi registrado). |
| `204` | No Content | Deu certo e não há nada para devolver (comum em `DELETE`). |
| `301` | Moved Permanently | O endereço mudou para sempre (ex.: `http` → `https`). |
| `400` | Bad Request | Os dados enviados estão errados (ex.: e-mail em branco no formulário). |
| `401` | Unauthorized | Você **não está logado**, ou o login expirou. O servidor não sabe quem você é. |
| `403` | Forbidden | O servidor **sabe quem você é**, mas você **não tem permissão** (ex.: cliente acessando a área do administrador). |
| `404` | Not Found | O recurso não existe (ex.: `/produtos/999`). |
| `422` | Unprocessable Content | Os dados estão no formato certo, mas violam uma regra (ex.: data de entrega no passado). |
| `429` | Too Many Requests | Você fez requisições demais em pouco tempo. |
| `500` | Internal Server Error | Um bug no servidor. |
| `503` | Service Unavailable | O servidor está fora do ar ou sobrecarregado. |

> **401 × 403**, outra pergunta clássica de entrevista: 401 é "quem é você?"; 403 é "sei quem você é, e você não pode".

### 4.9 Cabeçalhos importantes

| Cabeçalho | Para que serve |
| --- | --- |
| `Content-Type` | O formato do corpo: `text/html`, `application/json`, `image/png`... |
| `Authorization` | Credenciais de acesso. O **token de login** vai aqui, no **cabeçalho**, e não na URL (URLs ficam gravadas em históricos e logs). |
| `Cookie` / `Set-Cookie` | Pequenos dados que o servidor pede ao navegador para guardar e reenviar (muito usado para manter o login). |
| `Cache-Control` | Por quanto tempo o navegador pode reaproveitar a resposta sem pedir de novo. |
| `User-Agent` | Qual navegador/programa está fazendo a requisição. |

### 4.10 Veja com seus próprios olhos: o DevTools

Todo navegador tem ferramentas de desenvolvedor embutidas, o **DevTools**.

1. Abra qualquer site (por exemplo, `https://developer.mozilla.org/pt-BR/`).
2. Aperte **F12** (ou clique com o botão direito → *Inspecionar*).
3. Vá na aba **Network** (Rede) e recarregue a página (F5).

Cada linha é **uma requisição**. Clique em uma e observe:

- **Headers**: o método, a URL, o código de status e os cabeçalhos.
- **Response**: o que o servidor devolveu.
- **Timing**: quanto tempo cada etapa levou.

Desafio: quantas requisições a página fez? Qual foi a mais lenta? Alguma deu 404?

> ✏️ **Pratique agora — Exercício 03: HTTP na prática**
>
> Abra `exercicios/00-ambiente-web-git/03-http/respostas.js`. São situações de uma loja virtual: para cada uma,
> responda o método ou o código de status certo (seções 4.6 a 4.9).
>
> ```bash
> npm run exercicio -- 03-http
> ```

---

## 5. Git e GitHub

### 5.1 Por que versionar?

Sem controle de versão, projetos viram isto:

```
site-final.html
site-final-2.html
site-final-agora-vai.html
site-final-agora-vai-CORRIGIDO.html
```

O **Git** resolve isso. Ele é como o "salvar jogo" de um videogame: cada **commit** é um
ponto salvo, com data, autor e descrição. Você pode voltar a qualquer ponto, ver o que mudou
entre dois pontos e trabalhar em várias versões ao mesmo tempo.

- **Git** é o programa que roda no seu computador.
- **GitHub** é um site que hospeda repositórios Git na nuvem: backup, colaboração e portfólio.
  (Existem outros, como GitLab e Bitbucket.)

Em **toda** empresa de tecnologia você vai usar Git. Não existe exceção.

### 5.2 Conceitos

| Conceito | O que é |
| --- | --- |
| **Repositório** (repo) | Uma pasta cujo histórico o Git acompanha. O histórico fica na pasta oculta `.git`. |
| **Commit** | Um "ponto salvo": uma foto das mudanças com uma mensagem explicando o que foi feito. |
| **Staging area** | A "sala de espera": onde você escolhe **quais** mudanças vão entrar no próximo commit. |
| **Branch** | Uma linha do tempo paralela. Você cria uma branch para desenvolver algo sem mexer na principal. |
| **main** | A branch principal. |
| **Merge** | Juntar as mudanças de uma branch em outra. |
| **Remote** | Uma cópia do repositório em outro lugar (normalmente no GitHub). Por padrão se chama `origin`. |
| **Clone** | Baixar um repositório remoto para o seu computador. |
| **Fork** | Uma cópia de um repositório **de outra pessoa** para a **sua** conta do GitHub. |
| **Push** / **Pull** | Enviar commits para o remote / trazer commits do remote. |

As três áreas do Git, que é o diagrama mais importante desta seção:

```
  Pasta de trabalho        Staging area           Repositório
  (seus arquivos)          (sala de espera)       (histórico)
        │                        │                      │
        │──── git add ──────────▶│                      │
        │                        │──── git commit ─────▶│
        │                                               │
        │◀──────────────── git restore ─────────────────│
```

### 5.3 Configuração (uma vez por computador)

O Git grava o seu nome e e-mail em cada commit. Use o **mesmo e-mail** da sua conta do GitHub:

```bash
git config --global user.name "Ana Souza"
git config --global user.email "ana@exemplo.com"
git config --global init.defaultBranch main
```

Confira com `git config --global --list`. No Codespaces isso já vem configurado.

### 5.4 O fluxo do dia a dia

```bash
git status                 # 1. O que mudou? (use o tempo todo!)
git diff                   # 2. Quais linhas mudaram exatamente?
git add index.html         # 3. Coloca o arquivo na staging area
git add .                  #    ...ou todos os arquivos modificados
git commit -m "feat: adiciona seção de contato"   # 4. Salva o ponto
git log --oneline          # 5. Vê o histórico resumido
```

Exemplo do que o `git status` mostra:

```
On branch main
Changes not staged for commit:
        modified:   index.html        ← mudou, mas ainda não está no staging

Untracked files:
        contato.html                  ← arquivo novo, o Git ainda não acompanha
```

**Faça commits pequenos e frequentes**, cada um com **uma** mudança lógica. "Corrige o menu
no celular" é um bom commit. "Várias coisas" não é.

### 5.5 Branches e merge

Branches permitem trabalhar em uma funcionalidade sem quebrar a versão principal. Em empresas,
**ninguém faz commit direto na main**: cada tarefa vira uma branch.

```bash
git switch -c feat/formulario-contato   # cria a branch e muda para ela
# ... edita arquivos, faz commits ...
git switch main                          # volta para a main
git merge feat/formulario-contato        # traz as mudanças da branch
git branch -d feat/formulario-contato    # apaga a branch (opcional)
git branch                               # lista as branches
```

```
main     ──●──●───────────●  (merge)
                \         /
feat/contato     ●──●──●
```

**Conflitos.** Se a mesma linha foi alterada nas duas branches, o Git não sabe qual escolher
e pede a sua ajuda. O arquivo fica assim:

```
<<<<<<< HEAD
<h1>Bem-vindo à loja</h1>
=======
<h1>Bem-vinda à Loja do Bairro</h1>
>>>>>>> feat/novo-titulo
```

Para resolver: edite o arquivo deixando só a versão correta (apague as linhas `<<<<<<<`,
`=======` e `>>>>>>>`), depois rode `git add` e `git commit`. O VS Code mostra botões
*Accept Current / Accept Incoming / Accept Both* que facilitam.

### 5.6 Trabalhando com o GitHub

**Clonar** um repositório (baixar para o computador):

```bash
git clone https://github.com/seu-usuario/study-to-work.git
cd study-to-work
```

**Enviar** os seus commits:

```bash
git push                          # envia a branch atual
git push -u origin feat/contato   # primeira vez enviando uma branch nova
```

**Trazer** commits que estão no GitHub e você ainda não tem:

```bash
git pull
```

**Criar um repositório novo** para um projeto:

1. No GitHub: botão **New repository**, dê um nome (ex.: `portfolio`), marque **Public**.
2. No terminal, na pasta do projeto:

```bash
git init
git add .
git commit -m "chore: estrutura inicial do projeto"
git remote add origin https://github.com/seu-usuario/portfolio.git
git push -u origin main
```

**Autenticação.** O GitHub não aceita a senha da conta no terminal.
- No **Codespaces**, o repositório onde você abriu o codespace já funciona. Para criar e enviar
  **outros** repositórios (os seus projetos), rode uma vez `unset GITHUB_TOKEN` e depois
  `gh auth login`, escolhendo GitHub.com → HTTPS → login pelo navegador.
- No **seu computador**, o Git para Windows já traz o *Git Credential Manager*: no primeiro
  `git push` abre uma janela de login no navegador. No Linux/Mac, instale o GitHub CLI (`gh`)
  e rode `gh auth login`.

**Mantendo o seu fork do curso atualizado.** O curso pode receber correções. Para trazê-las:

```bash
git remote add upstream https://github.com/AUTOR-ORIGINAL/study-to-work.git   # só uma vez
git pull upstream main
```

### 5.7 `.gitignore`: o que não deve ir para o repositório

Alguns arquivos **não** devem ser versionados: dependências baixadas (`node_modules`), arquivos
gerados, e principalmente **senhas e chaves** (`.env`). O arquivo `.gitignore` lista o que o Git deve ignorar:

```gitignore
node_modules/
.env
dist/
.DS_Store
```

> Se uma senha for parar no GitHub, considere que ela **vazou**, mesmo que você apague o
> commit depois. Troque a senha imediatamente.

### 5.8 Mensagens de commit: Conventional Commits

Empresas usam um padrão para as mensagens. O mais comum é o **Conventional Commits**:

```
tipo(escopo opcional): descrição curta no imperativo
```

| Tipo | Quando usar | Exemplo |
| --- | --- | --- |
| `feat` | Nova funcionalidade | `feat: adiciona filtro por categoria` |
| `fix` | Correção de bug | `fix: corrige cálculo do frete grátis` |
| `docs` | Só documentação | `docs: explica como rodar o projeto` |
| `style` | Formatação, sem mudar lógica | `style: ajusta indentação` |
| `refactor` | Reorganiza o código sem mudar o comportamento | `refactor: extrai função de validação` |
| `test` | Testes | `test: cobre caso de carrinho vazio` |
| `chore` | Tarefas de manutenção | `chore: atualiza dependências` |
| `ci`, `build`, `perf` | Pipeline, build e performance | `perf: carrega imagens sob demanda` |

Boas e más mensagens:

```
❌ "ajustes"           ❌ "commit"            ❌ "agora vai"
✅ "fix: impede envio do formulário com e-mail vazio"
✅ "feat(carrinho): permite alterar a quantidade de itens"
```

### 5.9 Desfazendo coisas (sem pânico)

| Situação | Comando |
| --- | --- |
| Quero descartar as mudanças de um arquivo (que ainda não foram para o staging) | `git restore arquivo` |
| Coloquei no staging sem querer | `git restore --staged arquivo` |
| Errei a mensagem do último commit (e **ainda não** dei push) | `git commit --amend -m "nova mensagem"` |
| Quero desfazer um commit que **já** está no GitHub | `git revert <hash-do-commit>` (cria um commit que desfaz o outro) |
| Quero ver como o projeto estava num commit antigo | `git log --oneline` e depois `git switch --detach <hash>`; volte com `git switch main` |

Regra de ouro: **nunca reescreva o histórico que já foi enviado** (`--amend`, `reset --hard`)
numa branch que outras pessoas usam.

> ✏️ **Pratique agora — Exercício 04: Git na prática**
>
> Siga o passo a passo de `exercicios/00-ambiente-web-git/04-git/LEIA-ME.md`: criar uma branch, fazer dois
> commits no padrão Conventional Commits, fazer o merge na main e enviar para o GitHub.
>
> ```bash
> npm run exercicio -- 04-git
> ```

---

## 6. Markdown

Markdown é um jeito de formatar texto usando símbolos simples. É a linguagem dos READMEs,
da documentação, das issues e dos Pull Requests do GitHub. O seu portfólio no GitHub vai ser
escrito nela.

| Você escreve | Vira |
| --- | --- |
| `# Título` | Título de nível 1 (o maior) |
| `## Subtítulo` | Título de nível 2 |
| `**negrito**` | **negrito** |
| `*itálico*` | *itálico* |
| `` `código` `` | `código` |
| `[texto do link](https://exemplo.com)` | [texto do link](https://exemplo.com) |
| `![descrição da imagem](foto.png)` | Uma imagem (a descrição é o texto alternativo) |
| `- item` | Lista com marcadores |
| `1. passo` | Lista numerada |
| `> citação` | Bloco de citação |
| `---` | Linha horizontal |

**Bloco de código** com a linguagem indicada (o GitHub colore a sintaxe):

````markdown
```bash
npm install
npm test
```
````

**Tabela:**

```markdown
| Atalho | O que faz         |
| ------ | ----------------- |
| Ctrl+P | Abre um arquivo   |
| Ctrl+` | Abre o terminal   |
```

Para ver o resultado no VS Code: clique com o botão direito no arquivo `.md` → **Open Preview**
(ou `Ctrl+Shift+V`).

### Como é um bom README de projeto

1. **Título** e uma frase dizendo o que o projeto faz.
2. Um **print** ou GIF mostrando o projeto funcionando.
3. **Link** do projeto publicado (quando houver).
4. **Funcionalidades** principais.
5. **Tecnologias** usadas.
6. **Como rodar** localmente, com os comandos.
7. **Decisões técnicas** e **limitações**: o que você escolheu fazer e por quê.

Recrutadores gastam segundos em cada repositório. O README é o que eles leem.

> ✏️ **Pratique agora — Exercício 05: Markdown**
>
> Abra `exercicios/00-ambiente-web-git/05-markdown/README.md`, apague o comentário com o enunciado e escreva um
> guia do seu ambiente usando todos os elementos desta seção.
>
> ```bash
> npm run exercicio -- 05-markdown
> ```

---

## Resumo dos exercícios

Você já fez todos ao longo da aula. Confira com `npm run progresso`.

| # | Exercício | Seção |
| --- | --- | --- |
| 01 | `01-terminal`: criar, copiar, renomear e apagar só pelo terminal | 2 e 3 |
| 02 | `02-url`: as partes de uma URL | 4.4 |
| 03 | `03-http`: métodos e códigos de status de uma loja virtual | 4.6 a 4.9 |
| 04 | `04-git`: branch, commits no padrão, merge e push | 5 |
| 05 | `05-markdown`: um guia do seu ambiente com todos os elementos do Markdown | 6 |

Atividade extra, sem correção automática: abra o DevTools em três sites que você usa
(banco, rede social, loja) e anote na aba Network: quantas requisições, qual a maior e se
alguma retornou 4xx ou 5xx.

---

## Projeto do módulo — README de perfil do GitHub

Enunciado completo: [projetos/00-perfil-github/README.md](../projetos/00-perfil-github/README.md).

Resumo: criar o repositório especial `seu-usuario/seu-usuario`, cujo README aparece no topo do
seu perfil, com apresentação, tecnologias, objetivos e contato. É a primeira coisa que um
recrutador vê, e você vai atualizá-lo a cada projeto do curso.

```bash
npm run corrigir-projeto -- 00 ../seu-usuario
```

---

## Checklist para avançar

- [ ] Explico, sem olhar, o caminho de uma requisição: DNS → conexão → HTTP → servidor → resposta → render.
- [ ] Sei a diferença entre GET, POST, PUT, PATCH e DELETE, e entre 401 e 403.
- [ ] Uso o DevTools para ver as requisições de uma página.
- [ ] Meu ambiente está pronto (Codespaces ou local) e `npm test` roda.
- [ ] Navego e manipulo arquivos pelo terminal sem medo.
- [ ] Faço commits pequenos, com mensagens no padrão Conventional Commits.
- [ ] Crio branches, faço merge e resolvo um conflito simples.
- [ ] Os 5 exercícios estão passando (`npm run progresso`).
- [ ] Meu README de perfil está no ar e passou na correção.
