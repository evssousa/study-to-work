export class Produto {
  #id;
  #nome;
  #precoCentavos;

  constructor({ id, nome, precoCentavos }) {
    const nomeLimpo = String(nome ?? "").trim();
    if (nomeLimpo === "") throw new Error("Nome do produto é obrigatório");
    if (!Number.isInteger(precoCentavos) || precoCentavos < 0) throw new Error("Preço inválido");
    this.#id = id;
    this.#nome = nomeLimpo;
    this.#precoCentavos = precoCentavos;
  }

  get id() {
    return this.#id;
  }

  get nome() {
    return this.#nome;
  }

  get precoCentavos() {
    return this.#precoCentavos;
  }

  get precoFormatado() {
    return (this.#precoCentavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/ /g, " ");
  }

  static deObjeto(objeto) {
    return new Produto(objeto);
  }

  toJSON() {
    return { id: this.#id, nome: this.#nome, precoCentavos: this.#precoCentavos };
  }
}

export class Carrinho {
  #itens = new Map();
  #cupons;
  #percentualDoCupom = 0;

  constructor({ cupons = {} } = {}) {
    this.#cupons = Object.fromEntries(Object.entries(cupons).map(([codigo, percentual]) => [codigo.toUpperCase(), percentual]));
  }

  adicionar(produto, quantidade = 1) {
    if (!Number.isInteger(quantidade) || quantidade < 1) throw new Error("Quantidade inválida");
    const existente = this.#itens.get(produto.id);
    this.#itens.set(produto.id, { produto, quantidade: (existente?.quantidade ?? 0) + quantidade });
    return this;
  }

  remover(id) {
    this.#itens.delete(id);
    return this;
  }

  alterarQuantidade(id, quantidade) {
    const item = this.#itens.get(id);
    if (!item) throw new Error("Produto não está no carrinho");
    if (quantidade <= 0) this.#itens.delete(id);
    else this.#itens.set(id, { ...item, quantidade });
    return this;
  }

  aplicarCupom(codigo) {
    const percentual = this.#cupons[codigo.toUpperCase()];
    if (percentual === undefined) throw new Error(`Cupom inválido: ${codigo}`);
    this.#percentualDoCupom = percentual;
    return this;
  }

  get itens() {
    return [...this.#itens.values()].map((item) => ({ ...item }));
  }

  get quantidadeTotal() {
    return [...this.#itens.values()].reduce((soma, item) => soma + item.quantidade, 0);
  }

  get subtotalCentavos() {
    return [...this.#itens.values()].reduce((soma, item) => soma + item.produto.precoCentavos * item.quantidade, 0);
  }

  get descontoCentavos() {
    return Math.round((this.subtotalCentavos * this.#percentualDoCupom) / 100);
  }

  get totalCentavos() {
    return this.subtotalCentavos - this.descontoCentavos;
  }

  get vazio() {
    return this.#itens.size === 0;
  }
}
