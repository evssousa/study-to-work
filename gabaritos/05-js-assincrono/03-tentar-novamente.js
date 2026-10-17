const pausa = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function tentarNovamente(funcao, opcoes = {}) {
  const { tentativas = 3, esperaInicialMs = 100, fator = 2, tentarSe = () => true, esperar = pausa } = opcoes;

  let espera = esperaInicialMs;
  for (let tentativa = 1; ; tentativa++) {
    try {
      return await funcao(tentativa);
    } catch (erro) {
      const ultima = tentativa >= tentativas;
      if (ultima || !tentarSe(erro)) throw erro;
      await esperar(espera);
      espera *= fator;
    }
  }
}
