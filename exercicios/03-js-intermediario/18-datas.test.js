import { describe, expect, test } from "vitest";
import { adicionarDias, calcularIdade, diaDaSemana, diasEntre, ehDiaUtil, formatarDataBR } from "./18-datas.js";

describe("datas", () => {
  test("formatarDataBR", () => {
    expect(formatarDataBR("2026-10-15")).toBe("15/10/2026");
    expect(formatarDataBR("2027-01-05")).toBe("05/01/2027");
  });

  test("diasEntre", () => {
    expect(diasEntre("2026-10-01", "2026-10-15")).toBe(14);
    expect(diasEntre("2026-12-25", "2027-01-01")).toBe(7);
    expect(diasEntre("2026-10-15", "2026-10-01")).toBe(-14);
    expect(diasEntre("2026-10-15", "2026-10-15")).toBe(0);
  });

  test("diasEntre atravessa a mudança de horário sem erro", () => {
    expect(diasEntre("2026-01-01", "2027-01-01")).toBe(365);
    expect(diasEntre("2028-01-01", "2029-01-01")).toBe(366);
  });

  test("adicionarDias vira mês e ano", () => {
    expect(adicionarDias("2026-12-30", 3)).toBe("2027-01-02");
    expect(adicionarDias("2026-03-01", -1)).toBe("2026-02-28");
    expect(adicionarDias("2028-02-28", 1)).toBe("2028-02-29");
  });

  test("diaDaSemana", () => {
    expect(diaDaSemana("2026-10-15")).toBe("quinta-feira");
    expect(diaDaSemana("2026-10-18")).toBe("domingo");
  });

  test("ehDiaUtil", () => {
    expect(ehDiaUtil("2026-10-15")).toBe(true);
    expect(ehDiaUtil("2026-10-17")).toBe(false);
    expect(ehDiaUtil("2026-10-18")).toBe(false);
    expect(ehDiaUtil("2026-10-19")).toBe(true);
  });

  test("calcularIdade", () => {
    expect(calcularIdade("2000-10-16", "2026-10-15")).toBe(25);
    expect(calcularIdade("2000-10-15", "2026-10-15")).toBe(26);
    expect(calcularIdade("2000-12-31", "2026-01-01")).toBe(25);
  });
});
