import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));

describe("HTML semântico", () => {
  test("<header> contém um <nav> com uma lista de pelo menos 3 links", () => {
    const links = document.querySelectorAll("header nav ul li a[href]");
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  test("<main> contém um <article>", () => {
    expect(document.querySelector("main article")).not.toBeNull();
  });

  test("existe um único <h1>, dentro do article", () => {
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelector("article h1")).not.toBeNull();
  });

  test("o article tem um <time> com datetime no formato AAAA-MM-DD", () => {
    const data = document.querySelector("article time");
    expect(data, "Falta o <time>").not.toBeNull();
    expect(data.getAttribute("datetime")).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  test("o article tem pelo menos 2 parágrafos e uma <section> com <h2>", () => {
    expect(document.querySelectorAll("article p").length).toBeGreaterThanOrEqual(2);
    expect(document.querySelector("article section h2")).not.toBeNull();
  });

  test("tem um <aside> e um <footer>", () => {
    expect(document.querySelector("aside")).not.toBeNull();
    expect(document.querySelector("footer")).not.toBeNull();
  });

  test("os níveis de título não pulam (h1 → h2 → h3)", () => {
    const niveis = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) => Number(h.tagName[1]));
    for (let i = 1; i < niveis.length; i++) {
      expect(niveis[i] - niveis[i - 1], `Um h${niveis[i]} veio logo depois de um h${niveis[i - 1]}`).toBeLessThanOrEqual(1);
    }
  });

  test("não usa <div> (neste exercício, todas as áreas têm uma tag semântica)", () => {
    expect(document.querySelectorAll("div")).toHaveLength(0);
  });
});
