export function contarFrequencia(lista) {
  const frequencia = new Map();
  for (const item of lista) frequencia.set(item, (frequencia.get(item) ?? 0) + 1);
  return frequencia;
}

export function semDuplicados(lista) {
  return [...new Set(lista)];
}

export function interseccao(a, b) {
  const emB = new Set(b);
  return semDuplicados(a).filter((item) => emB.has(item));
}

export function diferenca(a, b) {
  const emB = new Set(b);
  return semDuplicados(a).filter((item) => !emB.has(item));
}

export function agruparPor(lista, chaveDe) {
  const grupos = new Map();
  for (const item of lista) {
    const chave = chaveDe(item);
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave).push(item);
  }
  return grupos;
}

export class CacheComTTL {
  #entradas = new Map();
  #ttlMs;
  #limite;
  #agora;

  constructor({ ttlMs, limite = Infinity, agora = Date.now }) {
    this.#ttlMs = ttlMs;
    this.#limite = limite;
    this.#agora = agora;
  }

  #venceu(entrada) {
    return this.#agora() - entrada.guardadoEm >= this.#ttlMs;
  }

  set(chave, valor) {
    this.#entradas.delete(chave);
    this.#entradas.set(chave, { valor, guardadoEm: this.#agora() });
    while (this.#entradas.size > this.#limite) {
      this.#entradas.delete(this.#entradas.keys().next().value);
    }
    return this;
  }

  get(chave) {
    const entrada = this.#entradas.get(chave);
    if (!entrada) return undefined;
    if (this.#venceu(entrada)) {
      this.#entradas.delete(chave);
      return undefined;
    }
    this.#entradas.delete(chave);
    this.#entradas.set(chave, entrada);
    return entrada.valor;
  }

  has(chave) {
    const entrada = this.#entradas.get(chave);
    return entrada !== undefined && !this.#venceu(entrada);
  }

  delete(chave) {
    return this.#entradas.delete(chave);
  }

  clear() {
    this.#entradas.clear();
  }

  get tamanho() {
    for (const [chave, entrada] of this.#entradas) {
      if (this.#venceu(entrada)) this.#entradas.delete(chave);
    }
    return this.#entradas.size;
  }
}
