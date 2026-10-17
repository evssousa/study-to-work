const CAMPOS = ["nome", "email", "senha", "confirmacao", "aceito"];

export function validarCadastro(dados) {
  const erros = {};
  if ((dados.nome ?? "").trim().length < 2) erros.nome = "Informe seu nome (mínimo 2 letras)";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email ?? "")) erros.email = "E-mail inválido";
  if ((dados.senha ?? "").length < 8) erros.senha = "A senha deve ter pelo menos 8 caracteres";
  if (dados.confirmacao !== dados.senha) erros.confirmacao = "As senhas não conferem";
  if (dados.aceito !== "on") erros.aceito = "Você precisa aceitar os termos";
  return erros;
}

export function ativarFormulario(form, aoEnviar) {
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dados = Object.fromEntries(new FormData(form));
    const erros = validarCadastro(dados);

    for (const nome of CAMPOS) {
      const campo = form.elements[nome];
      const mensagem = form.ownerDocument.querySelector(`#erro-${nome}`);
      if (erros[nome]) {
        mensagem.textContent = erros[nome];
        campo.setAttribute("aria-invalid", "true");
        campo.setAttribute("aria-describedby", `erro-${nome}`);
      } else {
        mensagem.textContent = "";
        campo.removeAttribute("aria-invalid");
      }
    }

    const primeiroComErro = CAMPOS.find((nome) => erros[nome]);
    if (primeiroComErro) {
      form.elements[primeiroComErro].focus();
      return;
    }

    aoEnviar(dados);
    form.reset();
  });
}
