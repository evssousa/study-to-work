export class ValidacaoError extends Error {
  constructor(campo, mensagem) {
    super(mensagem);
    this.name = "ValidacaoError";
    this.campo = campo;
  }
}

export class SaldoInsuficienteError extends Error {
  constructor(saldo, valor) {
    super(`Saldo de ${saldo} insuficiente para sacar ${valor}`);
    this.name = "SaldoInsuficienteError";
    this.saldo = saldo;
    this.valor = valor;
  }
}

export function sacar(saldo, valor) {
  if (typeof valor !== "number" || valor <= 0) {
    throw new ValidacaoError("valor", "O valor deve ser um número positivo");
  }
  if (valor > saldo) throw new SaldoInsuficienteError(saldo, valor);
  return saldo - valor;
}

export function tentarSacar(saldo, valor, operacao = sacar) {
  try {
    return { ok: true, saldo: operacao(saldo, valor) };
  } catch (erro) {
    if (erro instanceof ValidacaoError || erro instanceof SaldoInsuficienteError) {
      return { ok: false, erro: erro.message };
    }
    throw erro;
  }
}

export function comRegistro(funcao, registro) {
  registro.push("início");
  try {
    return funcao();
  } finally {
    registro.push("fim");
  }
}
