# Exercício 01 — Terminal

Faça tudo **pelo terminal** do VS Code (menu *Terminal → New Terminal*), sem usar o mouse
para criar ou mover arquivos. O teste confere o resultado final.

1. Entre nesta pasta:
   `cd exercicios/00-ambiente-web-git/01-terminal`
2. Crie a pasta `meu-projeto` e, dentro dela, as pastas `src` e `docs`.
3. Crie o arquivo `meu-projeto/README.md` contendo a linha `# Meu projeto`.
4. Crie o arquivo `meu-projeto/src/index.js` com o conteúdo:
   `console.log("Olá, terminal!");`
5. Rode o arquivo com o Node (`node meu-projeto/src/index.js`) e confira a mensagem.
6. Crie `meu-projeto/docs/anotacoes.txt` com pelo menos uma linha explicando,
   com suas palavras, o que os comandos `pwd`, `ls` e `cd ..` fazem.
7. **Copie** `meu-projeto/src/index.js` para `meu-projeto/src/copia.js`.
8. Crie o arquivo `meu-projeto/temporario.txt` e depois **apague-o** pelo terminal.
9. **Renomeie** (mova) `meu-projeto/src/copia.js` para `meu-projeto/src/ola.js`.

Teste: `npm run exercicio -- 01-terminal`
