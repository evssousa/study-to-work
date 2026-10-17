/**
 * Exercício 08 — Máscaras de entrada
 *
 * Uma máscara formata o texto ENQUANTO a pessoa digita. Todas as funções abaixo
 * aceitam qualquer texto (inclusive já formatado) e começam removendo o que não é dígito.
 *
 * a) `mascararTelefone(texto)` — no máximo 11 dígitos; o resto é descartado.
 *      ""            → ""
 *      "8"           → "(8"
 *      "81"          → "(81"
 *      "819"         → "(81) 9"
 *      "81999"       → "(81) 999"
 *      "8133330000"  → "(81) 3333-0000"      (10 dígitos: fixo, 4+4)
 *      "81999990000" → "(81) 99999-0000"     (11 dígitos: celular, 5+4)
 *      "(81) 9999-9" → "(81) 9999-9"        (7 dígitos: o hífen aparece depois do 6º dígito)
 *    Regra do hífen: até 10 dígitos o bloco do meio tem 4 dígitos (posições 2 a 5);
 *    com 11 dígitos o bloco do meio tem 5 (posições 2 a 6).
 *
 * b) `mascararCEP(texto)` — no máximo 8 dígitos; o hífen aparece depois do 5º.
 *      "50000" → "50000"       "500001" → "50000-1"       "50000000" → "50000-000"
 *
 * c) `mascararReais(texto)` — estilo "aplicativo de banco": os dígitos digitados são
 *    CENTAVOS, e o valor cresce da direita para a esquerda.
 *      ""        → ""
 *      "1"       → "0,01"
 *      "12"      → "0,12"
 *      "123"     → "1,23"
 *      "123456"  → "1.234,56"
 *      "0001"    → "0,01"         (zeros à esquerda não contam)
 *    Dica: Number(digitos) / 100 e toLocaleString("pt-BR", { minimumFractionDigits: 2,
 *    maximumFractionDigits: 2 }).
 *
 * d) `ativarMascara(campo, mascara)` — a cada evento "input", troca campo.value pelo
 *    resultado de mascara(campo.value). Também já formata o valor que o campo tiver ao ativar.
 *
 * Aula: seção 3.4.
 * Teste: npm run exercicio -- 08-mascaras
 */
export function mascararTelefone(texto) {
  // escreva seu código aqui
}

export function mascararCEP(texto) {
  // escreva seu código aqui
}

export function mascararReais(texto) {
  // escreva seu código aqui
}

export function ativarMascara(campo, mascara) {
  // escreva seu código aqui
}
