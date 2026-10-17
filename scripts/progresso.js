// Mostra quantos exercícios de cada módulo já estão passando nos testes.
// Uso: npm run progresso
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { rodarVitest } from "./vitest.js";

const pastaTemporaria = mkdtempSync(path.join(os.tmpdir(), "progresso-"));
const arquivoDeResultado = path.join(pastaTemporaria, "resultado.json");

console.log("Rodando todos os testes de exercícios, aguarde...\n");
rodarVitest(["run", "--reporter=json", `--outputFile=${arquivoDeResultado}`], { silencioso: true });

let resultado;
try {
  resultado = JSON.parse(readFileSync(arquivoDeResultado, "utf8"));
} catch {
  console.error("Não foi possível ler o resultado dos testes. Rode `npm test` para ver o erro.");
  process.exit(1);
} finally {
  rmSync(pastaTemporaria, { recursive: true, force: true });
}

const modulos = new Map();
for (const arquivo of resultado.testResults) {
  const relativo = arquivo.name.replaceAll("\\", "/").split("/exercicios/")[1];
  if (!relativo) continue;
  // Exercício pode ser um arquivo (01-celsius.test.js) ou uma pasta (01-estrutura/correcao.test.js).
  const [modulo, primeiraParte] = relativo.split("/");
  const exercicio = primeiraParte.replace(/\.test\.js$/, "");
  // Um arquivo com erro de sintaxe tem status "failed" e nenhum teste, então olhamos o status do arquivo.
  const passou = arquivo.status === "passed";
  if (!modulos.has(modulo)) modulos.set(modulo, []);
  const lista = modulos.get(modulo);
  const existente = lista.find((e) => e.exercicio === exercicio);
  if (existente) existente.passou &&= passou;
  else lista.push({ exercicio, passou });
}

let totalFeitos = 0;
let total = 0;
for (const [modulo, exercicios] of [...modulos].sort()) {
  exercicios.sort((a, b) => a.exercicio.localeCompare(b.exercicio));
  const feitos = exercicios.filter((e) => e.passou).length;
  totalFeitos += feitos;
  total += exercicios.length;
  const tamanho = 20;
  const cheio = Math.round((feitos / exercicios.length) * tamanho);
  const barra = "█".repeat(cheio) + "░".repeat(tamanho - cheio);
  const marca = feitos === exercicios.length ? " ✔ completo" : "";
  console.log(`${modulo.padEnd(28)} ${barra} ${feitos}/${exercicios.length}${marca}`);
  const pendentes = exercicios.filter((e) => !e.passou).map((e) => e.exercicio);
  if (pendentes.length > 0 && pendentes.length < exercicios.length) {
    console.log(`${"".padEnd(28)} pendentes: ${pendentes.join(", ")}`);
  }
}

console.log(`\nTotal: ${totalFeitos}/${total} exercícios concluídos.`);
console.log("Para ver o detalhe de um exercício: npm run exercicio -- <parte-do-nome>");
