import { describe, expect, test } from "vitest";
import { caminhoAoLado, lerTexto } from "../../suporte/arquivos.js";
import { criarDom } from "../../suporte/dom.js";
import {
  criarCartao,
  criarCartaoComTemplate,
  criarItem,
  moverParaOFim,
  removerConcluidos,
  renderizarLista,
} from "./03-criar-e-remover.js";

const ATAQUE = '<img src="x" onerror="alert(1)"><script>roubar()</script>';
const nomes = (ul) => [...ul.children].map((li) => li.textContent);

describe("criar e remover", () => {
  test("criarItem devolve um <li> com o texto", () => {
    const { document } = criarDom("");
    const li = criarItem(document, "Comprar pão");
    expect(li.tagName).toBe("LI");
    expect(li.textContent).toBe("Comprar pão");
    expect(li.isConnected).toBe(false);
  });

  test("criarItem é seguro contra HTML injetado", () => {
    const { document } = criarDom("");
    const li = criarItem(document, ATAQUE);
    expect(li.children).toHaveLength(0);
    expect(li.textContent).toBe(ATAQUE);
  });

  test("renderizarLista substitui todo o conteúdo anterior", () => {
    const { document } = criarDom("<ul><li>velho 1</li><li>velho 2</li></ul>");
    const ul = document.querySelector("ul");
    renderizarLista(ul, ["A", "B", "C"]);
    expect(nomes(ul)).toEqual(["A", "B", "C"]);
    renderizarLista(ul, ["Z"]);
    expect(nomes(ul)).toEqual(["Z"]);
    renderizarLista(ul, []);
    expect(ul.children).toHaveLength(0);
  });

  test("renderizarLista é seguro contra HTML injetado", () => {
    const { document } = criarDom("<ul></ul>");
    const ul = document.querySelector("ul");
    renderizarLista(ul, [ATAQUE]);
    expect(ul.querySelectorAll("img, script")).toHaveLength(0);
    expect(ul.firstElementChild.textContent).toBe(ATAQUE);
  });

  test("criarCartao com imagem", () => {
    const { document } = criarDom("");
    const cartao = criarCartao(document, { titulo: "Café", descricao: "Torrado na hora", imagem: "cafe.jpg" });
    expect(cartao.tagName).toBe("ARTICLE");
    expect(cartao.classList.contains("cartao")).toBe(true);
    expect([...cartao.children].map((c) => c.tagName)).toEqual(["IMG", "H2", "P"]);
    expect(cartao.querySelector("img").getAttribute("src")).toBe("cafe.jpg");
    expect(cartao.querySelector("img").getAttribute("alt")).toBe("");
    expect(cartao.querySelector("h2").textContent).toBe("Café");
    expect(cartao.querySelector("p").textContent).toBe("Torrado na hora");
  });

  test("criarCartao sem imagem não cria o <img>", () => {
    const { document } = criarDom("");
    const cartao = criarCartao(document, { titulo: "Pão", descricao: "Quentinho" });
    expect([...cartao.children].map((c) => c.tagName)).toEqual(["H2", "P"]);
  });

  test("criarCartao é seguro contra HTML injetado", () => {
    const { document } = criarDom("");
    const cartao = criarCartao(document, { titulo: ATAQUE, descricao: ATAQUE });
    expect(cartao.querySelectorAll("img, script")).toHaveLength(0);
  });

  test("criarCartaoComTemplate clona o template sem alterá-lo", () => {
    const { document } = criarDom(
      '<template id="t"><article class="cartao"><h2></h2><p></p></article></template>',
    );
    const template = document.querySelector("#t");
    const um = criarCartaoComTemplate(template, { titulo: "Um", descricao: "Primeiro" });
    const dois = criarCartaoComTemplate(template, { titulo: "Dois", descricao: "Segundo" });
    expect(um.tagName).toBe("ARTICLE");
    expect(um.querySelector("h2").textContent).toBe("Um");
    expect(dois.querySelector("p").textContent).toBe("Segundo");
    expect(um).not.toBe(dois);
    expect(template.content.querySelector("h2").textContent).toBe("");
  });

  test("removerConcluidos remove só os .feita e conta", () => {
    const { document } = criarDom(
      '<ul><li class="feita">a</li><li>b</li><li class="feita">c</li><li>d</li></ul>',
    );
    const ul = document.querySelector("ul");
    expect(removerConcluidos(ul)).toBe(2);
    expect(nomes(ul)).toEqual(["b", "d"]);
    expect(removerConcluidos(ul)).toBe(0);
  });

  test("moverParaOFim move o mesmo elemento", () => {
    const { document } = criarDom("<ul><li>a</li><li>b</li><li>c</li></ul>");
    const ul = document.querySelector("ul");
    const primeiro = ul.firstElementChild;
    moverParaOFim(ul, primeiro);
    expect(nomes(ul)).toEqual(["b", "c", "a"]);
    expect(ul.lastElementChild).toBe(primeiro);
  });

  test("não usa innerHTML nem insertAdjacentHTML", () => {
    const codigo = lerTexto(caminhoAoLado(import.meta.url, "03-criar-e-remover.js")).replace(/\/\*[\s\S]*?\*\//g, "");
    expect(codigo).not.toMatch(/innerHTML|insertAdjacentHTML|outerHTML/);
  });
});
