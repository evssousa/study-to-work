export class Conta {
  static #total = 0;
  #titular;
  #saldo = 0;
  #extrato = [];

  constructor(titular) {
    this.#titular = titular;
    Conta.#total++;
  }

  static get totalDeContas() {
    return Conta.#total;
  }

  get titular() {
    return this.#titular;
  }

  get saldo() {
    return this.#saldo;
  }

  get extrato() {
    return this.#extrato.map((operacao) => ({ ...operacao }));
  }

  get tipo() {
    return "Conta";
  }

  _podeSacar(valorCentavos) {
    return this.#saldo - valorCentavos >= 0;
  }

  depositar(valorCentavos) {
    if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) throw new Error("Valor inválido");
    this.#saldo += valorCentavos;
    this.#extrato.push({ tipo: "deposito", valorCentavos });
    return this;
  }

  sacar(valorCentavos) {
    if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) throw new Error("Valor inválido");
    if (!this._podeSacar(valorCentavos)) throw new Error("Saldo insuficiente");
    this.#saldo -= valorCentavos;
    this.#extrato.push({ tipo: "saque", valorCentavos });
    return this;
  }

  descrever() {
    return `${this.tipo} de ${this.titular}: saldo de ${this.saldo} centavos`;
  }
}

export class ContaPoupanca extends Conta {
  #taxaMensal;

  constructor(titular, taxaMensal) {
    super(titular);
    this.#taxaMensal = taxaMensal;
  }

  get tipo() {
    return "Poupança";
  }

  renderJuros() {
    const juros = Math.round(this.saldo * this.#taxaMensal);
    if (juros > 0) this.depositar(juros);
    return this;
  }
}

export class ContaCorrente extends Conta {
  #limiteCentavos;

  constructor(titular, limiteCentavos) {
    super(titular);
    this.#limiteCentavos = limiteCentavos;
  }

  get tipo() {
    return "Conta corrente";
  }

  _podeSacar(valorCentavos) {
    return this.saldo - valorCentavos >= -this.#limiteCentavos;
  }
}

export function sacarDeTodas(contas, valorCentavos) {
  return contas.map((conta) => {
    try {
      conta.sacar(valorCentavos);
      return `${conta.titular} (${conta.tipo}): ok`;
    } catch (erro) {
      return `${conta.titular} (${conta.tipo}): ${erro.message}`;
    }
  });
}

export class Banco {
  #contas = [];

  abrir(conta) {
    this.#contas.push(conta);
    return conta;
  }

  get contas() {
    return [...this.#contas];
  }

  get patrimonioCentavos() {
    return this.#contas.reduce((soma, conta) => soma + conta.saldo, 0);
  }

  buscarPorTitular(nome) {
    return this.#contas.filter((conta) => conta.titular === nome);
  }
}
