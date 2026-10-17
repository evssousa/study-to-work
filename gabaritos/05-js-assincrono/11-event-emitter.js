export class EventEmitter {
  #ouvintes = new Map();

  on(evento, ouvinte) {
    const lista = this.#ouvintes.get(evento) ?? [];
    lista.push({ ouvinte, funcao: ouvinte });
    this.#ouvintes.set(evento, lista);
    return () => this.#removerRegistro(evento, (registro) => registro.ouvinte === ouvinte && registro.funcao === ouvinte);
  }

  once(evento, ouvinte) {
    const registro = { ouvinte, funcao: null };
    registro.funcao = (...argumentos) => {
      this.#removerRegistro(evento, (r) => r === registro);
      ouvinte(...argumentos);
    };
    const lista = this.#ouvintes.get(evento) ?? [];
    lista.push(registro);
    this.#ouvintes.set(evento, lista);
    return () => this.#removerRegistro(evento, (r) => r === registro);
  }

  off(evento, ouvinte) {
    this.#removerRegistro(evento, (registro) => registro.ouvinte === ouvinte);
    return this;
  }

  emit(evento, ...argumentos) {
    const lista = this.#ouvintes.get(evento);
    if (!lista || lista.length === 0) return false;
    for (const registro of [...lista]) registro.funcao(...argumentos);
    return true;
  }

  listenerCount(evento) {
    return this.#ouvintes.get(evento)?.length ?? 0;
  }

  #removerRegistro(evento, escolher) {
    const lista = this.#ouvintes.get(evento);
    if (!lista) return;
    const posicao = lista.findIndex(escolher);
    if (posicao !== -1) lista.splice(posicao, 1);
  }
}
