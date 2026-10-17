import { describe, expect, test, vi } from "vitest";
import { criarDom, digitar, enviar, textoDe } from "../../suporte/dom.js";
import { iniciarBuscaCep } from "./08-busca-cep.js";

const HTML = `
  <main id="app">
    <form id="form-cep">
      <label for="cep">CEP</label>
      <input id="cep" name="cep">
      <button type="submit">Buscar</button>
    </form>
    <p id="estado" role="status" data-estado="inicial"></p>
    <input id="logradouro" readonly><input id="bairro" readonly><input id="cidade" readonly><input id="uf" readonly>
  </main>`;

const SE = { cep: "01001-000", logradouro: "Praça da Sé", bairro: "Sé", localidade: "São Paulo", uf: "SP", ibge: "3550308" };
const BOA_VIAGEM = { cep: "51021-040", logradouro: "Avenida Boa Viagem", bairro: "Boa Viagem", localidade: "Recife", uf: "PE" };

function adiada() {
  const controle = {};
  controle.promise = new Promise((resolver, rejeitar) => {
    controle.resolver = resolver;
    controle.rejeitar = rejeitar;
  });
  return controle;
}

function montar(fetch) {
  const dom = criarDom(HTML);
  const raiz = dom.document.querySelector("#app");
  iniciarBuscaCep(raiz, { fetch });
  const ui = {
    ...dom,
    raiz,
    estado: () => raiz.querySelector("#estado").dataset.estado,
    texto: () => textoDe(raiz.querySelector("#estado")),
    campo: (id) => raiz.querySelector(`#${id}`).value,
    botao: raiz.querySelector("button"),
    buscar(cep) {
      digitar(raiz.querySelector("#cep"), cep);
      enviar(raiz.querySelector("#form-cep"));
    },
  };
  return ui;
}

const respondendo = (corpo, status = 200) => vi.fn(async () => Response.json(corpo, { status }));

describe("busca de CEP", () => {
  test("CEP com menos de 8 dígitos: erro na hora, sem chamar a API", async () => {
    const fetch = respondendo(SE);
    const ui = montar(fetch);
    ui.buscar("123");
    expect(ui.estado()).toBe("erro");
    expect(ui.texto()).toBe("Informe um CEP com 8 dígitos");
    expect(fetch).not.toHaveBeenCalled();
  });

  test("aceita CEP com hífen e usa só os dígitos na URL", async () => {
    const fetch = respondendo(SE);
    const ui = montar(fetch);
    ui.buscar("01001-000");
    await vi.waitFor(() => expect(ui.estado()).toBe("sucesso"));
    expect(fetch.mock.calls[0][0]).toBe("https://viacep.com.br/ws/01001000/json/");
  });

  test("durante a busca: estado carregando, botão desabilitado", async () => {
    const espera = adiada();
    const ui = montar(vi.fn(() => espera.promise));
    ui.buscar("01001000");
    expect(ui.estado()).toBe("carregando");
    expect(ui.texto()).toBe("Buscando CEP...");
    expect(ui.botao.disabled).toBe(true);
    espera.resolver(Response.json(SE));
    await vi.waitFor(() => expect(ui.estado()).toBe("sucesso"));
    expect(ui.botao.disabled).toBe(false);
  });

  test("sucesso: preenche o endereço", async () => {
    const ui = montar(respondendo(SE));
    ui.buscar("01001000");
    await vi.waitFor(() => expect(ui.estado()).toBe("sucesso"));
    expect(ui.texto()).toBe("Endereço encontrado");
    expect(ui.campo("logradouro")).toBe("Praça da Sé");
    expect(ui.campo("bairro")).toBe("Sé");
    expect(ui.campo("cidade")).toBe("São Paulo");
    expect(ui.campo("uf")).toBe("SP");
  });

  test("CEP inexistente (a API responde 200 com { erro })", async () => {
    const ui = montar(respondendo({ erro: "true" }));
    ui.buscar("99999999");
    await vi.waitFor(() => expect(ui.estado()).toBe("erro"));
    expect(ui.texto()).toBe("CEP não encontrado");
    expect(ui.campo("logradouro")).toBe("");
  });

  test("status 400 → CEP inválido", async () => {
    const ui = montar(respondendo({}, 400));
    ui.buscar("00000000");
    await vi.waitFor(() => expect(ui.estado()).toBe("erro"));
    expect(ui.texto()).toBe("CEP inválido");
  });

  test("outro status HTTP → serviço indisponível", async () => {
    const ui = montar(respondendo({}, 503));
    ui.buscar("01001000");
    await vi.waitFor(() => expect(ui.estado()).toBe("erro"));
    expect(ui.texto()).toBe("Serviço indisponível. Tente novamente.");
  });

  test("sem internet → sem conexão", async () => {
    const ui = montar(vi.fn(async () => { throw new TypeError("fetch failed"); }));
    ui.buscar("01001000");
    await vi.waitFor(() => expect(ui.estado()).toBe("erro"));
    expect(ui.texto()).toBe("Sem conexão. Tente novamente.");
    expect(ui.botao.disabled).toBe(false);
  });

  test("uma nova busca esvazia o endereço anterior", async () => {
    const espera = adiada();
    const fetch = vi.fn().mockResolvedValueOnce(Response.json(SE)).mockReturnValueOnce(espera.promise);
    const ui = montar(fetch);
    ui.buscar("01001000");
    await vi.waitFor(() => expect(ui.campo("cidade")).toBe("São Paulo"));
    ui.buscar("51021040");
    expect(ui.campo("cidade")).toBe("");
    expect(ui.campo("logradouro")).toBe("");
  });

  test("a resposta antiga e lenta NÃO sobrescreve a busca mais recente", async () => {
    const primeira = adiada();
    const segunda = adiada();
    const fetch = vi.fn().mockReturnValueOnce(primeira.promise).mockReturnValueOnce(segunda.promise);
    const ui = montar(fetch);

    ui.buscar("01001000");
    ui.buscar("51021040");
    segunda.resolver(Response.json(BOA_VIAGEM));
    await vi.waitFor(() => expect(ui.campo("cidade")).toBe("Recife"));

    primeira.resolver(Response.json(SE)); // chega depois, mas é velha
    await new Promise((r) => setTimeout(r, 20));
    expect(ui.campo("cidade")).toBe("Recife");
    expect(ui.campo("uf")).toBe("PE");
    expect(ui.estado()).toBe("sucesso");
  });

  test("não deixa a página recarregar", () => {
    const ui = montar(respondendo(SE));
    digitar(ui.raiz.querySelector("#cep"), "123");
    const evento = new ui.window.Event("submit", { bubbles: true, cancelable: true });
    ui.raiz.querySelector("#form-cep").dispatchEvent(evento);
    expect(evento.defaultPrevented).toBe(true);
  });
});
