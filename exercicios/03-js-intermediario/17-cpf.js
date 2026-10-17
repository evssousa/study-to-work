/**
 * Exercício 17 — Validação de CPF (de verdade)
 *
 * Todo sistema brasileiro com cadastro valida CPF. Os dois últimos dígitos são
 * "dígitos verificadores", calculados a partir dos 9 primeiros:
 *
 * 1º dígito verificador:
 *   - multiplique os 9 primeiros dígitos por 10, 9, 8, ..., 2 e some tudo;
 *   - resto = (soma × 10) % 11; se o resto for 10, use 0;
 *   - o resultado deve ser igual ao 10º dígito.
 * 2º dígito verificador:
 *   - multiplique os 10 primeiros dígitos por 11, 10, 9, ..., 2 e some tudo;
 *   - mesma regra do resto; deve ser igual ao 11º dígito.
 *
 * CPFs com todos os dígitos iguais (111.111.111-11) passam na conta, mas são inválidos.
 *
 * a) `validarCPF(cpf)` → true ou false. Aceita com ou sem máscara ("529.982.247-25" ou "52998224725").
 *    Qualquer coisa que não tenha 11 dígitos depois de limpar é inválida.
 * b) `formatarCPF(cpf)` → "529.982.247-25". Se o CPF for inválido: throw new Error("CPF inválido").
 *
 * Dica: crie uma função auxiliar (não precisa exportar) para calcular um dígito verificador
 * a partir de uma lista de dígitos. As duas etapas usam a mesma lógica.
 *
 * Aula: seção 8 (e métodos de array da seção 2).
 * Teste: npm run exercicio -- 17-cpf
 */
export function validarCPF(cpf) {
  // escreva seu código aqui
}

export function formatarCPF(cpf) {
  // escreva seu código aqui
}
