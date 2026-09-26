# Análise SOLID

## 1. Objetivo

Este documento analisa o código do backend do ESM Forum à luz dos princípios SOLID, conforme solicitado na Tarefa 1 da Iteração 1 da Parte 3 do projeto.

A análise considera a organização atual do projeto, incluindo `server.js`, `modelo.js`, `bd/bd_utils.js` e os repositórios em `repositorio/`.

A tarefa solicita três trechos que seguem princípios SOLID e dois trechos que apresentam violações, explicando em cada caso o princípio envolvido, o motivo e uma possível melhoria.

---

# 2. Pontos positivos

## 2.1. Separação do acesso ao banco de dados — SRP

### Trecho analisado

Arquivo: `repositorio/repositorio_bd.js`

```javascript
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

function criar_pergunta(texto) {
  const params = [texto, 1];

  const result = bd.exec(
    'INSERT INTO perguntas (texto, id_usuario) VALUES(?, ?) RETURNING id_pergunta',
    params
  );

  return result.lastInsertRowid;
}
```

### Princípio relacionado

**SRP — Single Responsibility Principle (Princípio da Responsabilidade Única).**

### Análise

O `repositorio_bd.js` concentra as operações de persistência relacionadas às perguntas e respostas. Ele é responsável por executar consultas e alterações no banco de dados, enquanto a lógica da aplicação fica no `modelo.js`.

Essa separação evita que o modelo precise conhecer os comandos SQL utilizados para armazenar e recuperar os dados.

A responsabilidade de persistência fica, portanto, separada da responsabilidade de aplicação.

### Benefício

Uma alteração na forma como os dados são persistidos pode ser feita no repositório sem precisar alterar todas as operações do modelo.

---

## 2.2. Modelo dependente da abstração de operações do Repository — DIP

### Trecho analisado

Arquivo: `modelo.js`

```javascript
var repositorio = require('./repositorio/repositorio_bd.js');

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
```

E a função de configuração:

```javascript
function reconfig_repositorio(novo_repositorio) {
  repositorio = novo_repositorio;
}
```

### Princípio relacionado

**DIP — Dependency Inversion Principle (Princípio da Inversão de Dependência).**

### Análise

O `modelo.js` utiliza operações fornecidas pelo Repository, como:

```text
recuperar_todas_perguntas()
recuperar_pergunta()
criar_pergunta()
criar_resposta()
editar_pergunta()
deletar_pergunta()
```

O modelo não executa SQL diretamente.

Além disso, `reconfig_repositorio()` permite substituir o objeto utilizado pelo modelo. Nos testes, por exemplo, o modelo recebe uma instância de `RepositorioMemoria`.

Isso reduz o acoplamento entre a lógica do modelo e uma implementação específica de persistência.

### Benefício

Podemos usar:

```javascript
const RepositorioMemoria = require('./repositorio/repositorio_memoria.js');

const repositorio = new RepositorioMemoria();

modelo.reconfig_repositorio(repositorio);
```

sem precisar modificar as funções de negócio do modelo.

---

## 2.3. Duas implementações do Repository — OCP

### Trechos analisados

Arquivos:

```text
repositorio/repositorio_bd.js
repositorio/repositorio_memoria.js
```

As duas implementações disponibilizam operações com os mesmos objetivos, por exemplo:

```javascript
criar_pergunta(texto)
criar_resposta(id_pergunta, texto)
recuperar_pergunta(id_pergunta)
recuperar_todas_perguntas()
editar_pergunta(id_pergunta, texto)
deletar_pergunta(id_pergunta)
```

### Princípio relacionado

**OCP — Open/Closed Principle (Princípio Aberto/Fechado).**

### Análise

A estrutura permite acrescentar uma nova implementação do repositório sem precisar modificar a lógica do `modelo.js`.

Por exemplo, atualmente existem:

```text
             modelo.js
                 |
        operações do Repository
          /              \
         /                \
RepositorioBD      RepositorioMemoria
   SQLite              memória
```

Uma terceira implementação poderia fornecer as mesmas operações utilizando outra forma de persistência.

### Benefício

A lógica do modelo permanece estável enquanto novas formas de armazenamento podem ser adicionadas.

É importante observar que esta aplicação é uma aproximação do OCP, pois o projeto utiliza JavaScript sem uma interface formal que obrigue as implementações a seguirem um contrato. Mesmo assim, a separação atual permite extensão com baixo impacto no modelo.

---

# 3. Oportunidades de melhoria

## 3.1. `server.js` concentra responsabilidades — SRP

### Trecho analisado

Arquivo: `server.js`

Exemplo:

