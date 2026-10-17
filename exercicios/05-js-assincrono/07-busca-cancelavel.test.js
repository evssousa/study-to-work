import { describe, expect, test, vi } from "vitest";
import { criarBuscaCancelavel } from "./07-busca-cancelavel.js";

// Uma promise que o teste resolve ou rejeita quando quiser.
function adiada() {
  const controle = {};
  controle.promise = new Promise((resolver, rejeitar) => {
    controle.resolver = resolver;
    controle.rejeitar = rejeitar;
  });
  return controle;
}

describe("criarBuscaCancelavel", () => {
  test("uma busca simples devolve os dados", async () => {
    const pesquisar = criarBuscaCancelavel(async (termo) => [`resultado de ${termo}`]);
    await expect(pesquisar("java")).resolves.toEqual({ cancelada: false, dados: ["resultado de java"] });
  });

  test("a função de busca recebe o termo e um AbortSignal", async () => {
    const buscar = vi.fn(async () => []);
    await criarBuscaCancelavel(buscar)("css");
    const [termo, opcoes] = buscar.mock.calls[0];
    expect(termo).toBe("css");
    expect(opcoes.signal).toBeInstanceOf(AbortSignal);
    expect(opcoes.signal.aborted).toBe(false);
  });

  test("uma busca nova aborta a anterior", async () => {
    const pendentes = [];
    const buscar = vi.fn((termo, { signal }) => {
      const espera = adiada();
      pendentes.push({ termo, signal, espera });
      return espera.promise;
    });
    const pesquisar = criarBuscaCancelavel(buscar);

    const primeira = pesquisar("ja");
    expect(pendentes[0].signal.aborted).toBe(false);
    const segunda = pesquisar("java");
    expect(pendentes[0].signal.aborted).toBe(true);
    expect(pendentes[1].signal.aborted).toBe(false);

    pendentes[1].espera.resolver(["Java"]);
    pendentes[0].espera.resolver(["Já"]);
    await expect(segunda).resolves.toEqual({ cancelada: false, dados: ["Java"] });
    await expect(primeira).resolves.toEqual({ cancelada: true });
  });

  test("a resposta LENTA e ANTIGA chegando por último é ignorada (a condição de corrida)", async () => {
    const respostas = {};
    const pesquisar = criarBuscaCancelavel((termo) => {
      respostas[termo] = adiada();
      return respostas[termo].promise; // ignora o signal de propósito
    });

    const antiga = pesquisar("ja");
    const nova = pesquisar("java");
    respostas.java.resolver(["Java"]); // a nova chega primeiro
    await expect(nova).resolves.toEqual({ cancelada: false, dados: ["Java"] });
    respostas.ja.resolver(["Já"]); // a antiga chega depois
    await expect(antiga).resolves.toEqual({ cancelada: true });
  });

  test("buscar que lança AbortError vira cancelada", async () => {
    const pesquisar = criarBuscaCancelavel(async () => {
      throw new DOMException("cancelada", "AbortError");
    });
    await expect(pesquisar("x")).resolves.toEqual({ cancelada: true });
  });

  test("outros erros sobem quando a busca ainda é a mais recente", async () => {
    const pesquisar = criarBuscaCancelavel(async () => {
      throw new Error("servidor caiu");
    });
    await expect(pesquisar("x")).rejects.toThrow("servidor caiu");
  });

  test("erro de uma busca antiga não interessa mais", async () => {
    const respostas = [];
    const pesquisar = criarBuscaCancelavel(() => {
      const espera = adiada();
      respostas.push(espera);
      return espera.promise;
    });
    const antiga = pesquisar("a");
    const nova = pesquisar("ab");
    respostas[0].rejeitar(new Error("falhou, mas já não importa"));
    respostas[1].resolver("ok");
    await expect(antiga).resolves.toEqual({ cancelada: true });
    await expect(nova).resolves.toEqual({ cancelada: false, dados: "ok" });
  });

  test("depois que uma busca termina, a próxima começa do zero", async () => {
    const pesquisar = criarBuscaCancelavel(async (termo) => termo.toUpperCase());
    await expect(pesquisar("a")).resolves.toEqual({ cancelada: false, dados: "A" });
    await expect(pesquisar("b")).resolves.toEqual({ cancelada: false, dados: "B" });
  });
});
