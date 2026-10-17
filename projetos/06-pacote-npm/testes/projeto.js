import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { caminhoDoProjeto } from "../../../suporte/arquivos.js";

export const pasta = () => caminhoDoProjeto();
export const arquivo = (...partes) => caminhoDoProjeto(...partes);
export const existe = (...partes) => existsSync(arquivo(...partes));
export const ler = (...partes) => readFileSync(arquivo(...partes), "utf8");

export function lerPacote() {
  if (!existe("package.json")) throw new Error("Falta o package.json na pasta do projeto");
  return JSON.parse(ler("package.json"));
}

/** O nome do pacote sem o escopo: "@ana/clt-pj" → "clt-pj". */
export const nomeSemEscopo = (nome) => nome.replace(/^@[^/]+\//, "");

/** O caminho (relativo) do arquivo do comando, venha o `bin` como texto ou como objeto. */
export function caminhoDoBin(pacote = lerPacote()) {
  if (typeof pacote.bin === "string") return pacote.bin;
  return Object.values(pacote.bin ?? {})[0];
}

/** Variáveis de ambiente "limpas": sem as npm_* do comando que está rodando os testes do curso. */
function ambienteLimpo(extras = {}) {
  const ambiente = {};
  for (const [chave, valor] of Object.entries(process.env)) {
    if (!chave.toLowerCase().startsWith("npm_") && !["PROJETO_DIR", "GABARITO", "INIT_CWD"].includes(chave)) ambiente[chave] = valor;
  }
  return { ...ambiente, CI: "1", NO_COLOR: "1", FORCE_COLOR: "0", ...extras };
}

export function exigirDependenciasInstaladas() {
  if (!existe("node_modules")) {
    throw new Error("Falta a pasta node_modules. Rode `npm install` dentro da pasta do seu projeto e tente de novo.");
  }
}

/** Executa um comando npm (texto fixo, sem dados do usuário) dentro da pasta do projeto. */
export function npm(comando, { entrada, timeout = 120_000 } = {}) {
  const resultado = spawnSync(`npm ${comando}`, {
    cwd: pasta(),
    shell: true,
    encoding: "utf8",
    input: entrada,
    timeout,
    env: ambienteLimpo(),
  });
  const saida = `${resultado.stdout ?? ""}\n${resultado.stderr ?? ""}`;
  return { codigo: resultado.status, saida, stdout: resultado.stdout ?? "", stderr: resultado.stderr ?? "" };
}

/** Executa o ESLint do projeto lendo o código de um texto (stdin). */
export function eslintNoTexto(codigo, nomeDoArquivo = "src/amostra.js") {
  const executavel = arquivo("node_modules", "eslint", "bin", "eslint.js");
  if (!existsSync(executavel)) throw new Error("O ESLint não está instalado no projeto (npm install -D eslint)");
  const resultado = spawnSync(process.execPath, [executavel, "--stdin", "--stdin-filename", nomeDoArquivo], {
    cwd: pasta(),
    input: codigo,
    encoding: "utf8",
    env: ambienteLimpo(),
    timeout: 60_000,
  });
  return { codigo: resultado.status, saida: `${resultado.stdout}\n${resultado.stderr}` };
}

/** Executa o comando do pacote (o arquivo do bin) de OUTRA pasta, como um usuário faria. */
export function clt(...argumentos) {
  const executavel = arquivo(caminhoDoBin());
  const resultado = spawnSync(process.execPath, [executavel, ...argumentos], {
    cwd: os.tmpdir(),
    encoding: "utf8",
    env: ambienteLimpo(),
    timeout: 30_000,
  });
  return { codigo: resultado.status, stdout: resultado.stdout, stderr: resultado.stderr };
}

export function git(...argumentos) {
  if (!existe(".git")) throw new Error("A pasta do projeto não é um repositório Git. Rode `git init` nela.");
  return execFileSync("git", argumentos, { cwd: pasta(), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: ambienteLimpo() }).trim();
}

/** Importa o ponto de entrada da biblioteca, o que o campo `exports` do package.json declara. */
export async function importarBiblioteca() {
  const pacote = lerPacote();
  const entrada = typeof pacote.exports === "string" ? pacote.exports : (pacote.exports?.["."]?.import ?? pacote.exports?.["."] ?? pacote.main);
  const alvo = typeof entrada === "string" ? entrada : entrada?.default;
  if (!alvo) throw new Error('O package.json precisa de "exports": { ".": "./src/index.js" }');
  return import(pathToFileURL(path.resolve(pasta(), alvo)).href);
}
