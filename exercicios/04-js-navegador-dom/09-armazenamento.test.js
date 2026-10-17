import { describe, expect, test, vi } from "vitest";
import { criarDom } from "../../suporte/dom.js";
import { criarArmazenamento, lerTema, salvarTema } from "./09-armazenamento.js";

const novoStorage = () => criarDom("").window.localStorage;

describe("criarArmazenamento", () => {
  test("salva e lê objetos e listas", () => {
    const storage = novoStorage();
    const tarefas = criarArmazenamento(storage, "tarefas");
    expect(tarefas.salvar([{ id: 1, texto: "Estudar", feita: false }])).toBe(true);
    expect(tarefas.ler([])).toEqual([{ id: 1, texto: "Estudar", feita: false }]);
  });

  test("grava JSON de verdade no storage", () => {
    const storage = novoStorage();
    criarArmazenamento(storage, "dados").salvar({ a: 1 });
    expect(JSON.parse(storage.getItem("dados"))).toEqual({ a: 1 });
  });

  test("sem nada guardado, devolve o valor padrão", () => {
    const tarefas = criarArmazenamento(novoStorage(), "tarefas");
    expect(tarefas.ler([])).toEqual([]);
    expect(tarefas.ler(null)).toBeNull();
  });

  test("dado corrompido não derruba: devolve o valor padrão", () => {
    const storage = novoStorage();
    storage.setItem("tarefas", "{isso não é json");
    expect(criarArmazenamento(storage, "tarefas").ler(["padrão"])).toEqual(["padrão"]);
  });

  test("se o storage lançar erro ao gravar, salvar retorna false", () => {
    const storageCheio = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
      removeItem: () => {},
    };
    expect(criarArmazenamento(storageCheio, "x").salvar([1])).toBe(false);
  });

  test("valores falsy válidos (0, false, '') são lidos, e não confundidos com 'vazio'", () => {
    const storage = novoStorage();
    const contador = criarArmazenamento(storage, "contador");
    contador.salvar(0);
    expect(contador.ler(99)).toBe(0);
    contador.salvar(false);
    expect(contador.ler(true)).toBe(false);
  });

  test("limpar remove a chave", () => {
    const storage = novoStorage();
    const dados = criarArmazenamento(storage, "dados");
    dados.salvar({ a: 1 });
    dados.limpar();
    expect(storage.getItem("dados")).toBeNull();
    expect(dados.ler("vazio")).toBe("vazio");
  });

  test("chaves diferentes não se misturam", () => {
    const storage = novoStorage();
    criarArmazenamento(storage, "a").salvar(1);
    criarArmazenamento(storage, "b").salvar(2);
    expect(criarArmazenamento(storage, "a").ler(0)).toBe(1);
  });
});

describe("tema", () => {
  test("usa o tema guardado, sem consultar o sistema", () => {
    const storage = novoStorage();
    storage.setItem("tema", "escuro");
    const prefereEscuro = vi.fn(() => false);
    expect(lerTema(storage, prefereEscuro)).toBe("escuro");
    expect(prefereEscuro).not.toHaveBeenCalled();
  });

  test("sem tema guardado, segue a preferência do sistema", () => {
    expect(lerTema(novoStorage(), () => true)).toBe("escuro");
    expect(lerTema(novoStorage(), () => false)).toBe("claro");
  });

  test("lixo guardado é ignorado", () => {
    const storage = novoStorage();
    storage.setItem("tema", "roxo");
    expect(lerTema(storage, () => true)).toBe("escuro");
  });

  test("salvarTema grava texto puro", () => {
    const storage = novoStorage();
    salvarTema(storage, "claro");
    expect(storage.getItem("tema")).toBe("claro");
    expect(lerTema(storage, () => true)).toBe("claro");
  });

  test("salvarTema recusa temas inválidos", () => {
    const storage = novoStorage();
    expect(() => salvarTema(storage, "roxo")).toThrow("Tema inválido: roxo");
    expect(storage.getItem("tema")).toBeNull();
  });
});
