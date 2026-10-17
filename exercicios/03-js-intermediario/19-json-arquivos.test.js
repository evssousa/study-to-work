import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { adicionarTarefa, carregarJson, concluirTarefa, salvarJson } from "./19-json-arquivos.js";

let pasta;
beforeEach(() => {
  pasta = mkdtempSync(path.join(os.tmpdir(), "exercicio-19-"));
});
afterEach(() => rmSync(pasta, { recursive: true, force: true }));

describe("salvarJson e carregarJson", () => {
  test("salva JSON formatado com 2 espaços", () => {
    const arquivo = path.join(pasta, "dados.json");
    salvarJson(arquivo, { nome: "Ana", tags: ["a"] });
    expect(readFileSync(arquivo, "utf8").trim()).toBe(JSON.stringify({ nome: "Ana", tags: ["a"] }, null, 2));
  });

  test("cria a pasta se ela não existir", () => {
    const arquivo = path.join(pasta, "sub", "pasta", "dados.json");
    salvarJson(arquivo, [1, 2]);
    expect(JSON.parse(readFileSync(arquivo, "utf8"))).toEqual([1, 2]);
  });

  test("carrega o que foi salvo", () => {
    const arquivo = path.join(pasta, "dados.json");
    salvarJson(arquivo, { ok: true, numero: 3.5 });
    expect(carregarJson(arquivo, null)).toEqual({ ok: true, numero: 3.5 });
  });

  test("arquivo que não existe retorna o valor padrão", () => {
    expect(carregarJson(path.join(pasta, "nao-existe.json"), [])).toEqual([]);
  });

  test("JSON inválido lança um erro claro", () => {
    const arquivo = path.join(pasta, "quebrado.json");
    writeFileSync(arquivo, "{ isto não é json");
    expect(() => carregarJson(arquivo, [])).toThrow(`Arquivo JSON inválido: ${arquivo}`);
  });
});

describe("lista de tarefas", () => {
  test("adicionarTarefa cria ids em sequência e grava no arquivo", () => {
    const arquivo = path.join(pasta, "tarefas.json");
    expect(adicionarTarefa(arquivo, "Estudar closures")).toEqual({ id: 1, titulo: "Estudar closures", feita: false });
    expect(adicionarTarefa(arquivo, "Fazer o projeto")).toEqual({ id: 2, titulo: "Fazer o projeto", feita: false });
    expect(carregarJson(arquivo, [])).toHaveLength(2);
  });

  test("o id é o maior existente + 1 (mesmo se algum foi apagado)", () => {
    const arquivo = path.join(pasta, "tarefas.json");
    salvarJson(arquivo, [{ id: 7, titulo: "antiga", feita: true }]);
    expect(adicionarTarefa(arquivo, "nova").id).toBe(8);
  });

  test("concluirTarefa marca como feita e grava", () => {
    const arquivo = path.join(pasta, "tarefas.json");
    adicionarTarefa(arquivo, "A");
    adicionarTarefa(arquivo, "B");
    expect(concluirTarefa(arquivo, 2)).toEqual({ id: 2, titulo: "B", feita: true });
    expect(carregarJson(arquivo, []).map((t) => t.feita)).toEqual([false, true]);
  });

  test("concluirTarefa com id inexistente lança erro", () => {
    const arquivo = path.join(pasta, "tarefas.json");
    expect(() => concluirTarefa(arquivo, 1)).toThrow("Tarefa não encontrada");
  });
});
