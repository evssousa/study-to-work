import { describe, expect, test } from "vitest";
import { congelar, despesa as d, importarDoProjeto, rachaDeTeste } from "./carregar.js";

const { dividir, calcularSaldos, calcularAcerto, totalGasto, resumoTexto } = await importarDoProjeto("racha.js");

describe("src/racha.js — dividir", () => {
  test.each([
    [1000, 3, [334, 333, 333]],
    [100, 4, [25, 25, 25, 25]],
    [1, 3, [1, 0, 0]],
    [0, 2, [0, 0]],
    [1001, 2, [501, 500]],
    [5, 1, [5]],
  ])("dividir(%i, %i) → %j", (total, quantidade, esperado) => {
    expect(dividir(total, quantidade)).toEqual(esperado);
  });

  test("a soma das partes é sempre o total e a diferença entre partes é de no máximo 1 centavo", () => {
    for (const total of [1, 7, 99, 1000, 12345, 99999]) {
      for (const quantidade of [1, 2, 3, 4, 7, 10]) {
        const partes = dividir(total, quantidade);
        expect(partes.reduce((a, b) => a + b, 0)).toBe(total);
        expect(Math.max(...partes) - Math.min(...partes)).toBeLessThanOrEqual(1);
      }
    }
  });

  test("quantidade inválida e total inválido lançam erro", () => {
    expect(() => dividir(100, 0)).toThrow("Quantidade inválida");
    expect(() => dividir(100, 2.5)).toThrow("Quantidade inválida");
    expect(() => dividir(10.5, 2)).toThrow("Total inválido");
    expect(() => dividir(-1, 2)).toThrow("Total inválido");
  });
});

describe("src/racha.js — calcularSaldos (positivo = tem a receber)", () => {
  test("sem despesas todos ficam em zero", () => {
    expect(calcularSaldos(rachaDeTeste())).toEqual({ a: 0, b: 0, c: 0 });
  });

  test("uma despesa dividida entre todos", () => {
    const racha = congelar(rachaDeTeste([d("d1", 9000, "a", ["a", "b", "c"])]));
    expect(calcularSaldos(racha)).toEqual({ a: 6000, b: -3000, c: -3000 });
  });

  test("duas despesas, a segunda dividida só entre dois", () => {
    const racha = rachaDeTeste([d("d1", 9000, "a", ["a", "b", "c"]), d("d2", 3000, "b", ["b", "c"])]);
    expect(calcularSaldos(racha)).toEqual({ a: 6000, b: -1500, c: -4500 });
  });

  test("os centavos que sobram vão para os primeiros da lista da despesa", () => {
    const racha = rachaDeTeste([d("d1", 1000, "a", ["a", "b", "c"])]);
    expect(calcularSaldos(racha)).toEqual({ a: 666, b: -333, c: -333 });
  });

  test("quem paga pode não participar da divisão", () => {
    const racha = rachaDeTeste([d("d1", 3000, "a", ["b", "c"])]);
    expect(calcularSaldos(racha)).toEqual({ a: 3000, b: -1500, c: -1500 });
  });

  test("a soma dos saldos é sempre zero (ninguém ganha nem perde dinheiro do nada)", () => {
    const racha = rachaDeTeste([
      d("d1", 1001, "a", ["a", "b", "c"]),
      d("d2", 777, "c", ["a", "c"]),
      d("d3", 1, "b", ["a", "b", "c"]),
    ]);
    const soma = Object.values(calcularSaldos(racha)).reduce((a, b) => a + b, 0);
    expect(soma).toBe(0);
  });

  test("participante sem despesa aparece com zero", () => {
    const racha = rachaDeTeste([d("d1", 3000, "a", ["a", "b"])]);
    expect(calcularSaldos(racha).c).toBe(0);
  });

  test("não altera o racha recebido", () => {
    const racha = congelar(rachaDeTeste([d("d1", 9000, "a", ["a", "b", "c"])]));
    expect(() => calcularSaldos(racha)).not.toThrow();
  });
});

