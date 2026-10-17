const VALORES = [200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.01];

export function calcularTroco(valorCompra, valorPago) {
  if (valorPago < valorCompra) throw new Error("Valor pago insuficiente");

  let restanteEmCentavos = Math.round(valorPago * 100) - Math.round(valorCompra * 100);
  const troco = [];

  for (const valor of VALORES) {
    const valorEmCentavos = Math.round(valor * 100);
    const quantidade = Math.floor(restanteEmCentavos / valorEmCentavos);
    if (quantidade > 0) {
      troco.push({ valor, quantidade });
      restanteEmCentavos = restanteEmCentavos % valorEmCentavos;
    }
  }
  return troco;
}
