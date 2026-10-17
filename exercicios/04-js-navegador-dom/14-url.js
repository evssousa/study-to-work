/**
 * Exercício 14 — URLs e parâmetros (filtros compartilháveis e link de WhatsApp)
 *
 * Guardar os filtros de uma tela na URL (?categoria=moveis&pagina=2) permite favoritar,
 * compartilhar e usar o botão "voltar". O navegador já traz as ferramentas: URL e
 * URLSearchParams (elas também existem no Node, então os testes rodam sem navegador).
 *
 * a) `lerFiltros(busca)` — `busca` é a query string (com ou sem o "?" na frente).
 *    Retorna sempre um objeto com estas chaves:
 *      categoria  texto, ou null se ausente/vazia
 *      min, max   número, ou null se ausente ou se não for um número válido
 *      ordem      "relevancia" (padrão), "preco" ou "nome"; qualquer outro valor → "relevancia"
 *      pagina     inteiro >= 1; ausente, inválido ou menor que 1 → 1
 *    Exemplo: lerFiltros("?categoria=moveis&min=100&pagina=3")
 *      → { categoria: "moveis", min: 100, max: null, ordem: "relevancia", pagina: 3 }
 *    Dica: new URLSearchParams(busca) já aceita o "?" na frente. Atenção: Number("") é 0!
 *
 * b) `montarBusca(filtros)` — o caminho inverso: retorna a query string COM o "?" na frente,
 *    na ordem categoria, min, max, ordem, pagina, OMITINDO o que for padrão:
 *    categoria/min/max nulos, ordem "relevancia" e pagina 1.
 *    Se não sobrar nada, retorna "" (texto vazio). Use URLSearchParams (ele codifica
 *    caracteres especiais, como espaço e acentos, sozinho).
 *      montarBusca({ categoria: "casa e jardim", min: null, max: 500, ordem: "preco", pagina: 1 })
 *        → "?categoria=casa+e+jardim&max=500&ordem=preco"
 *
 * c) `linkWhatsApp(telefone, mensagem)` — retorna o link para abrir uma conversa:
 *      https://wa.me/<numero>?text=<mensagem codificada>
 *    O número fica só com dígitos; se tiver 10 ou 11 dígitos (sem o código do país),
 *    acrescente o 55 do Brasil na frente. Use encodeURIComponent na mensagem.
 *      linkWhatsApp("(81) 99999-0000", "Olá, tudo bem?")
 *        → "https://wa.me/5581999990000?text=Ol%C3%A1%2C%20tudo%20bem%3F"
 *    Telefone sem dígitos suficientes (menos de 10): throw new Error("Telefone inválido").
 *
 * Aula: seção 8.
 * Teste: npm run exercicio -- 14-url
 */
export function lerFiltros(busca) {
  // escreva seu código aqui
}

export function montarBusca(filtros) {
  // escreva seu código aqui
}

export function linkWhatsApp(telefone, mensagem) {
  // escreva seu código aqui
}
