# Módulo 00 — Ambiente, como a Web funciona e Git

**Duração:** 1–2 semanas · **Pré-requisito:** nenhum

## Objetivos

- Entender o que acontece quando você digita um endereço no navegador.
- Montar o ambiente de desenvolvimento profissional.
- Usar o terminal sem medo.
- Versionar código com Git e publicar no GitHub.

---

## 1. Como a Web funciona

### Cliente e servidor

- **Cliente**: quem pede algo (o navegador, um app de celular).
- **Servidor**: um computador que fica ligado esperando pedidos e devolve respostas.
- **Frontend**: o que roda no cliente (HTML, CSS, JavaScript no navegador).
- **Backend**: o que roda no servidor (regras de negócio, banco de dados, APIs).
- **Fullstack**: quem trabalha nos dois lados.

### O caminho de uma requisição

```
Você digita https://site.com
   │
   ├─ 1. DNS: "qual o IP de site.com?"  →  203.0.113.10
   ├─ 2. Conexão TCP + TLS (o "S" do HTTPS: criptografia)
   ├─ 3. Navegador envia:  GET / HTTP/1.1
   ├─ 4. Servidor responde: 200 OK + HTML
   ├─ 5. Navegador lê o HTML e pede CSS, JS e imagens
   └─ 6. Navegador monta e desenha a página
```

### HTTP em 5 minutos

Uma requisição tem **método**, **URL**, **cabeçalhos (headers)** e às vezes **corpo (body)**.

| Método   | Significado            | Exemplo                       |
| -------- | ---------------------- | ----------------------------- |
| `GET`    | Buscar dados           | Ver lista de produtos         |
| `POST`   | Criar                  | Cadastrar usuário             |
| `PUT`    | Substituir por inteiro | Atualizar perfil completo     |
| `PATCH`  | Atualizar parte        | Mudar só o e-mail             |
| `DELETE` | Remover                | Excluir um comentário         |

Códigos de status mais comuns: `200` OK, `201` Criado, `204` Sem conteúdo, `301` Redirecionado,
`400` Requisição inválida, `401` Não autenticado, `403` Sem permissão, `404` Não encontrado,
`500` Erro no servidor.

**Prática:** abra o DevTools do navegador (F12) → aba **Network** → recarregue qualquer site.
Clique em uma requisição e identifique método, status, headers e resposta.

---

## 2. Ambiente de desenvolvimento

Instale:

1. **Navegador**: Chrome ou Firefox (ótimos DevTools).
2. **VS Code** com extensões: *ESLint*, *Prettier*, *GitLens*, *Error Lens*, *EditorConfig*.
3. **Node.js LTS** — use um gerenciador de versões (`nvm-windows`, `nvm` ou `fnm`).
4. **Git** — no Windows, o *Git for Windows* já traz o Git Bash.
5. (Opcional, recomendado no Windows) **WSL 2** com Ubuntu — a maioria dos servidores roda Linux.

Confirme:

```bash
node -v    # v22.x ou superior
npm -v
git --version
```

---

## 3. Terminal essencial

```bash
pwd                  # onde estou?
ls -la               # listar arquivos (inclusive ocultos)
cd pasta             # entrar na pasta
cd ..                # voltar uma pasta
mkdir projetos       # criar pasta
touch index.html     # criar arquivo
cp a.txt b.txt       # copiar
mv a.txt docs/       # mover/renomear
rm arquivo.txt       # apagar (sem lixeira!)
rm -r pasta          # apagar pasta
cat arquivo.txt      # mostrar conteúdo
code .               # abrir a pasta atual no VS Code
```

**Exercício:** usando apenas o terminal, crie a estrutura abaixo, depois apague `lixo/`.

```
estudos/
├── modulo-00/
│   └── notas.md
├── modulo-01/
└── lixo/
```

---

## 4. Git e GitHub

### Conceitos

- **Repositório**: pasta cujo histórico o Git acompanha.
- **Commit**: uma "foto" do projeto com uma mensagem explicando a mudança.
- **Branch**: uma linha paralela de desenvolvimento.
- **Remote**: cópia do repositório em outro lugar (GitHub).

```
Working directory ──git add──▶ Staging area ──git commit──▶ Repositório local ──git push──▶ GitHub
```

### Comandos do dia a dia

```bash
git config --global user.name "Seu Nome"
git config --global user.email "voce@email.com"

git init                         # transforma a pasta em repositório
git status                       # o que mudou?
git add index.html               # prepara um arquivo
git add .                        # prepara tudo
git commit -m "feat: cria página inicial"
git log --oneline                # histórico resumido

git branch feature/menu          # cria branch
git switch feature/menu          # muda para ela
git switch -c feature/rodape     # cria e muda
git merge feature/menu           # traz as mudanças para a branch atual

git remote add origin https://github.com/voce/repo.git
git push -u origin main
git pull                         # baixa e integra mudanças
git clone https://github.com/x/y.git
```

### Boas mensagens de commit (Conventional Commits)

```
feat: adiciona filtro por categoria
fix: corrige cálculo do frete para CEP vazio
refactor: extrai função de validação de e-mail
docs: atualiza instruções de instalação
style: formata arquivos com prettier
test: adiciona testes do carrinho
chore: atualiza dependências
```

### `.gitignore`

```gitignore
node_modules/
.env
dist/
.DS_Store
```

> **Nunca** faça commit de senhas, tokens ou do arquivo `.env`.

---

## Exercícios

1. Crie um repositório `estudos` no GitHub e faça clone dele.
2. Crie um `README.md` com seu nome, objetivo e um checklist dos 17 módulos. Commit e push.
3. Crie uma branch `teste`, altere o README, faça commit, volte para `main` e faça merge.
4. Provoque um **conflito de merge** de propósito (altere a mesma linha em duas branches) e resolva.
5. No DevTools, descubra qual o status HTTP e o tamanho da página inicial de 3 sites diferentes.

## Projeto do módulo

**Repositório pessoal de estudos**: um repositório público com o README do exercício 2, onde
você vai registrar suas anotações de cada módulo (`notas/modulo-00.md`, etc.) ao longo da trilha.

## Checklist para avançar

- [ ] Sei explicar a diferença entre cliente, servidor, frontend e backend.
- [ ] Sei o que são métodos HTTP e status codes.
- [ ] Navego, crio e apago arquivos pelo terminal.
- [ ] Faço `add`, `commit`, `push`, `pull`, crio branches e resolvo conflitos simples.
- [ ] Meu repositório de estudos está no GitHub.
