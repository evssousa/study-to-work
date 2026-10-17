export function ativarAcordeao(raiz) {
  const botoes = [...raiz.querySelectorAll(".acordeao__botao")];

  function painelDe(botao) {
    return raiz.querySelector(`#${botao.getAttribute("aria-controls")}`);
  }

  function definirAberto(botao, aberto) {
    botao.setAttribute("aria-expanded", String(aberto));
    painelDe(botao).hidden = !aberto;
  }

  const primeiroAberto = botoes.find((botao) => botao.getAttribute("aria-expanded") === "true");
  botoes.forEach((botao) => definirAberto(botao, botao === primeiroAberto));

  raiz.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".acordeao__botao");
    if (!botao) return;
    const abrir = botao.getAttribute("aria-expanded") !== "true";
    botoes.forEach((outro) => definirAberto(outro, abrir && outro === botao));
  });

  raiz.addEventListener("keydown", (evento) => {
    const atual = evento.target.closest(".acordeao__botao");
    if (!atual) return;
    const posicao = botoes.indexOf(atual);
    const destinos = {
      ArrowDown: (posicao + 1) % botoes.length,
      ArrowUp: (posicao - 1 + botoes.length) % botoes.length,
      Home: 0,
      End: botoes.length - 1,
    };
    if (!(evento.key in destinos)) return;
    evento.preventDefault();
    botoes[destinos[evento.key]].focus();
  });
}
