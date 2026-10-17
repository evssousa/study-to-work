export function trocarTexto(elemento, texto) {
  elemento.textContent = texto;
}

export function alternarTema(documento) {
  return documento.body.classList.toggle("escuro");
}

export function marcarComoLido(artigo) {
  artigo.classList.add("lido");
  artigo.dataset.lido = "true";
}

export function esconder(elemento) {
  elemento.hidden = true;
}

export function mostrar(elemento) {
  elemento.hidden = false;
}

export function ativarAba(abas, indice) {
  abas.forEach((aba, posicao) => {
    const ativa = posicao === indice;
    aba.classList.toggle("ativa", ativa);
    aba.setAttribute("aria-selected", String(ativa));
  });
}

export function definirCorPrimaria(elemento, cor) {
  elemento.style.setProperty("--cor-primaria", cor);
}

export function marcarCampoInvalido(campo, mensagemDeErro) {
  if (mensagemDeErro) {
    campo.setAttribute("aria-invalid", "true");
    campo.classList.add("invalido");
  } else {
    campo.removeAttribute("aria-invalid");
    campo.classList.remove("invalido");
  }
}
