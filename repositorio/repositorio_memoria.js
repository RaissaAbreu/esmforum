class RepositorioMemoria {
  constructor() {
    this.perguntas = [
      {
        id_pergunta: 1,
        texto: 'Qual a capital de MG?',
        id_usuario: 1
      },
      {
        id_pergunta: 2,
        texto: 'Qual a capital de RJ?',
        id_usuario: 1
      },
      {
        id_pergunta: 3,
        texto: 'Qual a capital de SP?',
        id_usuario: 1
      }
    ];

    this.respostas = [
      {
        id_resposta: 1,
        id_pergunta: 1,
        texto: 'Belo Horizonte'
      },
      {
        id_resposta: 2,
        id_pergunta: 2,
        texto: 'Rio de Janeiro'
      },
      {
        id_resposta: 3,
        id_pergunta: 3,
        texto: 'São Paulo'
      }
    ];
  }

  recuperar_todas_perguntas() {
    return this.perguntas;
  }

  recuperar_pergunta(id_pergunta) {
    return this.perguntas.find(
      pergunta => pergunta.id_pergunta == id_pergunta
    );
  }

  recuperar_todas_respostas(id_pergunta) {
    return this.respostas.filter(
      resposta => resposta.id_pergunta == id_pergunta
    );
  }

  recuperar_num_respostas(id_pergunta) {
    return this.recuperar_todas_respostas(id_pergunta).length;
  }

  criar_pergunta(texto) {
    const id_pergunta = this.perguntas.length + 1;

    this.perguntas.push({
      id_pergunta: id_pergunta,
      texto: texto,
      id_usuario: 1
    });

    return id_pergunta;
  }

  criar_resposta(id_pergunta, texto) {
    const id_resposta = this.respostas.length + 1;

    this.respostas.push({
      id_resposta: id_resposta,
      id_pergunta: id_pergunta,
      texto: texto
    });

    return id_resposta;
  }

  editar_pergunta(id_pergunta, texto) {
    const pergunta = this.recuperar_pergunta(id_pergunta);

    if (pergunta) {
      pergunta.texto = texto;
    }

    return pergunta;
  }

  deletar_pergunta(id_pergunta) {
    this.respostas = this.respostas.filter(
      resposta => resposta.id_pergunta != id_pergunta
    );

    this.perguntas = this.perguntas.filter(
      pergunta => pergunta.id_pergunta != id_pergunta
    );
  }
}

module.exports = RepositorioMemoria;
