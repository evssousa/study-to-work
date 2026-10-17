/**
 * Exercício 03 — HTTP na prática
 *
 * Preencha cada resposta trocando o null pelo valor certo.
 * Métodos são strings em MAIÚSCULAS ("GET"); códigos de status são números (200).
 *
 * Situação: você está construindo uma loja virtual.
 *
 * Aula: seções 4.6 a 4.9 (HTTP).
 * Teste: npm run exercicio -- 03-http
 */
export const respostas = {
  // Qual método HTTP o navegador usa para BUSCAR a lista de produtos?
  metodoParaBuscar: "GET",

  // Qual método usar para CRIAR um novo pedido?
  metodoParaCriar: "POST",

  // Qual método usar para mudar APENAS o endereço de entrega de um pedido (atualização parcial)?
  metodoParaAtualizarParcialmente: "PATCH",

  // Qual método usar para SUBSTITUIR um produto inteiro por uma nova versão?
  metodoParaSubstituir: "PUT",

  // Qual método usar para REMOVER um item do carrinho?
  metodoParaRemover: "DELETE",

  // Qual código de status indica que a busca deu certo?
  statusSucesso: 200,

  // Qual código indica que o pedido foi CRIADO com sucesso?
  statusCriado: 201,

  // O cliente enviou um formulário com o e-mail em branco. Qual código o servidor responde?
  statusRequisicaoInvalida: 400,

  // O cliente tentou ver "Meus pedidos" sem ter feito login. Qual código?
  statusNaoAutenticado: 401,

  // Um cliente logado tentou acessar a área do administrador. Qual código?
  statusSemPermissao: 403,

  // O cliente acessou /produtos/999 e esse produto não existe. Qual código?
  statusNaoEncontrado: 404,

  // O servidor travou por causa de um bug no código. Qual código?
  statusErroDoServidor: 500,

  // Qual a porta padrão do HTTPS?
  portaPadraoHttps: 443,

  // Qual sistema traduz "minhaloja.com.br" para um endereço IP? (sigla)
  sistemaQueTraduzDominios: "DNS",

  // Em qual parte da requisição vai o token de login: "url", "cabecalho" ou "corpo"?
  ondeVaiOTokenDeLogin: "cabecalho",
};
