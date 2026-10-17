import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));

describe("tabela de horários", () => {
  test("a tabela tem um <caption> com texto", () => {
    expect(document.querySelector("table caption")?.textContent.trim()).toBeTruthy();
  });

  test('o <thead> tem os cabeçalhos Dia, Horário e Assunto com scope="col"', () => {
    const cabecalhos = [...document.querySelectorAll('table thead th[scope="col"]')].map((th) =>
      th.textContent.trim(),
    );
    expect(cabecalhos).toEqual(["Dia", "Horário", "Assunto"]);
  });

  test("o <tbody> tem pelo menos 3 linhas", () => {
    expect(document.querySelectorAll("table tbody tr").length).toBeGreaterThanOrEqual(3);
  });

  test('cada linha começa com <th scope="row"> e tem mais 2 <td>', () => {
    for (const linha of document.querySelectorAll("table tbody tr")) {
      const primeira = linha.firstElementChild;
      expect(primeira.tagName).toBe("TH");
      expect(primeira.getAttribute("scope")).toBe("row");
      expect(linha.querySelectorAll("td")).toHaveLength(2);
    }
  });
});
