export function criarArmazenamento(storage, chave) {
  return {
    ler(valorPadrao) {
      const texto = storage.getItem(chave);
      if (texto === null) return valorPadrao;
      try {
        return JSON.parse(texto);
      } catch {
        return valorPadrao;
      }
    },

    salvar(dados) {
      try {
        storage.setItem(chave, JSON.stringify(dados));
        return true;
      } catch {
        return false;
      }
    },

    limpar() {
      storage.removeItem(chave);
    },
  };
}

const TEMAS = ["claro", "escuro"];

export function lerTema(storage, prefereEscuro) {
  const guardado = storage.getItem("tema");
  if (TEMAS.includes(guardado)) return guardado;
  return prefereEscuro() ? "escuro" : "claro";
}

export function salvarTema(storage, tema) {
  if (!TEMAS.includes(tema)) throw new Error(`Tema inválido: ${tema}`);
  storage.setItem("tema", tema);
}
