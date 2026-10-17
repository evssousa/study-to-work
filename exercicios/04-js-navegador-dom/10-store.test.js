import { describe, expect, test, vi } from "vitest";
import { criarStore } from "./10-store.js";

describe("criarStore", () => {
  test("obterEstado devolve o estado inicial", () => {
    const store = criarStore({ contagem: 0, nome: "Ana" });
    expect(store.obterEstado()).toEqual({ contagem: 0, nome: "Ana" });
  });

  test("atualizar com objeto mescla com o estado atual", () => {
    const store = criarStore({ contagem: 0, nome: "Ana" });
    const novo = store.atualizar({ contagem: 5 });
    expect(novo).toEqual({ contagem: 5, nome: "Ana" });
    expect(store.obterEstado()).toEqual({ contagem: 5, nome: "Ana" });
  });

  test("atualizar com função recebe o estado atual", () => {
    const store = criarStore({ contagem: 1 });
    store.atualizar((estado) => ({ contagem: estado.contagem + 1 }));
    store.atualizar((estado) => ({ contagem: estado.contagem + 1 }));
    expect(store.obterEstado().contagem).toBe(3);
  });

  test("é imutável: o estado antigo não muda e o objeto é outro", () => {
    const inicial = { contagem: 0 };
    const store = criarStore(inicial);
    const antes = store.obterEstado();
    store.atualizar({ contagem: 1 });
    expect(antes.contagem).toBe(0);
    expect(inicial.contagem).toBe(0);
    expect(store.obterEstado()).not.toBe(antes);
  });

  test("assinantes são avisados com o estado novo", () => {
    const store = criarStore({ valor: 1 });
    const ouvinte = vi.fn();
    store.assinar(ouvinte);
    expect(ouvinte).not.toHaveBeenCalled();
    store.atualizar({ valor: 2 });
    expect(ouvinte).toHaveBeenCalledTimes(1);
    expect(ouvinte).toHaveBeenCalledWith({ valor: 2 });
  });

  test("vários assinantes, avisados na ordem em que assinaram", () => {
    const store = criarStore({ valor: 1 });
    const chamadas = [];
    store.assinar(() => chamadas.push("primeiro"));
    store.assinar(() => chamadas.push("segundo"));
    store.atualizar({ valor: 2 });
    expect(chamadas).toEqual(["primeiro", "segundo"]);
  });

  test("assinar devolve uma função que cancela a assinatura", () => {
    const store = criarStore({ valor: 1 });
    const mantido = vi.fn();
    const cancelado = vi.fn();
    store.assinar(mantido);
    const cancelar = store.assinar(cancelado);
    store.atualizar({ valor: 2 });
    cancelar();
    store.atualizar({ valor: 3 });
    expect(cancelado).toHaveBeenCalledTimes(1);
    expect(mantido).toHaveBeenCalledTimes(2);
  });

  test("lojas diferentes são independentes", () => {
    const a = criarStore({ n: 1 });
    const b = criarStore({ n: 1 });
    const ouvinteB = vi.fn();
    b.assinar(ouvinteB);
    a.atualizar({ n: 2 });
    expect(ouvinteB).not.toHaveBeenCalled();
    expect(b.obterEstado().n).toBe(1);
  });
});
