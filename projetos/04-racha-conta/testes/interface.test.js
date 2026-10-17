import { describe, expect, test } from "vitest";
import { abrirApp, abrirComChurrasco } from "./app.js";

const IDS_OBRIGATORIOS = [
  "app", "seletor-racha", "btn-excluir-racha", "form-racha", "erro-racha", "painel",
  "form-participante", "erro-participante", "lista-participantes",
  "form-despesa", "opcoes-participantes", "erro-descricao", "erro-valor", "erro-pagador", "erro-participantes",
  "lista-despesas", "sem-despesas", "total", "lista-saldos", "lista-acerto", "acerto-vazio", "link-whatsapp", "status",
];

const CAMPOS_OBRIGATORIOS = [
  "#form-racha [name=nome]",
  "#form-participante [name=nome]",
  "#form-despesa [name=descricao]",
  "#form-despesa [name=valor]",
  "#form-despesa select[name=pagador]",
];

describe("index.html — o contrato da tela", () => {
  test.each(IDS_OBRIGATORIOS)("existe o elemento #%s", async (id) => {
    const app = await abrirApp();
    expect(app.document.getElementById(id), `Falta um elemento com id="${id}" no index.html`).not.toBeNull();
  });

  test.each(CAMPOS_OBRIGATORIOS)("existe o campo %s", async (seletor) => {
    const app = await abrirApp();
    expect(app.q(seletor), `Falta o campo ${seletor}`).not.toBeNull();
  });

  test("os elementos de erro e o status são anunciados para leitores de tela", async () => {
    const app = await abrirApp();
    const status = app.q("#status");
    expect(status.getAttribute("role") === "status" || status.getAttribute("aria-live") === "polite").toBe(true);
  });
});

describe("começando do zero", () => {
  test("sem rachas: o painel fica escondido e o seletor vazio", async () => {
    const app = await abrirApp();
    expect(app.q("#painel").hidden).toBe(true);
    expect(app.q("#seletor-racha").options).toHaveLength(0);
  });

  test("criar um racha o seleciona, mostra o painel e avisa", async () => {
    const app = await abrirApp();
    app.criarRacha("  Viagem a Gramado ");
    const seletor = app.q("#seletor-racha");
    expect([...seletor.options].map((o) => o.textContent.trim())).toEqual(["Viagem a Gramado"]);
    expect(seletor.selectedOptions[0].textContent.trim()).toBe("Viagem a Gramado");
    expect(app.q("#painel").hidden).toBe(false);
    expect(app.texto("#status")).toBe('Racha "Viagem a Gramado" criado');
    expect(app.q("#form-racha [name=nome]").value).toBe("");
  });

  test("racha sem nome: mostra o erro acessível e não cria nada", async () => {
    const app = await abrirApp();
    app.criarRacha("   ");
    const campo = app.q("#form-racha [name=nome]");
    expect(app.texto("#erro-racha")).toBe("Dê um nome ao racha");
    expect(campo.getAttribute("aria-invalid")).toBe("true");
    expect(campo.getAttribute("aria-describedby")).toBe("erro-racha");
    expect(app.document.activeElement).toBe(campo);
    expect(app.q("#seletor-racha").options).toHaveLength(0);
    app.criarRacha("Agora vai");
    expect(app.texto("#erro-racha")).toBe("");
    expect(campo.hasAttribute("aria-invalid")).toBe(false);
  });
});

