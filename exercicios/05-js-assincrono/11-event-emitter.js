/**
 * Exercício 11 — Seu próprio EventEmitter
 *
 * Você já usou `addEventListener` no navegador. O Node tem o mesmo conceito, o EventEmitter,
 * que está por baixo de quase tudo (servidores HTTP, streams...). Agora você vai construir um.
 * É o padrão publish/subscribe (módulo 04, seção 5) em forma de classe.
 *
 * class EventEmitter
 *
 *   on(evento, ouvinte)
 *       registra o ouvinte para o evento. RETORNA uma função que cancela o registro.
 *       O mesmo ouvinte pode ser registrado mais de uma vez (e roda mais de uma vez).
 *
 *   once(evento, ouvinte)
 *       como o `on`, mas o ouvinte roda UMA vez só e depois é removido sozinho.
 *       Retorna a função que cancela.
 *
 *   off(evento, ouvinte)
 *       remove UM registro daquele ouvinte (o mais antigo). Não faz nada se não existir.
 *       Retorna `this` (para encadear).
 *
 *   emit(evento, ...argumentos)
 *       chama os ouvintes do evento, NA ORDEM em que foram registrados, passando os argumentos.
 *       Retorna true se havia pelo menos um ouvinte, e false se não havia nenhum.
 *       Se um ouvinte se remover (ou adicionar outro) durante o emit, isso NÃO pode
 *       bagunçar a rodada em andamento: itere sobre uma CÓPIA da lista.
 *
 *   listenerCount(evento)
 *       quantos ouvintes o evento tem agora.
 *
 * Guarde os ouvintes em um Map privado:  #ouvintes = new Map()  (evento → array de ouvintes).
 * Para o `once`, guarde uma função "embrulho" que se remove antes de chamar o original.
 * Cuidado: o `off(evento, original)` também deve conseguir remover um ouvinte registrado com
 * `once` (guarde no embrulho uma referência ao original).
 *
 * Aula: seção 6.6.
 * Teste: npm run exercicio -- 11-event
 */

// escreva a classe EventEmitter aqui (e exporte)
