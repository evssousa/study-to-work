/**
 * Exercício 03 — Configuração por variáveis de ambiente (.env)
 *
 * Senhas, chaves de API e endereços mudam de um ambiente para outro (seu computador, o servidor
 * de testes, a produção) e NUNCA podem ficar escritos no código. A solução universal são as
 * VARIÁVEIS DE AMBIENTE: o programa lê `process.env.PORTA`, e quem o executa define o valor.
 * Em desenvolvimento, as variáveis ficam num arquivo `.env` (que NUNCA vai para o Git).
 *
 * a) `parsearEnv(texto)` → objeto { CHAVE: "valor" } a partir do conteúdo de um arquivo .env:
 *      # comentário           linhas que começam com # são ignoradas, assim como linhas em branco
 *      PORTA=3000             CHAVE=VALOR (espaços em volta da chave e do valor são removidos)
 *      NOME="Loja do Bairro"  aspas duplas ou simples em volta do valor são removidas
 *      MSG="linha1\nlinha2"   dentro de aspas DUPLAS, \n vira uma quebra de linha de verdade
 *      URL=http://x.com # c   no valor SEM aspas, um " #" (espaço + #) começa um comentário e é cortado
 *      export TOKEN=abc       um "export " na frente é aceito e ignorado
 *      SENHA=a=b=c            só o PRIMEIRO "=" separa; o resto faz parte do valor ("a=b=c")
 *    Linhas sem "=" ou com nome de variável inválido (precisa casar com /^[A-Za-z_][A-Za-z0-9_]*$/)
 *    são ignoradas. Se uma chave aparecer duas vezes, vale a ÚLTIMA. Aceite \r\n (Windows).
 *
 * b) `class ConfiguracaoError extends Error`
 *      new ConfiguracaoError(problemas)  — `problemas` é um array de textos
 *      name = "ConfiguracaoError"; propriedade `problemas`;
 *      message = "Configuração inválida:\n- problema 1\n- problema 2"
 *
 * c) `lerConfiguracao(env, esquema)` → objeto com os valores já CONVERTIDOS.
 *    `env` é um objeto de textos (como process.env). `esquema` descreve cada variável:
 *      {
 *        PORTA:   { tipo: "numero", padrao: 3000 },
 *        DEBUG:   { tipo: "booleano", padrao: false },
 *        API_URL: { tipo: "texto", obrigatoria: true },
 *        MODO:    { tipo: "opcao", opcoes: ["dev", "prod"], padrao: "dev" },
 *      }
 *    Regras:
 *      - variável ausente OU vazia ("" ou só espaços) conta como não definida;
 *      - não definida: usa `padrao` se existir; senão, se `obrigatoria`, é um problema:
 *          `${CHAVE} é obrigatória`; senão, o valor fica null;
 *      - "numero": Number(valor) precisa ser um número finito, senão
 *          `${CHAVE} deve ser um número (recebido: "${valor}")`
 *      - "booleano": aceita (sem diferenciar maiúsculas) true/false, 1/0, sim/nao, yes/no, on/off;
 *          outro valor: `${CHAVE} deve ser verdadeiro ou falso (recebido: "${valor}")`
 *      - "opcao": o valor precisa estar em `opcoes`, senão
 *          `${CHAVE} deve ser uma de: ${opcoes.join(", ")} (recebido: "${valor}")`
 *      - "texto": o valor sem espaços nas pontas.
 *      - Reúna TODOS os problemas e lance UM ConfiguracaoError no final (em vez de parar no
 *        primeiro): assim a pessoa corrige tudo de uma vez só. A ordem é a do esquema.
 *
 * d) `mostrarConfiguracao(configuracao, esquema)` → cópia segura para escrever em logs:
 *    variáveis marcadas com `segredo: true` no esquema aparecem como "***" (se tiverem valor;
 *    null continua null). Nunca imprima senhas ou chaves em logs!
 *
 * Aula: seção 3.
 * Teste: npm run exercicio -- 03-configuracao
 */

// escreva a classe ConfiguracaoError aqui (e exporte)

export function parsearEnv(texto) {
  // escreva seu código aqui
}

export function lerConfiguracao(env, esquema) {
  // escreva seu código aqui
}

export function mostrarConfiguracao(configuracao, esquema) {
  // escreva seu código aqui
}
