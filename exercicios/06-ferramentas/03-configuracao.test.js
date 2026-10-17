import { describe, expect, test } from "vitest";
import * as modulo from "./03-configuracao.js";

const { parsearEnv, lerConfiguracao, mostrarConfiguracao, ConfiguracaoError } = modulo;

describe("parsearEnv", () => {
  test("o básico: chave=valor, comentários e linhas em branco", () => {
    const texto = "# configuração\nPORTA=3000\n\nNOME=Loja\n   # outro comentário\n";
    expect(parsearEnv(texto)).toEqual({ PORTA: "3000", NOME: "Loja" });
  });

  test("tira espaços em volta da chave e do valor", () => {
    expect(parsearEnv("  PORTA =  3000  ")).toEqual({ PORTA: "3000" });
  });

  test("aspas duplas e simples são removidas; \\n só vira quebra de linha nas duplas", () => {
    const texto = 'A="Loja do Bairro"\nB=\'valor simples\'\nC="linha1\\nlinha2"\nD=\'sem\\nquebra\'';
    expect(parsearEnv(texto)).toEqual({
      A: "Loja do Bairro",
      B: "valor simples",
      C: "linha1\nlinha2",
      D: "sem\\nquebra",
    });
  });

  test("comentário no fim da linha só vale em valores SEM aspas", () => {
    expect(parsearEnv("URL=http://x.com # servidor\nMSG=\"oi # tchau\"")).toEqual({
      URL: "http://x.com",
      MSG: "oi # tchau",
    });
    expect(parsearEnv("URL=http://x.com/#fragmento")).toEqual({ URL: "http://x.com/#fragmento" });
  });

  test("export na frente e só o primeiro = separa", () => {
    expect(parsearEnv("export TOKEN=abc\nSENHA=a=b=c")).toEqual({ TOKEN: "abc", SENHA: "a=b=c" });
  });

  test("valor vazio é mantido como texto vazio", () => {
    expect(parsearEnv("VAZIO=\nOUTRA=\"\"")).toEqual({ VAZIO: "", OUTRA: "" });
  });

  test("ignora linhas sem = e nomes inválidos; vale a última repetição", () => {
    const texto = "SEM IGUAL\n1INVALIDA=x\nNOME-COM-HIFEN=y\nOK=1\nOK=2";
    expect(parsearEnv(texto)).toEqual({ OK: "2" });
  });

  test("aceita quebras de linha do Windows", () => {
    expect(parsearEnv("A=1\r\nB=2\r\n")).toEqual({ A: "1", B: "2" });
  });

  test("texto vazio dá objeto vazio", () => {
    expect(parsearEnv("")).toEqual({});
  });
});

const esquema = {
  PORTA: { tipo: "numero", padrao: 3000 },
  DEBUG: { tipo: "booleano", padrao: false },
  API_URL: { tipo: "texto", obrigatoria: true },
  MODO: { tipo: "opcao", opcoes: ["dev", "prod"], padrao: "dev" },
};

describe("lerConfiguracao", () => {
  test("converte cada variável para o seu tipo", () => {
    const config = lerConfiguracao({ PORTA: "8080", DEBUG: "true", API_URL: "  https://api.exemplo.com ", MODO: "prod" }, esquema);
    expect(config).toEqual({ PORTA: 8080, DEBUG: true, API_URL: "https://api.exemplo.com", MODO: "prod" });
  });

  test("usa os valores padrão quando a variável não existe ou está vazia", () => {
    const config = lerConfiguracao({ API_URL: "https://x.com", PORTA: "", DEBUG: "   " }, esquema);
    expect(config).toEqual({ PORTA: 3000, DEBUG: false, API_URL: "https://x.com", MODO: "dev" });
  });

  test("variável opcional sem padrão fica null", () => {
    const config = lerConfiguracao({}, { CHAVE: { tipo: "texto" } });
    expect(config).toEqual({ CHAVE: null });
  });

  test.each([
    ["true", true], ["TRUE", true], ["1", true], ["sim", true], ["yes", true], ["on", true],
    ["false", false], ["False", false], ["0", false], ["nao", false], ["no", false], ["off", false],
  ])("booleano '%s' → %s", (texto, esperado) => {
    expect(lerConfiguracao({ X: texto }, { X: { tipo: "booleano" } }).X).toBe(esperado);
  });

  test("lança ConfiguracaoError com TODOS os problemas, na ordem do esquema", () => {
    const erro = (() => {
      try {
        lerConfiguracao({ PORTA: "abc", DEBUG: "talvez", MODO: "teste" }, esquema);
      } catch (e) {
        return e;
      }
    })();
    expect(erro).toBeInstanceOf(ConfiguracaoError);
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe("ConfiguracaoError");
    expect(erro.problemas).toEqual([
      'PORTA deve ser um número (recebido: "abc")',
      'DEBUG deve ser verdadeiro ou falso (recebido: "talvez")',
      "API_URL é obrigatória",
      'MODO deve ser uma de: dev, prod (recebido: "teste")',
    ]);
    expect(erro.message).toBe(
      "Configuração inválida:\n- PORTA deve ser um número (recebido: \"abc\")\n- DEBUG deve ser verdadeiro ou falso (recebido: \"talvez\")\n- API_URL é obrigatória\n- MODO deve ser uma de: dev, prod (recebido: \"teste\")",
    );
  });

  test("número: aceita decimais e negativos, rejeita Infinity e NaN", () => {
    const e = { N: { tipo: "numero" } };
    expect(lerConfiguracao({ N: "-2.5" }, e).N).toBe(-2.5);
    expect(() => lerConfiguracao({ N: "Infinity" }, e)).toThrow(ConfiguracaoError);
    expect(() => lerConfiguracao({ N: "1,5" }, e)).toThrow(ConfiguracaoError);
  });

  test("funciona com process.env de verdade (objeto com texto)", () => {
    const config = lerConfiguracao({ ...process.env, API_URL: "https://x.com" }, { API_URL: { tipo: "texto", obrigatoria: true } });
    expect(config.API_URL).toBe("https://x.com");
  });
});

describe("mostrarConfiguracao", () => {
  const esquemaComSegredo = {
    PORTA: { tipo: "numero", padrao: 3000 },
    SENHA_DO_BANCO: { tipo: "texto", obrigatoria: true, segredo: true },
    CHAVE_OPCIONAL: { tipo: "texto", segredo: true },
  };

  test("esconde os segredos e mantém o resto", () => {
    const config = lerConfiguracao({ SENHA_DO_BANCO: "super-secreta" }, esquemaComSegredo);
    expect(mostrarConfiguracao(config, esquemaComSegredo)).toEqual({ PORTA: 3000, SENHA_DO_BANCO: "***", CHAVE_OPCIONAL: null });
  });

  test("não altera o objeto original", () => {
    const config = lerConfiguracao({ SENHA_DO_BANCO: "super-secreta" }, esquemaComSegredo);
    mostrarConfiguracao(config, esquemaComSegredo);
    expect(config.SENHA_DO_BANCO).toBe("super-secreta");
  });
});
