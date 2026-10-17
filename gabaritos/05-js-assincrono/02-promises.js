export function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function promisificar(funcaoComCallback) {
  return (...argumentos) =>
    new Promise((resolve, reject) => {
      funcaoComCallback(...argumentos, (erro, resultado) => {
        if (erro) reject(erro);
        else resolve(resultado);
      });
    });
}

export function comTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Tempo esgotado")), ms);
    promise.then(
      (valor) => {
        clearTimeout(timer);
        resolve(valor);
      },
      (erro) => {
        clearTimeout(timer);
        reject(erro);
      },
    );
  });
}

export async function emSequencia(tarefas) {
  const resultados = [];
  for (const tarefa of tarefas) {
    resultados.push(await tarefa());
  }
  return resultados;
}
