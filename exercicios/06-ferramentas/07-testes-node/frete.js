// NÃO ALTERE ESTE ARQUIVO. Ele é o código que você vai testar no exercício 07.
//
// Regras de negócio do frete de uma loja:
//   - o peso (em kg) precisa ser maior que zero;
//   - o CEP precisa ter 8 dígitos (pode vir com ou sem hífen);
//   - peso acima de 30 kg não é entregue;
//   - o preço depende da faixa de peso: até 1 kg = R$ 15, até 5 kg = R$ 25, até 30 kg = R$ 60;
//   - CEPs que começam com 6, 7, 8 ou 9 (regiões mais distantes) pagam 20% a mais;
//   - pedidos de R$ 200 ou mais têm frete grátis.

const TABELA = [
  { ate: 1, preco: 15 },
  { ate: 5, preco: 25 },
  { ate: 30, preco: 60 },
];

const PRIMEIROS_DIGITOS_DISTANTES = ["6", "7", "8", "9"];

export function calcularFrete({ pesoKg, cep, valorDoPedido }) {
  if (!(pesoKg > 0)) throw new Error("Peso inválido");

  const digitos = String(cep).replace(/\D/g, "");
  if (!/^\d{8}$/.test(digitos)) throw new Error("CEP inválido");

  const faixa = TABELA.find((f) => pesoKg <= f.ate);
  if (!faixa) throw new Error("Peso acima do limite");

  if (valorDoPedido >= 200) return 0;

  const distante = PRIMEIROS_DIGITOS_DISTANTES.includes(digitos[0]);
  return distante ? Math.round(faixa.preco * 1.2 * 100) / 100 : faixa.preco;
}
