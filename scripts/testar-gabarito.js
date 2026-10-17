// Para quem mantém o curso: roda os testes dos exercícios contra as soluções
// de gabaritos/. Se algum falhar, o teste ou o gabarito está errado.
// Uso: npm run gabarito
import { rodarVitest } from "./vitest.js";

const resultado = rodarVitest(["run", ...process.argv.slice(2)], { env: { GABARITO: "1" } });
process.exit(resultado.status ?? 1);
