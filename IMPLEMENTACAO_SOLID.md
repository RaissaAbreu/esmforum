# Implementação SOLID

## 1. Objetivo

Este documento descreve a implementação realizada na Iteração 1 da Parte 3 do projeto, relacionando as alterações feitas no código aos princípios SOLID solicitados no enunciado: **SRP, DIP e OCP**.

A principal alteração realizada foi a introdução do padrão Repository entre o modelo da aplicação e a camada de persistência.

---

# 2. Situação anterior

Antes da implementação do Repository, o arquivo `modelo.js` acessava diretamente o módulo de banco de dados:

```javascript
var bd = require('./bd/bd_utils.js');
```

As funções do modelo executavam SQL diretamente. Por exemplo:

```javascript
function cadastrar_pergunta(texto) {
  const params = [texto, 1];

  const result = bd.exec(
    'INSERT INTO perguntas (texto, id_usuario) VALUES(?, ?) RETURNING id_pergunta',
    params
  );

  return result.lastInsertRowid;
}
```

Nesse modelo, havia uma dependência direta entre a lógica da aplicação e a forma de persistência dos dados.

O acesso ao banco e a lógica do modelo também ficavam mais próximos do que o necessário.

---

# 3. Solução implementada

Foi criada uma camada de Repository:

```text
repositorio/
├── repositorio_bd.js
└── repositorio_memoria.js
```

O `modelo.js` passou a utilizar o Repository:

```javascript
var repositorio = require('./repositorio/repositorio_bd.js');
```

As operações do modelo agora delegam a persistência ao repositório:

```javascript
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
```

O fluxo passou a ser:

```text
server.js
    |
    v
modelo.js
    |
    v
Repository
    |
    +----------------------+
    |                      |
    v                      v
RepositorioBD       RepositorioMemoria
    |
    v
SQLite
```

---

# 4. SRP — Single Responsibility Principle

## 4.1. Aplicação no projeto

O princípio de responsabilidade única estabelece que uma classe ou módulo deve ter uma responsabilidade bem definida.

A implementação do Repository separou a responsabilidade de persistência da lógica do modelo.

### `modelo.js`

O modelo trabalha com as operações da aplicação:

```javascript
function cadastrar_pergunta(texto) {
  return repositorio.criar_pergunta(texto);
}

function editar_pergunta(id_pergunta, texto) {
  return repositorio.editar_pergunta(id_pergunta, texto);
}

function deletar_pergunta(id_pergunta) {
  return repositorio.deletar_pergunta(id_pergunta);
}
```

### `repositorio_bd.js`

O Repository concentra as operações de acesso ao banco:

```javascript
function recuperar_pergunta(id_pergunta) {
  return bd.query(
    'select * from perguntas where id_pergunta = ?',
    [id_pergunta]
  );
}
```

E:

```javascript
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
```

## 4.2. Resultado

A alteração separa duas responsabilidades:

```text
modelo.js
Responsabilidade:
lógica da aplicação

repositorio_bd.js
Responsabilidade:
persistência dos dados
```

Assim, mudanças relacionadas ao banco podem ser feitas no Repository sem espalhar SQL pelo modelo.

---

# 5. DIP — Dependency Inversion Principle

## 5.1. Aplicação no projeto

O princípio de inversão de dependência busca evitar que a lógica de alto nível dependa diretamente de detalhes de implementação.

No projeto, o modelo deixou de executar diretamente comandos SQL.

Em vez disso, utiliza operações do Repository:

```javascript
repositorio.recuperar_todas_perguntas()
repositorio.recuperar_num_respostas()
repositorio.criar_pergunta()
repositorio.criar_resposta()
repositorio.editar_pergunta()
repositorio.deletar_pergunta()
```

Além disso, foi criada a função:

```javascript
function reconfig_repositorio(novo_repositorio) {
  repositorio = novo_repositorio;
}
```

Isso permite substituir a implementação utilizada pelo modelo.

## 5.2. Uso nos testes

Nos testes é utilizada a implementação em memória:

```javascript
const RepositorioMemoria =
  require('../repositorio/repositorio_memoria.js');

const repositorio = new RepositorioMemoria();

modelo.reconfig_repositorio(repositorio);
```

Assim, o mesmo modelo pode trabalhar com:

```text
RepositorioBD
       ou
RepositorioMemoria
```

sem que suas funções de negócio precisem ser modificadas.

## 5.3. Resultado

A dependência foi deslocada de uma implementação específica de banco para as operações fornecidas pelo Repository.

Isso também facilita os testes porque o modelo pode utilizar uma implementação que não depende do SQLite.

---

# 6. OCP — Open/Closed Principle

## 6.1. Aplicação no projeto

