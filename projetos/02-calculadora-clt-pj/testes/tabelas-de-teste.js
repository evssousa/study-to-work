// Tabelas FICTÍCIAS, usadas só nos testes. Os números são redondos de propósito,
// para que você consiga conferir as contas à mão. As tabelas reais do seu projeto
// ficam em src/tabelas.js e devem vir das fontes oficiais.
export const tabelasDeTeste = {
  inss: {
    faixas: [
      { ate: 1500, aliquota: 0.075 },
      { ate: 3000, aliquota: 0.09 },
      { ate: 4500, aliquota: 0.12 },
      { ate: 8000, aliquota: 0.14 },
    ],
  },
  irrf: {
    faixas: [
      { ate: 2400, aliquota: 0, deducao: 0 },
      { ate: 2800, aliquota: 0.075, deducao: 180 },
      { ate: 3700, aliquota: 0.15, deducao: 390 },
      { ate: 4600, aliquota: 0.225, deducao: 667.5 },
      { ate: Infinity, aliquota: 0.275, deducao: 897.5 },
    ],
    deducaoPorDependente: 190,
    descontoSimplificado: 600,
    reducao: { isencaoTotalAte: 5000, reducaoAte: 7000, constante: 950, fator: 0.13 },
  },
  fgts: 0.08,
};

export const irrfSemReducao = { ...tabelasDeTeste.irrf, reducao: null };
