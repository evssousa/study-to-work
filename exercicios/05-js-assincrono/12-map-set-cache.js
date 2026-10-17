/**
 * Exercício 12 — Map, Set e um cache de verdade
 *
 * Map guarda pares chave → valor com chaves de QUALQUER tipo e lembra a ordem de inserção.
 * Set guarda valores ÚNICOS. Os dois são mais rápidos e mais seguros que objetos comuns
 * para esses usos.
 *
 * a) `contarFrequencia(lista)` → Map elemento → quantas vezes aparece, na ordem da
 *    primeira aparição. contarFrequencia(["a","b","a"]) → Map { "a" => 2, "b" => 1 }
 *
 * b) `semDuplicados(lista)` → array sem repetições, mantendo a ordem da primeira aparição (Set).
 *    `interseccao(a, b)` → array com os elementos de `a` que também estão em `b` (sem repetir).
 *    `diferenca(a, b)`   → array com os elementos de `a` que NÃO estão em `b` (sem repetir).
 *    Use Set para a busca ser rápida (set.has).
 *
 * c) `agruparPor(lista, chaveDe)` → Map chave → array dos itens que têm aquela chave.
 *    `chaveDe(item)` descobre a chave. Mantém a ordem de aparição das chaves e dos itens.
 *
 * d) `class CacheComTTL` — um cache que guarda valores por um tempo e descarta os mais antigos
 *    quando enche. É o mesmo mecanismo que os navegadores, os servidores e as bibliotecas de
 *    dados (como o TanStack Query, módulo 10) usam.
 *
 *    new CacheComTTL({ ttlMs, limite = Infinity, agora = Date.now })
 *      ttlMs    quanto tempo (em ms) um valor vale depois de guardado
 *      limite   máximo de itens guardados
 *      agora    função que informa a hora atual em ms (parâmetro para o teste "viajar no tempo")
 *
 *    set(chave, valor)   guarda (ou substitui). Valor novo recomeça o prazo e vira o "mais
 *                        recente". Se passar do limite, descarta o MENOS RECENTEMENTE USADO.
 *                        Retorna `this`.
 *    get(chave)          retorna o valor, ou undefined se não existir OU se já venceu
 *                        (agora() − guardadoEm >= ttlMs; nesse caso, apague a entrada).
 *                        Ler um item o torna o "mais recentemente usado".
 *    has(chave)          true se existe e não venceu (não conta como "uso").
 *    delete(chave)       remove; retorna true se existia.
 *    clear()             esvazia.
 *    get tamanho         quantos itens VÁLIDOS há (descarte os vencidos antes de contar).
 *
 *    Dica: um Map lembra a ordem de inserção. Para "mover para o fim" (mais recente),
 *    apague a chave e insira de novo. O primeiro item do Map (map.keys().next().value) é
 *    sempre o menos recentemente usado.
 *
 * Aula: seção 7.
 * Teste: npm run exercicio -- 12-map
 */
export function contarFrequencia(lista) {
  // escreva seu código aqui
}

export function semDuplicados(lista) {
  // escreva seu código aqui
}

export function interseccao(a, b) {
  // escreva seu código aqui
}

export function diferenca(a, b) {
  // escreva seu código aqui
}

export function agruparPor(lista, chaveDe) {
  // escreva seu código aqui
}

// escreva a classe CacheComTTL aqui (e exporte)