describe("participantes", () => {
  test("aparecem na lista, no seletor de quem pagou e nas opções de quem divide", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    for (const nome of ["Ana", "Bruno", "Carla"]) app.adicionarParticipante(nome);

    expect(app.nomesDosParticipantes()).toEqual(["Ana", "Bruno", "Carla"]);
    const opcoes = [...app.q("#form-despesa [name=pagador]").options].map((o) => o.textContent.trim());
    expect(opcoes).toEqual(["Escolha quem pagou", "Ana", "Bruno", "Carla"]);
    expect(app.q("#form-despesa [name=pagador]").options[0].value).toBe("");

    const caixas = app.todos('#form-despesa [name="participantes"]');
    expect(caixas).toHaveLength(3);
    expect(caixas.every((c) => c.type === "checkbox" && c.checked)).toBe(true);
    expect(app.texto("#status")).toBe("Participante adicionado: Carla");
  });

  test("o campo é limpo e recebe o foco depois de adicionar", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    app.adicionarParticipante("Ana");
    const campo = app.q("#form-participante [name=nome]");
    expect(campo.value).toBe("");
    expect(app.document.activeElement).toBe(campo);
  });

  test("nome vazio ou repetido mostra o erro", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    app.adicionarParticipante("   ");
    expect(app.texto("#erro-participante")).toBe("Informe o nome do participante");
    app.adicionarParticipante("Ana");
    expect(app.texto("#erro-participante")).toBe("");
    app.adicionarParticipante("ana");
    expect(app.texto("#erro-participante")).toBe("Já existe um participante chamado ana");
    expect(app.q("#form-participante [name=nome]").getAttribute("aria-invalid")).toBe("true");
    expect(app.nomesDosParticipantes()).toEqual(["Ana"]);
  });

  test("remover participante sem despesas", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    for (const nome of ["Ana", "Bruno"]) app.adicionarParticipante(nome);
    app.q('#lista-participantes li [data-acao="remover-participante"]').click();
    expect(app.nomesDosParticipantes()).toEqual(["Bruno"]);
    expect(app.texto("#status")).toBe("Participante removido: Ana");
    expect([...app.q("#form-despesa [name=pagador]").options].map((o) => o.textContent.trim())).toEqual(["Escolha quem pagou", "Bruno"]);
  });

  test("os botões de remover têm nome acessível", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    app.adicionarParticipante("Ana");
    expect(app.q('[data-acao="remover-participante"]').getAttribute("aria-label")).toBe("Remover Ana");
  });

  test("participante com despesas não pode ser removido e o app explica", async () => {
    const app = await abrirComChurrasco();
    const botaoDaAna = app.q('#lista-participantes li [data-acao="remover-participante"]');
    botaoDaAna.click();
    expect(app.nomesDosParticipantes()).toContain("Ana");
    expect(app.texto("#erro-participante")).toBe("Este participante está em despesas. Remova as despesas antes.");
  });
});

describe("despesas", () => {
  test("a máscara do campo de valor funciona enquanto se digita", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    app.preencherDespesa({ digitosDoValor: "9000" });
    expect(app.q("#form-despesa [name=valor]").value).toBe("90,00");
    app.preencherDespesa({ digitosDoValor: "123456" });
    expect(app.q("#form-despesa [name=valor]").value).toBe("1.234,56");
  });

  test("a despesa aparece na lista com descrição, valor e quem pagou", async () => {
    const app = await abrirComChurrasco();
    const [carne, bebidas] = app.textos("#lista-despesas li");
    for (const trecho of ["Carne", "R$ 90,00", "Ana"]) expect(carne).toContain(trecho);
    for (const trecho of ["Bebidas", "R$ 30,00", "Bruno"]) expect(bebidas).toContain(trecho);
    expect(app.q("#sem-despesas").hidden).toBe(true);
    expect(app.texto("#status")).toBe("Despesa adicionada: Bebidas");
  });

  test("depois de adicionar, o formulário volta ao início", async () => {
    const app = await abrirComChurrasco();
    expect(app.q("#form-despesa [name=descricao]").value).toBe("");
    expect(app.q("#form-despesa [name=valor]").value).toBe("");
    expect(app.q("#form-despesa [name=pagador]").value).toBe("");
    expect(app.todos('#form-despesa [name="participantes"]').every((c) => c.checked)).toBe(true);
  });

  test("sem despesas aparece a mensagem de vazio", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    expect(app.q("#sem-despesas").hidden).toBe(false);
  });

  test("formulário vazio: as quatro mensagens, campos marcados e foco no primeiro erro", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    app.adicionarParticipante("Ana");
    app.enviarDespesa();
    expect(app.texto("#erro-descricao")).toBe("Informe a descrição");
    expect(app.texto("#erro-valor")).toBe("Informe um valor maior que zero");
    expect(app.texto("#erro-pagador")).toBe("Escolha quem pagou");
    expect(app.q("#form-despesa [name=descricao]").getAttribute("aria-invalid")).toBe("true");
    expect(app.q("#form-despesa [name=descricao]").getAttribute("aria-describedby")).toBe("erro-descricao");
    expect(app.q("#form-despesa [name=valor]").getAttribute("aria-invalid")).toBe("true");
    expect(app.q("#form-despesa [name=pagador]").getAttribute("aria-invalid")).toBe("true");
    expect(app.document.activeElement).toBe(app.q("#form-despesa [name=descricao]"));
    expect(app.q("#lista-despesas").children).toHaveLength(0);
  });

  test("ninguém marcado em quem divide", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    app.adicionarParticipante("Ana");
    app.preencherDespesa({ descricao: "Pizza", digitosDoValor: "5000", pagador: "Ana", divide: [] });
    app.enviarDespesa();
    expect(app.texto("#erro-participantes")).toBe("Escolha pelo menos uma pessoa");
    expect(app.q("#lista-despesas").children).toHaveLength(0);
  });

  test("corrigir o erro limpa as mensagens", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    app.adicionarParticipante("Ana");
    app.enviarDespesa();
    app.adicionarDespesa({ descricao: "Pizza", digitosDoValor: "5000", pagador: "Ana" });
    expect(app.texto("#erro-descricao")).toBe("");
    expect(app.texto("#erro-valor")).toBe("");
    expect(app.texto("#erro-pagador")).toBe("");
    expect(app.q("#form-despesa [name=descricao]").hasAttribute("aria-invalid")).toBe(false);
    expect(app.q("#lista-despesas").children).toHaveLength(1);
  });

  test("remover uma despesa atualiza tudo", async () => {
    const app = await abrirComChurrasco();
    expect(app.q('#lista-despesas li [data-acao="remover-despesa"]').getAttribute("aria-label")).toBe("Remover despesa Carne");
    app.q('#lista-despesas li [data-acao="remover-despesa"]').click();
    expect(app.textos("#lista-despesas li")).toHaveLength(1);
    expect(app.texto("#total")).toBe("Total gasto: R$ 30,00");
    expect(app.texto("#status")).toBe("Despesa removida: Carne");
  });
});

