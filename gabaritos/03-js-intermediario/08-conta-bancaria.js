export function criarConta(titular) {
  return {
    titular,
    saldo: 0,
    historico: [],

    depositar(valor) {
      if (valor <= 0) throw new Error("Valor inválido");
      this.saldo += valor;
      this.historico.push({ tipo: "deposito", valor });
      return this;
    },

    sacar(valor) {
      if (valor <= 0) throw new Error("Valor inválido");
      if (valor > this.saldo) throw new Error("Saldo insuficiente");
      this.saldo -= valor;
      this.historico.push({ tipo: "saque", valor });
      return this;
    },

    resumo() {
      return `${this.titular}: saldo de ${this.saldo} em ${this.historico.length} operações`;
    },
  };
}
