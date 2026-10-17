import { readFileSync } from "node:fs";
import * as prettier from "prettier";
import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";

const ENTRADA = `const produtos = [{nome: "Café", preco: 25}, {nome: "Pão", preco: 4.5}, {nome: "Leite", preco: 6}]
function total(lista) { return lista.reduce((soma, item) => soma + item.preco, 0); }
const dobrar = (n) => n * 2;
console.log("Total:", total(produtos), "e o dobro é", dobrar(total(produtos)));
`;

const ESPERADO = `const produtos = [
    { nome: 'Café', preco: 25 },
    { nome: 'Pão', preco: 4.5 },
    { nome: 'Leite', preco: 6 },
]
function total(lista) {
    return lista.reduce(
        (soma, item) => soma + item.preco,
        0,
    )
}
const dobrar = n => n * 2
console.log(
    'Total:',
    total(produtos),
    'e o dobro é',
    dobrar(total(produtos)),
)
`;

function lerConfiguracao() {
  const texto = readFileSync(caminhoAoLado(import.meta.url, ".prettierrc.json"), "utf8");
  try {
    return JSON.parse(texto);
  } catch {
    throw new Error(".prettierrc.json não é um JSON válido (aspas duplas nas chaves, sem vírgula sobrando)");
  }
}

describe(".prettierrc.json", () => {
  test("é um JSON válido com um objeto", () => {
    expect(lerConfiguracao()).toBeTypeOf("object");
  });

  test("cada opção tem o valor combinado pelo time", () => {
    expect(lerConfiguracao()).toMatchObject({
      semi: false,
      singleQuote: true,
      printWidth: 60,
      tabWidth: 4,
      trailingComma: "all",
      arrowParens: "avoid",
    });
  });

  test("o Prettier formata o código exatamente como o esperado", async () => {
    const saida = await prettier.format(ENTRADA, { ...lerConfiguracao(), parser: "babel" });
    expect(saida).toBe(ESPERADO);
  });

  test("formatar o resultado de novo não muda nada (idempotente)", async () => {
    const configuracao = { ...lerConfiguracao(), parser: "babel" };
    const uma = await prettier.format(ENTRADA, configuracao);
    expect(await prettier.format(uma, configuracao)).toBe(uma);
  });

  test("não há opções desconhecidas (erro de digitação)", () => {
    const conhecidas = new Set([
      "semi", "singleQuote", "printWidth", "tabWidth", "trailingComma", "arrowParens", "useTabs", "quoteProps",
      "bracketSpacing", "bracketSameLine", "endOfLine", "proseWrap", "jsxSingleQuote", "singleAttributePerLine",
      "$schema", "overrides",
    ]);
    for (const chave of Object.keys(lerConfiguracao())) {
      expect(conhecidas.has(chave), `Opção desconhecida no .prettierrc.json: ${chave}`).toBe(true);
    }
  });
});
