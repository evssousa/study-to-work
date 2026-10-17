export function* intervalo(inicio, fim, passo = 1) {
  if (passo === 0) throw new Error("O passo não pode ser zero");
  if (passo > 0) {
    for (let n = inicio; n < fim; n += passo) yield n;
  } else {
    for (let n = inicio; n > fim; n += passo) yield n;
  }
}

export function* pegar(iteravel, quantidade) {
  if (quantidade <= 0) return;
  let entregues = 0;
  for (const item of iteravel) {
    yield item;
    entregues++;
    if (entregues >= quantidade) return;
  }
}

export function* naturais() {
  let n = 1;
  while (true) yield n++;
}

export class Fila {
  #itens = [];

  enfileirar(item) {
    this.#itens.push(item);
    return this;
  }

  desenfileirar() {
    return this.#itens.shift();
  }

  get tamanho() {
    return this.#itens.length;
  }

  *[Symbol.iterator]() {
    yield* this.#itens;
  }
}

export async function* paginas(buscarPagina) {
  let numero = 1;
  let temMais = true;
  while (temMais) {
    const pagina = await buscarPagina(numero);
    yield pagina.itens;
    temMais = pagina.temMais;
    numero++;
  }
}

export async function coletarTudo(buscarPagina) {
  const todos = [];
  for await (const itens of paginas(buscarPagina)) todos.push(...itens);
  return todos;
}
