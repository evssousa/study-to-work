export function ativarGaleria(documento, fotos, imagem, legenda) {
  let indice = 0;

  function mostrar() {
    const foto = fotos[indice];
    imagem.setAttribute("src", foto.arquivo);
    imagem.setAttribute("alt", foto.descricao);
    legenda.textContent = `${indice + 1} de ${fotos.length} — ${foto.descricao}`;
  }

  const destinos = {
    ArrowRight: () => (indice + 1) % fotos.length,
    ArrowLeft: () => (indice - 1 + fotos.length) % fotos.length,
    Home: () => 0,
    End: () => fotos.length - 1,
    Escape: () => 0,
  };

  documento.addEventListener("keydown", (evento) => {
    if (evento.target.matches("input, textarea")) return;
    const calcular = destinos[evento.key];
    if (!calcular) return;
    evento.preventDefault();
    indice = calcular();
    mostrar();
  });

  mostrar();
}
