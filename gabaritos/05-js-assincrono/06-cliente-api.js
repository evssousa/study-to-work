import { buscarJson, enviarJson } from "./05-fetch-basico.js";

export function criarClienteApi({ baseUrl, fetch, token }) {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  function montarUrl(caminho, parametros = {}) {
    const query = new URLSearchParams();
    for (const [chave, valor] of Object.entries(parametros)) {
      if (valor !== undefined && valor !== null && valor !== "") query.set(chave, String(valor));
    }
    const texto = query.toString();
    return `${baseUrl}${caminho}${texto ? `?${texto}` : ""}`;
  }

  return {
    get: (caminho, parametros, { signal } = {}) => buscarJson(montarUrl(caminho, parametros), { fetch, signal, headers }),
    post: (caminho, dados) => enviarJson(`${baseUrl}${caminho}`, dados, { fetch, token, metodo: "POST" }),
    put: (caminho, dados) => enviarJson(`${baseUrl}${caminho}`, dados, { fetch, token, metodo: "PUT" }),
    remover: (caminho) => enviarJson(`${baseUrl}${caminho}`, undefined, { fetch, token, metodo: "DELETE" }),
  };
}
