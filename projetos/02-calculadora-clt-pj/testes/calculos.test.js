import { pathToFileURL } from "node:url";
import { describe, expect, test } from "vitest";
import { caminhoDoProjeto } from "../../../suporte/arquivos.js";
import { irrfSemReducao, tabelasDeTeste as tabelas } from "./tabelas-de-teste.js";

const {
  arredondar,
  calcularINSS,
  calcularIRRF,
  calcularSalarioLiquido,
  calcularPacoteAnualCLT,
  calcularPJEquivalente,
} = await import(pathToFileURL(caminhoDoProjeto("src", "calculos.js")).href);

describe("arredondar", () => {
  test("arredonda para 2 casas decimais", () => {
    expect(arredondar(1600.1875)).toBe(1600.19);
    expect(arredondar(407.1849)).toBe(407.18);
    expect(arredondar(10)).toBe(10);
  });
});

describe("calcularINSS (progressivo, faixa por faixa)", () => {
  test("salário dentro da 1ª faixa: só a 1ª alíquota", () => {
    expect(calcularINSS(1000, tabelas.inss)).toBe(75);
  });

  test("salário exatamente no limite da 1ª faixa", () => {
    expect(calcularINSS(1500, tabelas.inss)).toBe(112.5);
  });

  test("salário na 2ª faixa: 1500 × 7,5% + 500 × 9%", () => {
    expect(calcularINSS(2000, tabelas.inss)).toBe(157.5);
  });

  test("salário na 4ª faixa soma todas as faixas anteriores", () => {
    expect(calcularINSS(5000, tabelas.inss)).toBe(497.5);
  });

  test("acima do teto, a contribuição fica limitada ao teto", () => {
    expect(calcularINSS(10000, tabelas.inss)).toBe(917.5);
    expect(calcularINSS(50000, tabelas.inss)).toBe(917.5);
  });
});

describe("calcularIRRF", () => {
  test("base abaixo da faixa de isenção não paga imposto", () => {
    expect(calcularIRRF(2000, 157.5, 0, irrfSemReducao)).toBe(0);
  });

  test("usa o desconto simplificado quando ele é maior que INSS + dependentes", () => {
    // deduções = maior entre (300) e (600) = 600 → base 3400 → 3400 × 15% − 390
    expect(calcularIRRF(4000, 300, 0, irrfSemReducao)).toBe(120);
  });

  test("usa INSS + dependentes quando eles são maiores que o desconto simplificado", () => {
    // deduções = 300 + 2 × 190 = 680 → base 3320 → 3320 × 15% − 390
    expect(calcularIRRF(4000, 300, 2, irrfSemReducao)).toBe(108);
  });

  test("última faixa, resultado arredondado em centavos", () => {
    // base = 10000 − 917,5 = 9082,5 → 9082,5 × 27,5% − 897,5 = 1600,1875
    expect(calcularIRRF(10000, 917.5, 0, irrfSemReducao)).toBe(1600.19);
  });

  test("com redução: renda até o limite de isenção total não paga imposto", () => {
    expect(calcularIRRF(5000, 497.5, 0, tabelas.irrf)).toBe(0);
  });

  test("com redução: renda na faixa intermediária tem desconto parcial", () => {
    // imposto 577,1875 − redução (950 − 0,13 × 6000 = 170) = 407,1875
    expect(calcularIRRF(6000, 637.5, 0, tabelas.irrf)).toBe(407.19);
  });

  test("com redução: o imposto nunca fica negativo", () => {
    expect(calcularIRRF(5500, 567.5, 10, tabelas.irrf)).toBe(0);
  });

  test("com redução: renda acima do limite não tem redução", () => {
    expect(calcularIRRF(10000, 917.5, 0, tabelas.irrf)).toBe(1600.19);
  });
});

