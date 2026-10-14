# study-to-work — Do zero ao Fullstack Pleno com JavaScript

Plano de ensino prático para aprender programação com **JavaScript/TypeScript** e chegar ao nível de
**desenvolvedor Fullstack Pleno** (frontend + backend), pronto para o mercado de trabalho.

> **Filosofia:** aprender fazendo. Todo conceito vem com explicação, exemplo de código, exercícios
> e um projeto. Você só avança quando o projeto do módulo estiver funcionando e publicado no GitHub.

---

## Como usar este plano

1. Siga os módulos **na ordem** — cada um depende do anterior.
2. Para cada tópico: **leia a explicação → digite o exemplo (não copie e cole) → faça os exercícios**.
3. No fim de cada módulo, faça o **projeto simples** e depois o **projeto avançado**.
4. Use o **checklist** do módulo para saber se está pronto para seguir.
5. Coloque **todos os projetos no GitHub**, com README explicando o que faz e como rodar.
   Eles vão virar o seu portfólio.

### Carga horária sugerida

| Ritmo        | Horas/semana | Duração total estimada |
| ------------ | ------------ | ---------------------- |
| Intensivo    | 30–40 h      | ~8–10 meses            |
| Regular      | 15–20 h      | ~14–18 meses           |
| Leve         | 8–10 h       | ~24+ meses             |

A regra de ouro: **70% do tempo escrevendo código, 30% estudando teoria.**

---

## Mapa da trilha

```
FASE 1 — FUNDAMENTOS                    FASE 2 — FRONTEND
 00 Ambiente, Web e Git                  07 TypeScript
 01 HTML e CSS                           08 React
 02 JavaScript: fundamentos              09 Testes automatizados
 03 JavaScript: intermediário
 04 JavaScript no navegador (DOM)        FASE 3 — BACKEND
 05 JavaScript assíncrono e avançado     10 Node.js e APIs REST
 06 Ferramentas do dia a dia             11 Bancos de dados
                                         12 Autenticação e segurança

FASE 4 — FULLSTACK E PRODUÇÃO           FASE 5 — NÍVEL PLENO
 13 Next.js (fullstack)                  15 Arquitetura, padrões e performance
 14 Docker, CI/CD e deploy               16 Projeto final + carreira
```

| #  | Módulo                                                                 | Duração (ritmo regular) | Projeto principal                         |
| -- | ---------------------------------------------------------------------- | ----------------------- | ----------------------------------------- |
| 00 | [Ambiente, Web e Git](modulos/00-ambiente-web-git.md)                  | 1–2 semanas             | Repositório pessoal de estudos            |
| 01 | [HTML e CSS](modulos/01-html-css.md)                                   | 4–5 semanas             | Landing page responsiva                   |
| 02 | [JavaScript: fundamentos](modulos/02-js-fundamentos.md)                | 3–4 semanas             | Jogos de terminal / calculadoras          |
| 03 | [JavaScript: intermediário](modulos/03-js-intermediario.md)            | 3–4 semanas             | Sistema de biblioteca em memória          |
| 04 | [JavaScript no navegador](modulos/04-js-navegador-dom.md)              | 4 semanas               | Kanban com localStorage                   |
| 05 | [JavaScript assíncrono e avançado](modulos/05-js-assincrono-avancado.md) | 3–4 semanas           | App de clima/filmes consumindo APIs       |
| 06 | [Ferramentas do dia a dia](modulos/06-ferramentas.md)                  | 2 semanas               | Template de projeto profissional          |
| 07 | [TypeScript](modulos/07-typescript.md)                                 | 3 semanas               | Kanban reescrito em TS                    |
| 08 | [React](modulos/08-react.md)                                           | 6–8 semanas             | E-commerce frontend                       |
| 09 | [Testes automatizados](modulos/09-testes.md)                           | 2–3 semanas             | Testes para o e-commerce                  |
| 10 | [Node.js e APIs REST](modulos/10-node-apis.md)                         | 5–6 semanas             | API de tarefas completa                   |
| 11 | [Bancos de dados](modulos/11-bancos-de-dados.md)                       | 4–5 semanas             | API com PostgreSQL + Prisma               |
| 12 | [Autenticação e segurança](modulos/12-autenticacao-seguranca.md)       | 3 semanas               | Login completo com refresh token          |
| 13 | [Next.js fullstack](modulos/13-nextjs.md)                              | 4–5 semanas             | Blog/SaaS fullstack                       |
| 14 | [Docker, CI/CD e deploy](modulos/14-devops.md)                         | 3 semanas               | Pipeline completo em produção             |
| 15 | [Arquitetura, padrões e performance](modulos/15-arquitetura-pleno.md)  | 5–6 semanas             | Refatoração + filas, cache e tempo real   |
| 16 | [Projeto final e carreira](modulos/16-projeto-final-carreira.md)       | 6–8 semanas             | Produto SaaS completo em produção         |

