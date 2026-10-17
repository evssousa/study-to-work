/**
 * Exercício 11 — Validador de senha
 *
 * Todo sistema com cadastro tem uma regra de senha. Vamos escrever a nossa.
 *
 * `validarSenha(senha)` retorna um ARRAY com as mensagens de erro, na ordem abaixo.
 * Se a senha for válida, retorna um array vazio [].
 *
 *   1. "A senha deve ter pelo menos 8 caracteres"
 *   2. "A senha deve ter pelo menos uma letra maiúscula"
 *   3. "A senha deve ter pelo menos uma letra minúscula"
 *   4. "A senha deve ter pelo menos um número"
 *
 * Exemplos:
 *   validarSenha("Abcdefg1") → []
 *   validarSenha("abc")      → [mensagem 1, mensagem 2, mensagem 4]
 *
 * Dicas:
 *   - Um caractere é letra maiúscula se: caractere !== caractere.toLowerCase()
 *   - Um caractere é letra minúscula se: caractere !== caractere.toUpperCase()
 *   - Um caractere é número se: "0123456789".includes(caractere)
 *   - Use variáveis booleanas, como `temMaiuscula`, que começam em false.
 *
 * Aula: seções 4 (strings), 5 (booleanos e operadores lógicos), 7 (laços) e 9 (arrays).
 * Teste: npm run exercicio -- 11-validar
 */
export function validarSenha(senha) {
  // escreva seu código aqui
}