describe("src/racha.js — calcularAcerto", () => {
  test("tudo em zero → ninguém precisa pagar ninguém", () => {
    expect(calcularAcerto({ a: 0, b: 0, c: 0 })).toEqual([]);
  });

  test("dois devedores, um credor: o que deve mais paga primeiro", () => {
    expect(calcularAcerto({ a: 6000, b: -1500, c: -4500 })).toEqual([
      { deId: "c", paraId: "a", valorCentavos: 4500 },
      { deId: "b", paraId: "a", valorCentavos: 1500 },
    ]);
  });

  test("quatro pessoas: sempre o maior devedor com o maior credor (empates pelo id)", () => {
    expect(calcularAcerto({ a: 5000, b: 3000, c: -4000, d: -4000 })).toEqual([
      { deId: "c", paraId: "a", valorCentavos: 4000 },
      { deId: "d", paraId: "b", valorCentavos: 3000 },
      { deId: "d", paraId: "a", valorCentavos: 1000 },
    ]);
  });

  test("uma dívida simples entre duas pessoas", () => {
    expect(calcularAcerto({ x: 700, y: -700 })).toEqual([{ deId: "y", paraId: "x", valorCentavos: 700 }]);
  });

  test("quem está quite não aparece", () => {
    const acerto = calcularAcerto({ a: 100, b: 0, c: -100 });
    expect(acerto).toEqual([{ deId: "c", paraId: "a", valorCentavos: 100 }]);
  });

  test("saldos que não fecham em zero indicam um bug e lançam erro", () => {
    expect(() => calcularAcerto({ a: 100, b: -50 })).toThrow("Os saldos não fecham em zero");
  });

  test("propriedades valem para qualquer grupo (testado com 300 grupos aleatórios, sempre os mesmos)", () => {
    let semente = 12345;
    const aleatorio = (max) => {
      semente = (semente * 1103515245 + 12345) % 2147483648;
      return semente % max;
    };

    for (let rodada = 0; rodada < 300; rodada++) {
      const pessoas = 2 + aleatorio(9);
      const ids = Array.from({ length: pessoas }, (_, i) => `p${String.fromCharCode(97 + i)}`);
      const saldos = Object.fromEntries(ids.map((id) => [id, aleatorio(20000) - 10000]));
      const soma = Object.values(saldos).reduce((a, b) => a + b, 0);
      saldos[ids[0]] -= soma; // ajusta para fechar em zero

      const acerto = calcularAcerto(saldos);

      // 1. aplicar as transferências deixa todos quites
      const final = { ...saldos };
      for (const t of acerto) {
        final[t.deId] += t.valorCentavos;
        final[t.paraId] -= t.valorCentavos;
      }
      expect(Object.values(final).every((v) => v === 0)).toBe(true);

      // 2. valores inteiros e positivos, e ninguém paga a si mesmo
      for (const t of acerto) {
        expect(Number.isInteger(t.valorCentavos) && t.valorCentavos > 0).toBe(true);
        expect(t.deId).not.toBe(t.paraId);
      }

      // 3. no máximo (pessoas - 1) transferências
      expect(acerto.length).toBeLessThanOrEqual(pessoas - 1);

      // 4. só devedores pagam e só credores recebem
      for (const t of acerto) {
        expect(saldos[t.deId]).toBeLessThan(0);
        expect(saldos[t.paraId]).toBeGreaterThan(0);
      }
    }
  });
});

describe("src/racha.js — totalGasto e resumoTexto", () => {
  const racha = rachaDeTeste(
    [d("d1", 9000, "a", ["a", "b", "c"], "Carne"), d("d2", 3000, "b", ["b", "c"], "Bebidas")],
    "Churrasco",
  );

  test("totalGasto soma todas as despesas", () => {
    expect(totalGasto(racha)).toBe(12000);
    expect(totalGasto(rachaDeTeste())).toBe(0);
  });

  test("resumoTexto no formato para colar no WhatsApp", () => {
    expect(resumoTexto(racha)).toBe(
      [
        "*Churrasco*",
        "Total gasto: R$ 120,00",
        "",
        "Acerto de contas:",
        "• Carla paga R$ 45,00 para Ana",
        "• Bruno paga R$ 15,00 para Ana",
      ].join("\n"),
    );
  });

  test("resumoTexto sem dívidas", () => {
    expect(resumoTexto(rachaDeTeste([], "Viagem"))).toBe(
      ["*Viagem*", "Total gasto: R$ 0,00", "", "Acerto de contas:", "Tudo certo: ninguém deve nada."].join("\n"),
    );
  });
});
