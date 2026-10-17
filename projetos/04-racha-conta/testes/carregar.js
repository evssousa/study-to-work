import { pathToFileURL } from "node:url";
import { caminhoDoProjeto } from "../../../suporte/arquivos.js";

/** Importa um arquivo de src/ do projeto do aluno. */
export function importarDoProjeto(arquivo) {
  return import(pathToFileURL(caminhoDoProjeto("src", arquivo)).href);
}

/** Congela um objeto e tudo dentro dele: qualquer alteração vira erro. */
export function congelar(valor) {
  if (valor && typeof valor === "object") {
    Object.values(valor).forEach(congelar);
    Object.freeze(valor);
  }
  return valor;
}

/** Monta um racha de teste com três participantes (Ana, Bruno, Carla) e as despesas dadas. */
export function rachaDeTeste(despesas = [], nome = "Churrasco") {
  return {
    id: "r1",
    nome,
    participantes: [
      { id: "a", nome: "Ana" },
      { id: "b", nome: "Bruno" },
      { id: "c", nome: "Carla" },
    ],
    despesas,
  };
}

export const despesa = (id, valorCentavos, pagadorId, participantesIds, descricao = id) => ({
  id,
  descricao,
  valorCentavos,
  pagadorId,
  participantesIds,
});
