/**
 * Exercício 13 — Tempo: relógio, cronômetro e timers
 *
 * a) `formatarTempo(ms)` — milissegundos → "MM:SS.cc" (cc = centésimos de segundo).
 *      0        → "00:00.00"
 *      1230     → "00:01.23"
 *      65230    → "01:05.23"
 *      3600000  → "60:00.00"    (os minutos podem passar de 59)
 *    Os centésimos são TRUNCADOS (1239 ms → "00:01.23"), nunca arredondados.
 *    Dica: Math.floor e padStart(2, "0").
 *
 * b) `criarCronometro({ aoAtualizar })` retorna um objeto com:
 *      iniciar()      → começa (ou continua) a contar. Chamar iniciar() com ele já
 *                       rodando não faz nada.
 *      pausar()       → para de contar, guardando o tempo acumulado.
 *      zerar()        → para, volta a 0 e apaga as voltas. Chama aoAtualizar(0).
 *      marcarVolta()  → registra uma volta e a retorna: { numero, totalMs, parcialMs }
 *                       (numero começa em 1; parcialMs = totalMs − totalMs da volta anterior).
 *      tempo()        → o tempo atual em ms (acumulado + o trecho em andamento).
 *      voltas()       → um array (cópia) com as voltas registradas.
 *    Enquanto roda, chama aoAtualizar(tempoEmMs) a cada 10 ms (setInterval).
 *
 *    PULO DO GATO: não conte "ticks" (somar 10 a cada intervalo): o setInterval atrasa
 *    e o relógio ficaria errado. Em vez disso, guarde o instante em que iniciou
 *    (Date.now()) e calcule: tempo = acumulado + (Date.now() − instanteDoInicio).
 *
 * c) `iniciarRelogio(elemento)` — escreve a hora atual no elemento (formato "14:05:09",
 *    com new Date().toLocaleTimeString("pt-BR")), imediatamente e a cada 1 segundo.
 *    Retorna uma função `parar()` que interrompe as atualizações (clearInterval).
 *
 * Aula: seção 7.
 * Teste: npm run exercicio -- 13-tempo
 */
export function formatarTempo(ms) {
  // escreva seu código aqui
}

export function criarCronometro({ aoAtualizar }) {
  // escreva seu código aqui
}

export function iniciarRelogio(elemento) {
  // escreva seu código aqui
}
