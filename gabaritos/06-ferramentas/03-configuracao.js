export class ConfiguracaoError extends Error {
  constructor(problemas) {
    super(`Configuração inválida:\n${problemas.map((p) => `- ${p}`).join("\n")}`);
    this.name = "ConfiguracaoError";
    this.problemas = problemas;
  }
}

const NOME_VALIDO = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function parsearEnv(texto) {
  const resultado = {};
  for (const linhaBruta of texto.split(/\r?\n/)) {
    const linha = linhaBruta.trim();
    if (linha === "" || linha.startsWith("#")) continue;

    const posicao = linha.indexOf("=");
    if (posicao === -1) continue;

    const chave = linha.slice(0, posicao).trim().replace(/^export\s+/, "");
    if (!NOME_VALIDO.test(chave)) continue;

    let valor = linha.slice(posicao + 1).trim();
    const abertura = valor[0];
    if ((abertura === '"' || abertura === "'") && valor.lastIndexOf(abertura) > 0) {
      const fim = valor.lastIndexOf(abertura);
      valor = valor.slice(1, fim);
      if (abertura === '"') valor = valor.replaceAll("\\n", "\n");
    } else {
      const comentario = valor.indexOf(" #");
      if (comentario !== -1) valor = valor.slice(0, comentario).trim();
    }
    resultado[chave] = valor;
  }
  return resultado;
}

const VERDADEIROS = ["true", "1", "sim", "yes", "on"];
const FALSOS = ["false", "0", "nao", "no", "off"];

export function lerConfiguracao(env, esquema) {
  const configuracao = {};
  const problemas = [];

  for (const [chave, regra] of Object.entries(esquema)) {
    const bruto = env[chave];
    const definida = typeof bruto === "string" && bruto.trim() !== "";

    if (!definida) {
      if (regra.padrao !== undefined) configuracao[chave] = regra.padrao;
      else if (regra.obrigatoria) problemas.push(`${chave} é obrigatória`);
      else configuracao[chave] = null;
      continue;
    }

    const valor = bruto.trim();
    if (regra.tipo === "numero") {
      const numero = Number(valor);
      if (Number.isFinite(numero)) configuracao[chave] = numero;
      else problemas.push(`${chave} deve ser um número (recebido: "${valor}")`);
    } else if (regra.tipo === "booleano") {
      const minusculo = valor.toLowerCase();
      if (VERDADEIROS.includes(minusculo)) configuracao[chave] = true;
      else if (FALSOS.includes(minusculo)) configuracao[chave] = false;
      else problemas.push(`${chave} deve ser verdadeiro ou falso (recebido: "${valor}")`);
    } else if (regra.tipo === "opcao") {
      if (regra.opcoes.includes(valor)) configuracao[chave] = valor;
      else problemas.push(`${chave} deve ser uma de: ${regra.opcoes.join(", ")} (recebido: "${valor}")`);
    } else {
      configuracao[chave] = valor;
    }
  }

  if (problemas.length > 0) throw new ConfiguracaoError(problemas);
  return configuracao;
}

export function mostrarConfiguracao(configuracao, esquema) {
  const copia = { ...configuracao };
  for (const [chave, regra] of Object.entries(esquema)) {
    if (regra.segredo && copia[chave] !== null && copia[chave] !== undefined) copia[chave] = "***";
  }
  return copia;
}
