/**
 * Exercício 20 — CSV: o formato das planilhas e dos extratos
 *
 * CSV é texto: cada linha é um registro e os campos são separados por um caractere
 * (vírgula ou ponto e vírgula). A primeira linha costuma ser o cabeçalho.
 *
 *   nome;cidade;idade
 *   Ana;Recife;28
 *   Bruno;Natal;35
 *
 * a) `csvParaObjetos(texto, separador = ",")` → array de objetos, com as chaves do cabeçalho.
 *    Todos os valores ficam como texto. Ignore linhas vazias. Funcione com quebras de linha
 *    "\n" e "\r\n" (arquivos do Windows). Tire espaços das pontas de cada campo.
 *      → [{ nome: "Ana", cidade: "Recife", idade: "28" }, ...]
 *
 * b) `objetosParaCsv(objetos, separador = ",")` → o caminho inverso: cabeçalho com as
 *    chaves do primeiro objeto e uma linha por objeto, separadas por "\n".
 *    Lista vazia → "" (texto vazio).
 *
 * Neste exercício os campos não têm o separador dentro deles. No projeto do módulo
 * você vai tratar o caso difícil: campos entre aspas.
 *
 * Aula: seção 10.4.
 * Teste: npm run exercicio -- 20-csv
 */
export function csvParaObjetos(texto, separador = ",") {
  // escreva seu código aqui
}

export function objetosParaCsv(objetos, separador = ",") {
  // escreva seu código aqui
}
