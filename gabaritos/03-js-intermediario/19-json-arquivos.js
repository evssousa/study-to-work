import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export function salvarJson(caminho, dados) {
  mkdirSync(path.dirname(caminho), { recursive: true });
  writeFileSync(caminho, `${JSON.stringify(dados, null, 2)}\n`);
}

export function carregarJson(caminho, valorPadrao) {
  if (!existsSync(caminho)) return valorPadrao;
  try {
    return JSON.parse(readFileSync(caminho, "utf8"));
  } catch {
    throw new Error(`Arquivo JSON inválido: ${caminho}`);
  }
}

export function adicionarTarefa(caminho, titulo) {
  const tarefas = carregarJson(caminho, []);
  const id = tarefas.reduce((maior, tarefa) => Math.max(maior, tarefa.id), 0) + 1;
  const tarefa = { id, titulo, feita: false };
  salvarJson(caminho, [...tarefas, tarefa]);
  return tarefa;
}

export function concluirTarefa(caminho, id) {
  const tarefas = carregarJson(caminho, []);
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) throw new Error("Tarefa não encontrada");
  const concluida = { ...tarefa, feita: true };
  salvarJson(
    caminho,
    tarefas.map((t) => (t.id === id ? concluida : t)),
  );
  return concluida;
}