describe("resumo e acerto de contas", () => {
  test("total gasto", async () => {
    const app = await abrirComChurrasco();
    expect(app.texto("#total")).toBe("Total gasto: R$ 120,00");
  });

  test("saldo de cada pessoa, na ordem dos participantes", async () => {
    const app = await abrirComChurrasco();
    expect(app.textos("#lista-saldos li")).toEqual(["Ana: recebe R$ 60,00", "Bruno: deve R$ 15,00", "Carla: deve R$ 45,00"]);
  });

  test("quem não deve nem recebe está quite", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    app.adicionarParticipante("Ana");
    expect(app.textos("#lista-saldos li")).toEqual(["Ana: está quite"]);
  });

  test("quem paga quanto para quem", async () => {
    const app = await abrirComChurrasco();
    expect(app.textos("#lista-acerto li")).toEqual(["Carla paga R$ 45,00 para Ana", "Bruno paga R$ 15,00 para Ana"]);
    expect(app.q("#acerto-vazio").hidden).toBe(true);
  });

  test("sem dívidas, mostra a mensagem de tudo certo", async () => {
    const app = await abrirApp();
    app.criarRacha("Rolê");
    expect(app.q("#lista-acerto").children).toHaveLength(0);
    expect(app.q("#acerto-vazio").hidden).toBe(false);
  });

  test("o link do WhatsApp leva o resumo pronto", async () => {
    const app = await abrirComChurrasco();
    const resumo = [
      "*Churrasco*",
      "Total gasto: R$ 120,00",
      "",
      "Acerto de contas:",
      "• Carla paga R$ 45,00 para Ana",
      "• Bruno paga R$ 15,00 para Ana",
    ].join("\n");
    expect(app.q("#link-whatsapp").getAttribute("href")).toBe(`https://wa.me/?text=${encodeURIComponent(resumo)}`);
  });
});

