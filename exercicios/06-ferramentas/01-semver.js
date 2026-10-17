/**
 * Exercício 01 — Versionamento semântico (SemVer)
 *
 * Toda dependência do npm tem uma versão no formato  MAIOR.MENOR.PATCH  (ex.: 4.17.21).
 * É o que o npm usa para decidir o que pode ou não ser atualizado sozinho. Você vai
 * reimplementar o coração dessa lógica.
 *
 *   MAIOR  muda quando quebra a compatibilidade (código antigo pode parar de funcionar)
 *   MENOR  muda quando acrescenta funcionalidade, sem quebrar nada
 *   PATCH  muda quando só corrige bugs
 *   Pré-lançamento: "1.0.0-beta.2" (depois do hífen) é uma versão ANTES da 1.0.0 final.
 *
 * a) `analisarVersao(texto)` → { maior, menor, patch, preLancamento }
 *      "1.2.3"        → { maior: 1, menor: 2, patch: 3, preLancamento: null }
 *      "v2.0.1"       → aceita um "v" na frente
 *      "1.0.0-beta.2" → preLancamento: "beta.2"
 *    Os três primeiros são NÚMEROS. Formato inválido ("1.2", "abc", "1.2.3.4" e "1.02.3", pois zero
 *    à esquerda não vale): throw new Error(`Versão inválida: ${texto}`)
 *
 * b) `compararVersoes(a, b)` → -1 se a < b, 0 se iguais, 1 se a > b.
 *    Compare maior, depois menor, depois patch. Depois:
 *      - uma versão SEM pré-lançamento é MAIOR que a mesma COM pré-lançamento (1.0.0 > 1.0.0-rc.1);
 *      - entre dois pré-lançamentos, compare os identificadores separados por ponto, um a um:
 *          · dois números: compare como números (beta.2 < beta.11);
 *          · número contra texto: o número é menor (1 < "alpha");
 *          · dois textos: compare como texto (alpha < beta);
 *          · se um acabar antes e todos os anteriores forem iguais, o MENOR é o mais curto
 *            (alpha < alpha.1).
 *    A ordem oficial: 1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta
 *                     < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0
 *
 * c) `satisfaz(versao, intervalo)` → true/false. Intervalos aceitos:
 *      "1.2.3"    exatamente essa versão
 *      "*"        qualquer versão
 *      ">=1.2.0"  ">1.2.0"  "<=2.0.0"  "<2.0.0"   comparações
 *      "^1.2.3"   compatível: >=1.2.3 e abaixo do PRÓXIMO MAIOR   (<2.0.0)
 *                 caso especial: ^0.2.3 → >=0.2.3 <0.3.0  e  ^0.0.3 → >=0.0.3 <0.0.4
 *                 (enquanto o MAIOR é 0, o projeto ainda é instável: mudar o menor já pode quebrar)
 *      "~1.2.3"   aproximado: >=1.2.3 e abaixo do próximo MENOR (<1.3.0)
 *    Versões com pré-lançamento só satisfazem um intervalo que seja EXATAMENTE essa versão.
 *    Intervalo que você não entende: throw new Error(`Intervalo inválido: ${intervalo}`)
 *
 * d) `proximaVersao(atual, tipo)` → string. tipo: "maior", "menor" ou "patch".
 *      ("1.2.3", "patch") → "1.2.4"
 *      ("1.2.3", "menor") → "1.3.0"     (o patch volta a zero)
 *      ("1.2.3", "maior") → "2.0.0"     (menor e patch voltam a zero)
 *    O pré-lançamento é descartado. Tipo desconhecido: throw new Error(`Tipo de versão inválido: ${tipo}`)
 *
 * Aula: seção 2.4.
 * Teste: npm run exercicio -- 01-semver
 */
export function analisarVersao(texto) {
  // escreva seu código aqui
}

export function compararVersoes(a, b) {
  // escreva seu código aqui
}

export function satisfaz(versao, intervalo) {
  // escreva seu código aqui
}

export function proximaVersao(atual, tipo) {
  // escreva seu código aqui
}
