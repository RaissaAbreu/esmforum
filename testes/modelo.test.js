const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando edição de uma pergunta', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Pergunta original');

  modelo.editar_pergunta(id_pergunta, 'Pergunta editada');

  const pergunta = modelo.get_pergunta(id_pergunta);

  expect(pergunta.texto).toBe('Pergunta editada');
});

test('Testando exclusão de uma pergunta', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Pergunta para excluir');

  modelo.deletar_pergunta(id_pergunta);

  const pergunta = modelo.get_pergunta(id_pergunta);

  expect(pergunta).toBeUndefined();
});

test('Testando exclusão de pergunta com respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Pergunta com resposta');

  modelo.cadastrar_resposta(id_pergunta, 'Resposta 1');
  modelo.cadastrar_resposta(id_pergunta, 'Resposta 2');

  expect(modelo.get_respostas(id_pergunta).length).toBe(2);

  modelo.deletar_pergunta(id_pergunta);

  expect(modelo.get_pergunta(id_pergunta)).toBeUndefined();
  expect(modelo.get_respostas(id_pergunta).length).toBe(0);
});

test('Testando número de respostas de uma pergunta', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Pergunta com respostas');

  modelo.cadastrar_resposta(id_pergunta, 'Resposta 1');
  modelo.cadastrar_resposta(id_pergunta, 'Resposta 2');

  expect(modelo.get_num_respostas(id_pergunta)).toBe(2);
});