describe("vários rachas", () => {
  test("cada racha tem os seus dados e dá para alternar", async () => {
    const app = await abrirComChurrasco();
    app.criarRacha("Viagem");
    app.adicionarParticipante("Diego");
    expect(app.nomesDosParticipantes()).toEqual(["Diego"]);
    expect(app.texto("#total")).toBe("Total gasto: R$ 0,00");

    app.trocarRacha("Churrasco");
    expect(app.nomesDosParticipantes()).toEqual(["Ana", "Bruno", "Carla"]);
    expect(app.texto("#total")).toBe("Total gasto: R$ 120,00");
    expect(app.q("#seletor-racha").selectedOptions[0].textContent.trim()).toBe("Churrasco");
  });

  test("excluir pede confirmação", async () => {
    const perguntas = [];
    const app = await abrirApp({ confirmar: (mensagem) => (perguntas.push(mensagem), false) });
    app.criarRacha("Rolê");
    app.q("#btn-excluir-racha").click();
    expect(perguntas).toHaveLength(1);
    expect(perguntas[0]).toContain("Rolê");
    expect(app.q("#seletor-racha").options).toHaveLength(1);
  });

  test("excluir o racha atual passa para outro, ou esconde o painel se não sobrar nenhum", async () => {
    const app = await abrirApp();
    app.criarRacha("Um");
    app.criarRacha("Dois");
    app.q("#btn-excluir-racha").click();
    expect([...app.q("#seletor-racha").options].map((o) => o.textContent.trim())).toEqual(["Um"]);
    expect(app.q("#painel").hidden).toBe(false);
    expect(app.texto("#status")).toBe("Racha excluído: Dois");
    app.q("#btn-excluir-racha").click();
    expect(app.q("#painel").hidden).toBe(true);
    expect(app.q("#seletor-racha").options).toHaveLength(0);
  });
});

describe("persistência", () => {
  test("tudo é gravado no localStorage a cada mudança", async () => {
    const app = await abrirComChurrasco();
    const gravado = app.guardadoAgora();
    expect(gravado.rachas).toHaveLength(1);
    expect(gravado.rachas[0].nome).toBe("Churrasco");
    expect(gravado.rachas[0].participantes.map((p) => p.nome)).toEqual(["Ana", "Bruno", "Carla"]);
    expect(gravado.rachas[0].despesas).toHaveLength(2);
    expect(gravado.rachas[0].despesas[0].valorCentavos).toBe(9000);
    expect(gravado.ativoId).toBe(gravado.rachas[0].id);
  });

  test("ao reabrir, está tudo lá: racha ativo, participantes, despesas e acerto", async () => {
    const primeira = await abrirComChurrasco();
    primeira.criarRacha("Viagem");
    primeira.trocarRacha("Churrasco");
    const guardado = primeira.storage.getItem("racha-conta:v1");

    const reaberta = await abrirApp({ guardado });
    expect(reaberta.q("#painel").hidden).toBe(false);
    expect(reaberta.q("#seletor-racha").selectedOptions[0].textContent.trim()).toBe("Churrasco");
    expect(reaberta.nomesDosParticipantes()).toEqual(["Ana", "Bruno", "Carla"]);
    expect(reaberta.textos("#lista-acerto li")).toEqual(["Carla paga R$ 45,00 para Ana", "Bruno paga R$ 15,00 para Ana"]);
  });

  test("dados corrompidos no localStorage não quebram o app", async () => {
    const app = await abrirApp({ guardado: "{isto não é json" });
    expect(app.q("#painel").hidden).toBe(true);
    app.criarRacha("Recomeço");
    expect(app.q("#seletor-racha").options).toHaveLength(1);
  });
});

describe("segurança e acessibilidade", () => {
  const ATAQUE = '<img src="x" onerror="alert(1)"><script>roubar()</script>';

  test("HTML digitado pela pessoa aparece como texto, nunca como elementos", async () => {
    const app = await abrirApp();
    app.criarRacha(ATAQUE);
    app.adicionarParticipante(ATAQUE);
    app.adicionarDespesa({ descricao: ATAQUE, digitosDoValor: "1000", pagador: ATAQUE });
    expect(app.raiz.querySelectorAll("img, script")).toHaveLength(0);
    expect(app.q("#seletor-racha").options[0].textContent).toBe(ATAQUE);
    expect(app.nomesDosParticipantes()).toEqual([ATAQUE]);
    expect(app.texto("#lista-despesas li")).toContain(ATAQUE);
  });

  test("todos os campos, inclusive os criados pelo JavaScript, têm rótulo", async () => {
    const app = await abrirComChurrasco();
    for (const campo of app.todos("input, select, textarea")) {
      const id = campo.getAttribute("id");
      const temRotulo = (id && app.document.querySelector(`label[for="${id}"]`)) || campo.closest("label") || campo.getAttribute("aria-label");
      expect(temRotulo, `Campo name="${campo.getAttribute("name")}" sem rótulo`).toBeTruthy();
    }
  });

  test("todos os botões têm nome acessível", async () => {
    const app = await abrirComChurrasco();
    for (const botao of app.todos("button")) {
      const nome = botao.getAttribute("aria-label") || botao.textContent.trim();
      expect(nome, "Botão sem texto e sem aria-label").not.toBe("");
    }
  });
});
