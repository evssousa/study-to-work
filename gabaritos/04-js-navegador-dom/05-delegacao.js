export function ativarLista(ul) {
  ul.addEventListener("click", (evento) => {
    const item = evento.target.closest("li");
    if (!item || !ul.contains(item)) return;

    if (evento.target.closest('[data-acao="remover"]')) {
      item.remove();
    } else {
      item.classList.toggle("feita");
    }
  });
}
