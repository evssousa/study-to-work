/**
 * Exercício 02 — Um "linter" de package.json (o pacote está pronto para ser publicado?)
 *
 * Antes de publicar no npm, vale conferir se o package.json está completo. Neste exercício
 * você escreve a função que faz essa conferência (ferramentas reais, como o publint, fazem
 * algo parecido).
 *
 * `validarPacote(pacote, arquivosExistentes = [])`
 *    pacote              o package.json já convertido em objeto (JSON.parse)
 *    arquivosExistentes  lista dos caminhos de arquivo que existem no projeto
 *                        (ex.: ["src/cli.js", "README.md"]), para conferir o `bin`
 *
 * Retorna um ARRAY com as mensagens dos problemas, NESTA ordem (array vazio = tudo certo).
 * Cada regra produz no máximo uma mensagem:
 *
 *  1. name ausente ou vazio                          "Falta o campo name"
 *     name fora do padrão do npm (só minúsculas, números, - . _ ~; pode ter escopo
 *     "@usuario/nome"; no máximo 214 caracteres)     `Nome inválido: ${name}`
 *       válidos: "clt-pj", "@ana/clt-pj", "a.b_c~d"      inválidos: "CLT", "meu pacote", "@ana/", ".oculto"
 *       Use esta expressão regular:  /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
 *  2. version ausente                                "Falta o campo version"
 *     version que não seja MAIOR.MENOR.PATCH         `Versão inválida: ${version}`
 *       (aceite o pré-lançamento: "1.0.0-beta.1")
 *  3. description ausente ou vazia                   "Falta o campo description"
 *  4. license ausente                                "Falta o campo license"
 *  5. type diferente de "module"                     'Use "type": "module"'
 *  6. repository ausente                             "Falta o campo repository"
 *  7. bin: para cada arquivo apontado pelo bin que NÃO esteja em arquivosExistentes
 *     (bin pode ser um texto ou um objeto { comando: arquivo }; mensagens na ordem do objeto)
 *                                                    `O arquivo do bin não existe: ${arquivo}`
 *  8. files ausente (ou vazio)                       "Defina files para controlar o que é publicado"
 *  9. scripts.test ausente                           "Falta o script test"
 *     scripts.test que ainda seja o padrão do `npm init` (contém "no test specified")
 *                                                    "O script test ainda é o padrão do npm init"
 * 10. engines.node ausente                           "Defina engines.node"
 * 11. private: true                                  "O pacote está marcado como private e não pode ser publicado"
 * 12. dependencies / devDependencies cujo valor seja "*", "latest" ou "" (qualquer versão):
 *     UMA mensagem por dependência, ordenadas pelo nome, dependencies antes de devDependencies
 *                                                    `Dependência sem versão definida: ${nome}`
 *
 * Aula: seção 2.6.
 * Teste: npm run exercicio -- 02-package-json
 */
export function validarPacote(pacote, arquivosExistentes = []) {
  // escreva seu código aqui
}
