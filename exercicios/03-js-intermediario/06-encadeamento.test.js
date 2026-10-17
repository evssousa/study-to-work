import { describe, expect, test } from "vitest";
import { clientesQueCompraram, faturamento, itensVendidos, ticketMedio, totalDoPedido } from "./06-encadeamento.js";

const pedidos = [
  { id: 1, cliente: "Carla", status: "pago", itens: [{ produto: "Café", preco: 25, quantidade: 2 }] },
  {
    id: 2,
    cliente: "Ana",
    status: "pago",
    itens: [
      { produto: "Pão", preco: 1, quantidade: 10 },
      { produto: "Leite", preco: 6, quantidade: 1 },
    ],
  },
  { id: 3, cliente: "Bruno", status: "cancelado", itens: [{ produto: "Bolo", preco: 40, quantidade: 1 }] },
  { id: 4, cliente: "Carla", status: "pago", itens: [{ produto: "Café", preco: 25, quantidade: 1 }] },
  { id: 5, cliente: "Diego", status: "pendente", itens: [{ produto: "Suco", preco: 8, quantidade: 3 }] },
];

describe("relatório de pedidos", () => {
  test("totalDoPedido", () => {
    expect(totalDoPedido(pedidos[1])).toBe(16);
  });

  test("faturamento: só pedidos pagos", () => {
    expect(faturamento(pedidos)).toBe(91);
  });

  test("ticketMedio: faturamento dividido pelos pedidos pagos", () => {
    expect(ticketMedio(pedidos)).toBe(30.33);
  });

  test("ticketMedio: sem pedidos pagos é 0", () => {
    expect(ticketMedio([pedidos[2]])).toBe(0);
  });

  test("clientesQueCompraram: sem repetição e em ordem alfabética", () => {
    expect(clientesQueCompraram(pedidos)).toEqual(["Ana", "Carla"]);
  });

  test("itensVendidos: todos os itens dos pedidos pagos", () => {
    expect(itensVendidos(pedidos)).toEqual(["2x Café", "10x Pão", "1x Leite", "1x Café"]);
  });
});
