import { pathToFileURL } from "node:url";
import { caminhoDoProjeto } from "../../../suporte/arquivos.js";

/** Importa um arquivo de src/ do projeto do aluno. */
export function importarDoProjeto(arquivo) {
  return import(pathToFileURL(caminhoDoProjeto("src", arquivo)).href);
}

export const semEspacoEspecial = (texto) => texto.replace(/ /g, " ");

export const reais = (centavos) =>
  semEspacoEspecial((centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
