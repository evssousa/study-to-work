/**
 * Exercício 18 — Datas sem dor de cabeça
 *
 * Todas as datas são strings no formato ISO "AAAA-MM-DD" (o formato que bancos de dados
 * e APIs usam). Para evitar problemas de fuso horário, trabalhe SEMPRE em UTC:
 *   new Date("2026-10-15T00:00:00Z")    e    data.toISOString().slice(0, 10)
 *
 * a) `formatarDataBR(iso)` → "15/10/2026"
 * b) `diasEntre(inicio, fim)` → quantos dias de `inicio` até `fim` (negativo se fim vier antes)
 *      diasEntre("2026-10-01", "2026-10-15") → 14
 * c) `adicionarDias(iso, dias)` → nova data ISO (dias pode ser negativo). Vira mês e ano certinho:
 *      adicionarDias("2026-12-30", 3) → "2027-01-02"
 * d) `diaDaSemana(iso)` → "quinta-feira" (use toLocaleDateString com weekday: "long"
 *      e timeZone: "UTC")
 * e) `ehDiaUtil(iso)` → false para sábado e domingo; true para os outros dias (ignore feriados)
 * f) `calcularIdade(nascimento, hoje)` → idade em anos completos na data `hoje`
 *      calcularIdade("2000-10-16", "2026-10-15") → 25   (o aniversário ainda não chegou)
 *
 * Aula: seção 9.
 * Teste: npm run exercicio -- 18-datas
 */
export function formatarDataBR(iso) {
  // escreva seu código aqui
}

export function diasEntre(inicio, fim) {
  // escreva seu código aqui
}

export function adicionarDias(iso, dias) {
  // escreva seu código aqui
}

export function diaDaSemana(iso) {
  // escreva seu código aqui
}

export function ehDiaUtil(iso) {
  // escreva seu código aqui
}

export function calcularIdade(nascimento, hoje) {
  // escreva seu código aqui
}
