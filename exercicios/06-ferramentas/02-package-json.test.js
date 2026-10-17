import { describe, expect, test } from "vitest";
import { validarPacote } from "./02-package-json.js";

const pacoteBom = () => ({
  name: "@ana/clt-pj",
  version: "1.2.0",
  description: "Compara propostas CLT e PJ pelo terminal",
  license: "MIT",
  type: "module",
  repository: { type: "git", url: "git+https://github.com/ana/clt-pj.git" },
  bin: { "clt-pj": "src/cli.js" },
  files: ["src"],
  scripts: { test: "node --test", lint: "eslint ." },
  engines: { node: ">=20" },
  dependencies: { "date-fns": "^4.1.0" },
  devDependencies: { eslint: "^10.0.0" },
});
const arquivos = ["src/cli.js", "README.md"];

const sem = (campo) => {
  const pacote = pacoteBom();
  delete pacote[campo];
  return pacote;
};

describe("validarPacote", () => {
  test("um pacote completo não tem problemas", () => {
    expect(validarPacote(pacoteBom(), arquivos)).toEqual([]);
  });

  test("o segundo argumento é opcional", () => {
    const pacote = pacoteBom();
    delete pacote.bin;
    expect(validarPacote(pacote)).toEqual([]);
  });

  test("name", () => {
    expect(validarPacote(sem("name"), arquivos)).toEqual(["Falta o campo name"]);
    expect(validarPacote({ ...pacoteBom(), name: "" }, arquivos)).toEqual(["Falta o campo name"]);
    for (const invalido of ["CLT", "meu pacote", "@ana/", "@ana", "Ana/clt", ".oculto", "_x"]) {
      expect(validarPacote({ ...pacoteBom(), name: invalido }, arquivos), invalido).toEqual([`Nome inválido: ${invalido}`]);
    }
    for (const valido of ["clt-pj", "@ana/clt-pj", "a.b_c~d", "x"]) {
      expect(validarPacote({ ...pacoteBom(), name: valido }, arquivos), valido).toEqual([]);
    }
    expect(validarPacote({ ...pacoteBom(), name: "a".repeat(215) }, arquivos)).toHaveLength(1);
  });

  test("version", () => {
    expect(validarPacote(sem("version"), arquivos)).toEqual(["Falta o campo version"]);
    expect(validarPacote({ ...pacoteBom(), version: "1.2" }, arquivos)).toEqual(["Versão inválida: 1.2"]);
    expect(validarPacote({ ...pacoteBom(), version: "latest" }, arquivos)).toEqual(["Versão inválida: latest"]);
    expect(validarPacote({ ...pacoteBom(), version: "1.0.0-beta.1" }, arquivos)).toEqual([]);
  });

  test("description, license, repository", () => {
    expect(validarPacote(sem("description"), arquivos)).toEqual(["Falta o campo description"]);
    expect(validarPacote({ ...pacoteBom(), description: "   " }, arquivos)).toEqual(["Falta o campo description"]);
    expect(validarPacote(sem("license"), arquivos)).toEqual(["Falta o campo license"]);
    expect(validarPacote(sem("repository"), arquivos)).toEqual(["Falta o campo repository"]);
  });

  test("type", () => {
    expect(validarPacote({ ...pacoteBom(), type: "commonjs" }, arquivos)).toEqual(['Use "type": "module"']);
    expect(validarPacote(sem("type"), arquivos)).toEqual(['Use "type": "module"']);
  });

  test("bin: texto ou objeto, e o arquivo precisa existir", () => {
    expect(validarPacote({ ...pacoteBom(), bin: "src/cli.js" }, arquivos)).toEqual([]);
    expect(validarPacote({ ...pacoteBom(), bin: "src/sumiu.js" }, arquivos)).toEqual(["O arquivo do bin não existe: src/sumiu.js"]);
    expect(validarPacote({ ...pacoteBom(), bin: { a: "src/cli.js", b: "bin/b.js", c: "bin/c.js" } }, arquivos)).toEqual([
      "O arquivo do bin não existe: bin/b.js",
      "O arquivo do bin não existe: bin/c.js",
    ]);
  });

  test("files", () => {
    expect(validarPacote(sem("files"), arquivos)).toEqual(["Defina files para controlar o que é publicado"]);
    expect(validarPacote({ ...pacoteBom(), files: [] }, arquivos)).toEqual(["Defina files para controlar o que é publicado"]);
  });

  test("scripts.test", () => {
    const semTeste = pacoteBom();
    delete semTeste.scripts.test;
    expect(validarPacote(semTeste, arquivos)).toEqual(["Falta o script test"]);
    expect(validarPacote({ ...pacoteBom(), scripts: {} }, arquivos)).toEqual(["Falta o script test"]);
    expect(validarPacote(sem("scripts"), arquivos)).toEqual(["Falta o script test"]);
    const padrao = { ...pacoteBom(), scripts: { test: 'echo "Error: no test specified" && exit 1' } };
    expect(validarPacote(padrao, arquivos)).toEqual(["O script test ainda é o padrão do npm init"]);
  });

  test("engines.node", () => {
    expect(validarPacote(sem("engines"), arquivos)).toEqual(["Defina engines.node"]);
    expect(validarPacote({ ...pacoteBom(), engines: {} }, arquivos)).toEqual(["Defina engines.node"]);
  });

  test("private", () => {
    expect(validarPacote({ ...pacoteBom(), private: true }, arquivos)).toEqual([
      "O pacote está marcado como private e não pode ser publicado",
    ]);
    expect(validarPacote({ ...pacoteBom(), private: false }, arquivos)).toEqual([]);
  });

  test("dependências sem versão definida, em ordem", () => {
    const pacote = {
      ...pacoteBom(),
      dependencies: { zeta: "*", alfa: "latest", ok: "^1.0.0" },
      devDependencies: { beta: "", gama: "~2.0.0", delta: "*" },
    };
    expect(validarPacote(pacote, arquivos)).toEqual([
      "Dependência sem versão definida: alfa",
      "Dependência sem versão definida: zeta",
      "Dependência sem versão definida: beta",
      "Dependência sem versão definida: delta",
    ]);
  });

  test("vários problemas aparecem juntos, na ordem das regras", () => {
    const horrivel = { name: "Meu Pacote", private: true, scripts: { test: 'echo "no test specified"' }, dependencies: { x: "*" } };
    expect(validarPacote(horrivel, [])).toEqual([
      "Nome inválido: Meu Pacote",
      "Falta o campo version",
      "Falta o campo description",
      "Falta o campo license",
      'Use "type": "module"',
      "Falta o campo repository",
      "Defina files para controlar o que é publicado",
      "O script test ainda é o padrão do npm init",
      "Defina engines.node",
      "O pacote está marcado como private e não pode ser publicado",
      "Dependência sem versão definida: x",
    ]);
  });
});
