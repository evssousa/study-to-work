const doisDigitos = (n) => String(n).padStart(2, "0");

export function formatarTempo(ms) {
  const centesimos = Math.floor(ms / 10) % 100;
  const segundos = Math.floor(ms / 1000) % 60;
  const minutos = Math.floor(ms / 60000);
  return `${doisDigitos(minutos)}:${doisDigitos(segundos)}.${doisDigitos(centesimos)}`;
}

export function criarCronometro({ aoAtualizar }) {
  let acumulado = 0;
  let inicio = null;
  let intervalo = null;
  let voltas = [];

  const tempo = () => (inicio === null ? acumulado : acumulado + (Date.now() - inicio));

  return {
    iniciar() {
      if (intervalo !== null) return;
      inicio = Date.now();
      intervalo = setInterval(() => aoAtualizar(tempo()), 10);
    },

    pausar() {
      if (intervalo === null) return;
      acumulado = tempo();
      inicio = null;
      clearInterval(intervalo);
      intervalo = null;
    },

    zerar() {
      clearInterval(intervalo);
      intervalo = null;
      inicio = null;
      acumulado = 0;
      voltas = [];
      aoAtualizar(0);
    },

    marcarVolta() {
      const totalMs = tempo();
      const anterior = voltas.at(-1)?.totalMs ?? 0;
      const volta = { numero: voltas.length + 1, totalMs, parcialMs: totalMs - anterior };
      voltas.push(volta);
      return volta;
    },

    tempo,
    voltas: () => [...voltas],
  };
}

export function iniciarRelogio(elemento) {
  const atualizar = () => {
    elemento.textContent = new Date().toLocaleTimeString("pt-BR");
  };
  atualizar();
  const intervalo = setInterval(atualizar, 1000);
  return () => clearInterval(intervalo);
}
