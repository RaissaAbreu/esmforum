var repositorio = require('./repositorio/repositorio_bd.js');

// usada pelos testes de unidade
// para que o modelo passe a usar uma versão em memória
function reconfig_repositorio(novo_repositorio) {
  repositorio = novo_repositorio;
}

// listar_perguntas retorna um array de objetos com os seguintes campos:
// { id_pergunta: int
//   texto: int
//   id_usuario: int
//   num_respostas: int
// }
function listar_perguntas() {
  const perguntas = repositorio.recuperar_todas_perguntas();

  perguntas.forEach(pergunta =>
    pergunta['num_respostas'] =
      repositorio.recuperar_num_respostas(pergunta['id_pergunta'])
  );

  return perguntas;
}

function cadastrar_pergunta(texto) {
  return repositorio.criar_pergunta(texto);
}

function cadastrar_resposta(id_pergunta, texto) {
  return repositorio.criar_resposta(id_pergunta, texto);
}

function get_pergunta(id_pergunta) {
  return repositorio.recuperar_pergunta(id_pergunta);
}

function get_respostas(id_pergunta) {
  return repositorio.recuperar_todas_respostas(id_pergunta);
}

function get_num_respostas(id_pergunta) {
  return repositorio.recuperar_num_respostas(id_pergunta);
}

function editar_pergunta(id_pergunta, texto) {
  return repositorio.editar_pergunta(id_pergunta, texto);
}

function deletar_pergunta(id_pergunta) {
  return repositorio.deletar_pergunta(id_pergunta);
}

exports.reconfig_repositorio = reconfig_repositorio;
exports.listar_perguntas = listar_perguntas;
exports.cadastrar_pergunta = cadastrar_pergunta;
exports.cadastrar_resposta = cadastrar_resposta;
exports.get_pergunta = get_pergunta;
exports.get_respostas = get_respostas;
exports.get_num_respostas = get_num_respostas;
exports.editar_pergunta = editar_pergunta;
exports.deletar_pergunta = deletar_pergunta;
