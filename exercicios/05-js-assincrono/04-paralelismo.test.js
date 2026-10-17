import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { emLotes, fonteMaisRapida, separarResultados, somarEmParalelo } from "./04-paralelismo.js";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const depois = (ms, valor) => new Promise((resolve) => setTimeout(() => resolve(valor), ms));
const falhaDepois = (ms, mensagem) => new Promise((_, rejeitar) => setTimeout(() => rejeitar(new Error(mensagem)), ms));

describe("somarEmParalelo", () => {
  test("soma os resultados", async () => {
    const resultado = somarEmParalelo([() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)]);
    await expect(resultado).resolves.toBe(6);
  });

  test("roda em paralelo: 3 buscas de 100 ms levam ~100 ms, não 300", async () => {
    const inicio = Date.now();
    const promessa = somarEmParalelo([() => depois(100, 10), () => depois(100, 20), () => depois(100, 30)]);
    await vi.advanceTimersByTimeAsync(100);
    await expect(promessa).resolves.toBe(60);
    expect(Date.now() - inicio).toBe(100);
  });

  test("uma falha derruba tudo", async () => {
    const promessa = somarEmParalelo([() => Promise.resolve(1), () => Promise.reject(new Error("uma caiu"))]);
    await expect(promessa).rejects.toThrow("uma caiu");
  });

  test("lista vazia soma 0", async () => {
    await expect(somarEmParalelo([])).resolves.toBe(0);
  });
});

describe("separarResultados", () => {
  test("separa os que deram certo dos que falharam, mantendo a ordem", async () => {
    const resultado = await separarResultados([
      () => Promise.resolve("a"),
      () => Promise.reject(new Error("erro 1")),
      () => Promise.resolve("b"),
      () => Promise.reject(new Error("erro 2")),
    ]);
    expect(resultado).toEqual({ valores: ["a", "b"], erros: ["erro 1", "erro 2"] });
  });

  test("espera todas, inclusive as lentas", async () => {
    const promessa = separarResultados([() => depois(10, "rápida"), () => depois(500, "lenta"), () => falhaDepois(200, "média")]);
    await vi.advanceTimersByTimeAsync(500);
    await expect(promessa).resolves.toEqual({ valores: ["rápida", "lenta"], erros: ["média"] });
  });

  test("tudo certo ou tudo errado", async () => {
    await expect(separarResultados([() => Promise.resolve(1)])).resolves.toEqual({ valores: [1], erros: [] });
    await expect(separarResultados([() => Promise.reject(new Error("x"))])).resolves.toEqual({ valores: [], erros: ["x"] });
  });
});

describe("fonteMaisRapida", () => {
  test("devolve a primeira que der certo", async () => {
    const promessa = fonteMaisRapida([() => depois(300, "lenta"), () => depois(50, "rápida"), () => depois(100, "média")]);
    await vi.advanceTimersByTimeAsync(50);
    await expect(promessa).resolves.toBe("rápida");
  });

  test("ignora as que falham antes", async () => {
    const promessa = fonteMaisRapida([() => falhaDepois(10, "caiu"), () => depois(100, "a segunda serve")]);
    await vi.advanceTimersByTimeAsync(100);
    await expect(promessa).resolves.toBe("a segunda serve");
  });

  test("se todas falharem, lança a mensagem combinada", async () => {
    const promessa = fonteMaisRapida([() => Promise.reject(new Error("a")), () => Promise.reject(new Error("b"))]);
    await expect(promessa).rejects.toThrow("Todas as fontes falharam");
  });
});

describe("emLotes", () => {
  test("devolve os resultados na ordem dos itens", async () => {
    const promessa = emLotes([1, 2, 3, 4, 5], 2, async (n) => {
      await depois(n % 2 === 0 ? 5 : 20, null);
      return n * 10;
    });
    await vi.advanceTimersByTimeAsync(200);
    await expect(promessa).resolves.toEqual([10, 20, 30, 40, 50]);
  });

  test("nunca passa de `tamanho` ao mesmo tempo, mas usa o paralelismo", async () => {
    let ativos = 0;
    let maximo = 0;
    const promessa = emLotes([1, 2, 3, 4, 5, 6, 7], 3, async (n) => {
      ativos++;
      maximo = Math.max(maximo, ativos);
      await depois(100, null);
      ativos--;
      return n;
    });
    await vi.advanceTimersByTimeAsync(1000);
    await promessa;
    expect(maximo).toBe(3);
  });

  test("lotes em sequência: 7 itens em lotes de 3 levam 3 rodadas de 100 ms", async () => {
    const inicio = Date.now();
    const promessa = emLotes([1, 2, 3, 4, 5, 6, 7], 3, () => depois(100, null));
    await vi.advanceTimersByTimeAsync(300);
    await promessa;
    expect(Date.now() - inicio).toBe(300);
  });

  test("lista vazia e tamanho maior que a lista", async () => {
    await expect(emLotes([], 3, async (n) => n)).resolves.toEqual([]);
    await expect(emLotes([1, 2], 10, async (n) => n + 1)).resolves.toEqual([2, 3]);
  });
});
