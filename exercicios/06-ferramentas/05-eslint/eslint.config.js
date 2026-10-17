/**
 * Exercício 05 — Configurando o ESLint
 *
 * O ESLint lê o código (sem executar) e aponta bugs e más práticas. A configuração moderna
 * ("flat config") é um ARRAY de objetos, e fica no arquivo eslint.config.js na raiz do projeto.
 * O teste roda o ESLINT DE VERDADE com a sua configuração em vários trechos de código.
 *
 * Imagine um projeto Node.js (uma ferramenta de terminal) e configure:
 *
 *  1. Comece pelas regras recomendadas: js.configs.recommended
 *     (elas já pegam coisas como no-undef, no-unused-vars e no-cond-assign).
 *  2. O código roda no Node, então declare os globais do Node (console, process...):
 *       { languageOptions: { globals: globals.node } }
 *     O navegador NÃO existe aqui: usar `document` deve ser um erro (no-undef).
 *  3. Regras adicionais, todas como "error":
 *       eqeqeq        exige === e !== (nunca == nem !=)
 *       no-var        proíbe var
 *       prefer-const  exige const quando a variável nunca é reatribuída
 *       no-eval       proíbe eval
 *  4. Ajuste no-unused-vars (continua "error"): ignore argumentos E variáveis cujo nome começa
 *     com "_" (a convenção para "sei que não uso"). Opções: argsIgnorePattern e varsIgnorePattern
 *     com o valor "^_".
 *  5. NÃO ative no-console: ferramentas de terminal existem para escrever no console.
 *
 * Documentação das regras: https://eslint.org/docs/latest/rules/
 *
 * Aula: seção 5.2.
 * Teste: npm run exercicio -- 05-eslint
 */
import js from "@eslint/js";
import globals from "globals";

export default [
  // escreva sua configuração aqui
];

// (js e globals já estão importados para você usar acima.)
void js;
void globals;