---

## O que é ser um Fullstack Pleno (o objetivo final)

Ao terminar, você deve conseguir, **com autonomia**:

- Receber uma funcionalidade de negócio, quebrar em tarefas e entregar do banco de dados até a tela.
- Escrever código **legível, testado e tipado** (TypeScript), seguindo padrões do time.
- Modelar um banco de dados relacional, escrever queries e evitar problemas de performance (N+1, índices).
- Construir APIs REST seguras (autenticação, autorização, validação, rate limit).
- Construir interfaces React acessíveis, responsivas e performáticas.
- Colocar uma aplicação em produção com Docker, CI/CD, variáveis de ambiente, logs e monitoramento.
- Investigar bugs em produção lendo logs, stack traces e usando o debugger.
- Fazer e receber code review, discutir trade-offs técnicos e ajudar devs júnior.

| Nível      | Característica principal                                                        |
| ---------- | ------------------------------------------------------------------------------- |
| Júnior     | Executa tarefas bem definidas, com ajuda frequente.                              |
| **Pleno**  | **Resolve problemas de ponta a ponta sozinho, conhece trade-offs, ajuda júniors.** |
| Sênior     | Define arquitetura, antecipa problemas, influencia o time e o produto.          |

> Você estará **apto a buscar vagas júnior ao fim da Fase 3** (módulo 12). As fases 4 e 5
> são o que transforma o júnior em pleno — continue estudando enquanto trabalha.

---

## Stack que você vai dominar

| Camada       | Tecnologias                                                     |
| ------------ | --------------------------------------------------------------- |
| Linguagem    | JavaScript (ES2015+), TypeScript                                |
| Frontend     | HTML5, CSS3, Tailwind CSS, React, React Router, TanStack Query, Zustand |
| Fullstack    | Next.js (App Router, Server Components, Server Actions)         |
| Backend      | Node.js, Express e Fastify, Zod                                 |
| Banco        | PostgreSQL, Prisma, Redis, noções de MongoDB                    |
| Testes       | Vitest, Testing Library, Supertest, Playwright                  |
| DevOps       | Git, GitHub Actions, Docker, Docker Compose, deploy em nuvem    |
| Arquitetura  | REST, SOLID, Clean Architecture, filas, cache, WebSockets       |

---

## Rotina de estudo recomendada

- **Todo dia:** pelo menos 1 commit no GitHub (mesmo que pequeno).
- **Toda semana:** 1 exercício de lógica em plataformas como Beecrowd, Exercism ou LeetCode (fácil).
- **Todo módulo:** escreva um resumo com suas palavras (técnica de Feynman — se não consegue
  explicar simples, ainda não entendeu).
- **Ao travar:** 1) leia a mensagem de erro inteira, 2) use `console.log`/debugger, 3) pesquise
  o erro, 4) consulte a documentação oficial, 5) só então peça ajuda — explicando o que já tentou.
- **Sobre IA:** use assistentes de IA como *tutor* (peça explicações, revisões e dicas), não como
  quem faz o exercício por você. Nos módulos 00–05, escreva todo o código sozinho.

## Referências principais (gratuitas)

- [MDN Web Docs](https://developer.mozilla.org/pt-BR/) — a referência oficial de HTML, CSS e JS
- [javascript.info](https://javascript.info/) — o melhor tutorial de JS moderno
- [react.dev](https://react.dev/) — documentação oficial do React
- [Node.js Docs](https://nodejs.org/docs/latest/api/) e [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [roadmap.sh](https://roadmap.sh/full-stack) — para conferir se nada ficou de fora