O princípio aberto/fechado estabelece que um componente deve permitir extensão sem exigir alterações constantes em seu código existente.

No projeto existem duas implementações:

```text
repositorio/repositorio_bd.js
repositorio/repositorio_memoria.js
```

As duas fornecem operações equivalentes para o modelo.

Por exemplo, ambas possuem:

```javascript
criar_pergunta(texto)
criar_resposta(id_pergunta, texto)
recuperar_pergunta(id_pergunta)
recuperar_todas_perguntas()
editar_pergunta(id_pergunta, texto)
deletar_pergunta(id_pergunta)
```

O `modelo.js` não precisa saber se os dados estão vindo do SQLite ou de estruturas em memória.

## 6.2. Exemplo

Com o banco:

```text
modelo
  |
  v
RepositorioBD
  |
  v
SQLite
```

Durante os testes:

```text
modelo
  |
  v
RepositorioMemoria
  |
  v
arrays em memória
```

A lógica do modelo continua a mesma.

## 6.3. Resultado

A estrutura permite adicionar outra implementação do Repository no futuro sem precisar reescrever as funções do modelo.

É importante destacar que o projeto utiliza JavaScript e não possui uma interface formal ou classe abstrata obrigatória para o Repository. Portanto, a aplicação do OCP ocorre por meio de um contrato baseado nas operações esperadas pelo modelo.

---

# 7. Testes relacionados à implementação

A implementação foi acompanhada de testes para verificar o comportamento do modelo e do Repository.

Entre os testes existentes estão:

### Cadastro

```javascript
modelo.cadastrar_pergunta('1 + 1 = ?');
```

### Edição

```javascript
const id_pergunta =
  modelo.cadastrar_pergunta('Pergunta original');

modelo.editar_pergunta(
  id_pergunta,
  'Pergunta editada'
);
```

### Exclusão

```javascript
modelo.deletar_pergunta(id_pergunta);
```

### Exclusão com respostas

```javascript
modelo.cadastrar_resposta(
  id_pergunta,
  'Resposta 1'
);

modelo.cadastrar_resposta(
  id_pergunta,
  'Resposta 2'
);

modelo.deletar_pergunta(id_pergunta);
```

### Repository em memória

O `listar_perguntas.test.js` passou a utilizar:

```javascript
const RepositorioMemoria =
  require('../repositorio/repositorio_memoria.js');

const repositorio = new RepositorioMemoria();

modelo.reconfig_repositorio(repositorio);
```

Isso verifica na prática a possibilidade de substituir o mecanismo de persistência.

---

# 8. Benefícios obtidos

A implementação trouxe os seguintes benefícios:

1. **Separação de responsabilidades:** o modelo não precisa executar SQL diretamente.
2. **Menor acoplamento:** o modelo pode utilizar diferentes implementações do Repository.
3. **Testabilidade:** os testes podem utilizar `RepositorioMemoria`.
4. **Possibilidade de extensão:** novas formas de persistência podem ser adicionadas.
5. **Organização:** as operações de acesso aos dados ficam agrupadas na camada de Repository.

---

# 9. Limitações e pontos futuros

A implementação atual melhora a estrutura do sistema, mas ainda existem pontos que podem ser aprimorados.

O `server.js` ainda concentra as rotas HTTP e seu tratamento, podendo futuramente ser separado em controllers e módulos de rotas.

Além disso, `bd_utils.js` ainda depende diretamente de `better-sqlite3`:

```javascript
const Database = require('better-sqlite3');
```

Portanto, o desacoplamento da implementação concreta de persistência ainda pode ser aprofundado.

Esses pontos serão considerados nas próximas atividades da Parte 3, especialmente na análise de padrões e na proposta arquitetural.

---

# 10. Conclusão

A implementação do Repository foi utilizada como principal aplicação prática dos princípios SOLID nesta etapa.

A estrutura resultante pode ser resumida como:

```text
                    +------------------+
                    |    server.js     |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    |    modelo.js     |
                    +--------+---------+
                             |
                    operações Repository
                             |
              +--------------+--------------+
              |                             |
              v                             v
+--------------------------+    +--------------------------+
|    repositorio_bd.js     |    | repositorio_memoria.js  |
+------------+-------------+    +--------------------------+
             |
             v
       +-----------+
       |  SQLite   |
       +-----------+
```

Com essa organização, o modelo fica separado da persistência, pode utilizar diferentes implementações do Repository e pode ser testado com uma implementação em memória.

A implementação atende aos objetivos de aplicação de **SRP, DIP e OCP** previstos para esta etapa, mantendo como próximos pontos de evolução a separação das responsabilidades do `server.js` e o aprofundamento da arquitetura em camadas.
