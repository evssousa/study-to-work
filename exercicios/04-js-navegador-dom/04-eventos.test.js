import { describe, expect, test } from "vitest";
import { criarDom, digitar } from "../../suporte/dom.js";
import { ativarContador, ativarLimiteDeCaracteres } from "./04-eventos.js";

const CONTADOR = `
  <div class="contador">
    <button data-acao="menos">−</button>
    <output class="valor">0</output>
    <button data-acao="mais">+</button>
    <button data-acao="zerar">Zerar</button>
  </div>`;

const peca = (raiz, nome) => raiz.querySelector(nome === "valor" ? ".valor" : `[data-acao="${nome}"]`);

describe("ativarContador", () => {
  test("soma e subtrai ao clicar", () => {
    const { document } = criarDom(CONTADOR);
    const raiz = document.querySelector(".contador");
    ativarContador(raiz);
    peca(raiz, "mais").click();
    peca(raiz, "mais").click();
    peca(raiz, "mais").click();
    peca(raiz, "menos").click();
    expect(peca(raiz, "valor").textContent).toBe("2");
  });

  test("zerar volta a 0", () => {
    const { document } = criarDom(CONTADOR);
    const raiz = document.querySelector(".contador");
    ativarContador(raiz);
    peca(raiz, "mais").click();
    peca(raiz, "mais").click();
    peca(raiz, "zerar").click();
    expect(peca(raiz, "valor").textContent).toBe("0");
  });

  test("nunca fica negativo", () => {
    const { document } = criarDom(CONTADOR);
    const raiz = document.querySelector(".contador");
    ativarContador(raiz);
    peca(raiz, "menos").click();
    peca(raiz, "menos").click();
    expect(peca(raiz, "valor").textContent).toBe("0");
    peca(raiz, "mais").click();
    expect(peca(raiz, "valor").textContent).toBe("1");
  });

  test('o botão "menos" começa desabilitado e só habilita quando o valor passa de 0', () => {
    const { document } = criarDom(CONTADOR);
    const raiz = document.querySelector(".contador");
    ativarContador(raiz);
    expect(peca(raiz, "menos").disabled).toBe(true);
    peca(raiz, "mais").click();
    expect(peca(raiz, "menos").disabled).toBe(false);
    peca(raiz, "menos").click();
    expect(peca(raiz, "menos").disabled).toBe(true);
    peca(raiz, "mais").click();
    peca(raiz, "zerar").click();
    expect(peca(raiz, "menos").disabled).toBe(true);
  });

  test("dois contadores na mesma página são independentes", () => {
    const { document } = criarDom(CONTADOR + CONTADOR);
    const [a, b] = document.querySelectorAll(".contador");
    ativarContador(a);
    ativarContador(b);
    peca(a, "mais").click();
    peca(a, "mais").click();
    peca(b, "mais").click();
    expect(peca(a, "valor").textContent).toBe("2");
    expect(peca(b, "valor").textContent).toBe("1");
  });
});

describe("ativarLimiteDeCaracteres", () => {
  const montar = () => {
    const { document } = criarDom('<textarea id="msg"></textarea><p id="saida"></p>');
    return { campo: document.querySelector("#msg"), saida: document.querySelector("#saida") };
  };

  test("mostra o valor inicial", () => {
    const { campo, saida } = montar();
    ativarLimiteDeCaracteres(campo, saida, 20);
    expect(saida.textContent).toBe("20 restantes");
  });

  test("atualiza a cada digitação", () => {
    const { campo, saida } = montar();
    ativarLimiteDeCaracteres(campo, saida, 20);
    digitar(campo, "Olá!");
    expect(saida.textContent).toBe("16 restantes");
    digitar(campo, "");
    expect(saida.textContent).toBe("20 restantes");
  });

  test('passou do limite: número negativo e classe "excedido"', () => {
    const { campo, saida } = montar();
    ativarLimiteDeCaracteres(campo, saida, 5);
    digitar(campo, "123456789");
    expect(saida.textContent).toBe("-4 restantes");
    expect(saida.classList.contains("excedido")).toBe(true);
    digitar(campo, "12345");
    expect(saida.textContent).toBe("0 restantes");
    expect(saida.classList.contains("excedido")).toBe(false);
  });
});