describe("calcularSalarioLiquido", () => {
  test("retorna o detalhamento completo", () => {
    expect(
      calcularSalarioLiquido({ salarioBruto: 6000, dependentes: 0, outrosDescontos: 0 }, tabelas),
    ).toEqual({ bruto: 6000, inss: 637.5, irrf: 407.19, outrosDescontos: 0, liquido: 4955.31 });
  });

  test("desconta outros descontos (plano de saúde, vale-transporte...)", () => {
    const resultado = calcularSalarioLiquido(
      { salarioBruto: 6000, dependentes: 0, outrosDescontos: 150.3 },
      tabelas,
    );
    expect(resultado.liquido).toBe(4805.01);
  });

  test("dependentes e outros descontos são opcionais (valem 0)", () => {
    const resultado = calcularSalarioLiquido({ salarioBruto: 6000 }, tabelas);
    expect(resultado.liquido).toBe(4955.31);
  });

  test("salário inválido lança erro", () => {
    expect(() => calcularSalarioLiquido({ salarioBruto: 0 }, tabelas)).toThrow("Salário bruto inválido");
    expect(() => calcularSalarioLiquido({ salarioBruto: -100 }, tabelas)).toThrow("Salário bruto inválido");
    expect(() => calcularSalarioLiquido({ salarioBruto: NaN }, tabelas)).toThrow("Salário bruto inválido");
  });

  test("número de dependentes negativo ou quebrado lança erro", () => {
    expect(() => calcularSalarioLiquido({ salarioBruto: 3000, dependentes: -1 }, tabelas)).toThrow(
      "Número de dependentes inválido",
    );
    expect(() => calcularSalarioLiquido({ salarioBruto: 3000, dependentes: 1.5 }, tabelas)).toThrow(
      "Número de dependentes inválido",
    );
  });
});

describe("calcularPacoteAnualCLT", () => {
  const pacote = () =>
    calcularPacoteAnualCLT({ salarioBruto: 6000, dependentes: 0, beneficiosMensais: 800 }, tabelas);

  test("12 salários líquidos", () => {
    expect(pacote().salarios).toBe(59463.72);
  });

  test("13º salário com a mesma proporção líquido/bruto do mês", () => {
    expect(pacote().decimoTerceiro).toBe(4955.31);
  });

  test("terço de férias (1/3 do bruto) com a mesma proporção líquido/bruto", () => {
    expect(pacote().tercoFerias).toBe(1651.77);
  });

  test("FGTS de 8% sobre 12 salários + 13º + terço de férias", () => {
    expect(pacote().fgts).toBe(6400);
  });

  test("benefícios (VR, VA, plano de saúde) de 12 meses", () => {
    expect(pacote().beneficios).toBe(9600);
  });

  test("total é a soma de tudo", () => {
    expect(pacote().total).toBe(82070.8);
  });

  test("benefícios são opcionais", () => {
    const semBeneficios = calcularPacoteAnualCLT({ salarioBruto: 6000 }, tabelas);
    expect(semBeneficios.beneficios).toBe(0);
    expect(semBeneficios.total).toBe(72470.8);
  });
});

describe("calcularPJEquivalente", () => {
  test("faturamento mensal para ganhar o mesmo que no CLT trabalhando 12 meses", () => {
    expect(
      calcularPJEquivalente(82070.8, { aliquotaImposto: 0.06, custoContadorMensal: 200, mesesFaturados: 12 }),
    ).toBe(7488.55);
  });

  test("faturando só 11 meses (tirando 1 mês de férias sem receber)", () => {
    expect(
      calcularPJEquivalente(82070.8, { aliquotaImposto: 0.06, custoContadorMensal: 200, mesesFaturados: 11 }),
    ).toBe(8149.98);
  });

  test("sem imposto e sem contador, é só dividir pelos meses", () => {
    expect(
      calcularPJEquivalente(60000, { aliquotaImposto: 0, custoContadorMensal: 0, mesesFaturados: 12 }),
    ).toBe(5000);
  });

  test("alíquota de 100% ou mais é impossível e lança erro", () => {
    expect(() =>
      calcularPJEquivalente(60000, { aliquotaImposto: 1, custoContadorMensal: 0, mesesFaturados: 12 }),
    ).toThrow("Alíquota de imposto inválida");
  });
});
