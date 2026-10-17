import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { criarDom } from "../../suporte/dom.js";
import { criarCronometro, formatarTempo, iniciarRelogio } from "./13-tempo.js";

describe("formatarTempo", () => {
  test.each([
    [0, "00:00.00"],
    [10, "00:00.01"],
    [1230, "00:01.23"],
    [1239, "00:01.23"],
    [59990, "00:59.99"],
    [60000, "01:00.00"],
    [65230, "01:05.23"],
    [3600000, "60:00.00"],
  ])("%i ms → %s", (ms, esperado) => {
    expect(formatarTempo(ms)).toBe(esperado);
  });
});

describe("criarCronometro", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-15T12:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  test("começa parado em 0", () => {
    const cronometro = criarCronometro({ aoAtualizar: vi.fn() });
    expect(cronometro.tempo()).toBe(0);
    expect(cronometro.voltas()).toEqual([]);
  });

  test("conta o tempo e avisa a cada 10 ms", () => {
    const aoAtualizar = vi.fn();
    const cronometro = criarCronometro({ aoAtualizar });
    cronometro.iniciar();
    vi.advanceTimersByTime(100);
    expect(cronometro.tempo()).toBe(100);
    expect(aoAtualizar).toHaveBeenCalledTimes(10);
    expect(aoAtualizar).toHaveBeenLastCalledWith(100);
  });

  test("usa o relógio de verdade (Date.now), não a contagem de ticks", () => {
    const cronometro = criarCronometro({ aoAtualizar: vi.fn() });
    cronometro.iniciar();
    vi.setSystemTime(Date.now() + 5000); // o tempo "pulou" 5 s sem nenhum tick
    expect(cronometro.tempo()).toBe(5000);
  });

  test("pausar guarda o tempo e para de avisar", () => {
    const aoAtualizar = vi.fn();
    const cronometro = criarCronometro({ aoAtualizar });
    cronometro.iniciar();
    vi.advanceTimersByTime(300);
    cronometro.pausar();
    const chamadas = aoAtualizar.mock.calls.length;
    vi.advanceTimersByTime(1000);
    expect(cronometro.tempo()).toBe(300);
    expect(aoAtualizar.mock.calls.length).toBe(chamadas);
  });

  test("continua de onde parou", () => {
    const cronometro = criarCronometro({ aoAtualizar: vi.fn() });
    cronometro.iniciar();
    vi.advanceTimersByTime(300);
    cronometro.pausar();
    vi.advanceTimersByTime(5000);
    cronometro.iniciar();
    vi.advanceTimersByTime(200);
    expect(cronometro.tempo()).toBe(500);
  });

  test("iniciar duas vezes seguidas não cria dois contadores", () => {
    const aoAtualizar = vi.fn();
    const cronometro = criarCronometro({ aoAtualizar });
    cronometro.iniciar();
    cronometro.iniciar();
    vi.advanceTimersByTime(100);
    expect(aoAtualizar).toHaveBeenCalledTimes(10);
    expect(cronometro.tempo()).toBe(100);
  });

  test("zerar volta a 0, para e apaga as voltas", () => {
    const aoAtualizar = vi.fn();
    const cronometro = criarCronometro({ aoAtualizar });
    cronometro.iniciar();
    vi.advanceTimersByTime(500);
    cronometro.marcarVolta();
    cronometro.zerar();
    expect(aoAtualizar).toHaveBeenLastCalledWith(0);
    expect(cronometro.tempo()).toBe(0);
    expect(cronometro.voltas()).toEqual([]);
    vi.advanceTimersByTime(500);
    expect(cronometro.tempo()).toBe(0);
  });

  test("marcarVolta registra total e parcial", () => {
    const cronometro = criarCronometro({ aoAtualizar: vi.fn() });
    cronometro.iniciar();
    vi.advanceTimersByTime(1500);
    expect(cronometro.marcarVolta()).toEqual({ numero: 1, totalMs: 1500, parcialMs: 1500 });
    vi.advanceTimersByTime(2000);
    expect(cronometro.marcarVolta()).toEqual({ numero: 2, totalMs: 3500, parcialMs: 2000 });
    expect(cronometro.voltas()).toHaveLength(2);
  });

  test("voltas() devolve uma cópia", () => {
    const cronometro = criarCronometro({ aoAtualizar: vi.fn() });
    cronometro.iniciar();
    vi.advanceTimersByTime(100);
    cronometro.marcarVolta();
    cronometro.voltas().push("lixo");
    expect(cronometro.voltas()).toHaveLength(1);
  });
});

describe("iniciarRelogio", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const esperada = () => new Date().toLocaleTimeString("pt-BR");

  test("escreve a hora na hora", () => {
    vi.setSystemTime(new Date(2026, 9, 15, 14, 5, 9));
    const { document } = criarDom('<time id="hora"></time>');
    const elemento = document.querySelector("#hora");
    iniciarRelogio(elemento);
    expect(elemento.textContent).toBe("14:05:09");
  });

  test("atualiza a cada segundo", () => {
    vi.setSystemTime(new Date(2026, 9, 15, 14, 5, 9));
    const { document } = criarDom('<time id="hora"></time>');
    const elemento = document.querySelector("#hora");
    iniciarRelogio(elemento);
    vi.advanceTimersByTime(3000);
    expect(elemento.textContent).toBe(esperada());
    expect(elemento.textContent).toBe("14:05:12");
  });

  test("parar() interrompe as atualizações", () => {
    vi.setSystemTime(new Date(2026, 9, 15, 14, 5, 9));
    const { document } = criarDom('<time id="hora"></time>');
    const elemento = document.querySelector("#hora");
    const parar = iniciarRelogio(elemento);
    vi.advanceTimersByTime(1000);
    parar();
    vi.advanceTimersByTime(5000);
    expect(elemento.textContent).toBe("14:05:10");
  });
});
