export function ativarContador(raiz) {
  let valor = 0;
  const saida = raiz.querySelector(".valor");
  const menos = raiz.querySelector('[data-acao="menos"]');

  function atualizar() {
    saida.textContent = String(valor);
    menos.disabled = valor === 0;
  }

  raiz.querySelector('[data-acao="mais"]').addEventListener("click", () => {
    valor++;
    atualizar();
  });
  menos.addEventListener("click", () => {
    valor = Math.max(0, valor - 1);
    atualizar();
  });
  raiz.querySelector('[data-acao="zerar"]').addEventListener("click", () => {
    valor = 0;
    atualizar();
  });

  atualizar();
}

export function ativarLimiteDeCaracteres(campo, saida, limite) {
  function atualizar() {
    const restantes = limite - campo.value.length;
    saida.textContent = `${restantes} restantes`;
    saida.classList.toggle("excedido", restantes < 0);
  }
  campo.addEventListener("input", atualizar);
  atualizar();
}
