import { describe, expect, test } from "vitest";
import { criarDom, pressionar } from "../../suporte/dom.js";
import { ativarGaleria } from "./06-teclado.js";

const fotos = [
  { arquivo: "praia.jpg", descricao: "Praia ao entardecer" },
  { arquivo: "serra.jpg", descricao: "Trilha na serra" },
  { arquivo: "rio.jpg", descricao: "Rio de águas claras" },
];

const montar = () => {
  const dom = criarDom('<img id="foto" /><p id="legenda"></p><input id="busca" />');
  const { document } = dom;
  ativarGaleria(document, fotos, document.querySelector("#foto"), document.querySelector("#legenda"));
  return { ...dom, foto: document.querySelector("#foto"), legenda: document.querySelector("#legenda") };
};

const atual = ({ foto, legenda }) => `${foto.getAttribute("src")} | ${foto.getAttribute("alt")} | ${legenda.textContent}`;

describe("galeria com teclado", () => {
  test("mostra a primeira foto ao ativar", () => {
    const m = montar();
    expect(atual(m)).toBe("praia.jpg | Praia ao entardecer | 1 de 3 — Praia ao entardecer");
  });

  test("ArrowRight avança e dá a volta no final", () => {
    const m = montar();
    pressionar(m.document.body, "ArrowRight");
    expect(atual(m)).toBe("serra.jpg | Trilha na serra | 2 de 3 — Trilha na serra");
    pressionar(m.document.body, "ArrowRight");
    pressionar(m.document.body, "ArrowRight");
    expect(m.foto.getAttribute("src")).toBe("praia.jpg");
  });

  test("ArrowLeft volta e dá a volta no começo", () => {
    const m = montar();
    pressionar(m.document.body, "ArrowLeft");
    expect(atual(m)).toBe("rio.jpg | Rio de águas claras | 3 de 3 — Rio de águas claras");
    pressionar(m.document.body, "ArrowLeft");
    expect(m.foto.getAttribute("src")).toBe("serra.jpg");
  });

  test("Home, End e Escape", () => {
    const m = montar();
    pressionar(m.document.body, "End");
    expect(m.foto.getAttribute("src")).toBe("rio.jpg");
    pressionar(m.document.body, "Home");
    expect(m.foto.getAttribute("src")).toBe("praia.jpg");
    pressionar(m.document.body, "ArrowRight");
    pressionar(m.document.body, "Escape");
    expect(m.foto.getAttribute("src")).toBe("praia.jpg");
  });

  test("outras teclas são ignoradas (e o comportamento padrão não é bloqueado)", () => {
    const m = montar();
    const evento = pressionar(m.document.body, "a");
    expect(m.foto.getAttribute("src")).toBe("praia.jpg");
    expect(evento.defaultPrevented).toBe(false);
  });

  test("nas teclas tratadas chama preventDefault", () => {
    const m = montar();
    expect(pressionar(m.document.body, "ArrowRight").defaultPrevented).toBe(true);
    expect(pressionar(m.document.body, "End").defaultPrevented).toBe(true);
  });

  test("não muda a foto enquanto a pessoa digita em um campo", () => {
    const m = montar();
    const busca = m.document.querySelector("#busca");
    const evento = pressionar(busca, "ArrowRight");
    expect(m.foto.getAttribute("src")).toBe("praia.jpg");
    expect(evento.defaultPrevented).toBe(false);
  });
});
