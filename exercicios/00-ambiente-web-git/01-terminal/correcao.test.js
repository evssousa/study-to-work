import { execFileSync } from "node:child_process";
import { describe, expect, test } from "vitest";
import { caminhoAoLado, existe, lerTexto } from "../../../suporte/arquivos.js";

const projeto = (...partes) => caminhoAoLado(import.meta.url, "meu-projeto", ...partes);

describe("terminal", () => {
  test("2. existem as pastas meu-projeto, src e docs", () => {
    expect(existe(projeto()), "Crie a pasta meu-projeto (mkdir)").toBe(true);
    expect(existe(projeto("src"))).toBe(true);
    expect(existe(projeto("docs"))).toBe(true);
  });

  test('3. README.md começa com "# Meu projeto"', () => {
    expect(lerTexto(projeto("README.md")).trim().startsWith("# Meu projeto")).toBe(true);
  });

  test('4 e 5. src/index.js imprime "Olá, terminal!"', () => {
    const saida = execFileSync(process.execPath, [projeto("src", "index.js")], { encoding: "utf8" });
    expect(saida.trim()).toBe("Olá, terminal!");
  });

  test("6. docs/anotacoes.txt explica pwd, ls e cd ..", () => {
    const anotacoes = lerTexto(projeto("docs", "anotacoes.txt"));
    expect(anotacoes).toContain("pwd");
    expect(anotacoes).toContain("ls");
    expect(anotacoes).toContain("cd ..");
  });

  test("8. temporario.txt foi apagado", () => {
    expect(existe(projeto("temporario.txt"))).toBe(false);
  });

  test("7 e 9. a cópia foi renomeada para src/ola.js (e copia.js não existe mais)", () => {
    expect(existe(projeto("src", "copia.js")), "Renomeie copia.js com o comando mv").toBe(false);
    expect(existe(projeto("src", "ola.js"))).toBe(true);
    expect(lerTexto(projeto("src", "ola.js"))).toBe(lerTexto(projeto("src", "index.js")));
  });
});
