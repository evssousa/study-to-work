import { spawnSync } from "node:child_process";
import path from "node:path";
import { raizDoRepositorio } from "../suporte/arquivos.js";

const binarioDoVitest = path.join(raizDoRepositorio, "node_modules", "vitest", "vitest.mjs");

/** Roda o Vitest com os argumentos e variáveis de ambiente informados. */
export function rodarVitest(argumentos, { env = {}, silencioso = false } = {}) {
  return spawnSync(process.execPath, [binarioDoVitest, ...argumentos], {
    cwd: raizDoRepositorio,
    env: { ...process.env, ...env },
    stdio: silencioso ? "ignore" : "inherit",
  });
}
