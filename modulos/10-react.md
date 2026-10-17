# Módulo 10 — React

> ⚠️ **Versão anterior.** Este módulo ainda não foi reescrito no novo padrão do curso (aula
> detalhada, exercícios com correção automática e projeto de portfólio utilizável). O conteúdo
> serve de referência, mas exercícios e projeto vão mudar.

**Duração:** 6–8 semanas · **Pré-requisito:** Módulo 09

## Objetivos

- Pensar em componentes e em "interface como função do estado".
- Dominar JSX, props, estado, eventos, listas e formulários.
- Usar os hooks corretamente (`useState`, `useEffect`, `useRef`, `useMemo`, `useContext`…).
- Criar SPAs com rotas, busca de dados com cache e estado global.
- Estilizar com Tailwind CSS e construir uma aplicação completa e performática.

```bash
npm create vite@latest loja -- --template react-ts
```

---

## 1. Componentes e JSX

Um componente é uma **função que retorna interface**.

```tsx
type CardProdutoProps = {
  nome: string;
  preco: number;
  imagem: string;
  emPromocao?: boolean;
};

export function CardProduto({ nome, preco, imagem, emPromocao = false }: CardProdutoProps) {
  return (
    <article className="card">
      <img src={imagem} alt={nome} />
      <h2>{nome}</h2>
      {emPromocao && <span className="badge">Promoção</span>}
      <p>{preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
    </article>
  );
}

// Uso
<CardProduto nome="Teclado" preco={250} imagem="/teclado.jpg" emPromocao />
```

Regras do JSX: um elemento raiz (ou `<>…</>`), `className` em vez de `class`, expressões entre
`{}`, tags sempre fechadas.

### `children` e composição

```tsx
function Painel({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="painel">
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

<Painel titulo="Resumo">
  <p>Qualquer conteúdo aqui</p>
</Painel>
```

## 2. Estado e eventos

```tsx
import { useState } from "react";

function Contador() {
  const [valor, setValor] = useState(0);

  return (
    <div>
      <p>{valor}</p>
      <button onClick={() => setValor((v) => v + 1)}>+</button>
      <button onClick={() => setValor(0)}>Zerar</button>
    </div>
  );
}
```

- Quando o estado muda, o React **re-renderiza** o componente.
- **Nunca altere o estado diretamente.** Crie um novo valor:

```tsx
setTarefas([...tarefas, nova]);                                     // adicionar
setTarefas(tarefas.filter((t) => t.id !== id));                     // remover
setTarefas(tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t))); // atualizar
setUsuario({ ...usuario, endereco: { ...usuario.endereco, cidade: "Recife" } });
```

- Use a forma `setValor((anterior) => …)` quando o novo valor depende do anterior.

## 3. Listas, chaves e renderização condicional

```tsx
<ul>
  {tarefas.map((tarefa) => (
    <li key={tarefa.id}>{tarefa.texto}</li>   // key única e estável (nunca o índice se a lista muda)
  ))}
</ul>

{carregando ? <Spinner /> : <Lista itens={itens} />}
{erro && <MensagemErro texto={erro} />}
{itens.length === 0 && <EstadoVazio />}
```

## 4. Formulários

```tsx
function FormLogin({ onEntrar }: { onEntrar: (d: { email: string; senha: string }) => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onEntrar({ email, senha });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="senha">Senha</label>
      <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  );
}
```

No mercado, formulários grandes usam **React Hook Form + Zod**:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "Mínimo de 8 caracteres"),
});
type Dados = z.infer<typeof schema>;

function FormLogin() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<Dados>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(async (dados) => await login(dados))}>
      <input {...register("email")} />
      {errors.email && <p role="alert">{errors.email.message}</p>}
      <input type="password" {...register("senha")} />
      {errors.senha && <p role="alert">{errors.senha.message}</p>}
      <button disabled={isSubmitting}>Entrar</button>
    </form>
  );
}
```

## 5. Pensando em React

O processo recomendado pela documentação oficial:
1. Quebre a tela em uma **hierarquia de componentes**.
2. Construa uma versão **estática** (só props).
3. Encontre o **estado mínimo** (o que não pode ser calculado a partir de outra coisa).
4. Decida **onde o estado mora** (no ancestral comum de quem usa).
5. Passe **funções por props** para os filhos alterarem o estado ("lifting state up").

```tsx
// ❌ Estado derivado duplicado
const [tarefas, setTarefas] = useState<Tarefa[]>([]);
const [pendentes, setPendentes] = useState(0);

