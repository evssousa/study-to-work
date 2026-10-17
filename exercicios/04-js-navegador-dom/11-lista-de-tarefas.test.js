import { describe, expect, test } from "vitest";
import { caminhoAoLado, lerTexto } from "../../suporte/arquivos.js";
import { criarDom, digitar, enviar, marcar, textoDe } from "../../suporte/dom.js";
import { iniciarTarefas } from "./11-lista-de-tarefas.js";

const HTML = `
  <main id="app">
    <form id="form-tarefa">
      <label for="nova">Nova tarefa</label>
      <input id="nova" name="texto">
      <button>Adicionar</button>
    </form>
    <nav id="filtros">
      <button data-filtro="todas" aria-pressed="true">Todas</button>
      <button data-filtro="pendentes" aria-pressed="false">Pendentes</button>
      <button data-filtro="concluidas" aria-pressed="false">Concluídas</button>
    </nav>
    <ul id="lista"></ul>
    <p id="vazio" hidden>Nenhuma tarefa por aqui.</p>
    <p id="contador"></p>
    <button id="limpar">Limpar concluídas</button>
  </main>`;

function montar(tarefasGuardadas, dom = criarDom(HTML)) {
  const { document, window } = dom;
  if (tarefasGuardadas !== undefined) {
    window.localStorage.setItem("tarefas", typeof tarefasGuardadas === "string" ? tarefasGuardadas : JSON.stringify(tarefasGuardadas));
  }
  const raiz = document.querySelector("#app");
  iniciarTarefas(raiz, window.localStorage);
  const ui = {
    ...dom,
    raiz,
    storage: window.localStorage,
    itens: () => [...raiz.querySelectorAll("#lista > li")],
    textos: () => [...raiz.querySelectorAll("#lista .texto")].map((e) => e.textContent),
    contador: () => textoDe(raiz.querySelector("#contador")),
    vazio: () => raiz.querySelector("#vazio"),
    adicionar(texto) {
      digitar(raiz.querySelector("#nova"), texto);
      enviar(raiz.querySelector("#form-tarefa"));
    },
    filtrar(nome) {
      raiz.querySelector(`[data-filtro="${nome}"]`).click();
    },
    guardadas: () => JSON.parse(window.localStorage.getItem("tarefas") ?? "null"),
  };
  return ui;
}

const tarefa = (id, texto, feita = false) => ({ id, texto, feita });

describe("adicionar", () => {
  test("a nova tarefa entra no fim da lista", () => {
    const ui = montar();
    ui.adicionar("Estudar closures");
    ui.adicionar("Fazer o projeto");
    expect(ui.textos()).toEqual(["Estudar closures", "Fazer o projeto"]);
  });

  test("tira espaços das pontas e ignora texto vazio", () => {
    const ui = montar();
    ui.adicionar("   Comprar pão  ");
    ui.adicionar("    ");
    ui.adicionar("");
    expect(ui.textos()).toEqual(["Comprar pão"]);
  });

  test("limpa o campo e devolve o foco a ele", () => {
    const ui = montar();
    ui.adicionar("Ler um artigo");
    const campo = ui.raiz.querySelector("#nova");
    expect(campo.value).toBe("");
    expect(ui.document.activeElement).toBe(campo);
  });

  test("não deixa a página recarregar", () => {
    const ui = montar();
    const evento = new ui.window.Event("submit", { bubbles: true, cancelable: true });
    ui.raiz.querySelector("#form-tarefa").dispatchEvent(evento);
    expect(evento.defaultPrevented).toBe(true);
  });

  test("cada tarefa tem um id único", () => {
    const ui = montar();
    ui.adicionar("A");
    ui.adicionar("B");
    const ids = ui.itens().map((li) => li.dataset.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);
  });
});

