import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const raizDoRepositorio = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Caminho de um arquivo que fica na mesma pasta do teste.
 * Com GABARITO=1, aponta para a pasta equivalente em gabaritos/.
 */
export function caminhoAoLado(importMetaUrl, ...partes) {
  const pastaDoTeste = path.dirname(fileURLToPath(importMetaUrl));
  const caminho = path.join(pastaDoTeste, ...partes);
  if (process.env.GABARITO !== "1") return caminho;
  const separador = `${path.sep}exercicios${path.sep}`;
  return caminho.replace(separador, `${path.sep}gabaritos${path.sep}`);
}

/** Caminho de um arquivo dentro do projeto que está sendo corrigido. */
export function caminhoDoProjeto(...partes) {
  const pasta = process.env.PROJETO_DIR;
  if (!pasta) {
    throw new Error(
      "Nenhum projeto informado. Use: npm run corrigir-projeto -- <numero> <pasta-do-seu-projeto>",
    );
  }
  return path.join(pasta, ...partes);
}

export function lerTexto(caminho) {
  if (!existsSync(caminho)) {
    throw new Error(`Arquivo não encontrado: ${caminho}`);
  }
  return readFileSync(caminho, "utf8");
}

export function existe(caminho) {
  return existsSync(caminho);
}