// ✔ Calcule durante a renderização
const pendentes = tarefas.filter((t) => !t.feita).length;
```

## 6. Hooks principais

### `useEffect` — sincronizar com o mundo externo

```tsx
useEffect(() => {
  const id = setInterval(() => setSegundos((s) => s + 1), 1000);
  return () => clearInterval(id); // limpeza: roda ao desmontar ou antes do próximo efeito
}, []); // dependências: [] = só ao montar

useEffect(() => {
  document.title = `${pendentes} tarefas pendentes`;
}, [pendentes]);
```

> **Você provavelmente não precisa de um efeito** para: calcular valores a partir de props/estado,
> reagir a eventos do usuário (use o próprio handler) ou buscar dados (use TanStack Query).
> Leia: [react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect).

### Outros hooks

```tsx
const inputRef = useRef<HTMLInputElement>(null);       // acesso ao DOM / valor que não re-renderiza
inputRef.current?.focus();

const filtrados = useMemo(() => filtrarCaro(itens, busca), [itens, busca]); // memoriza cálculo
const handleClick = useCallback(() => salvar(id), [id]);                     // memoriza função

const [estado, dispatch] = useReducer(reducer, inicial); // estado complexo com ações
```

### Hooks personalizados — reaproveitando lógica

```tsx
function useLocalStorage<T>(chave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    const salvo = localStorage.getItem(chave);
    return salvo ? (JSON.parse(salvo) as T) : inicial;
  });

  useEffect(() => {
    localStorage.setItem(chave, JSON.stringify(valor));
  }, [chave, valor]);

  return [valor, setValor] as const;
}

function useDebounce<T>(valor: T, ms = 300) {
  const [debounced, setDebounced] = useState(valor);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(valor), ms);
    return () => clearTimeout(id);
  }, [valor, ms]);
  return debounced;
}
```

## 7. Context API — evitando "prop drilling"

```tsx
type Tema = "claro" | "escuro";
const TemaContext = createContext<{ tema: Tema; alternar: () => void } | null>(null);

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>("claro");
  const alternar = () => setTema((t) => (t === "claro" ? "escuro" : "claro"));
  return <TemaContext.Provider value={{ tema, alternar }}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error("useTema deve ser usado dentro de TemaProvider");
  return ctx;
}
```

Use Context para dados que mudam pouco (tema, usuário logado, idioma).

## 8. Rotas com React Router

```tsx
import { createBrowserRouter, RouterProvider, Link, useParams, Outlet } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,          // contém <Outlet /> onde as páginas aparecem
    errorElement: <PaginaErro />,
    children: [
      { index: true, element: <Home /> },
      { path: "produtos/:id", element: <DetalheProduto /> },
      { path: "carrinho", element: <Carrinho /> },
      { path: "conta", element: <RotaProtegida><Conta /></RotaProtegida> },
    ],
  },
]);

function DetalheProduto() {
  const { id } = useParams();
  // ...
}

<RouterProvider router={router} />
```

Aprenda também: `useNavigate`, `useSearchParams` (filtros na URL), rotas protegidas e lazy loading.

## 9. Buscando dados: TanStack Query

Gerencia cache, loading, erro, refetch, paginação e sincronização de dados do servidor.

```tsx
const queryClient = new QueryClient();
<QueryClientProvider client={queryClient}><App /></QueryClientProvider>

function ListaProdutos() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["produtos"],
    queryFn: () => api.get<Produto[]>("/produtos"),
  });

  if (isPending) return <Skeleton />;
  if (isError) return <Erro mensagem={error.message} onTentarNovamente={refetch} />;
  return <Grade produtos={data} />;
}

function BotaoFavoritar({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => api.post(`/produtos/${id}/favorito`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["produtos"] }),
  });
  return <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>♥</button>;
}
```

## 10. Estado global: Zustand

Para estado do cliente compartilhado (carrinho, filtros, UI):

```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CarrinhoStore = {
  itens: ItemCarrinho[];
  adicionar: (p: Produto) => void;
  remover: (id: number) => void;
};

