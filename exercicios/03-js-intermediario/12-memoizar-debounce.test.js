import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { debounce, memoizar } from "./12-memoizar-debounce.js";

describe("memoizar", () => {
  test("retorna o mesmo resultado da função original", () => {
    const dobro = memoizar((n) => n * 2);
    expect(dobro(4)).toBe(8);
    expect(dobro(10)).toBe(20);
  });

  test("não executa de novo para o mesmo argumento", () => {
    const original = vi.fn((n) => n * n);
    const rapida = memoizar(original);
    rapida(9);
    rapida(9);
    rapida(9);
    expect(original).toHaveBeenCalledTimes(1);
  });

  test("executa de novo para argumentos diferentes", () => {
    const original = vi.fn((n) => n + 1);
    const rapida = memoizar(original);
    rapida(1);
    rapida(2);
    rapida(1);
    expect(original).toHaveBeenCalledTimes(2);
  });

  test("guarda até resultados 'falsos' como 0 e undefined", () => {
    const original = vi.fn(() => 0);
    const rapida = memoizar(original);
    rapida("x");
    rapida("x");
    expect(original).toHaveBeenCalledTimes(1);
  });
});

describe("debounce", () => {
  beforeEach(() => vi.useFakeTimers()); // relógio falso: o teste controla o tempo
  afterEach(() => vi.useRealTimers());

  test("não executa imediatamente", () => {
    const funcao = vi.fn();
    debounce(funcao, 300)();
    expect(funcao).not.toHaveBeenCalled();
  });

  test("executa depois do tempo de espera", () => {
    const funcao = vi.fn();
    debounce(funcao, 300)();
    vi.advanceTimersByTime(300);
    expect(funcao).toHaveBeenCalledTimes(1);
  });

  test("chamadas seguidas executam UMA vez, com os argumentos da última", () => {
    const buscar = vi.fn();
    const buscarComDebounce = debounce(buscar, 300);
    buscarComDebounce("j");
    vi.advanceTimersByTime(100);
    buscarComDebounce("ja");
    vi.advanceTimersByTime(100);
    buscarComDebounce("java");
    vi.advanceTimersByTime(299);
    expect(buscar).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(buscar).toHaveBeenCalledTimes(1);
    expect(buscar).toHaveBeenCalledWith("java");
  });

  test("depois de executar, uma nova chamada agenda outra execução", () => {
    const funcao = vi.fn();
    const comDebounce = debounce(funcao, 200);
    comDebounce(1);
    vi.advanceTimersByTime(200);
    comDebounce(2);
    vi.advanceTimersByTime(200);
    expect(funcao).toHaveBeenCalledTimes(2);
  });
});
