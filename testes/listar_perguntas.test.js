const modelo = require('../modelo.js');
const RepositorioMemoria = require('../repositorio/repositorio_memoria.js');

const repositorio = new RepositorioMemoria();

modelo.reconfig_repositorio(repositorio);

test('Testando listar três perguntas', () => {
  const perguntas = modelo.listar_perguntas();

  expect(perguntas.length).toBe(3);

  expect(perguntas[0].texto).toBe('Qual a capital de MG?');
  expect(perguntas[1].texto).toBe('Qual a capital de RJ?');
  expect(perguntas[2].texto).toBe('Qual a capital de SP?');

  expect(perguntas[0].num_respostas).toBe(1);
  expect(perguntas[1].num_respostas).toBe(1);
  expect(perguntas[2].num_respostas).toBe(1);
});
