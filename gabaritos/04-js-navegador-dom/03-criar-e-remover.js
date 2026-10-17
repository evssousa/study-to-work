export function criarItem(documento, texto) {
  const li = documento.createElement("li");
  li.textContent = texto;
  return li;
}

export function renderizarLista(ul, textos) {
  const documento = ul.ownerDocument;
  ul.replaceChildren(...textos.map((texto) => criarItem(documento, texto)));
}

export function criarCartao(documento, { titulo, descricao, imagem }) {
  const cartao = documento.createElement("article");
  cartao.className = "cartao";

  if (imagem) {
    const img = documento.createElement("img");
    img.setAttribute("src", imagem);
    img.setAttribute("alt", "");
    cartao.append(img);
  }

  const h2 = documento.createElement("h2");
  h2.textContent = titulo;
  const p = documento.createElement("p");
  p.textContent = descricao;
  cartao.append(h2, p);
  return cartao;
}

export function criarCartaoComTemplate(template, { titulo, descricao }) {
  const copia = template.content.cloneNode(true);
  copia.querySelector("h2").textContent = titulo;
  copia.querySelector("p").textContent = descricao;
  return copia.firstElementChild;
}

export function removerConcluidos(ul) {
  const concluidos = ul.querySelectorAll("li.feita");
  concluidos.forEach((li) => li.remove());
  return concluidos.length;
}

export function moverParaOFim(ul, li) {
  ul.append(li);
}
