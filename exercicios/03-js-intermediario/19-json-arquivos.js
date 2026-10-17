/**
 * Exercício 19 — JSON e arquivos: uma lista de tarefas que não se perde
 *
 * Use o módulo node:fs (readFileSync, writeFileSync, existsSync, mkdirSync) e node:path.
 *
 * a) `salvarJson(caminho, dados)` → grava os dados como JSON formatado (2 espaços de
 *    indentação). Se a pasta não existir, cria (mkdirSync com { recursive: true }).
 *
 * b) `carregarJson(caminho, valorPadrao)` →
 *      - arquivo não existe → retorna valorPadrao
 *      - arquivo existe     → retorna os dados lidos
 *      - JSON inválido      → throw new Error(`Arquivo JSON inválido: ${caminho}`)
 *
 * c) `adicionarTarefa(caminho, titulo)` → carrega a lista (padrão []), acrescenta
 *    { id, titulo, feita: false } com id = maior id existente + 1 (ou 1 na lista vazia),
 *    salva e retorna a tarefa criada.
 *
 * d) `concluirTarefa(caminho, id)` → marca a tarefa como feita: true, salva e retorna a
 *    tarefa. Se não existir: throw new Error("Tarefa não encontrada").
 *
 * Aula: seção 10.
 * Teste: npm run exercicio -- 19-json
 */
export function salvarJson(caminho, dados) {
  // escreva seu código aqui
}

export function carregarJson(caminho, valorPadrao) {
  // escreva seu código aqui
}

export function adicionarTarefa(caminho, titulo) {
  // escreva seu código aqui
}

export function concluirTarefa(caminho, id) {
  // escreva seu código aqui
}
