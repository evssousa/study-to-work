/**
 * Exercício 07 — Formulário com validação acessível
 *
 * a) `validarCadastro(dados)` — função PURA (sem DOM). Recebe um objeto com os campos
 *    nome, email, senha, confirmacao e aceito, e retorna um objeto só com os campos
 *    que têm problema: { campo: "mensagem" }. Objeto vazio {} = tudo certo.
 *
 *      nome         menos de 2 letras (depois de tirar espaços das pontas)
 *                   → "Informe seu nome (mínimo 2 letras)"
 *      email        fora do formato algo@algo.algo
 *                   → "E-mail inválido"
 *      senha        menos de 8 caracteres
 *                   → "A senha deve ter pelo menos 8 caracteres"
 *      confirmacao  diferente da senha
 *                   → "As senhas não conferem"
 *      aceito       diferente de "on" (é o valor que uma caixa marcada envia)
 *                   → "Você precisa aceitar os termos"
 *
 * b) `ativarFormulario(form, aoEnviar)` — liga o formulário ao validador.
 *    O formulário tem campos com name="nome", "email", "senha", "confirmacao", "aceito" e,
 *    para cada campo, um elemento de mensagem com id="erro-<campo>" (ex.: id="erro-email").
 *
 *    No evento "submit":
 *      1. evento.preventDefault()  (senão a página recarrega);
 *      2. leia os dados:  Object.fromEntries(new FormData(form))
 *         (atenção: uma caixa de seleção desmarcada NÃO aparece no FormData);
 *      3. valide com validarCadastro;
 *      4. para CADA um dos 5 campos:
 *           - com erro: escreva a mensagem em #erro-<campo> (textContent), coloque
 *             aria-invalid="true" no campo e aria-describedby="erro-<campo>" no campo;
 *           - sem erro: esvazie #erro-<campo> e REMOVA o aria-invalid do campo;
 *      5. se houver erros, coloque o foco (focus()) no PRIMEIRO campo com erro
 *         (na ordem: nome, email, senha, confirmacao, aceito) e pare;
 *      6. se estiver tudo certo: chame aoEnviar(dados) e depois form.reset().
 *
 * Aula: seção 3.
 * Teste: npm run exercicio -- 07-formulario
 */
export function validarCadastro(dados) {
  // escreva seu código aqui
}

export function ativarFormulario(form, aoEnviar) {
  // escreva seu código aqui
}
