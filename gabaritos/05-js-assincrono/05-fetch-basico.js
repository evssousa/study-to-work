export class HttpError extends Error {
  constructor(status) {
    super(`O servidor respondeu ${status}`);
    this.name = "HttpError";
    this.status = status;
  }
}

export class RedeError extends Error {
  constructor(causa) {
    super("Falha de rede. Verifique sua conexão.");
    this.name = "RedeError";
    this.causa = causa;
  }
}

async function requisitar(fetch, url, opcoes) {
  let resposta;
  try {
    resposta = await fetch(url, opcoes);
  } catch (erro) {
    if (erro.name === "AbortError") throw erro;
    throw new RedeError(erro);
  }
  if (!resposta.ok) throw new HttpError(resposta.status);
  return resposta;
}

async function lerJson(resposta) {
  try {
    return await resposta.json();
  } catch {
    throw new Error("Resposta inválida do servidor");
  }
}

export async function buscarJson(url, { fetch, signal, headers } = {}) {
  const resposta = await requisitar(fetch, url, { signal, headers });
  return lerJson(resposta);
}

export async function enviarJson(url, dados, { fetch, metodo = "POST", token, signal } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const opcoes = { method: metodo, headers, signal };
  if (dados !== undefined) opcoes.body = JSON.stringify(dados);

  const resposta = await requisitar(fetch, url, opcoes);
  if (resposta.status === 204) return null;
  return lerJson(resposta);
}
