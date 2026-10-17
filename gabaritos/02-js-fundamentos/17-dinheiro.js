function arredondarCentavos(valor) {
  return Math.round(valor * 100) / 100;
}

export function somarPrecos(precos) {
  let totalEmCentavos = 0;
  for (const preco of precos) {
    totalEmCentavos += Math.round(preco * 100);
  }
  return totalEmCentavos / 100;
}

export function formatarReais(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function aplicarDesconto(valor, percentual) {
  if (percentual < 0 || percentual > 100) {
    throw new Error("Percentual de desconto inválido");
  }
  return arredondarCentavos(valor - (valor * percentual) / 100);
}
