// Roda os testes de correção de um projeto de portfólio contra a pasta do seu projeto.
// Uso: npm run corrigir-projeto -- <numero-do-projeto> <pasta-do-seu-projeto>
// Exemplo: npm run corrigir-projeto -- 02 ../calculadora-clt-pj
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { raizDoRepositorio } from "../suporte/arquivos.js";
import { rodarVitest } from "./vitest.js";

const [numero, pastaInformada, ...extras] = process.argv.slice(2);
const pastaDeProjetos = path.join(raizDoRepositorio, "projetos");
const projetos = readdirSync(pastaDeProjetos).filter((nome) => /^\d{2}-/.test(nome));

if (!numero || !pastaInformada) {
  console.log("Uso: npm run corrigir-projeto -- <numero> <pasta-do-seu-projeto>\n");
  console.log("Projetos disponíveis:");
  for (const nome of projetos) console.log(`  ${nome}`);
  process.exit(1);
}

const projeto = projetos.find((nome) => nome.startsWith(numero.padStart(2, "0")));
if (!projeto) {
  console.error(`Projeto "${numero}" não existe. Disponíveis: ${projetos.join(", ")}`);
  process.exit(1);
}

const pastaDoAluno = path.resolve(process.cwd(), pastaInformada);
if (!existsSync(pastaDoAluno)) {
  console.error(`A pasta ${pastaDoAluno} não existe.`);
  process.exit(1);
}

console.log(`Corrigindo ${projeto}\nProjeto do aluno: ${pastaDoAluno}\n`);
const resultado = rodarVitest(["run", `projetos/${projeto}/`, ...extras], {
  env: { PROJETO_DIR: pastaDoAluno },
});
process.exit(resultado.status ?? 1);
