export function tituloDaPagina(documento) {
  return documento.querySelector("#titulo").textContent;
}

export function textosDosLinks(documento) {
  return [...documento.querySelectorAll("nav a")].map((link) => link.textContent);
}

export function quantosItens(documento) {
  return documento.querySelectorAll(".item").length;
}

export function itemEmDestaque(documento) {
  return documento.querySelector(".destaque")?.textContent ?? null;
}

export function enderecoDoLinkAtivo(documento) {
  return documento.querySelector("nav a.ativo").getAttribute("href");
}

export function primeiroItemDe(lista) {
  return lista.querySelector("li")?.textContent ?? null;
}
