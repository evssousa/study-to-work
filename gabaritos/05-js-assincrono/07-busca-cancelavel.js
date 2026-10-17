export function criarBuscaCancelavel(buscar) {
  let controladorAtual = null;

  return async function pesquisar(termo) {
    controladorAtual?.abort();
    const controlador = new AbortController();
    controladorAtual = controlador;

    try {
      const dados = await buscar(termo, { signal: controlador.signal });
      if (controlador !== controladorAtual) return { cancelada: true };
      return { cancelada: false, dados };
    } catch (erro) {
      if (erro.name === "AbortError" || controlador !== controladorAtual) return { cancelada: true };
      throw erro;
    }
  };
}
