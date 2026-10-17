/**
 * Exercício 05 — fetch: buscar e enviar dados com erros bem tratados
 *
 * O `fetch` tem pegadinhas. A principal: ele só REJEITA quando a rede falha (sem internet,
 * servidor fora do ar). Se o servidor responde "404 Não encontrado" ou "500 Erro", o fetch
 * considera isso um SUCESSO, e é você quem precisa conferir `resposta.ok`.
 *
 * Todas as funções recebem o `fetch` por PARÂMETRO (no navegador você passa o fetch de
 * verdade; nos testes, um falso). Isso é injeção de dependência, como no módulo 04.
 *
 * Classes de erro (escreva e EXPORTE as duas):
 *   HttpError   estende Error. new HttpError(404)
 *               → name "HttpError", propriedade `status` = 404, message "O servidor respondeu 404"
 *   RedeError   estende Error. new RedeError(erroOriginal)
 *               → name "RedeError", message "Falha de rede. Verifique sua conexão.",
 *                 propriedade `causa` = o erro original
 *
 * a) `buscarJson(url, { fetch, signal, headers })`
 *      1. chama fetch(url, { signal, headers });
 *      2. se o fetch REJEITAR:
 *           - erro com name "AbortError" (a busca foi cancelada de propósito): repasse o MESMO erro;
 *           - qualquer outro: lance um RedeError;
 *      3. se resposta.ok for false: lance um HttpError com resposta.status;
 *      4. converta com await resposta.json(); se isso falhar (o corpo não é JSON válido):
 *         lance Error("Resposta inválida do servidor");
 *      5. retorne os dados.
 *
 * b) `enviarJson(url, dados, { fetch, metodo = "POST", token, signal })`
 *      Igual ao buscarJson (mesmos erros), mas envia dados:
 *      fetch(url, { method: metodo, headers, body: JSON.stringify(dados), signal })
 *      onde headers = { "Content-Type": "application/json" } e, se houver `token`,
 *      também "Authorization": `Bearer ${token}`.
 *      Se `dados` for undefined, NÃO envie o campo body (útil para DELETE).
 *      Se a resposta for 204 (sem conteúdo), retorne null SEM tentar ler o JSON.
 *
 * Dica: para não repetir código, escreva uma função auxiliar (sem exportar) que faz as
 * etapas 2 e 3 e use nas duas.
 *
 * Aula: seção 4.
 * Teste: npm run exercicio -- 05-fetch
 */

// escreva as classes HttpError e RedeError aqui

export async function buscarJson(url, { fetch, signal, headers } = {}) {
  // escreva seu código aqui
}

export async function enviarJson(url, dados, { fetch, metodo = "POST", token, signal } = {}) {
  // escreva seu código aqui
}
