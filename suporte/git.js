import { execFileSync } from "node:child_process";
import { raizDoRepositorio } from "./arquivos.js";

/** Executa um comando git na raiz do repositório. Retorna null se falhar. */
export function git(...argumentos) {
  try {
    return execFileSync("git", argumentos, {
      cwd: raizDoRepositorio,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

export const padraoConventionalCommit =
  /^(feat|fix|docs|style|refactor|test|chore|build|ci|perf)(\([\w\-./]+\))?!?: .{3,}/;
