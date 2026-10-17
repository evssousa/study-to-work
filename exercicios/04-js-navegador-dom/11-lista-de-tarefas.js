/**
 * Exercício 11 — Lista de tarefas completa (estado → render)
 *
 * O primeiro "aplicativo" de verdade do curso: reúne criação de elementos, eventos,
 * delegação, formulário, armazenamento e o padrão estado → render.
 *
 * `iniciarTarefas(raiz, storage)` — a `raiz` contém:
 *
 *   <form id="form-tarefa">
 *     <label for="nova">Nova tarefa</label>
 *     <input id="nova" name="texto">
 *     <button>Adicionar</button>
 *   </form>
 *   <nav id="filtros">
 *     <button data-filtro="todas" aria-pressed="true">Todas</button>
 *     <button data-filtro="pendentes" aria-pressed="false">Pendentes</button>
 *     <button data-filtro="concluidas" aria-pressed="false">Concluídas</button>
 *   </nav>
 *   <ul id="lista"></ul>
 *   <p id="vazio" hidden>Nenhuma tarefa por aqui.</p>
 *   <p id="contador"></p>
 *   <button id="limpar">Limpar concluídas</button>
 *
 * ESTADO: { tarefas: [{ id, texto, feita }], filtro: "todas" | "pendentes" | "concluidas" }
 *
 * COMPORTAMENTO
 *   Adicionar     ao enviar o formulário (preventDefault!): texto sem espaços nas pontas;
 *                 texto vazio é ignorado; nova tarefa { id: crypto.randomUUID(), texto,
 *                 feita: false } entra NO FIM; o campo é limpo e recebe o foco.
 *   Item          cada <li> da #lista tem data-id e contém:
 *                   <input type="checkbox"> (marcado se feita; aria-label = o texto)
 *                   <span class="texto">o texto</span>
 *                   <button data-acao="remover" aria-label='Remover "o texto"'>✕</button>
 *                 O <li> de uma tarefa feita tem a classe "feita".
 *   Marcar        mudar o checkbox (evento "change") alterna feita da tarefa.
 *   Remover       clicar em [data-acao="remover"] apaga a tarefa.
 *   Filtros       clicar em um botão de #filtros muda o filtro; só o botão do filtro
 *                 atual tem aria-pressed="true" (os outros "false"); a lista mostra
 *                 só as tarefas do filtro.
 *   Vazio         #vazio fica visível (hidden = false) só quando NENHUMA tarefa está
 *                 visível na lista.
 *   Contador      #contador mostra as tarefas PENDENTES (de todas, independente do filtro):
 *                 0 → "Nenhuma pendente";  1 → "1 pendente";  n → "n pendentes".
 *   Limpar        #limpar apaga todas as tarefas feitas.
 *   Persistência  a cada mudança nas tarefas, grave-as (só as tarefas, não o filtro) no
 *                 storage, na chave "tarefas", como JSON. Ao iniciar, carregue-as (JSON
 *                 inválido ou ausente = lista vazia).
 *   Segurança     o texto das tarefas NUNCA entra com innerHTML (use textContent).
 *
 * ESTRUTURA SUGERIDA
 *   const estado = { tarefas: ..., filtro: "todas" };
 *   function render() { ...desenha TUDO a partir do estado... }
 *   function mudar(parcial) { Object.assign(estado, parcial); salvar; render(); }
 *   e um listener por evento: submit no form, change e click na lista (delegação!),
 *   click em #filtros, click em #limpar.
 *
 * Aula: seção 5.2.
 * Teste: npm run exercicio -- 11-lista
 */
export function iniciarTarefas(raiz, storage) {
  // escreva seu código aqui
}
