import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { comTimeout, emSequencia, esperar, promisificar } from "./02-promises.js";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("esperar", () => {
  test("resolve só depois do tempo", async () => {
    let resolvida = false;
    const promessa = esperar(100);
    expect(promessa).toBeInstanceOf(Promise);
    promessa.then(() => (resolvida = true));

    await vi.advanceTimersByTimeAsync(99);
    expect(resolvida).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(resolvida).toBe(true);
  });

  test("resolve sem valor", async () => {
    const promessa = esperar(10);
    await vi.advanceTimersByTimeAsync(10);
    await expect(promessa).resolves.toBeUndefined();
  });
});

describe("promisificar", () => {
  test("resolve com o resultado do callback", async () => {
    const somarComCallback = (a, b, callback) => callback(null, a + b);
    const somar = promisificar(somarComCallback);
    await expect(somar(2, 3)).resolves.toBe(5);
  });

  test("rejeita quando o callback recebe um erro", async () => {
    const quebrada = (_valor, callback) => callback(new Error("deu ruim"));
    await expect(promisificar(quebrada)("x")).rejects.toThrow("deu ruim");
  });

  test("funciona com callbacks chamados depois (assíncronos)", async () => {
    const lenta = (nome, callback) => setTimeout(() => callback(null, `Olá, ${nome}`), 50);
    const promessa = promisificar(lenta)("Ana");
    await vi.advanceTimersByTimeAsync(50);
    await expect(promessa).resolves.toBe("Olá, Ana");
  });

  test("repassa todos os argumentos, sem o callback", async () => {
    const espiao = vi.fn((a, b, c, callback) => callback(null, [a, b, c]));
    await expect(promisificar(espiao)(1, 2, 3)).resolves.toEqual([1, 2, 3]);
    expect(espiao.mock.calls[0]).toHaveLength(4);
  });

  test("uma função sem argumentos também funciona", async () => {
    await expect(promisificar((callback) => callback(null, "ok"))()).resolves.toBe("ok");
  });
});

describe("comTimeout", () => {
  test("resolve com o valor quando a promise é mais rápida", async () => {
    const rapida = esperar(50).then(() => "pronto");
    const resultado = comTimeout(rapida, 100);
    await vi.advanceTimersByTimeAsync(50);
    await expect(resultado).resolves.toBe("pronto");
  });

  test("rejeita com 'Tempo esgotado' quando demora demais", async () => {
    const lenta = esperar(500).then(() => "tarde");
    const resultado = comTimeout(lenta, 100);
    const verificacao = expect(resultado).rejects.toThrow("Tempo esgotado");
    await vi.advanceTimersByTimeAsync(100);
    await verificacao;
  });

  test("repassa o erro da própria promise", async () => {
    const resultado = comTimeout(Promise.reject(new Error("falhou antes")), 100);
    await expect(resultado).rejects.toThrow("falhou antes");
  });

  test("limpa o timer quando a promise termina antes (não deixa nada pendurado)", async () => {
    await expect(comTimeout(Promise.resolve("ok"), 10_000)).resolves.toBe("ok");
    expect(vi.getTimerCount()).toBe(0);
    await expect(comTimeout(Promise.reject(new Error("x")), 10_000)).rejects.toThrow("x");
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("emSequencia", () => {
  test("executa uma de cada vez e devolve os resultados na ordem", async () => {
    const eventos = [];
    const tarefa = (nome, ms) => async () => {
      eventos.push(`início ${nome}`);
      await esperar(ms);
      eventos.push(`fim ${nome}`);
      return nome.toUpperCase();
    };

    const resultado = emSequencia([tarefa("a", 30), tarefa("b", 10), tarefa("c", 20)]);
    await vi.advanceTimersByTimeAsync(60);
    await expect(resultado).resolves.toEqual(["A", "B", "C"]);
    expect(eventos).toEqual(["início a", "fim a", "início b", "fim b", "início c", "fim c"]);
  });

  test("lista vazia → lista vazia", async () => {
    await expect(emSequencia([])).resolves.toEqual([]);
  });

  test("se uma falha, as próximas não executam e o erro sobe", async () => {
    const terceira = vi.fn();
    const promessa = emSequencia([async () => 1, async () => { throw new Error("parou"); }, terceira]);
    await expect(promessa).rejects.toThrow("parou");
    expect(terceira).not.toHaveBeenCalled();
  });
});
