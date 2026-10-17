/**
 * Exercício 02 — As partes de uma URL
 *
 * Observe a URL abaixo e preencha cada parte (troque os null).
 * Todas as respostas são strings, exatamente como aparecem na URL
 * (sem os símbolos separadores, como "://", ":", "?" ou "#").
 *
 *   https://loja.exemplo.com.br:8080/produtos/tenis?cor=azul&tamanho=42#avaliacoes
 *
 * Aula: seção 4.4 (anatomia de uma URL).
 * Teste: npm run exercicio -- 02-url
 */
export const partes = {
  protocolo: "https", // ex.: "http"
  dominio: "loja.exemplo.com.br",
  porta: "8080",
  caminho: "/produtos/tenis", // começa com "/"
  parametros: {
    cor: "azul",
    tamanho: "42",
  },
  fragmento: "avaliacoes",
};
