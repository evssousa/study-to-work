/**
 * Exercício 04 — Configurando o Vite
 *
 * O Vite lê o arquivo `vite.config.js` da raiz do projeto. Ele exporta um OBJETO de
 * configuração. (Em projetos reais você costuma escrever `export default defineConfig({ ... })`,
 * com `defineConfig` vindo do pacote "vite", só para o editor oferecer autocompletar. Aqui o
 * Vite não está instalado, então exporte o objeto direto: funciona do mesmo jeito.)
 *
 * Imagine o projeto "racha-conta" que será publicado no GitHub Pages em
 * https://seu-usuario.github.io/racha-conta/  e escreva a configuração abaixo.
 * Troque o objeto vazio pelas opções pedidas:
 *
 *   base            "/racha-conta/"   no GitHub Pages o site mora em uma SUBPASTA (o nome do
 *                                      repositório), e os caminhos dos arquivos precisam saber disso
 *   build.outDir    "dist"            a pasta onde o `vite build` coloca o site pronto
 *   build.sourcemap true              gera mapas para depurar o código minificado no DevTools
 *   server.port     3000              a porta do servidor de desenvolvimento (`npm run dev`)
 *   server.open     false             não abrir o navegador sozinho a cada início
 *   envPrefix       "APP_"            só as variáveis do .env que começam com APP_ ficam visíveis
 *                                      no código do navegador (o padrão é VITE_). TUDO que vai
 *                                      para o navegador é público: nunca exponha segredos.
 *   resolve.alias   { "@": "/src" }   permite escrever `import x from "@/modulo.js"`
 *
 * Aula: seção 4.
 * Teste: npm run exercicio -- 04-vite
 */
export default {
  // escreva seu código aqui
};
