/**
 * Exercício 08 — Busca de CEP: os 4 estados de uma tela que consome uma API
 *
 * Toda tela que busca dados passa por estados: ainda não buscou (inicial), buscando
 * (carregando), deu certo (sucesso) e deu errado (erro). Mostrar cada um com clareza é o
 * que diferencia um app profissional de um que "trava sem avisar".
 *
 * Usa a API ViaCEP:  https://viacep.com.br/ws/<8 dígitos>/json/
 *   CEP existente  → { "cep": "01001-000", "logradouro": "Praça da Sé", "bairro": "Sé",
 *                      "localidade": "São Paulo", "uf": "SP", ... }
 *   CEP inexistente → status 200 com { "erro": "true" }   (!!)
 *   CEP malformado  → status 400
 *
 * Use as funções do exercício 05:  import { buscarJson, HttpError, RedeError } from "./05-fetch-basico.js";
 *
 * `iniciarBuscaCep(raiz, { fetch })` — a `raiz` contém:
 *
 *   <form id="form-cep">
 *     <label for="cep">CEP</label>
 *     <input id="cep" name="cep">
 *     <button type="submit">Buscar</button>
 *   </form>
 *   <p id="estado" role="status" data-estado="inicial"></p>
 *   <input id="logradouro" readonly>  <input id="bairro" readonly>
 *   <input id="cidade" readonly>      <input id="uf" readonly>
 *
 * Ao enviar o formulário (preventDefault!):
 *   1. Pegue só os dígitos do campo. Se NÃO forem exatamente 8: estado "erro" com o texto
 *      "Informe um CEP com 8 dígitos" e NÃO chame o fetch.
 *   2. Estado "carregando", texto "Buscando CEP..."; o botão fica desabilitado (disabled) e
 *      os 4 campos de endereço são esvaziados.
 *   3. Busque com buscarJson(`https://viacep.com.br/ws/${cep}/json/`, { fetch }).
 *   4. Resultado:
 *        - dados com `erro`            → estado "erro", texto "CEP não encontrado"
 *        - dados normais               → estado "sucesso", texto "Endereço encontrado";
 *                                        preencha logradouro, bairro, cidade (= localidade) e uf
 *        - HttpError com status 400    → "erro", "CEP inválido"
 *        - outro HttpError             → "erro", "Serviço indisponível. Tente novamente."
 *        - RedeError                   → "erro", "Sem conexão. Tente novamente."
 *      Qualquer OUTRO tipo de erro é um bug: não esconda, deixe subir (relance).
 *   5. Ao terminar (de qualquer jeito), o botão volta a ficar habilitado.
 *
 * O estado fica em DOIS lugares de #estado: o atributo data-estado ("inicial" | "carregando"
 * | "sucesso" | "erro") e o texto. O CSS usa o atributo para pintar; o texto vai para o
 * leitor de tela (role="status").
 *
 * CONDIÇÃO DE CORRIDA: se a pessoa enviar um segundo CEP enquanto o primeiro ainda carrega,
 * a resposta do primeiro (que pode chegar depois!) NÃO pode sobrescrever a tela. Só vale a
 * busca mais recente. (Use o AbortController, ou um contador de buscas, ou o seu
 * criarBuscaCancelavel do exercício 07.)
 *
 * Aula: seção 5.
 * Teste: npm run exercicio -- 08-busca-cep
 */
import { buscarJson, HttpError, RedeError } from "./05-fetch-basico.js";

export function iniciarBuscaCep(raiz, { fetch }) {
  // escreva seu código aqui
}