export const useCarrinho = create<CarrinhoStore>()(
  persist(
    (set) => ({
      itens: [],
      adicionar: (p) =>
        set((s) => {
          const existe = s.itens.find((i) => i.id === p.id);
          return {
            itens: existe
              ? s.itens.map((i) => (i.id === p.id ? { ...i, qtd: i.qtd + 1 } : i))
              : [...s.itens, { ...p, qtd: 1 }],
          };
        }),
      remover: (id) => set((s) => ({ itens: s.itens.filter((i) => i.id !== id) })),
    }),
    { name: "carrinho" },
  ),
);

const totalItens = useCarrinho((s) => s.itens.reduce((t, i) => t + i.qtd, 0));
```

**Mapa mental:** estado do **servidor** → TanStack Query · estado **global do cliente** → Zustand
(ou Context) · estado **local** → `useState` · estado **da URL** → search params.
(Redux Toolkit ainda aparece em muitas empresas: conheça o básico.)

## 11. Estilização

- **Tailwind CSS** (mais usado hoje): classes utilitárias direto no JSX.

```tsx
<button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700
                   focus-visible:outline-2 disabled:opacity-50">
  Comprar
</button>
```

- **shadcn/ui** — componentes acessíveis prontos (baseados em Radix) que você copia para o projeto.
- Conheça também CSS Modules e styled-components (comuns em projetos existentes).

## 12. Performance e boas práticas

- Entenda **quando** um componente re-renderiza (estado próprio, pai re-renderizou, contexto mudou).
- Use o **React DevTools Profiler** antes de otimizar. Não saia colocando `useMemo` em tudo.
- `React.memo`, `useMemo`, `useCallback` para casos medidos; o React Compiler automatiza parte disso.
- **Code splitting**: `const Admin = lazy(() => import("./Admin"))` + `<Suspense>`.
- Listas enormes: virtualização (`@tanstack/react-virtual`).
- **Error Boundaries** para que um erro não derrube a aplicação inteira.
- Estrutura de pastas por funcionalidade:

```
src/
├── app/            # providers, rotas
├── features/
│   ├── produtos/   # components/, hooks/, api.ts, types.ts
│   └── carrinho/
├── components/ui/  # botões, inputs, modais reutilizáveis
├── lib/            # cliente http, utilitários
└── main.tsx
```

---

## Exercícios

1. Reescreva o contador, o alternador de tema e o accordion do módulo 04 em React.
2. Lista de tarefas com filtros, usando `useReducer` e um hook `useLocalStorage`.
3. Componente `<Modal>` reutilizável e acessível (foco preso, Esc, portal com `createPortal`).
4. Tela de busca de usuários do GitHub com `useDebounce` + TanStack Query e filtros na URL.
5. Formulário de cadastro em etapas (wizard) com React Hook Form + Zod.
6. Tabela com ordenação, paginação e busca (dados de uma API pública).
7. Use o Profiler para encontrar e corrigir uma re-renderização desnecessária.

## Projetos

### Projeto simples — Gerenciador de finanças pessoais
Cadastro de receitas/despesas com categorias, saldo, filtros por mês, gráfico (Recharts),
persistência local, tema escuro. Tailwind + TypeScript.

### Projeto avançado — Frontend de e-commerce
Consumindo uma API pública (ex.: [DummyJSON](https://dummyjson.com/) ou Fake Store API):
- Home com vitrine, busca com debounce, filtros (categoria, faixa de preço, ordenação) **na URL**,
  paginação.
- Página de produto com galeria de imagens e produtos relacionados.
- Carrinho global (Zustand + persistência), cálculo de frete fake por CEP (ViaCEP), cupom.
- Login (DummyJSON tem endpoint de auth), rota protegida "Minha conta" e checkout em etapas
  com validação.
- TanStack Query para dados, skeletons, tratamento de erro, Error Boundary.
- Lazy loading de rotas, Lighthouse 90+, totalmente responsivo e acessível por teclado.
- Deploy na Vercel ou Netlify.

## Checklist para avançar

- [ ] Quebro telas em componentes e decido onde o estado deve morar.
- [ ] Atualizo estado de forma imutável, sem estado derivado duplicado.
- [ ] Sei quando **não** usar `useEffect`.
- [ ] Crio hooks personalizados.
- [ ] Uso React Router, TanStack Query, Zustand e React Hook Form + Zod.
- [ ] Investigo performance com o Profiler.
