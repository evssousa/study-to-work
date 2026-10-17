import { describe, expect, test } from "vitest";
import { criarDom } from "../../../suporte/dom.js";
import { importarDoProjeto } from "./carregar.js";

const { CHAVE, carregarSalvo, salvarParcial } = await importarDoProjeto("armazenamento.js");

const novoStorage = () => criarDom("").window.localStorage;

const usd = { moeda: "USD", nome: "Dólar Americano", taxa: 5.0931, variacaoPercentual: 0.9, maxima: 5.1, minima: 5.0, timestamp: 1792098492 };
const eur = { ...usd, moeda: "EUR", nome: "Euro", taxa: 5.7156 };

describe("src/armazenamento.js", () => {
  test("a chave é painel-cambio:v1", () => {
    expect(CHAVE).toBe("painel-cambio:v1");
  });

  test("nada salvo → cotações vazias e USD", () => {
    expect(carregarSalvo(novoStorage())).toEqual({ cotacoes: [], moeda: "USD" });
  });

  test("salva e carrega", () => {
    const storage = novoStorage();
    expect(salvarParcial(storage, { cotacoes: [usd, eur], moeda: "EUR" })).toBe(true);
    expect(carregarSalvo(storage)).toEqual({ cotacoes: [usd, eur], moeda: "EUR" });
  });

  test("salvarParcial mescla: gravar só a moeda mantém as cotações, e vice-versa", () => {
    const storage = novoStorage();
    salvarParcial(storage, { cotacoes: [usd] });
    salvarParcial(storage, { moeda: "GBP" });
    expect(carregarSalvo(storage)).toEqual({ cotacoes: [usd], moeda: "GBP" });
    salvarParcial(storage, { cotacoes: [eur] });
    expect(carregarSalvo(storage)).toEqual({ cotacoes: [eur], moeda: "GBP" });
  });

  test("grava JSON com versão", () => {
    const storage = novoStorage();
    salvarParcial(storage, { moeda: "EUR" });
    expect(JSON.parse(storage.getItem(CHAVE)).versao).toBe(1);
  });

  test("JSON quebrado ou formato inesperado → valores padrão, sem erro", () => {
    const storage = novoStorage();
    for (const lixo of ["{quebrado", "null", "42", '"texto"', "[]"]) {
      storage.setItem(CHAVE, lixo);
      expect(carregarSalvo(storage)).toEqual({ cotacoes: [], moeda: "USD" });
    }
  });

  test("descarta cotações malformadas e mantém as boas", () => {
    const storage = novoStorage();
    storage.setItem(
      CHAVE,
      JSON.stringify({
        moeda: "EUR",
        cotacoes: [usd, { moeda: "XX" }, null, "texto", { ...eur, taxa: "5.7" }, { ...eur, taxa: -1 }, { ...eur, moeda: "euro" }, eur],
      }),
    );
    expect(carregarSalvo(storage).cotacoes.map((c) => c.moeda)).toEqual(["USD", "EUR"]);
  });

  test("moeda salva inválida volta para USD", () => {
    const storage = novoStorage();
    storage.setItem(CHAVE, JSON.stringify({ moeda: "<script>", cotacoes: [] }));
    expect(carregarSalvo(storage).moeda).toBe("USD");
  });

  test("storage que lança erro: salvarParcial retorna false e carregarSalvo não quebra", () => {
    const cheio = {
      getItem: () => null,
      setItem: () => {
        throw new Error("cota excedida");
      },
    };
    expect(salvarParcial(cheio, { moeda: "EUR" })).toBe(false);
    expect(carregarSalvo(cheio)).toEqual({ cotacoes: [], moeda: "USD" });
  });
});
