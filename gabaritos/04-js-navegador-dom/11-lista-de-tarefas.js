const CHAVE = "tarefas";

function carregar(storage) {
  try {
    const tarefas = JSON.parse(storage.getItem(CHAVE));
    return Array.isArray(tarefas) ? tarefas : [];
  } catch {
    return [];
  }
}

const FILTROS = {
  todas: () => true,
  pendentes: (tarefa) => !tarefa.feita,
  concluidas: (tarefa) => tarefa.feita,
};

export function iniciarTarefas(raiz, storage) {
  const documento = raiz.ownerDocument;
  const form = raiz.querySelector("#form-tarefa");
  const campo = raiz.querySelector("#nova");
  const filtros = raiz.querySelector("#filtros");
  const lista = raiz.querySelector("#lista");
  const vazio = raiz.querySelector("#vazio");
  const contador = raiz.querySelector("#contador");

  const estado = { tarefas: carregar(storage), filtro: "todas" };

  function criarItem(tarefa) {
    const li = documento.createElement("li");
    li.dataset.id = tarefa.id;
    li.classList.toggle("feita", tarefa.feita);

    const caixa = documento.createElement("input");
    caixa.type = "checkbox";
    caixa.checked = tarefa.feita;
    caixa.setAttribute("aria-label", tarefa.texto);

    const texto = documento.createElement("span");
    texto.className = "texto";
    texto.textContent = tarefa.texto;

    const remover = documento.createElement("button");
    remover.dataset.acao = "remover";
    remover.setAttribute("aria-label", `Remover "${tarefa.texto}"`);
    remover.textContent = "✕";

    li.append(caixa, texto, remover);
    return li;
  }

  function render() {
    const visiveis = estado.tarefas.filter(FILTROS[estado.filtro]);
    lista.replaceChildren(...visiveis.map(criarItem));
    vazio.hidden = visiveis.length > 0;

    const pendentes = estado.tarefas.filter(FILTROS.pendentes).length;
    contador.textContent = pendentes === 0 ? "Nenhuma pendente" : `${pendentes} ${pendentes === 1 ? "pendente" : "pendentes"}`;

    for (const botao of filtros.querySelectorAll("[data-filtro]")) {
      botao.setAttribute("aria-pressed", String(botao.dataset.filtro === estado.filtro));
    }
  }

  function mudarTarefas(tarefas) {
    estado.tarefas = tarefas;
    storage.setItem(CHAVE, JSON.stringify(tarefas));
    render();
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = campo.value.trim();
    if (texto === "") return;
    mudarTarefas([...estado.tarefas, { id: crypto.randomUUID(), texto, feita: false }]);
    campo.value = "";
    campo.focus();
  });

  lista.addEventListener("change", (evento) => {
    const id = evento.target.closest("li").dataset.id;
    mudarTarefas(estado.tarefas.map((tarefa) => (tarefa.id === id ? { ...tarefa, feita: evento.target.checked } : tarefa)));
  });

  lista.addEventListener("click", (evento) => {
    if (!evento.target.closest('[data-acao="remover"]')) return;
    const id = evento.target.closest("li").dataset.id;
    mudarTarefas(estado.tarefas.filter((tarefa) => tarefa.id !== id));
  });

  filtros.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-filtro]");
    if (!botao) return;
    estado.filtro = botao.dataset.filtro;
    render();
  });

  raiz.querySelector("#limpar").addEventListener("click", () => {
    mudarTarefas(estado.tarefas.filter(FILTROS.pendentes));
  });

  render();
}
