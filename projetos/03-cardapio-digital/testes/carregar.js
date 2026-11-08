import { resolve } from "node:path";
import { caminhoDoProjeto } from "../../../suporte/arquivos.js";

export async function carregar(arquivo) {
  const caminho = resolve(caminhoDoProjeto(arquivo));
  return import(caminho);
}
