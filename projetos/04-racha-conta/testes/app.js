import { caminhoDoProjeto } from "../../../suporte/arquivos.js";
import { digitar, disparar, enviar, instalarClassesDoDom, marcar, textoDe } from "../../../suporte/dom.js";
import { carregarPagina } from "../../../suporte/html.js";
import { importarDoProjeto } from "./carregar.js";

/**
 * Abre o index.html do aluno num "navegador" de mentira (sem executar os scripts),
 * chama iniciarApp e devolve funções para a pessoa "usar" a tela.
 *
 * `guardado`: texto que já está no localStorage (para simular quem reabre o app).
 * `confirmar`: função que responde ao "tem certeza?" (padrão: sempre sim).
 */
export async function abrirApp({ guardado, confirmar = () => true } = {}) {
  const { iniciarApp } = await importarDoProjeto("ui.js");
  const pagina = carregarPagina(caminhoDoProjeto("index.html"), { url: "http://localhost/" });
  instalarClassesDoDom(pagina.window);
  const { document, window } = pagina;

  if (guardado !== undefined) window.localStorage.setItem("racha-conta:v1", guardado);
  const raiz = document.querySelector("#app");
  iniciarApp(raiz, { storage: window.localStorage, confirmar });

  const q = (seletor) => raiz.querySelector(seletor);
  const todos = (seletor) => [...raiz.querySelectorAll(seletor)];

  const app = {
    ...pagina,
    raiz,
    storage: window.localStorage,
    q,
    todos,
    texto: (seletor) => textoDe(q(seletor)),
    textos: (seletor) => todos(seletor).map((elemento) => textoDe(elemento)),

    criarRacha(nome) {
      digitar(q("#form-racha [name=nome]"), nome);
      enviar(q("#form-racha"));
    },
    adicionarParticipante(nome) {
      digitar(q("#form-participante [name=nome]"), nome);
      enviar(q("#form-participante"));
    },
    escolherPagador(nome) {
      const opcao = [...q("#form-despesa [name=pagador]").options].find((o) => o.textContent.trim() === nome);
      q("#form-despesa [name=pagador]").value = opcao ? opcao.value : "";
      disparar(q("#form-despesa [name=pagador]"), "change");
    },
    /** Marca só as pessoas informadas na divisão da despesa. */
    escolherQuemDivide(nomes) {
      for (const caixa of todos('#form-despesa [name="participantes"]')) {
        const nome = textoDe(caixa.closest("label") ?? caixa.parentElement);
        marcar(caixa, nomes.includes(nome));
      }
    },
    preencherDespesa({ descricao, digitosDoValor, pagador, divide }) {
      if (descricao !== undefined) digitar(q("#form-despesa [name=descricao]"), descricao);
      if (digitosDoValor !== undefined) digitar(q("#form-despesa [name=valor]"), digitosDoValor);
      if (pagador !== undefined) app.escolherPagador(pagador);
      if (divide !== undefined) app.escolherQuemDivide(divide);
    },
    enviarDespesa() {
      enviar(q("#form-despesa"));
    },
    /** Registra uma despesa de ponta a ponta, como uma pessoa faria. */
    adicionarDespesa(dados) {
      app.preencherDespesa(dados);
      app.enviarDespesa();
    },
    trocarRacha(nome) {
      const seletor = q("#seletor-racha");
      const opcao = [...seletor.options].find((o) => o.textContent.trim() === nome);
      seletor.value = opcao.value;
      disparar(seletor, "change");
    },
    nomesDosParticipantes: () => app.textos("#lista-participantes li .nome"),
    guardadoAgora: () => JSON.parse(window.localStorage.getItem("racha-conta:v1")),
  };
  return app;
}

/** O cenário do enunciado: Churrasco com Ana, Bruno e Carla, duas despesas. */
export async function abrirComChurrasco() {
  const app = await abrirApp();
  app.criarRacha("Churrasco");
  for (const nome of ["Ana", "Bruno", "Carla"]) app.adicionarParticipante(nome);
  app.adicionarDespesa({ descricao: "Carne", digitosDoValor: "9000", pagador: "Ana" });
  app.adicionarDespesa({ descricao: "Bebidas", digitosDoValor: "3000", pagador: "Bruno", divide: ["Bruno", "Carla"] });
  return app;
}
