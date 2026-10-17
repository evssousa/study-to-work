import { describe, expect, test, vi } from "vitest";
import { criarClienteApi } from "./06-cliente-api.js";

const BASE = "https://api.exemplo.com/v1";
const fetchOk = (corpo = {}, status = 200) => vi.fn(async () => (status === 204 ? new Response(null, { status }) : Response.json(corpo, { status })));
const ultimaChamada = (fetch) => fetch.mock.calls.at(-1);

describe("get", () => {
  test("monta a URL com base + caminho", async () => {
    const fetch = fetchOk({ itens: [] });
    const api = criarClienteApi({ baseUrl: BASE, fetch });
    await expect(api.get("/produtos")).resolves.toEqual({ itens: [] });
    expect(ultimaChamada(fetch)[0]).toBe(`${BASE}/produtos`);
  });

  test("acrescenta os parâmetros codificados e ignora os vazios", async () => {
    const fetch = fetchOk();
    const api = criarClienteApi({ baseUrl: BASE, fetch });
    await api.get("/produtos", { categoria: "casa e jardim", pagina: 2, busca: "", marca: null, ordem: undefined });
    expect(ultimaChamada(fetch)[0]).toBe(`${BASE}/produtos?categoria=casa+e+jardim&pagina=2`);
  });

  test("parâmetro 0 e false NÃO são ignorados", async () => {
    const fetch = fetchOk();
    await criarClienteApi({ baseUrl: BASE, fetch }).get("/x", { min: 0, ativo: false });
    expect(ultimaChamada(fetch)[0]).toBe(`${BASE}/x?min=0&ativo=false`);
  });

  test("sem token não manda Authorization; com token manda", async () => {
    const semToken = fetchOk();
    await criarClienteApi({ baseUrl: BASE, fetch: semToken }).get("/me");
    expect(ultimaChamada(semToken)[1].headers?.Authorization).toBeUndefined();

    const comToken = fetchOk();
    await criarClienteApi({ baseUrl: BASE, fetch: comToken, token: "segredo" }).get("/me");
    expect(ultimaChamada(comToken)[1].headers.Authorization).toBe("Bearer segredo");
  });

  test("repassa o signal de cancelamento", async () => {
    const fetch = fetchOk();
    const controlador = new AbortController();
    await criarClienteApi({ baseUrl: BASE, fetch }).get("/x", {}, { signal: controlador.signal });
    expect(ultimaChamada(fetch)[1].signal).toBe(controlador.signal);
  });

  test("repassa os erros sem alterar", async () => {
    const api = criarClienteApi({ baseUrl: BASE, fetch: fetchOk({}, 404) });
    const erro = await api.get("/nada").catch((e) => e);
    expect(erro.name).toBe("HttpError");
    expect(erro.status).toBe(404);
  });
});

describe("post, put e remover", () => {
  test("post envia JSON", async () => {
    const fetch = fetchOk({ id: 1 }, 201);
    const api = criarClienteApi({ baseUrl: BASE, fetch, token: "t" });
    await expect(api.post("/tarefas", { titulo: "Estudar" })).resolves.toEqual({ id: 1 });
    const [url, opcoes] = ultimaChamada(fetch);
    expect(url).toBe(`${BASE}/tarefas`);
    expect(opcoes.method).toBe("POST");
    expect(opcoes.body).toBe('{"titulo":"Estudar"}');
    expect(opcoes.headers.Authorization).toBe("Bearer t");
  });

  test("put usa o método PUT", async () => {
    const fetch = fetchOk({});
    await criarClienteApi({ baseUrl: BASE, fetch }).put("/tarefas/1", { titulo: "Novo" });
    expect(ultimaChamada(fetch)[1].method).toBe("PUT");
    expect(ultimaChamada(fetch)[0]).toBe(`${BASE}/tarefas/1`);
  });

  test("remover usa DELETE e devolve null quando a API responde 204", async () => {
    const fetch = fetchOk(null, 204);
    const api = criarClienteApi({ baseUrl: BASE, fetch, token: "t" });
    await expect(api.remover("/tarefas/1")).resolves.toBeNull();
    const [url, opcoes] = ultimaChamada(fetch);
    expect(url).toBe(`${BASE}/tarefas/1`);
    expect(opcoes.method).toBe("DELETE");
    expect(opcoes.headers.Authorization).toBe("Bearer t");
    expect("body" in opcoes).toBe(false);
  });
});
