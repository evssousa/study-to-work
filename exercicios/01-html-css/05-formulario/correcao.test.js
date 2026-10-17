import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));
const campo = (nome) => document.querySelector(`form [name="${nome}"]`);

describe("formulário de inscrição", () => {
  test("existe um <form>", () => {
    expect(document.querySelector("form")).not.toBeNull();
  });

  test("nome: texto e obrigatório", () => {
    expect(campo("nome")?.getAttribute("type")).toBe("text");
    expect(campo("nome").hasAttribute("required")).toBe(true);
  });

  test("e-mail: type=email e obrigatório", () => {
    expect(campo("email")?.getAttribute("type")).toBe("email");
    expect(campo("email").hasAttribute("required")).toBe(true);
  });

  test("telefone: type=tel", () => {
    expect(campo("telefone")?.getAttribute("type")).toBe("tel");
  });

  test("camiseta: select com as opções P, M, G e GG", () => {
    const select = campo("camiseta");
    expect(select?.tagName).toBe("SELECT");
    const opcoes = [...select.querySelectorAll("option")].map((o) => o.textContent.trim());
    for (const tamanho of ["P", "M", "G", "GG"]) expect(opcoes).toContain(tamanho);
  });

  test("modalidade: dois rádios dentro de um fieldset com legend", () => {
    const radios = document.querySelectorAll('fieldset input[type="radio"][name="modalidade"]');
    expect(radios).toHaveLength(2);
    expect(document.querySelector("fieldset legend")?.textContent.trim()).not.toBe("");
  });

  test("mensagem: textarea", () => {
    expect(campo("mensagem")?.tagName).toBe("TEXTAREA");
  });

  test("termos: checkbox obrigatório", () => {
    expect(campo("termos")?.getAttribute("type")).toBe("checkbox");
    expect(campo("termos").hasAttribute("required")).toBe(true);
  });

  test('botão de envio com o texto "Inscrever"', () => {
    const botao = document.querySelector('form button[type="submit"]');
    expect(botao?.textContent.trim()).toBe("Inscrever");
  });

  test("TODOS os campos têm um <label for> ligado ao id", () => {
    const campos = document.querySelectorAll("form input, form select, form textarea");
    for (const elemento of campos) {
      const id = elemento.getAttribute("id");
      const descricao = `o campo name="${elemento.getAttribute("name")}"`;
      expect(id, `${descricao} precisa de um id`).toBeTruthy();
      expect(document.querySelector(`label[for="${id}"]`), `${descricao} precisa de <label for="${id}">`).not.toBeNull();
    }
  });
});
