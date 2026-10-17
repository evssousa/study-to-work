/**
 * Exercício 06 — Um cliente de API reutilizável
 *
 * Em vez de repetir a URL base, o token e o tratamento de erros em cada chamada, empresas
 * criam UM "cliente" de API. Você vai montar o seu usando as funções do exercício 05:
 *
 *   import { buscarJson, enviarJson } from "./05-fetch-basico.js";
 *
 * (Faça o exercício 05 primeiro.)
 *
 * `criarClienteApi({ baseUrl, fetch, token })` retorna um objeto com 4 métodos, todos
 * assíncronos. `baseUrl` não termina com barra (ex.: "https://api.exemplo.com/v1") e os
 * caminhos começam com barra (ex.: "/produtos").
 *
 *   get(caminho, parametros = {}, { signal } = {})
 *      GET na baseUrl + caminho + a query string dos `parametros`.
 *      Parâmetros com valor undefined, null ou "" são IGNORADOS.
 *      Use URLSearchParams (ele codifica acentos, espaços e símbolos sozinho).
 *      Se houver token, envia o header Authorization: `Bearer ${token}`.
 *        get("/produtos", { categoria: "casa e jardim", pagina: 2, busca: "" })
 *        → GET https://api.exemplo.com/v1/produtos?categoria=casa+e+jardim&pagina=2
 *
 *   post(caminho, dados)     envia os dados com método POST
 *   put(caminho, dados)      envia os dados com método PUT
 *   remover(caminho)         DELETE, sem corpo (a API responde 204 → retorna null)
 *
 * O remover usa enviarJson com metodo "DELETE" e dados undefined (sem corpo, como o
 * exercício 05 pede).
 *
 * Todos repassam os erros do exercício 05 (HttpError, RedeError...) sem alterar.
 *
 * Aula: seção 4.4.
 * Teste: npm run exercicio -- 06-cliente
 */
import { buscarJson, enviarJson } from "./05-fetch-basico.js";

export function criarClienteApi({ baseUrl, fetch, token }) {
  // escreva seu código aqui
}
