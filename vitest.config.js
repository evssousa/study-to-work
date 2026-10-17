import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

const corrigindoProjeto = Boolean(process.env.PROJETO_DIR);
const usandoGabarito = process.env.GABARITO === "1";

// Quando GABARITO=1, os testes de exercicios/ importam as soluções de gabaritos/.
// Serve para conferir se os próprios testes estão corretos.
function redirecionarParaGabarito() {
  return {
    name: "redirecionar-para-gabarito",
    enforce: "pre",
    resolveId(origem, importador) {
      if (!importador || !origem.startsWith(".")) return null;
      const deQuem = importador.replaceAll("\\", "/");
      if (!deQuem.includes("/exercicios/")) return null;
      const alvo = path.resolve(path.dirname(deQuem), origem).replaceAll("\\", "/");
      const noGabarito = alvo.replace("/exercicios/", "/gabaritos/");
      return existsSync(noGabarito) ? noGabarito : null;
    },
  };
}

export default defineConfig({
  plugins: usandoGabarito ? [redirecionarParaGabarito()] : [],
  test: {
    include: corrigindoProjeto ? ["projetos/**/*.test.js"] : ["exercicios/**/*.test.js"],
    environment: "node",
    reporters: ["default"],
  },
});
