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
  metodoParaBuscar: null,

  // Qual método usar para CRIAR um novo pedido?
  metodoParaCriar: null,

  // Qual método usar para mudar APENAS o endereço de entrega de um pedido (atualização parcial)?
  metodoParaAtualizarParcialmente: null,

  // Qual método usar para SUBSTITUIR um produto inteiro por uma nova versão?
  metodoParaSubstituir: null,

  // Qual método usar para REMOVER um item do carrinho?
  metodoParaRemover: null,

  // Qual código de status indica que a busca deu certo?
  statusSucesso: null,

  // Qual código indica que o pedido foi CRIADO com sucesso?
  statusCriado: null,

  // O cliente enviou um formulário com o e-mail em branco. Qual código o servidor responde?
  statusRequisicaoInvalida: null,

  // O cliente tentou ver "Meus pedidos" sem ter feito login. Qual código?
  statusNaoAutenticado: null,

  // Um cliente logado tentou acessar a área do administrador. Qual código?
  statusSemPermissao: null,

  // O cliente acessou /produtos/999 e esse produto não existe. Qual código?
  statusNaoEncontrado: null,

  // O servidor travou por causa de um bug no código. Qual código?
  statusErroDoServidor: null,

  // Qual a porta padrão do HTTPS?
  portaPadraoHttps: null,

  // Qual sistema traduz "minhaloja.com.br" para um endereço IP? (sigla)
  sistemaQueTraduzDominios: null,

  // Em qual parte da requisição vai o token de login: "url", "cabecalho" ou "corpo"?
  ondeVaiOTokenDeLogin: null,
};
