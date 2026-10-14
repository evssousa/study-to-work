# Módulo 09 — Testes automatizados

**Duração:** 2–3 semanas · **Pré-requisito:** Módulo 08

## Objetivos

- Entender por que e o que testar.
- Escrever testes unitários, de componentes e de ponta a ponta (E2E).
- Simular APIs com mocks.
- Praticar TDD.

---

## 1. Por que testar?

Testes dão **confiança para mudar o código**. Em empresas, PR sem teste costuma ser recusado.

### A pirâmide (ou "troféu") de testes

```
        ▲  E2E (Playwright)          — poucos, lentos, testam o fluxo real no navegador
       ▲▲▲ Integração / componentes  — a maioria no frontend
     ▲▲▲▲▲ Unitários (Vitest)        — muitos, rápidos, testam funções isoladas
```

**Teste comportamento, não implementação**: o que o usuário vê e faz, ou o que a função
retorna — não detalhes internos.

## 2. Testes unitários com Vitest

```bash
npm install -D vitest
```

```ts
// src/lib/carrinho.ts
export function calcularTotal(itens: { preco: number; qtd: number }[], cupom?: number) {
  const subtotal = itens.reduce((t, i) => t + i.preco * i.qtd, 0);
  if (cupom && (cupom < 0 || cupom > 100)) throw new Error("Cupom inválido");
  return cupom ? subtotal * (1 - cupom / 100) : subtotal;
}
```

```ts
// src/lib/carrinho.test.ts
import { describe, it, expect } from "vitest";
import { calcularTotal } from "./carrinho";

describe("calcularTotal", () => {
  it("retorna 0 para carrinho vazio", () => {
    expect(calcularTotal([])).toBe(0);
  });

  it("soma preço × quantidade", () => {
    expect(calcularTotal([{ preco: 10, qtd: 2 }, { preco: 5, qtd: 1 }])).toBe(25);
  });

  it("aplica cupom percentual", () => {
    expect(calcularTotal([{ preco: 100, qtd: 1 }], 10)).toBe(90);
  });

  it("rejeita cupom acima de 100%", () => {
    expect(() => calcularTotal([{ preco: 100, qtd: 1 }], 150)).toThrow("Cupom inválido");
  });
});
```

Estrutura **AAA**: *Arrange* (prepara), *Act* (executa), *Assert* (verifica).
Matchers comuns: `toBe`, `toEqual`, `toContain`, `toHaveLength`, `toThrow`, `toBeTruthy`,
`toHaveBeenCalledWith`, `resolves`/`rejects`.

## 3. Mocks, spies e timers

```ts
import { vi } from "vitest";

const enviarEmail = vi.fn();
await cadastrarUsuario({ email: "a@b.com" }, { enviarEmail });
expect(enviarEmail).toHaveBeenCalledWith("a@b.com", expect.any(String));

vi.useFakeTimers();
debounced();
vi.advanceTimersByTime(300);
expect(fn).toHaveBeenCalledOnce();
```

Dica de design: **receber dependências por parâmetro** (injeção de dependência) torna o código
muito mais fácil de testar.

## 4. Testando componentes com Testing Library

```bash
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("adiciona uma tarefa", async () => {
  const user = userEvent.setup();
  render(<ListaTarefas />);

  await user.type(screen.getByLabelText(/nova tarefa/i), "Estudar testes");
  await user.click(screen.getByRole("button", { name: /adicionar/i }));

  expect(screen.getByText("Estudar testes")).toBeInTheDocument();
  expect(screen.getByText(/1 pendente/i)).toBeInTheDocument();
});
```

Prioridade de seletores: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`.
Se é difícil selecionar por *role*, provavelmente o componente tem problema de acessibilidade.

## 5. Simulando APIs com MSW

O **Mock Service Worker** intercepta requisições de rede — o componente funciona como na vida
real, sem depender do backend.

```ts
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.get("/api/produtos", () => HttpResponse.json([{ id: 1, nome: "Teclado", preco: 250 }])),
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("mostra erro quando a API falha", async () => {
  server.use(http.get("/api/produtos", () => new HttpResponse(null, { status: 500 })));
  renderComProviders(<ListaProdutos />);
  expect(await screen.findByRole("alert")).toHaveTextContent(/erro/i);
});
```

## 6. Testes E2E com Playwright

```bash
npm init playwright@latest
```

```ts
import { test, expect } from "@playwright/test";

test("usuário compra um produto", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Buscar").fill("teclado");
  await page.getByRole("link", { name: /teclado mecânico/i }).click();
  await page.getByRole("button", { name: /adicionar ao carrinho/i }).click();
  await page.getByRole("link", { name: /carrinho/i }).click();
  await expect(page.getByText(/total/i)).toContainText("R$");
});
```

Use `npx playwright codegen` para gravar testes e `--ui` para depurar.

## 7. TDD — Test Driven Development

Ciclo **Red → Green → Refactor**:
1. Escreva um teste que falha.
2. Escreva o mínimo de código para passar.
3. Melhore o código mantendo os testes verdes.

## 8. Cobertura

```bash
npx vitest run --coverage
```

Cobertura alta não garante qualidade. Foque em **regras de negócio** e **fluxos críticos**
(login, pagamento, cálculo de preço).

---

## Exercícios

1. Escreva testes para todas as funções utilitárias que você criou nos módulos 03–05.
2. Implemente com TDD: `validarCPF`, `formatarMoeda`, `calcularFrete(peso, distancia)`.
3. Teste o hook `useDebounce` com fake timers (`renderHook`).
4. Teste o formulário de cadastro: erros de validação aparecem e o envio chama a API certa.
5. Escreva 3 testes E2E para o fluxo principal do seu projeto.

## Projeto do módulo

**Suíte de testes do e-commerce** (módulo 08):
- Unitários para carrinho, cupom e frete (100% das regras de negócio).
- Componentes: busca, filtros, carrinho, formulário de checkout (com MSW).
- E2E: busca → produto → carrinho → checkout; login e rota protegida.
- Script `npm test` e cobertura no README.

## Checklist para avançar

- [ ] Escrevo testes unitários com Vitest e uso mocks quando necessário.
- [ ] Testo componentes pelo comportamento, com seletores acessíveis.
- [ ] Simulo APIs com MSW.
- [ ] Escrevo testes E2E com Playwright.
- [ ] Já resolvi problemas usando TDD.
