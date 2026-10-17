# Módulo 09 — TypeScript

> ⚠️ **Versão anterior.** Este módulo ainda não foi reescrito no novo padrão do curso (aula
> detalhada, exercícios com correção automática e projeto de portfólio utilizável). O conteúdo
> serve de referência, mas exercícios e projeto vão mudar.

**Duração:** 3 semanas · **Pré-requisito:** Módulo 08

## Objetivos

- Entender por que o mercado usa TypeScript em praticamente todo projeto novo.
- Tipar variáveis, funções, objetos e APIs.
- Usar generics, union types, narrowing e utility types.
- Configurar um projeto TS e migrar código JS.

---

## 1. Por que TypeScript?

TypeScript é JavaScript **com tipos**. O compilador encontra erros *antes* de rodar o código,
o editor passa a autocompletar tudo e o código se documenta sozinho.

```ts
function calcularTotal(preco: number, quantidade: number): number {
  return preco * quantidade;
}

calcularTotal("10", 2); // ❌ erro no editor: string não é number
```

Configurando:

```bash
npm create vite@latest meu-app -- --template vanilla-ts
# ou, em um projeto Node:
npm install -D typescript tsx @types/node
npx tsc --init
npx tsx src/index.ts   # roda TS direto, sem compilar
```

No `tsconfig.json`, mantenha **`"strict": true`** sempre.

## 2. Tipos básicos

```ts
let nome: string = "Ana";
let idade = 25;                 // inferência: o TS já sabe que é number
let ativo: boolean = true;
let tags: string[] = ["js", "ts"];
let par: [string, number] = ["idade", 25]; // tupla
let qualquer: unknown;          // "não sei o tipo" — seguro, obriga a verificar
// any desliga o TypeScript. Evite.

function log(msg: string): void { console.log(msg); }
function falhar(msg: string): never { throw new Error(msg); }
```

Regra: **deixe o TS inferir** quando for óbvio; declare tipos em parâmetros de funções,
retornos públicos e estruturas de dados.

## 3. Objetos: `type` e `interface`

```ts
type Usuario = {
  id: string;
  nome: string;
  email: string;
  telefone?: string;            // opcional
  readonly criadoEm: Date;      // não pode ser alterado
};

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface ProdutoDigital extends Produto {
  urlDownload: string;
}
```

`type` e `interface` são quase equivalentes para objetos. Escolha um padrão e seja consistente
(muitos times usam `type` para tudo).

## 4. Union types, literais e narrowing

```ts
type Status = "pendente" | "pago" | "cancelado";   // só esses valores

function corDoStatus(status: Status) {
  switch (status) {
    case "pendente": return "amarelo";
    case "pago": return "verde";
    case "cancelado": return "vermelho";
  }
}

// Narrowing: o TS "estreita" o tipo após uma verificação
function formatar(valor: string | number) {
  if (typeof valor === "number") return valor.toFixed(2); // aqui é number
  return valor.toUpperCase();                              // aqui é string
}
```

### Discriminated unions — modelando estados corretamente

```ts
type EstadoRequisicao<T> =
  | { status: "carregando" }
  | { status: "erro"; mensagem: string }
  | { status: "sucesso"; dados: T };

function render(estado: EstadoRequisicao<Produto[]>) {
  if (estado.status === "sucesso") {
    estado.dados.forEach((p) => console.log(p.nome)); // dados só existe aqui
  }
}
```

Impossível acessar `dados` durante o carregamento — estados inválidos viram erro de compilação.

## 5. Generics

Generics são "parâmetros de tipo": permitem funções e tipos reutilizáveis sem perder a tipagem.

```ts
function primeiro<T>(lista: T[]): T | undefined {
  return lista[0];
}
primeiro([1, 2, 3]);       // number | undefined
primeiro(["a", "b"]);      // string | undefined

async function buscar<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}
const produtos = await buscar<Produto[]>("/api/produtos");

// Restrições
function porId<T extends { id: number }>(lista: T[], id: number) {
  return lista.find((item) => item.id === id);
}

type RespostaPaginada<T> = {
  itens: T[];
  total: number;
  pagina: number;
};
```

## 6. Utility types

```ts
type NovoUsuario = Omit<Usuario, "id" | "criadoEm">;   // sem esses campos
type AtualizarUsuario = Partial<NovoUsuario>;          // tudo opcional
type UsuarioPublico = Pick<Usuario, "id" | "nome">;    // só esses campos
type ContagemPorStatus = Record<Status, number>;       // { pendente: number; pago: number; ... }
type Obrigatorio = Required<Usuario>;
type Retorno = ReturnType<typeof corDoStatus>;
type ItemDoArray = (typeof tags)[number];

const config = { tema: "escuro", idioma: "pt" } as const; // valores literais e readonly
type Tema = typeof config.tema; // "escuro"

const rotas = { home: "/", sobre: "/sobre" } satisfies Record<string, string>;
```

## 7. Tipando o DOM e eventos

```ts
const input = document.querySelector<HTMLInputElement>("#busca");
input?.addEventListener("input", (e) => {
  const alvo = e.target as HTMLInputElement;
  console.log(alvo.value);
});
```

## 8. Validação em tempo de execução: Zod

Tipos do TS **somem** quando o código roda. Dados de fora (APIs, formulários) precisam de
validação real. Zod valida **e** gera o tipo:

```ts
import { z } from "zod";

const UsuarioSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  idade: z.number().int().positive().optional(),
});

type Usuario = z.infer<typeof UsuarioSchema>;

const resultado = UsuarioSchema.safeParse(dadosDoFormulario);
if (!resultado.success) console.log(resultado.error.flatten());
else salvar(resultado.data); // tipado e validado
```

Você vai usar Zod no frontend (formulários) e no backend (validação de requisições).

---

## Exercícios

1. Pegue os exercícios de arrays do módulo 03 e reescreva-os em TS com `strict`.
2. Tipe um `Carrinho` com itens, cupom (`{ tipo: "percentual" | "fixo"; valor: number }`) e total.
3. Crie a função genérica `agruparPor<T, K extends keyof T>(lista: T[], chave: K)`.
4. Modele os estados de uma tela de login com discriminated union e escreva o `render`.
5. Crie um cliente HTTP tipado `api.get<T>()`, `api.post<T, B>()` com tratamento de erro.
6. Valide a resposta de uma API pública com Zod e mostre erro amigável se o formato vier errado.

## Projeto do módulo

**Kanban em TypeScript**: migre o Kanban (módulo 04/06) para TypeScript estrito.
Tipos para `Quadro`, `Coluna`, `Cartao`, `Prioridade` e eventos; validação do JSON importado com
Zod; zero `any`; `npm run typecheck` (`tsc --noEmit`) passando no pre-commit.

## Checklist para avançar

- [ ] Configuro projetos TS com `strict`.
- [ ] Uso unions, narrowing e discriminated unions para modelar estados.
- [ ] Escrevo funções e tipos genéricos.
- [ ] Uso utility types (`Partial`, `Pick`, `Omit`, `Record`).
- [ ] Valido dados externos com Zod.
