# study-to-work — Do zero ao Fullstack Pleno com JavaScript

Curso prático e gratuito para aprender desenvolvimento web com **JavaScript e TypeScript**, do
primeiro "Olá, mundo" até o nível de **desenvolvedor Fullstack Pleno**: pronto para vagas CLT,
para trabalhar como PJ ou para pegar projetos como freelancer.

> **Filosofia:** aprender fazendo, com correção na hora. Toda aula traz explicação detalhada e
> exemplos. Todo exercício tem **testes automáticos que corrigem a sua resposta**, como um
> professor. E todo módulo termina com um **projeto de portfólio que resolve um problema real**,
> algo que outras pessoas conseguem usar, e não um exercício de enfeite no GitHub.

---

## Como começar

### No navegador (recomendado): GitHub Codespaces

1. Faça um **fork** deste repositório (botão *Fork*, no topo da página).
2. No seu fork: **Code → Codespaces → Create codespace on main**.
3. Espere o ambiente montar (Node.js, extensões e dependências são instalados sozinhos).
4. No terminal: `npm test`.

### No seu computador

Instale [VS Code](https://code.visualstudio.com/), [Node.js LTS](https://nodejs.org/pt) (v24+) e
[Git](https://git-scm.com/). Depois:

```bash
git clone https://github.com/SEU-USUARIO/study-to-work.git
cd study-to-work
npm install
npm test
```

O passo a passo completo, com explicação de cada etapa, está no [Módulo 00](modulos/00-ambiente-web-git.md).

---

## Como o curso funciona

```
study-to-work/
├── modulos/       → as aulas, em ordem
├── exercicios/    → onde você pratica (cada exercício tem seu teste de correção)
├── projetos/      → enunciados e testes dos projetos de portfólio
├── gabaritos/     → soluções dos exercícios (só depois de tentar!)
├── suporte/       → código que os testes usam
└── scripts/       → comandos do curso (progresso, correção de projetos)
```

1. **Leia a aula** do módulo, digitando os exemplos (não copie e cole).
2. **Resolva cada exercício assim que ele aparecer na aula**, no bloco ✏️ *Pratique agora*, logo
   depois do assunto que ele pratica. Os arquivos ficam em `exercicios/NN-modulo/`, e cada um tem um teste que corrige:

   ```bash
   npm run exercicio -- 01-celsius   # corrige e fica observando: salve o arquivo e veja o resultado
   npm run progresso                 # barra de progresso de todos os módulos
   npm test                          # roda tudo uma vez
   ```

3. **No fim da aula, construa o projeto do módulo** num repositório próprio no seu GitHub (é o que o recrutador vai
   abrir) e corrija com os testes do curso:

   ```bash
   npm run corrigir-projeto -- 02 ../calculadora-clt-pj
   ```

4. **Confira o checklist** no fim da aula. Só avance quando estiver tudo marcado.

**Regras:** não altere os arquivos `.test.js`; só abra o gabarito depois de resolver (ou depois de
uma hora travado tentando de verdade); exercícios e projetos usam **apenas** o que já foi ensinado.

---

## A trilha

| Fase | # | Módulo | Projeto de portfólio | Status |
| --- | --- | --- | --- | --- |
| **1. Fundamentos** | 00 | [Web, ambiente, terminal, Git e Markdown](modulos/00-ambiente-web-git.md) | README de perfil do GitHub | ✅ |
| | 01 | [HTML e CSS](modulos/01-html-css.md) | Site de portfólio pessoal (GitHub Pages) | ✅ |
| | 02 | [JavaScript: fundamentos](modulos/02-js-fundamentos.md) | Calculadora CLT × PJ (terminal) | ✅ |
| | 03 | [JavaScript intermediário](modulos/03-js-intermediario.md) | Analisador de extrato bancário (terminal) | ✅ |
| | 04 | [JavaScript no navegador (DOM)](modulos/04-js-navegador-dom.md) | Racha-conta: divide despesas do grupo (funciona sem internet) | ✅ |
| | 05 | [JavaScript assíncrono, APIs e classes](modulos/05-js-assincrono-avancado.md) | Painel de câmbio: cotações reais, conversor e histórico (funciona sem internet) | ✅ |
| | 06 | [Ferramentas do dia a dia profissional](modulos/06-ferramentas.md) | Pacote npm da calculadora CLT × PJ | ✅ |
| **2. Produto e Frontend** | 07 | Análise e projeto de sistemas (requisitos, histórias de usuário, UML/Mermaid) | Documento de requisitos de um produto real | 📝 planejado |
| | 08 | UX/UI (design system, acessibilidade, protótipo) | Design system + protótipo | 📝 planejado |
| | 09 | [TypeScript](modulos/09-typescript.md) | *a definir* | 🔄 versão anterior |
| | 10 | [React](modulos/10-react.md) | Controle financeiro pessoal (PWA) | 🔄 versão anterior |
| | 11 | [Testes automatizados](modulos/11-testes.md) | Suíte de testes do controle financeiro | 🔄 versão anterior |
| **3. Backend** | 12 | Node.js e APIs REST | API de agendamento para pequenos negócios | 📝 planejado |
| | 13 | PostgreSQL e Prisma | Agendamento com banco relacional | 📝 planejado |
| | 14 | MongoDB | *a definir* | 📝 planejado |
| | 15 | Autenticação e segurança | Login completo com refresh token | 📝 planejado |
| **4. Fullstack e produção** | 16 | Next.js fullstack | Cardápio digital com QR Code e pedidos | 📝 planejado |
| | 17 | Docker, CI/CD e deploy | Pipeline completo em produção | 📝 planejado |
| | 18 | Observabilidade (logs, métricas, alertas) | Monitoramento do cardápio digital | 📝 planejado |
| **5. Nível Pleno** | 19 | Arquitetura (SOLID, Clean Architecture, DDD básico) | Refatoração arquitetural | 📝 planejado |
| | 20 | Refatoração e código legado | Resgate de um sistema legado | 📝 planejado |
| | 21 | Filas, cache e tempo real | Notificações em tempo real | 📝 planejado |
| | 22 | IA no desenvolvimento (Claude Code, CLAUDE.md, skills, MCP, API) | Assistente com IA + servidor MCP | 📝 planejado |
| | 23 | Carreira: CLT, PJ, MEI, freelancer, entrevistas | Proposta comercial e precificação | 📝 planejado |
| | 24 | Projeto final | SaaS completo em produção | 📝 planejado |

✅ pronto no novo padrão · 🔄 conteúdo da versão anterior, será reescrito · 📝 planejado

> Você estará apto a buscar vagas **júnior** ao fim da Fase 3. As Fases 4 e 5 são o que
> transforma o júnior em **pleno**: continue estudando enquanto trabalha.

### Carga horária sugerida

| Ritmo | Horas por semana | Duração total estimada |
| --- | --- | --- |
| Intensivo | 30–40 h | ~10–12 meses |
| Regular | 15–20 h | ~18–22 meses |
| Leve | 8–10 h | ~30 meses |

A regra de ouro: **70% do tempo escrevendo código, 30% estudando teoria.**

---

## Tudo dentro do VS Code

O curso foi pensado para rodar **inteiro no VS Code**, inclusive no GitHub Codespaces, sem
depender de serviços externos. Quando um módulo precisar de banco de dados (PostgreSQL, MongoDB,
Redis), eles vão rodar em **containers** no próprio ambiente, como acontece no dia a dia das empresas.

---

## O que é ser um Fullstack Pleno (o objetivo final)

Ao terminar, você deve conseguir, **com autonomia**:

- Receber uma necessidade de negócio, levantar requisitos, quebrar em tarefas e entregar do banco de dados até a tela.
- Desenhar interfaces usáveis e acessíveis e transformá-las em componentes reutilizáveis.
- Escrever código **legível, testado e tipado**, seguindo os padrões do time.
- Modelar bancos de dados relacionais e não relacionais e evitar problemas de performance.
- Construir APIs seguras (autenticação, autorização, validação, rate limit).
- Colocar uma aplicação em produção com Docker, CI/CD, logs e monitoramento.
- Investigar bugs em produção e refatorar código legado com segurança.
- Discutir arquitetura e trade-offs, fazer code review e ajudar devs júnior.
- Usar IA como ferramenta de produtividade, sabendo avaliar e corrigir o que ela produz.
- Negociar e trabalhar como CLT, PJ ou freelancer.

| Nível | Característica principal |
| --- | --- |
| Júnior | Executa tarefas bem definidas, com ajuda frequente. |
| **Pleno** | **Resolve problemas de ponta a ponta sozinho, conhece trade-offs, ajuda os júniors.** |
| Sênior | Define arquitetura, antecipa problemas, influencia o time e o produto. |

---

## Rotina de estudo recomendada

- **Todo dia:** pelo menos 1 commit no GitHub, mesmo que pequeno.
- **Toda semana:** 1 problema de lógica no [Beecrowd](https://judge.beecrowd.com/) ou no [Exercism](https://exercism.org/).
- **Todo módulo:** um resumo com as suas palavras (técnica de Feynman: se não consegue explicar de forma simples, ainda não entendeu).
- **Ao travar:** 1) leia a mensagem de erro inteira, 2) use `console.log` ou o debugger, 3) pesquise o
  erro, 4) consulte a documentação oficial, 5) só então peça ajuda, explicando o que já tentou.
- **Sobre IA:** nos módulos 00 a 06, use IA só como *tutor* (peça explicações, nunca a resposta).
  No módulo 22 você aprende a desenvolver **com** IA, e só aproveita bem quem sabe programar sem ela.

## Referências principais (gratuitas)

- [MDN Web Docs](https://developer.mozilla.org/pt-BR/): a referência de HTML, CSS e JavaScript
- [javascript.info](https://javascript.info/): o melhor tutorial de JavaScript moderno
- [web.dev](https://web.dev/): performance, acessibilidade e boas práticas (Google)
- [react.dev](https://react.dev/), [Node.js Docs](https://nodejs.org/docs/latest/api/), [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [roadmap.sh](https://roadmap.sh/full-stack): para conferir se nada ficou de fora

---

## Para quem mantém o curso

```bash
npm run gabarito   # roda os testes dos exercícios contra gabaritos/ (todos devem passar)
```

Padrão de um módulo novo: aula em `modulos/`, exercícios em `exercicios/NN-modulo/` (arquivo do
aluno + `.test.js` + solução em `gabaritos/`), projeto em `projetos/NN-nome/` (README com problema,
requisitos e "o que falar na entrevista" + `testes/` validados contra uma solução de referência).
