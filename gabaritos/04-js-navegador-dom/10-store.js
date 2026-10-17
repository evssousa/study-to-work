export function criarStore(estadoInicial) {
  let estado = estadoInicial;
  const ouvintes = [];

  return {
    obterEstado: () => estado,

    atualizar(mudanca) {
      const parte = typeof mudanca === "function" ? mudanca(estado) : mudanca;
      estado = { ...estado, ...parte };
      ouvintes.forEach((ouvinte) => ouvinte(estado));
      return estado;
    },

    assinar(ouvinte) {
      ouvintes.push(ouvinte);
      return () => {
        const posicao = ouvintes.indexOf(ouvinte);
        if (posicao !== -1) ouvintes.splice(posicao, 1);
      };
    },
  };
}
