function calcularDigito(digitos) {
  const pesoInicial = digitos.length + 1;
  const soma = digitos.reduce((total, digito, indice) => total + digito * (pesoInicial - indice), 0);
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

export function validarCPF(cpf) {
  const limpo = cpf.replace(/\D/g, "");
  if (!/^\d{11}$/.test(limpo)) return false;
  if (/^(\d)\1{10}$/.test(limpo)) return false;

  const digitos = limpo.split("").map(Number);
  const primeiro = calcularDigito(digitos.slice(0, 9));
  const segundo = calcularDigito(digitos.slice(0, 10));
  return primeiro === digitos[9] && segundo === digitos[10];
}

export function formatarCPF(cpf) {
  if (!validarCPF(cpf)) throw new Error("CPF inválido");
  return cpf.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
