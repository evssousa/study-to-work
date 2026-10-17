import { beforeEach, describe, expect, test, vi } from "vitest";
import { adiada, importarDoProjeto, proibirFetchGlobal, semEspera } from "./carregar.js";

const { buscarJson, HttpError, RedeError, RespostaInvalidaError } = await importarDoProjeto("http.js");
const { tentarNovamente } = await importarDoProjeto("tentar.js");
const { CacheComTTL } = await importarDoProjeto("cache.js");

beforeEach(proibirFetchGlobal);

describe("src/http.js", () => {
  test("as classes de erro", () => {
    const http = new HttpError(503);
    expect(http).toBeInstanceOf(Error);
    expect([http.name, http.status, http.message]).toEqual(["HttpError", 503, "O servidor respondeu 503"]);

    const original = new TypeError("fetch failed");
    const rede = new RedeError(original);
    expect([rede.name, rede.message, rede.causa]).toEqual(["RedeError", "Falha de rede. Verifique sua conexão.", original]);

    const invalida = new RespostaInvalidaError();
    expect(invalida).toBeInstanceOf(Error);
    expect([invalida.name, invalida.message]).toEqual(["RespostaInvalidaError", "Resposta inválida do servidor"]);
  });

  test("buscarJson devolve o JSON e repassa url, signal e headers", async () => {
    const fetch = vi.fn(async () => Response.json({ ok: true }));
    const controlador = new AbortController();
    await expect(buscarJson("https://x.com/a", { fetch, signal: controlador.signal, headers: { A: "1" } })).resolves.toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith("https://x.com/a", { signal: controlador.signal, headers: { A: "1" } });
  });

  test("status de erro → HttpError; falha de rede → RedeError; abort passa direto", async () => {
    const http = await buscarJson("https://x.com", { fetch: async () => Response.json({}, { status: 404 }) }).catch((e) => e);
    expect(http).toBeInstanceOf(HttpError);
    expect(http.status).toBe(404);

    const rede = await buscarJson("https://x.com", { fetch: async () => { throw new TypeError("fetch failed"); } }).catch((e) => e);
    expect(rede).toBeInstanceOf(RedeError);

    const abortado = new DOMException("cancelada", "AbortError");
    const erro = await buscarJson("https://x.com", { fetch: async () => { throw abortado; } }).catch((e) => e);
    expect(erro).toBe(abortado);
  });

  test("corpo que não é JSON → RespostaInvalidaError", async () => {
    const erro = await buscarJson("https://x.com", { fetch: async () => new Response("<html>") }).catch((e) => e);
    expect(erro).toBeInstanceOf(RespostaInvalidaError);
  });
});

describe("src/tentar.js", () => {
  test("repete com backoff e devolve o resultado", async () => {
    const esperar = semEspera();
    const funcao = vi.fn(async (tentativa) => {
      if (tentativa < 3) throw new Error("falha");
      return "ok";
    });
    await expect(tentarNovamente(funcao, { tentativas: 4, esperaInicialMs: 100, fator: 2, esperar })).resolves.toBe("ok");
    expect(esperar.mock.calls.map((c) => c[0])).toEqual([100, 200]);
  });

  test("lança o erro da última tentativa; tentarSe=false desiste na hora", async () => {
    const esperar = semEspera();
    const sempre = vi.fn(async (n) => { throw new Error(`erro ${n}`); });
    await expect(tentarNovamente(sempre, { tentativas: 3, esperar })).rejects.toThrow("erro 3");
    expect(esperar).toHaveBeenCalledTimes(2);

    const funcao = vi.fn(async () => { throw new Error("nem adianta"); });
    await expect(tentarNovamente(funcao, { tentativas: 5, esperar, tentarSe: () => false })).rejects.toThrow("nem adianta");
    expect(funcao).toHaveBeenCalledTimes(1);
  });
});

describe("src/cache.js — CacheComTTL", () => {
  test("vence depois do TTL e valores falsy são guardados", () => {
    let agora = 1000;
    const cache = new CacheComTTL({ ttlMs: 1000, agora: () => agora });
    cache.set("a", 0).set("b", "");
    expect(cache.get("a")).toBe(0);
    expect(cache.has("b")).toBe(true);
    agora += 1000;
    expect(cache.get("a")).toBeUndefined();
    expect(cache.tamanho).toBe(0);
  });

  test("descarta o menos recentemente usado ao passar do limite", () => {
    const cache = new CacheComTTL({ ttlMs: 10_000, limite: 2 });
    cache.set("a", 1).set("b", 2);
    cache.get("a");
    cache.set("c", 3);
    expect([cache.has("a"), cache.has("b"), cache.has("c")]).toEqual([true, false, true]);
  });

  test("adiada(): utilitário dos testes funciona", async () => {
    const espera = adiada();
    espera.resolver(7);
    await expect(espera.promise).resolves.toBe(7);
  });
});
