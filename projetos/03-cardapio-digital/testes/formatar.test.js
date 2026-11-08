import { describe, expect, test } from "vitest";
import { carregar } from "./carregar.js";

const { formatarPreco, escaparHtml, slugificar, diaDaSemana } = await carregar("src/formatar.js");

describe("formatarPreco", () => {
  test("converte centavos para reais formatados", () => {
    expect(formatarPreco(4500)).toBe("R$ 45,00");
    expect(formatarPreco(900)).toBe("R$ 9,00");
    expect(formatarPreco(100)).toBe("R$ 1,00");
  });

  test("formata corretamente valores maiores", () => {
    expect(formatarPreco(1234567)).toBe("R$ 12.345,67");
    expect(formatarPreco(100000)).toBe("R$ 1.000,00");
  });

  test("formata centavos abaixo de 1 real", () => {
    expect(formatarPreco(50)).toBe("R$ 0,50");
    expect(formatarPreco(5)).toBe("R$ 0,05");
  });
});

describe("escaparHtml", () => {
  test("escapa & < > \" '", () => {
    expect(escaparHtml("A & B")).toContain("&amp;");
    expect(escaparHtml("<script>")).toContain("&lt;");
    expect(escaparHtml("<script>")).toContain("&gt;");
    expect(escaparHtml('"')).toContain("&quot;");
  });

  test("não altera texto normal", () => {
    expect(escaparHtml("Pizza Margherita")).toBe("Pizza Margherita");
  });
});

describe("slugificar", () => {
  test("converte para minúsculas sem acentos", () => {
    expect(slugificar("Pizzas Tradicionais")).toBe("pizzas-tradicionais");
    expect(slugificar("Bebidas")).toBe("bebidas");
  });

  test("remove caracteres especiais", () => {
    expect(slugificar("Café & Bar")).toMatch(/cafe.*bar/);
  });
});

describe("diaDaSemana", () => {
  test("retorna o nome do dia em português minúsculo", () => {
    // Monday = 1, Tuesday = 2, ...
    expect(diaDaSemana(new Date("2026-11-09"))).toBe("segunda"); // Monday
    expect(diaDaSemana(new Date("2026-11-10"))).toBe("terca");   // Tuesday
    expect(diaDaSemana(new Date("2026-11-14"))).toBe("sabado");  // Saturday
    expect(diaDaSemana(new Date("2026-11-15"))).toBe("domingo"); // Sunday
  });
});
