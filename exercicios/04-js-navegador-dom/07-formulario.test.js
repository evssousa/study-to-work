import { describe, expect, test, vi } from "vitest";
import { criarDom, enviar, marcar } from "../../suporte/dom.js";
import { ativarFormulario, validarCadastro } from "./07-formulario.js";

const MENSAGENS = {
  nome: "Informe seu nome (mínimo 2 letras)",
  email: "E-mail inválido",
  senha: "A senha deve ter pelo menos 8 caracteres",
  confirmacao: "As senhas não conferem",
  aceito: "Você precisa aceitar os termos",
};

const valido = { nome: "Ana", email: "ana@exemplo.com", senha: "segredo123", confirmacao: "segredo123", aceito: "on" };

describe("validarCadastro", () => {
  test("dados válidos → objeto vazio", () => {
    expect(validarCadastro(valido)).toEqual({});
  });

  test("cada campo tem a sua mensagem", () => {
    expect(validarCadastro({ ...valido, nome: "A" })).toEqual({ nome: MENSAGENS.nome });
    expect(validarCadastro({ ...valido, nome: "   " })).toEqual({ nome: MENSAGENS.nome });
    expect(validarCadastro({ ...valido, email: "ana@exemplo" })).toEqual({ email: MENSAGENS.email });
    expect(validarCadastro({ ...valido, senha: "curta", confirmacao: "curta" })).toEqual({ senha: MENSAGENS.senha });
    expect(validarCadastro({ ...valido, confirmacao: "outra-coisa" })).toEqual({ confirmacao: MENSAGENS.confirmacao });
    expect(validarCadastro({ ...valido, aceito: undefined })).toEqual({ aceito: MENSAGENS.aceito });
  });

  test("vários erros de uma vez", () => {
    expect(Object.keys(validarCadastro({})).toSorted()).toEqual(["aceito", "email", "nome", "senha"]);
  });

  test("nome com espaços nas pontas conta sem eles", () => {
    expect(validarCadastro({ ...valido, nome: " Al " })).toEqual({});
  });
});

const HTML = `
  <form id="f" novalidate>
    <label for="nome">Nome</label><input id="nome" name="nome"><span id="erro-nome"></span>
    <label for="email">E-mail</label><input id="email" name="email"><span id="erro-email"></span>
    <label for="senha">Senha</label><input id="senha" name="senha" type="password"><span id="erro-senha"></span>
    <label for="confirmacao">Confirmação</label><input id="confirmacao" name="confirmacao" type="password"><span id="erro-confirmacao"></span>
    <input id="aceito" name="aceito" type="checkbox"><label for="aceito">Aceito</label><span id="erro-aceito"></span>
    <button>Cadastrar</button>
  </form>`;

function montar() {
  const dom = criarDom(HTML);
  const form = dom.document.querySelector("#f");
  const aoEnviar = vi.fn();
  ativarFormulario(form, aoEnviar);
  const campo = (nome) => form.elements[nome];
  const erro = (nome) => dom.document.querySelector(`#erro-${nome}`);
  const preencher = (dados) => {
    campo("nome").value = dados.nome;
    campo("email").value = dados.email;
    campo("senha").value = dados.senha;
    campo("confirmacao").value = dados.confirmacao;
    marcar(campo("aceito"), dados.aceito === "on");
  };
  return { ...dom, form, aoEnviar, campo, erro, preencher };
}

describe("ativarFormulario", () => {
  test("não deixa a página recarregar (preventDefault)", () => {
    const { form } = montar();
    const evento = new form.ownerDocument.defaultView.Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(evento);
    expect(evento.defaultPrevented).toBe(true);
  });

  test("formulário vazio: mostra as mensagens, marca os campos e não envia", () => {
    const m = montar();
    enviar(m.form);
    expect(m.aoEnviar).not.toHaveBeenCalled();
    for (const nome of ["nome", "email", "senha", "aceito"]) {
      expect(m.erro(nome).textContent).toBe(MENSAGENS[nome]);
      expect(m.campo(nome).getAttribute("aria-invalid")).toBe("true");
      expect(m.campo(nome).getAttribute("aria-describedby")).toBe(`erro-${nome}`);
    }
  });

  test("o foco vai para o primeiro campo com erro", () => {
    const m = montar();
    m.preencher({ ...valido, email: "errado" });
    enviar(m.form);
    expect(m.document.activeElement).toBe(m.campo("email"));
  });

  test("campos corretos ficam limpos", () => {
    const m = montar();
    m.preencher({ ...valido, senha: "curta", confirmacao: "curta" });
    enviar(m.form);
    expect(m.erro("nome").textContent).toBe("");
    expect(m.campo("nome").hasAttribute("aria-invalid")).toBe(false);
    expect(m.erro("senha").textContent).toBe(MENSAGENS.senha);
  });

  test("corrigir o erro e enviar de novo limpa as mensagens antigas", () => {
    const m = montar();
    enviar(m.form);
    m.preencher(valido);
    enviar(m.form);
    for (const nome of ["nome", "email", "senha", "confirmacao", "aceito"]) {
      expect(m.erro(nome).textContent).toBe("");
      expect(m.campo(nome).hasAttribute("aria-invalid")).toBe(false);
    }
  });

  test("tudo certo: chama aoEnviar com os dados e limpa o formulário", () => {
    const m = montar();
    m.preencher(valido);
    enviar(m.form);
    expect(m.aoEnviar).toHaveBeenCalledTimes(1);
    expect(m.aoEnviar).toHaveBeenCalledWith(valido);
    expect(m.campo("nome").value).toBe("");
    expect(m.campo("aceito").checked).toBe(false);
  });
});
