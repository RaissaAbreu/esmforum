const bd = require('../bd/bd_utils.js');

function recuperar_todas_perguntas() {
  return bd.queryAll(
    'select * from perguntas',
    []
  );
}

function recuperar_pergunta(id_pergunta) {
  return bd.query(
    'select * from perguntas where id_pergunta = ?',
    [id_pergunta]
  );
}

function recuperar_todas_respostas(id_pergunta) {
  return bd.queryAll(
    'select * from respostas where id_pergunta = ?',
    [id_pergunta]
  );
}

function recuperar_num_respostas(id_pergunta) {
  const resultado = bd.query(
    'select count(*) from respostas where id_pergunta = ?',
    [id_pergunta]
  );

  return resultado['count(*)'];
}

function criar_pergunta(texto) {
  const params = [texto, 1];

  const result = bd.exec(
    'INSERT INTO perguntas (texto, id_usuario) VALUES(?, ?) RETURNING id_pergunta',
    params
  );

  return result.lastInsertRowid;
}

function criar_resposta(id_pergunta, texto) {
  const params = [id_pergunta, texto];

  const result = bd.exec(
    'INSERT INTO respostas (id_pergunta, texto) VALUES(?, ?) RETURNING id_resposta',
    params
  );

  return result.lastInsertRowid;
}

function editar_pergunta(id_pergunta, texto) {
  return bd.exec(
    'UPDATE perguntas SET texto = ? WHERE id_pergunta = ?',
    [texto, id_pergunta]
  );
}

function deletar_pergunta(id_pergunta) {
  bd.exec(
    'DELETE FROM respostas WHERE id_pergunta = ?',
    [id_pergunta]
  );

  return bd.exec(
    'DELETE FROM perguntas WHERE id_pergunta = ?',
    [id_pergunta]
  );
}

exports.recuperar_todas_perguntas = recuperar_todas_perguntas;
exports.recuperar_pergunta = recuperar_pergunta;
exports.recuperar_todas_respostas = recuperar_todas_respostas;
exports.recuperar_num_respostas = recuperar_num_respostas;
exports.criar_pergunta = criar_pergunta;
exports.criar_resposta = criar_resposta;
exports.editar_pergunta = editar_pergunta;
exports.deletar_pergunta = deletar_pergunta;

