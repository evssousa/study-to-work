/**
 * Exercício 09 — Armazenamento no navegador (localStorage)
 *
 * O localStorage guarda SÓ texto, por site, sem prazo de validade. Para guardar objetos
 * você usa JSON. Todas as funções recebem o `storage` como parâmetro (no navegador de
 * verdade, você passa o localStorage; nos testes, uma versão de mentira):
 *   storage.getItem(chave)        → texto, ou null se não existir
 *   storage.setItem(chave, texto) → grava (PODE lançar erro: cota cheia, modo privado)
 *   storage.removeItem(chave)
 *
 * a) `criarArmazenamento(storage, chave)` retorna um objeto com:
 *      ler(valorPadrao)  → os dados guardados, já convertidos de JSON.
 *                          Retorna `valorPadrao` se não existir nada guardado OU se o texto
 *                          guardado não for um JSON válido (dado corrompido NÃO pode
 *                          derrubar a página!).
 *      salvar(dados)     → grava os dados como JSON e retorna true.
 *                          Se o storage lançar erro, retorna false (não propague o erro).
 *      limpar()          → remove a chave.
 *
 * b) `lerTema(storage, prefereEscuro)`
 *      - Se existir "claro" ou "escuro" guardado na chave "tema", retorna esse valor.
 *      - Senão, usa a preferência do sistema: `prefereEscuro` é uma FUNÇÃO que retorna
 *        true/false (no navegador seria () => matchMedia("(prefers-color-scheme: dark)").matches).
 *        Retorna "escuro" ou "claro" conforme ela responder.
 *      - Qualquer outro valor guardado na chave "tema" (lixo) é ignorado.
 *
 * c) `salvarTema(storage, tema)`
 *      - grava o tema na chave "tema" (texto puro, sem JSON);
 *      - se o tema não for "claro" nem "escuro": throw new Error("Tema inválido: <tema>").
 *
 * Aula: seção 4.
 * Teste: npm run exercicio -- 09-armazenamento
 */
export function criarArmazenamento(storage, chave) {
  // escreva seu código aqui
}

export function lerTema(storage, prefereEscuro) {
  // escreva seu código aqui
}

export function salvarTema(storage, tema) {
  // escreva seu código aqui
}
