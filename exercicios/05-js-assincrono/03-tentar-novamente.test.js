import { describe, expect, test, vi } from "vitest";
import { tentarNovamente } from "./03-tentar-novamente.js";

const semEspera = () => vi.fn(async () => {});

describe("tentarNovamente", () => {
  test("deu certo de primeira: devolve o resultado e não espera", async () => {
    const esperar = semEspera();
    const funcao = vi.fn(async () => "ok");
    await expect(tentarNovamente(funcao, { esperar })).resolves.toBe("ok");
    expect(funcao).toHaveBeenCalledTimes(1);
    expect(esperar).not.toHaveBeenCalled();
  });

  test("a função recebe o número da tentativa", async () => {
    const funcao = vi.fn(async (tentativa) => {
      if (tentativa < 3) throw new Error("ainda não");
      return `deu na ${tentativa}ª`;
    });
    await expect(tentarNovamente(funcao, { esperar: semEspera() })).resolves.toBe("deu na 3ª");
    expect(funcao.mock.calls.map((c) => c[0])).toEqual([1, 2, 3]);
  });

  test("esperas crescem: 100, 200, 400...", async () => {
    const esperar = semEspera();
    const funcao = vi.fn(async (tentativa) => {
      if (tentativa < 4) throw new Error("falha");
      return "afinal";
    });
    await tentarNovamente(funcao, { tentativas: 4, esperaInicialMs: 100, fator: 2, esperar });
    expect(esperar.mock.calls.map((c) => c[0])).toEqual([100, 200, 400]);
  });

  test("falhou em todas: lança o erro da ÚLTIMA tentativa e não espera depois dela", async () => {
    const esperar = semEspera();
    const funcao = vi.fn(async (tentativa) => {
      throw new Error(`erro ${tentativa}`);
    });
    await expect(tentarNovamente(funcao, { tentativas: 3, esperar })).rejects.toThrow("erro 3");
    expect(funcao).toHaveBeenCalledTimes(3);
    expect(esperar).toHaveBeenCalledTimes(2);
  });

  test("os valores padrão: 3 tentativas, espera inicial de 100 e fator 2", async () => {
    const esperar = semEspera();
    const funcao = vi.fn(async () => {
      throw new Error("sempre");
    });
    await expect(tentarNovamente(funcao, { esperar })).rejects.toThrow("sempre");
    expect(funcao).toHaveBeenCalledTimes(3);
    expect(esperar.mock.calls.map((c) => c[0])).toEqual([100, 200]);
  });

  test("fator personalizado", async () => {
    const esperar = semEspera();
    const funcao = vi.fn(async () => {
      throw new Error("x");
    });
    await expect(tentarNovamente(funcao, { tentativas: 4, esperaInicialMs: 10, fator: 3, esperar })).rejects.toThrow();
    expect(esperar.mock.calls.map((c) => c[0])).toEqual([10, 30, 90]);
  });

  test("tentarSe = false desiste na hora, sem esperar", async () => {
    const esperar = semEspera();
    const erro400 = Object.assign(new Error("requisição inválida"), { status: 400 });
    const funcao = vi.fn(async () => {
      throw erro400;
    });
    await expect(
      tentarNovamente(funcao, { tentativas: 5, esperar, tentarSe: (erro) => erro.status >= 500 }),
    ).rejects.toBe(erro400);
    expect(funcao).toHaveBeenCalledTimes(1);
    expect(esperar).not.toHaveBeenCalled();
  });

  test("tentarSe = true continua tentando", async () => {
    const funcao = vi.fn(async (tentativa) => {
      if (tentativa === 1) throw Object.assign(new Error("caiu"), { status: 503 });
      return "voltou";
    });
    const resultado = await tentarNovamente(funcao, { esperar: semEspera(), tentarSe: (erro) => erro.status >= 500 });
    expect(resultado).toBe("voltou");
  });

  test("com tentativas: 1 não repete", async () => {
    const funcao = vi.fn(async () => {
      throw new Error("uma só");
    });
    await expect(tentarNovamente(funcao, { tentativas: 1, esperar: semEspera() })).rejects.toThrow("uma só");
    expect(funcao).toHaveBeenCalledTimes(1);
  });

  test("sem passar `esperar`, usa uma pausa de verdade (curta)", async () => {
    const funcao = vi.fn(async (tentativa) => {
      if (tentativa === 1) throw new Error("falha");
      return "ok";
    });
    const inicio = Date.now();
    await expect(tentarNovamente(funcao, { esperaInicialMs: 30 })).resolves.toBe("ok");
    expect(Date.now() - inicio).toBeGreaterThanOrEqual(25);
  });
});
