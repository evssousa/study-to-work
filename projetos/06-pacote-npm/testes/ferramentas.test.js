import { beforeAll, describe, expect, test } from "vitest";
import { eslintNoTexto, exigirDependenciasInstaladas, existe, ler, lerPacote, npm } from "./projeto.js";

// Estes testes executam as ferramentas DE VERDADE dentro do seu projeto, por isso podem levar alguns segundos.
const TEMPO = 180_000;

beforeAll(() => {
  exigirDependenciasInstaladas();
});

describe("as ferramentas de qualidade rodam no seu projeto", () => {
  test("npm run lint passa sem erros", { timeout: TEMPO }, () => {
    const resultado = npm("run lint");
    expect(resultado.codigo, `O ESLint encontrou problemas:\n${resultado.saida}`).toBe(0);
  });

  test("npm run format:check passa (tudo está formatado pelo Prettier)", { timeout: TEMPO }, () => {
    const resultado = npm("run format:check");
    expect(resultado.codigo, `Rode npm run format para corrigir:\n${resultado.saida}`).toBe(0);
  });

  test("npm test passa, com pelo menos 12 testes", { timeout: TEMPO }, () => {
    const resultado = npm("test");
    expect(resultado.codigo, `Seus testes falharam:\n${resultado.saida}`).toBe(0);
    const passaram = Number(/(?:ℹ|#)\s*pass\s+(\d+)/.exec(resultado.saida)?.[1] ?? 0);
    const falharam = Number(/(?:ℹ|#)\s*fail\s+(\d+)/.exec(resultado.saida)?.[1] ?? 0);
    expect(falharam).toBe(0);
    expect(passaram, "Escreva pelo menos 12 testes (cálculos e linha de comando)").toBeGreaterThanOrEqual(12);
  });
});

describe("a SUA configuração do ESLint de fato pega problemas", () => {
  test("var e == são erros", { timeout: TEMPO }, () => {
    const resultado = eslintNoTexto("var a = 1;\nif (a == 2) {\n  console.log(a);\n}\n");
    expect(resultado.codigo).toBe(1);
    expect(resultado.saida).toMatch(/\berror\b.*\sno-var\s*$/m);
    expect(resultado.saida).toMatch(/\berror\b.*\seqeqeq\s*$/m);
  });

  test("variável não usada e const esquecido são erros", { timeout: TEMPO }, () => {
    const resultado = eslintNoTexto("let sobrando = 1;\nlet x = 2;\nexport { x };\n");
    expect(resultado.codigo).toBe(1);
    expect(resultado.saida).toMatch(/\berror\b.*\sno-unused-vars\s*$/m);
    expect(resultado.saida).toMatch(/\berror\b.*\sprefer-const\s*$/m);
  });

  test("código de linha de comando correto passa (console e process são permitidos)", { timeout: TEMPO }, () => {
    const resultado = eslintNoTexto('console.log(process.argv.length);\nexport const ok = "sim";\n');
    expect(resultado.saida.trim(), resultado.saida).toBe("");
    expect(resultado.codigo).toBe(0);
  });
});

describe("o que será publicado no npm (npm pack --dry-run)", () => {
  function pacote() {
    const resultado = npm("pack --dry-run --json --ignore-scripts");
    expect(resultado.codigo, `npm pack falhou:\n${resultado.saida}`).toBe(0);
    const [entrada] = JSON.parse(resultado.stdout);
    return { entrada, caminhos: entrada.files.map((f) => f.path) };
  }

  test("inclui o código, os documentos e o arquivo do comando", { timeout: TEMPO }, () => {
    const { caminhos } = pacote();
    const bin = typeof lerPacote().bin === "string" ? lerPacote().bin : Object.values(lerPacote().bin)[0];
    for (const esperado of ["package.json", "README.md", "LICENSE", "CHANGELOG.md", "src/calculos.js", "src/tabelas.js", "src/index.js", bin.replace(/^\.\//, "")]) {
      expect(caminhos, `${esperado} deveria ser publicado`).toContain(esperado);
    }
  });

  test("não publica testes, configurações de desenvolvimento nem arquivos sensíveis", { timeout: TEMPO }, () => {
    const { caminhos } = pacote();
    for (const caminho of caminhos) {
      expect(caminho, `${caminho} NÃO deveria ser publicado`).not.toMatch(
        /^(test\/|\.github\/|\.husky\/|node_modules\/|eslint\.config\.js|\.prettierrc|\.editorconfig|\.gitignore|package-lock\.json|\.env)/,
      );
    }
  });

  test("é pequeno (menos de 100 KB descompactado) e usa o nome e a versão do package.json", { timeout: TEMPO }, () => {
    const { entrada } = pacote();
    expect(entrada.unpackedSize).toBeLessThan(100_000);
    expect(entrada.name).toBe(lerPacote().name);
    expect(entrada.version).toBe(lerPacote().version);
  });

  test("o package-lock.json existe (o CI usa npm ci) e o lockfile acompanha o package.json", () => {
    expect(existe("package-lock.json")).toBe(true);
    const lock = JSON.parse(ler("package-lock.json"));
    expect(lock.name).toBe(lerPacote().name);
    expect(lock.version).toBe(lerPacote().version);
  });
});
