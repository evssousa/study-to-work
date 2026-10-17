/**
 * Exercício 04 — Eventos: reagindo ao usuário
 *
 * a) `ativarContador(raiz)`
 *    A `raiz` é um elemento que contém estes outros:
 *      <button data-acao="menos">−</button>
 *      <output class="valor">0</output>
 *      <button data-acao="mais">+</button>
 *      <button data-acao="zerar">Zerar</button>
 *    Faça os botões funcionarem com addEventListener("click", ...):
 *      - "mais" soma 1;  "menos" subtrai 1;  "zerar" volta a 0.
 *      - O número NUNCA fica negativo.
 *      - O texto do .valor é sempre atualizado.
 *      - O botão "menos" fica desabilitado (propriedade disabled) quando o valor é 0.
 *        Ele já deve começar desabilitado.
 *    Cada contador tem o SEU valor: duas raízes na mesma página não se misturam. Guarde o
 *    valor numa variável local da função ativarContador (closure!), não numa global.
 *
 * b) `ativarLimiteDeCaracteres(campo, saida, limite)`
 *    A cada digitação (evento "input") mostra em `saida` quantos caracteres ainda restam:
 *      saida.textContent = "12 restantes"         (use sempre a palavra "restantes")
 *    Se passou do limite, o número fica negativo ("-3 restantes") e a saída ganha a classe
 *    "excedido" (remova a classe quando voltar ao normal).
 *    Também deve mostrar o valor inicial assim que for ativado.
 *
 * Dica: o texto do campo está em campo.value; o evento é "input", e não "change"
 * (o "change" só dispara quando o campo perde o foco).
 *
 * Aula: seção 2.1 e 2.2.
 * Teste: npm run exercicio -- 04-eventos
 */
export function ativarContador(raiz) {
  // escreva seu código aqui
}

export function ativarLimiteDeCaracteres(campo, saida, limite) {
  // escreva seu código aqui
}
