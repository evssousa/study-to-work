/**
 * Exercício 09 — Classes: Produto e Carrinho
 *
 * Uma classe é um molde para criar objetos que juntam DADOS e COMPORTAMENTO. Você vai
 * modelar o carrinho de uma loja usando campos privados (#), getters, métodos estáticos e
 * validação no construtor.
 *
 * ── class Produto ──────────────────────────────────────────────
 *   new Produto({ id, nome, precoCentavos })
 *     - nome sem espaços nas pontas; nome vazio  → throw new Error("Nome do produto é obrigatório")
 *     - precoCentavos precisa ser um inteiro >= 0 → senão throw new Error("Preço inválido")
 *     - guarde os dados em campos PRIVADOS (#id, #nome, #precoCentavos) e exponha só
 *       leitura por getters: produto.id, produto.nome, produto.precoCentavos
 *       (tentar atribuir produto.nome = "x" não deve alterar nada)
 *     - get precoFormatado → "R$ 4,50"  (toLocaleString pt-BR em reais; troque o espaço
 *       inquebrável por espaço comum: .replace(/ /g, " "))
 *     - static deObjeto(obj) → cria um Produto a partir de um objeto simples
 *     - toJSON() → { id, nome, precoCentavos } (para JSON.stringify funcionar)
 *
 * ── class Carrinho ─────────────────────────────────────────────
 *   new Carrinho({ cupons = {} } = {})
 *     `cupons` é um objeto { CODIGO: percentualDeDesconto }, ex.: { DESC10: 10 }
 *     Os itens ficam num campo PRIVADO (#itens), um Map de id → { produto, quantidade }.
 *
 *   adicionar(produto, quantidade = 1)   soma à quantidade se o produto já está no carrinho;
 *                                        quantidade precisa ser inteiro >= 1, senão
 *                                        throw new Error("Quantidade inválida"). Retorna `this`.
 *   remover(id)                          tira o produto. Retorna `this`.
 *   alterarQuantidade(id, quantidade)    define a quantidade; 0 ou menos remove o produto;
 *                                        id inexistente → throw new Error("Produto não está no carrinho").
 *                                        Retorna `this`.
 *   aplicarCupom(codigo)                 guarda o cupom (maiúsculas/minúsculas não importam);
 *                                        cupom desconhecido → throw new Error(`Cupom inválido: ${codigo}`).
 *                                        Retorna `this`.
 *   get itens                            um ARRAY NOVO de { produto, quantidade } (alterá-lo
 *                                        não pode afetar o carrinho), na ordem de inserção
 *   get quantidadeTotal                  soma das quantidades
 *   get subtotalCentavos                 soma de preço × quantidade
 *   get descontoCentavos                 subtotal × percentual do cupom, arredondado (Math.round); 0 sem cupom
 *   get totalCentavos                    subtotal − desconto
 *   get vazio                            true se não houver itens
 *
 * Aula: seção 6.
 * Teste: npm run exercicio -- 09-classes
 */

// escreva as classes Produto e Carrinho aqui (e exporte as duas)
