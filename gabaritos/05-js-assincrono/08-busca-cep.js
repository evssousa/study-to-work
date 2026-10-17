import { buscarJson, HttpError, RedeError } from "./05-fetch-basico.js";

export function iniciarBuscaCep(raiz, { fetch }) {
  const form = raiz.querySelector("#form-cep");
  const campoCep = raiz.querySelector("#cep");
  const botao = form.querySelector("button");
  const estado = raiz.querySelector("#estado");
  const campos = {
    logradouro: raiz.querySelector("#logradouro"),
    bairro: raiz.querySelector("#bairro"),
    cidade: raiz.querySelector("#cidade"),
    uf: raiz.querySelector("#uf"),
  };

  let controladorAtual = null;

  function mostrar(nome, texto) {
    estado.dataset.estado = nome;
    estado.textContent = texto;
  }

  function limparEndereco() {
    for (const campo of Object.values(campos)) campo.value = "";
  }

  function mensagemDoErro(erro) {
    if (erro instanceof HttpError) {
      return erro.status === 400 ? "CEP inválido" : "Serviço indisponível. Tente novamente.";
    }
    if (erro instanceof RedeError) return "Sem conexão. Tente novamente.";
    throw erro;
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const cep = campoCep.value.replace(/\D/g, "");
    if (cep.length !== 8) {
      mostrar("erro", "Informe um CEP com 8 dígitos");
      return;
    }

    controladorAtual?.abort();
    const controlador = new AbortController();
    controladorAtual = controlador;

    mostrar("carregando", "Buscando CEP...");
    botao.disabled = true;
    limparEndereco();

    try {
      const dados = await buscarJson(`https://viacep.com.br/ws/${cep}/json/`, { fetch, signal: controlador.signal });
      if (controlador !== controladorAtual) return;

      if (dados.erro) {
        mostrar("erro", "CEP não encontrado");
      } else {
        campos.logradouro.value = dados.logradouro;
        campos.bairro.value = dados.bairro;
        campos.cidade.value = dados.localidade;
        campos.uf.value = dados.uf;
        mostrar("sucesso", "Endereço encontrado");
      }
    } catch (erro) {
      if (erro.name === "AbortError" || controlador !== controladorAtual) return;
      mostrar("erro", mensagemDoErro(erro));
    } finally {
      if (controlador === controladorAtual) botao.disabled = false;
    }
  });
}
