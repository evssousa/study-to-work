import { describe, expect, test } from "vitest";
import { criarDom } from "../../../suporte/dom.js";
import { congelar, despesa as d, importarDoProjeto, rachaDeTeste } from "./carregar.js";

const estado = await importarDoProjeto("estado.js");
const { CHAVE, carregarEstado, salvarEstado } = await importarDoProjeto("armazenamento.js");
const {
  ValidacaoError,
  criarRacha,
  adicionarParticipante,
  removerParticipante,
  validarDespesa,
  adicionarDespesa,
  removerDespesa,
} = estado;


const mensagemDe = (funcao) => {
  try {
    funcao();
  } catch (erro) {
    return erro;
  }
  return null;
};

describe("src/estado.js — ValidacaoError", () => {
  test("estende Error, tem o nome certo, guarda os erros e usa a primeira mensagem", () => {
    const erro = new ValidacaoError({ nome: "Nome inválido", valor: "Valor inválido" });
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe("ValidacaoError");
    expect(erro.erros).toEqual({ nome: "Nome inválido", valor: "Valor inválido" });
    expect(erro.message).toBe("Nome inválido");
  });
});

describe("src/estado.js — criarRacha", () => {
  test("cria um racha vazio, com o nome sem espaços nas pontas", () => {
    expect(criarRacha("  Viagem a Gramado  ", "r1")).toEqual({
      id: "r1",
      nome: "Viagem a Gramado",
      participantes: [],
      despesas: [],
    });
  });

  test("gera um id sozinho quando não é informado, e ids diferentes", () => {
    const a = criarRacha("A");
    const b = criarRacha("B");
    expect(typeof a.id).toBe("string");
    expect(a.id).not.toBe("");
    expect(a.id).not.toBe(b.id);
  });

  test("nome vazio lança ValidacaoError", () => {
    const erro = mensagemDe(() => criarRacha("   "));
    expect(erro).toBeInstanceOf(ValidacaoError);
    expect(erro.message).toBe("Dê um nome ao racha");
  });
});

describe("src/estado.js — participantes", () => {
  test("adicionarParticipante devolve um racha novo, sem alterar o antigo", () => {
    const racha = congelar(rachaDeTeste());
    const novo = adicionarParticipante(racha, "  Diego ", "d");
    expect(novo.participantes.at(-1)).toEqual({ id: "d", nome: "Diego" });
    expect(novo.participantes).toHaveLength(4);
    expect(racha.participantes).toHaveLength(3);
    expect(novo).not.toBe(racha);
  });

  test("nome vazio e nome repetido (ignorando maiúsculas) lançam ValidacaoError", () => {
    const racha = rachaDeTeste();
    expect(mensagemDe(() => adicionarParticipante(racha, "  "))).toBeInstanceOf(ValidacaoError);
    expect(() => adicionarParticipante(racha, " ")).toThrow("Informe o nome do participante");
    expect(() => adicionarParticipante(racha, "ana")).toThrow("Já existe um participante chamado ana");
    expect(() => adicionarParticipante(racha, " BRUNO ")).toThrow("Já existe um participante chamado BRUNO");
  });

  test("removerParticipante", () => {
    const racha = congelar(rachaDeTeste());
    const novo = removerParticipante(racha, "b");
    expect(novo.participantes.map((p) => p.id)).toEqual(["a", "c"]);
  });

  test("não remove quem está em alguma despesa (como pagador ou participante)", () => {
    const racha = rachaDeTeste([d("d1", 3000, "a", ["b", "c"])]);
    const mensagem = "Este participante está em despesas. Remova as despesas antes.";
    expect(() => removerParticipante(racha, "a")).toThrow(mensagem);
    expect(() => removerParticipante(racha, "b")).toThrow(mensagem);
    expect(mensagemDe(() => removerParticipante(racha, "c"))).toBeInstanceOf(ValidacaoError);
  });

  test("participante inexistente", () => {
    expect(() => removerParticipante(rachaDeTeste(), "zzz")).toThrow("Participante não encontrado");
  });
});

