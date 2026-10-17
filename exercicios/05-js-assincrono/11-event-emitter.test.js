import { describe, expect, test, vi } from "vitest";
import * as modulo from "./11-event-emitter.js";

const { EventEmitter } = modulo;
const novo = () => {
  expect(typeof EventEmitter, "Exporte a classe EventEmitter").toBe("function");
  return new EventEmitter();
};

describe("EventEmitter", () => {
  test("on + emit chamam o ouvinte com os argumentos", () => {
    const emissor = novo();
    const ouvinte = vi.fn();
    emissor.on("compra", ouvinte);
    emissor.emit("compra", "café", 3);
    expect(ouvinte).toHaveBeenCalledWith("café", 3);
    expect(ouvinte).toHaveBeenCalledTimes(1);
  });

  test("ouvintes rodam na ordem em que foram registrados", () => {
    const emissor = novo();
    const ordem = [];
    emissor.on("x", () => ordem.push("a"));
    emissor.on("x", () => ordem.push("b"));
    emissor.on("x", () => ordem.push("c"));
    emissor.emit("x");
    expect(ordem).toEqual(["a", "b", "c"]);
  });

  test("eventos diferentes não se misturam", () => {
    const emissor = novo();
    const a = vi.fn();
    const b = vi.fn();
    emissor.on("a", a);
    emissor.on("b", b);
    emissor.emit("a");
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).not.toHaveBeenCalled();
  });

  test("emit informa se havia ouvintes", () => {
    const emissor = novo();
    expect(emissor.emit("ninguem")).toBe(false);
    emissor.on("alguem", () => {});
    expect(emissor.emit("alguem")).toBe(true);
  });

  test("on retorna a função que cancela", () => {
    const emissor = novo();
    const ouvinte = vi.fn();
    const cancelar = emissor.on("x", ouvinte);
    emissor.emit("x");
    cancelar();
    emissor.emit("x");
    expect(ouvinte).toHaveBeenCalledTimes(1);
  });

  test("off remove o ouvinte e encadeia", () => {
    const emissor = novo();
    const ouvinte = vi.fn();
    emissor.on("x", ouvinte);
    expect(emissor.off("x", ouvinte)).toBe(emissor);
    emissor.emit("x");
    expect(ouvinte).not.toHaveBeenCalled();
    expect(() => emissor.off("x", ouvinte)).not.toThrow();
    expect(() => emissor.off("evento-que-nao-existe", ouvinte)).not.toThrow();
  });

  test("off remove só UM registro por vez", () => {
    const emissor = novo();
    const ouvinte = vi.fn();
    emissor.on("x", ouvinte);
    emissor.on("x", ouvinte);
    emissor.off("x", ouvinte);
    emissor.emit("x");
    expect(ouvinte).toHaveBeenCalledTimes(1);
  });

  test("once roda uma vez só", () => {
    const emissor = novo();
    const ouvinte = vi.fn();
    emissor.once("x", ouvinte);
    emissor.emit("x", 1);
    emissor.emit("x", 2);
    expect(ouvinte).toHaveBeenCalledTimes(1);
    expect(ouvinte).toHaveBeenCalledWith(1);
    expect(emissor.listenerCount("x")).toBe(0);
  });

  test("once pode ser cancelado antes de rodar, pela função ou pelo off", () => {
    const emissor = novo();
    const a = vi.fn();
    const b = vi.fn();
    const cancelarA = emissor.once("x", a);
    emissor.once("x", b);
    cancelarA();
    emissor.off("x", b);
    emissor.emit("x");
    expect(a).not.toHaveBeenCalled();
    expect(b).not.toHaveBeenCalled();
  });

  test("listenerCount", () => {
    const emissor = novo();
    expect(emissor.listenerCount("x")).toBe(0);
    const ouvinte = () => {};
    emissor.on("x", ouvinte);
    emissor.once("x", () => {});
    expect(emissor.listenerCount("x")).toBe(2);
    emissor.off("x", ouvinte);
    expect(emissor.listenerCount("x")).toBe(1);
  });

  test("um ouvinte que se remove durante o emit não pula o seguinte", () => {
    const emissor = novo();
    const chamados = [];
    const primeiro = () => {
      chamados.push("primeiro");
      emissor.off("x", primeiro);
    };
    emissor.on("x", primeiro);
    emissor.on("x", () => chamados.push("segundo"));
    emissor.on("x", () => chamados.push("terceiro"));
    emissor.emit("x");
    expect(chamados).toEqual(["primeiro", "segundo", "terceiro"]);
    emissor.emit("x");
    expect(chamados.slice(3)).toEqual(["segundo", "terceiro"]);
  });

  test("um ouvinte adicionado durante o emit só roda na próxima rodada", () => {
    const emissor = novo();
    const novoOuvinte = vi.fn();
    emissor.once("x", () => emissor.on("x", novoOuvinte));
    emissor.emit("x");
    expect(novoOuvinte).not.toHaveBeenCalled();
    emissor.emit("x");
    expect(novoOuvinte).toHaveBeenCalledTimes(1);
  });

  test("duas instâncias são independentes", () => {
    const a = novo();
    const b = novo();
    const ouvinte = vi.fn();
    a.on("x", ouvinte);
    b.emit("x");
    expect(ouvinte).not.toHaveBeenCalled();
  });
});
