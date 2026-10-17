/**
 * Exercício 15 — Expressões regulares: validar e formatar dados brasileiros
 *
 * a) `apenasDigitos(texto)` → remove tudo que não é dígito.
 *      apenasDigitos("(81) 99999-0000") → "81999990000"
 *
 * b) `validarCEP(cep)` → true para "50000-000" ou "50000000"; false para o resto.
 *
 * c) `validarEmail(email)` → validação simples: algo@algo.algo, sem espaços.
 *      true: "ana@exemplo.com", "ana.souza+loja@mail.com.br"
 *      false: "ana@", "ana exemplo.com", "@exemplo.com", "ana@exemplo"
 *
 * d) `formatarTelefone(telefone)` → aceita o número com ou sem máscara e devolve formatado:
 *      11 dígitos (celular) → "(81) 99999-0000"
 *      10 dígitos (fixo)    → "(81) 3333-0000"
 *      outro tamanho        → throw new Error("Telefone inválido")
 *    Use apenasDigitos e depois replace com GRUPOS de captura: /(\d{2})(\d{5})(\d{4})/
 *
 * e) `extrairHashtags(texto)` → array com as hashtags, sem o #, em minúsculas e sem repetir.
 *      extrairHashtags("Amo #JS e #Node. #js") → ["js", "node"]
 *
 * Aula: seção 8.
 * Teste: npm run exercicio -- 15-regex
 */
export function apenasDigitos(texto) {
  // escreva seu código aqui
}

export function validarCEP(cep) {
  // escreva seu código aqui
}

export function validarEmail(email) {
  // escreva seu código aqui
}

export function formatarTelefone(telefone) {
  // escreva seu código aqui
}

export function extrairHashtags(texto) {
  // escreva seu código aqui
}
