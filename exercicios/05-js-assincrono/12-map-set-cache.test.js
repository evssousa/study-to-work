import { describe, expect, test } from "vitest";
import * as modulo from "./12-map-set-cache.js";

const { contarFrequencia, semDuplicados, interseccao, diferenca, agruparPor, CacheComTTL } = modulo;

describe("Map e Set", () => {
  test("contarFrequencia devolve um Map na ordem da primeira aparição", () => {
    const frequencia = contarFrequencia(["b", "a", "b", "c", "a", "b"]);
    expect(frequencia).toBeInstanceOf(Map);
    expect([...frequencia]).toEqual([["b", 3], ["a", 2], ["c", 1]]);
  });

  test("contarFrequencia aceita chaves de qualquer tipo (1 e '1' são diferentes)", () => {
    const frequencia = contarFrequencia([1, "1", 1, true]);
    expect(frequencia.get(1)).toBe(2);
    expect(frequencia.get("1")).toBe(1);
    expect(frequencia.get(true)).toBe(1);
  });

  test("semDuplicados", () => {
    expect(semDuplicados([3, 1, 3, 2, 1])).toEqual([3, 1, 2]);
    expect(semDuplicados([])).toEqual([]);
  });

  test("interseccao e diferenca", () => {
    expect(interseccao([1, 2, 3, 4, 2], [2, 4, 6])).toEqual([2, 4]);
    expect(diferenca([1, 2, 3, 4, 2], [2, 4, 6])).toEqual([1, 3]);
    expect(interseccao([], [1])).toEqual([]);
    expect(diferenca([1, 2], [])).toEqual([1, 2]);
  });

  test("agruparPor devolve um Map de arrays, na ordem de aparição", () => {
    const palavras = ["maçã", "uva", "banana", "pera", "kiwi", "caju"];
    const grupos = agruparPor(palavras, (p) => p.length);
    expect(grupos).toBeInstanceOf(Map);
    expect([...grupos]).toEqual([
      [4, ["maçã", "pera", "kiwi", "caju"]],
      [3, ["uva"]],
      [6, ["banana"]],
    ]);
  });
});

describe("CacheComTTL", () => {
  const relogio = (inicio = 1000) => {
    const estado = { agora: inicio };
    return { agora: () => estado.agora, avancar: (ms) => (estado.agora += ms) };
  };

  test("guarda e lê valores", () => {
    expect(typeof CacheComTTL, "Exporte a classe CacheComTTL").toBe("function");
    const cache = new CacheComTTL({ ttlMs: 1000 });
    expect(cache.set("a", 1)).toBe(cache);
    expect(cache.get("a")).toBe(1);
    expect(cache.get("inexistente")).toBeUndefined();
    expect(cache.has("a")).toBe(true);
    expect(cache.has("b")).toBe(false);
  });

  test("o valor vence depois do TTL (e some de verdade)", () => {
    const r = relogio();
    const cache = new CacheComTTL({ ttlMs: 1000, agora: r.agora });
    cache.set("a", 1);
    r.avancar(999);
    expect(cache.get("a")).toBe(1);
    r.avancar(1);
    expect(cache.get("a")).toBeUndefined();
    expect(cache.has("a")).toBe(false);
    expect(cache.tamanho).toBe(0);
  });

  test("set de novo recomeça o prazo", () => {
    const r = relogio();
    const cache = new CacheComTTL({ ttlMs: 1000, agora: r.agora });
    cache.set("a", 1);
    r.avancar(800);
    cache.set("a", 2);
    r.avancar(800);
    expect(cache.get("a")).toBe(2);
  });

  test("ler NÃO renova o prazo (só a ordem de uso)", () => {
    const r = relogio();
    const cache = new CacheComTTL({ ttlMs: 1000, agora: r.agora });
    cache.set("a", 1);
    r.avancar(600);
    cache.get("a");
    r.avancar(600);
    expect(cache.get("a")).toBeUndefined();
  });

  test("valores falsy válidos (0, '', false, null) são guardados e lidos", () => {
    const cache = new CacheComTTL({ ttlMs: 1000 });
    cache.set("zero", 0).set("vazio", "").set("falso", false).set("nulo", null);
    expect(cache.get("zero")).toBe(0);
    expect(cache.get("vazio")).toBe("");
    expect(cache.get("falso")).toBe(false);
    expect(cache.get("nulo")).toBeNull();
    expect(cache.has("zero")).toBe(true);
    expect(cache.tamanho).toBe(4);
  });

  test("descarta o MENOS recentemente usado quando passa do limite", () => {
    const cache = new CacheComTTL({ ttlMs: 10_000, limite: 3 });
    cache.set("a", 1).set("b", 2).set("c", 3);
    cache.set("d", 4);
    expect(cache.has("a")).toBe(false);
    expect([cache.has("b"), cache.has("c"), cache.has("d")]).toEqual([true, true, true]);
    expect(cache.tamanho).toBe(3);
  });

  test("ler um item o salva do descarte (LRU)", () => {
    const cache = new CacheComTTL({ ttlMs: 10_000, limite: 3 });
    cache.set("a", 1).set("b", 2).set("c", 3);
    cache.get("a"); // a vira o mais recente; b é agora o mais antigo
    cache.set("d", 4);
    expect(cache.has("a")).toBe(true);
    expect(cache.has("b")).toBe(false);
  });

  test("substituir uma chave existente não ocupa espaço novo", () => {
    const cache = new CacheComTTL({ ttlMs: 10_000, limite: 2 });
    cache.set("a", 1).set("b", 2).set("a", 99);
    expect(cache.tamanho).toBe(2);
    expect(cache.get("a")).toBe(99);
    expect(cache.has("b")).toBe(true);
  });

  test("tamanho ignora os vencidos", () => {
    const r = relogio();
    const cache = new CacheComTTL({ ttlMs: 100, agora: r.agora });
    cache.set("a", 1);
    r.avancar(60);
    cache.set("b", 2);
    r.avancar(60); // a venceu (120), b ainda vale (60)
    expect(cache.tamanho).toBe(1);
  });

  test("delete e clear", () => {
    const cache = new CacheComTTL({ ttlMs: 1000 });
    cache.set("a", 1).set("b", 2);
    expect(cache.delete("a")).toBe(true);
    expect(cache.delete("a")).toBe(false);
    cache.clear();
    expect(cache.tamanho).toBe(0);
  });

  test("usa Date.now por padrão", () => {
    const cache = new CacheComTTL({ ttlMs: 1000 });
    cache.set("a", 1);
    expect(cache.get("a")).toBe(1);
  });
});