describe("itens", () => {
  test("estrutura de cada item", () => {
    const ui = montar([tarefa("1", "Estudar", false), tarefa("2", "Dormir", true)]);
    const [primeiro, segundo] = ui.itens();
    expect(primeiro.dataset.id).toBe("1");
    expect(primeiro.querySelector('input[type="checkbox"]').checked).toBe(false);
    expect(primeiro.querySelector('input[type="checkbox"]').getAttribute("aria-label")).toBe("Estudar");
    expect(primeiro.classList.contains("feita")).toBe(false);
    expect(primeiro.querySelector('[data-acao="remover"]').getAttribute("aria-label")).toBe('Remover "Estudar"');
    expect(segundo.querySelector('input[type="checkbox"]').checked).toBe(true);
    expect(segundo.classList.contains("feita")).toBe(true);
  });

  test("marcar o checkbox alterna feita (e desmarcar desfaz)", () => {
    const ui = montar([tarefa("1", "Estudar")]);
    marcar(ui.itens()[0].querySelector("input"), true);
    expect(ui.itens()[0].classList.contains("feita")).toBe(true);
    expect(ui.guardadas()[0].feita).toBe(true);
    marcar(ui.itens()[0].querySelector("input"), false);
    expect(ui.itens()[0].classList.contains("feita")).toBe(false);
  });

  test("remover apaga a tarefa", () => {
    const ui = montar([tarefa("1", "A"), tarefa("2", "B"), tarefa("3", "C")]);
    ui.itens()[1].querySelector('[data-acao="remover"]').click();
    expect(ui.textos()).toEqual(["A", "C"]);
  });

  test("é seguro contra HTML injetado no texto", () => {
    const ui = montar();
    ui.adicionar('<img src=x onerror="alert(1)">');
    expect(ui.raiz.querySelectorAll("#lista img")).toHaveLength(0);
    expect(ui.textos()).toEqual(['<img src=x onerror="alert(1)">']);
  });

  test("não usa innerHTML", () => {
    const codigo = lerTexto(caminhoAoLado(import.meta.url, "11-lista-de-tarefas.js")).replace(/\/\*[\s\S]*?\*\//g, "");
    expect(codigo).not.toMatch(/innerHTML|insertAdjacentHTML|outerHTML/);
  });
});

describe("filtros, contador e vazio", () => {
  const tarefas = [tarefa("1", "Feita 1", true), tarefa("2", "Pendente 1"), tarefa("3", "Pendente 2"), tarefa("4", "Feita 2", true)];

  test("filtros mostram só o que pedem", () => {
    const ui = montar(tarefas);
    ui.filtrar("pendentes");
    expect(ui.textos()).toEqual(["Pendente 1", "Pendente 2"]);
    ui.filtrar("concluidas");
    expect(ui.textos()).toEqual(["Feita 1", "Feita 2"]);
    ui.filtrar("todas");
    expect(ui.textos()).toHaveLength(4);
  });

  test("só o botão do filtro atual tem aria-pressed=true", () => {
    const ui = montar(tarefas);
    ui.filtrar("concluidas");
    const pressionados = Object.fromEntries(
      [...ui.raiz.querySelectorAll("[data-filtro]")].map((b) => [b.dataset.filtro, b.getAttribute("aria-pressed")]),
    );
    expect(pressionados).toEqual({ todas: "false", pendentes: "false", concluidas: "true" });
  });

  test("o contador conta as pendentes de todas as tarefas, mesmo com filtro", () => {
    const ui = montar(tarefas);
    expect(ui.contador()).toBe("2 pendentes");
    ui.filtrar("concluidas");
    expect(ui.contador()).toBe("2 pendentes");
  });

  test("singular, plural e nenhuma", () => {
    const ui = montar([tarefa("1", "Só uma")]);
    expect(ui.contador()).toBe("1 pendente");
    marcar(ui.itens()[0].querySelector("input"), true);
    expect(ui.contador()).toBe("Nenhuma pendente");
  });

  test("a mensagem de vazio aparece só quando não há nada visível", () => {
    const ui = montar();
    expect(ui.vazio().hidden).toBe(false);
    ui.adicionar("Algo");
    expect(ui.vazio().hidden).toBe(true);
    ui.filtrar("concluidas");
    expect(ui.vazio().hidden).toBe(false);
    ui.filtrar("todas");
    expect(ui.vazio().hidden).toBe(true);
  });

  test("limpar concluídas", () => {
    const ui = montar(tarefas);
    ui.raiz.querySelector("#limpar").click();
    expect(ui.textos()).toEqual(["Pendente 1", "Pendente 2"]);
    expect(ui.guardadas()).toHaveLength(2);
  });
});

describe("persistência", () => {
  test("grava as tarefas em JSON na chave 'tarefas' a cada mudança", () => {
    const ui = montar();
    ui.adicionar("Salvar isto");
    expect(ui.guardadas()).toEqual([{ id: expect.any(String), texto: "Salvar isto", feita: false }]);
    ui.itens()[0].querySelector('[data-acao="remover"]').click();
    expect(ui.guardadas()).toEqual([]);
  });

  test("não grava o filtro", () => {
    const ui = montar([tarefa("1", "A")]);
    ui.filtrar("pendentes");
    expect(ui.storage.length).toBe(1);
  });

  test("ao reabrir a página, as tarefas voltam", () => {
    const primeira = montar();
    primeira.adicionar("Lembrar de mim");
    marcar(primeira.itens()[0].querySelector("input"), true);

    // "Reabrir": uma página nova, cujo storage já tem o que ficou guardado.
    const reaberta = montar(primeira.storage.getItem("tarefas"));
    expect(reaberta.textos()).toEqual(["Lembrar de mim"]);
    expect(reaberta.itens()[0].classList.contains("feita")).toBe(true);
  });

  test("JSON corrompido no storage não quebra: começa vazio", () => {
    const ui = montar("{isto não é json");
    expect(ui.textos()).toEqual([]);
    expect(ui.vazio().hidden).toBe(false);
    ui.adicionar("Funciona");
    expect(ui.textos()).toEqual(["Funciona"]);
  });
});