describe("src/estado.js — despesas", () => {
  const valida = { descricao: "Carne", valorCentavos: 9000, pagadorId: "a", participantesIds: ["a", "b", "c"] };

  test("validarDespesa: dados válidos → objeto vazio", () => {
    expect(validarDespesa(rachaDeTeste(), valida)).toEqual({});
  });

  test("validarDespesa: cada campo tem a sua mensagem", () => {
    const racha = rachaDeTeste();
    expect(validarDespesa(racha, { ...valida, descricao: "  " })).toEqual({ descricao: "Informe a descrição" });
    expect(validarDespesa(racha, { ...valida, valorCentavos: 0 })).toEqual({ valorCentavos: "Informe um valor maior que zero" });
    expect(validarDespesa(racha, { ...valida, valorCentavos: Number.NaN }).valorCentavos).toBe("Informe um valor maior que zero");
    expect(validarDespesa(racha, { ...valida, valorCentavos: 10.5 }).valorCentavos).toBe("Informe um valor maior que zero");
    expect(validarDespesa(racha, { ...valida, pagadorId: "" })).toEqual({ pagadorId: "Escolha quem pagou" });
    expect(validarDespesa(racha, { ...valida, pagadorId: "fantasma" })).toEqual({ pagadorId: "Escolha quem pagou" });
    expect(validarDespesa(racha, { ...valida, participantesIds: [] })).toEqual({ participantesIds: "Escolha pelo menos uma pessoa" });
    expect(validarDespesa(racha, { ...valida, participantesIds: ["a", "fantasma"] })).toEqual({
      participantesIds: "Participante inválido",
    });
  });

  test("validarDespesa: vários erros de uma vez", () => {
    const erros = validarDespesa(rachaDeTeste(), { descricao: "", valorCentavos: 0, pagadorId: "", participantesIds: [] });
    expect(Object.keys(erros).toSorted()).toEqual(["descricao", "pagadorId", "participantesIds", "valorCentavos"]);
  });

  test("adicionarDespesa guarda a despesa normalizada, sem alterar o racha antigo", () => {
    const racha = congelar(rachaDeTeste());
    const novo = adicionarDespesa(racha, { ...valida, descricao: "  Carne  ", participantesIds: ["c", "a", "a"] }, "d1");
    expect(novo.despesas).toEqual([
      { id: "d1", descricao: "Carne", valorCentavos: 9000, pagadorId: "a", participantesIds: ["a", "c"] },
    ]);
    expect(racha.despesas).toHaveLength(0);
  });

  test("os participantes da despesa ficam na ordem do racha, sem repetir", () => {
    const racha = rachaDeTeste();
    const novo = adicionarDespesa(racha, { ...valida, participantesIds: ["c", "b", "a", "b"] }, "d1");
    expect(novo.despesas[0].participantesIds).toEqual(["a", "b", "c"]);
  });

  test("adicionarDespesa com dados inválidos lança ValidacaoError com os erros", () => {
    const erro = mensagemDe(() => adicionarDespesa(rachaDeTeste(), { ...valida, valorCentavos: 0, descricao: "" }));
    expect(erro).toBeInstanceOf(ValidacaoError);
    expect(erro.erros).toEqual({ descricao: "Informe a descrição", valorCentavos: "Informe um valor maior que zero" });
  });

  test("gera ids únicos quando não informados", () => {
    let racha = rachaDeTeste();
    racha = adicionarDespesa(racha, valida);
    racha = adicionarDespesa(racha, valida);
    expect(racha.despesas[0].id).not.toBe(racha.despesas[1].id);
  });

  test("removerDespesa", () => {
    const racha = congelar(rachaDeTeste([d("d1", 100, "a", ["a"]), d("d2", 200, "b", ["b"])]));
    expect(removerDespesa(racha, "d1").despesas.map((x) => x.id)).toEqual(["d2"]);
    expect(removerDespesa(racha, "inexistente").despesas).toHaveLength(2);
  });
});

describe("src/armazenamento.js", () => {
  const novoStorage = () => criarDom("").window.localStorage;
  const racha = (id, nome = id) => ({ id, nome, participantes: [], despesas: [] });

  test("a chave é racha-conta:v1", () => {
    expect(CHAVE).toBe("racha-conta:v1");
  });

  test("storage vazio → estado vazio", () => {
    expect(carregarEstado(novoStorage())).toEqual({ rachas: [], ativoId: null });
  });

  test("salva e carrega", () => {
    const storage = novoStorage();
    const original = { rachas: [racha("r1"), racha("r2")], ativoId: "r2" };
    expect(salvarEstado(storage, original)).toBe(true);
    expect(carregarEstado(storage)).toEqual(original);
    expect(JSON.parse(storage.getItem(CHAVE)).rachas).toHaveLength(2);
  });

  test("ativoId que não existe mais cai para o primeiro racha", () => {
    const storage = novoStorage();
    salvarEstado(storage, { rachas: [racha("r1"), racha("r2")], ativoId: "sumiu" });
    expect(carregarEstado(storage).ativoId).toBe("r1");
  });

  test("JSON quebrado ou formato inesperado → estado vazio, sem lançar erro", () => {
    const storage = novoStorage();
    for (const lixo of ["{quebrado", "null", "42", '"texto"', '{"rachas": "não é lista"}', "[]"]) {
      storage.setItem(CHAVE, lixo);
      expect(carregarEstado(storage)).toEqual({ rachas: [], ativoId: null });
    }
  });

  test("ignora rachas malformados mas mantém os bons", () => {
    const storage = novoStorage();
    storage.setItem(
      CHAVE,
      JSON.stringify({ ativoId: "r1", rachas: [racha("r1"), { id: "x" }, null, "texto", { ...racha("r3"), despesas: "não" }] }),
    );
    expect(carregarEstado(storage).rachas.map((r) => r.id)).toEqual(["r1"]);
  });

  test("storage que lança erro: salvarEstado retorna false", () => {
    const cheio = {
      getItem: () => null,
      setItem: () => {
        throw new Error("cota excedida");
      },
    };
    expect(salvarEstado(cheio, { rachas: [], ativoId: null })).toBe(false);
  });
});