```javascript
app.post('/perguntas', (req, res) => {
  try {
    const id_pergunta = modelo.cadastrar_pergunta(req.body.pergunta);
    res.json({id_pergunta: id_pergunta});
  }
  catch(erro) {
    res.status(500).json(erro.message);
  }
});
```

O mesmo arquivo também possui rotas para:

```text
GET /
POST /perguntas
PUT /perguntas/:id_pergunta
DELETE /perguntas/:id_pergunta
GET /respostas/:id_pergunta
POST /respostas
```

### Princípio relacionado

**SRP — Single Responsibility Principle.**

### Problema

O `server.js` concentra a configuração do Express e também a lógica de tratamento das diversas requisições HTTP.

Conforme novas funcionalidades forem adicionadas, esse arquivo tende a crescer e acumular responsabilidades relacionadas a diferentes recursos.

Por exemplo, perguntas e respostas poderiam ter seus próprios módulos de rotas/controllers.

### Possível melhoria

Separar as responsabilidades em módulos, por exemplo:

```text
server.js
routes/
├── perguntas.js
└── respostas.js
controllers/
├── perguntas_controller.js
└── respostas_controller.js
```

Assim:

```text
server.js
   |
   +-- configura Express
   |
   +-- registra rotas

routes/
   |
   +-- define endpoints

controllers/
   |
   +-- trata requisições

modelo.js
   |
   +-- lógica da aplicação

repositorio/
   |
   +-- persistência
```

A melhoria deixaria cada módulo mais focado em uma responsabilidade.

---

## 3.2. `bd_utils.js` utiliza diretamente uma implementação concreta — DIP

### Trecho analisado

Arquivo: `bd/bd_utils.js`

```javascript
const Database = require('better-sqlite3');

var bd = new Database('./bd/esmforum.db');

function query(query, params) {
  return bd.prepare(query).get(params);
}

function queryAll(query, params) {
  return bd.prepare(query).all(params);
}

function exec(statement, params) {
  return bd.prepare(statement).run(params);
}
```

### Princípio relacionado

**DIP — Dependency Inversion Principle.**

### Problema

O módulo depende diretamente de:

```javascript
require('better-sqlite3')
```

e cria diretamente uma instância de:

```javascript
new Database('./bd/esmforum.db')
```

Isso torna o módulo fortemente ligado ao SQLite/better-sqlite3.

Caso fosse necessário substituir a tecnologia de persistência, seria necessário alterar esse módulo.

### Possível melhoria

Uma possibilidade seria separar a criação/configuração do banco de sua interface de operações.

Por exemplo:

```javascript
class Banco {
  query(sql, params) {
    // implementação
  }

  queryAll(sql, params) {
    // implementação
  }

  exec(sql, params) {
    // implementação
  }
}
```

O código que utiliza o banco dependeria das operações esperadas, enquanto a implementação concreta do SQLite seria fornecida externamente.

No projeto atual, a criação dos repositórios já reduz parte desse acoplamento para o `modelo.js`, mas `bd_utils.js` ainda possui dependência direta da biblioteca SQLite.

---

# 4. Resumo da análise

| Trecho | Princípio | Classificação | Justificativa |
|---|---|---|---|
| `repositorio/repositorio_bd.js` | SRP | Positivo | Concentra operações de persistência |
| `modelo.js` + `reconfig_repositorio()` | DIP | Positivo | O modelo utiliza operações do Repository e permite substituição |
| `repositorio_bd.js` + `repositorio_memoria.js` | OCP | Positivo | Permite novas implementações de persistência sem alterar a lógica do modelo |
| `server.js` | SRP | Oportunidade de melhoria | Concentra configuração, rotas e tratamento das requisições |
| `bd/bd_utils.js` | DIP | Oportunidade de melhoria | Depende diretamente de `better-sqlite3` |

---

# 5. Conclusão

A principal evolução realizada no projeto foi a separação entre a lógica da aplicação e a persistência por meio do Repository.

Antes, o acesso ao banco estava diretamente no modelo. Após a reorganização, o fluxo passou a ser:

```text
server.js
    |
    v
modelo.js
    |
    v
Repository
    |
    v
banco de dados
```

Essa mudança melhora a separação de responsabilidades e permite utilizar uma implementação em memória nos testes.

Ainda existem pontos que podem ser aprimorados, principalmente a separação das responsabilidades do `server.js` e o desacoplamento da implementação concreta do SQLite em `bd_utils.js`.

Esses pontos também servem como base para as próximas atividades da Parte 3, especialmente a análise dos padrões existentes e a proposta de uma organização arquitetural em camadas.
