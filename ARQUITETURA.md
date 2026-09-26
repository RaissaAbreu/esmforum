# ARQUITETURA

## 1. Visão geral

O ESM Forum é organizado em uma arquitetura em camadas, separando a interface HTTP, as regras de negócio e o acesso aos dados.

A estrutura atualmente utilizada é:

```text
Cliente / Front-end
       |
       v
   server.js
       |
       v
   modelo.js
       |
       v
 repositorio/
       |
       +--> repositorio_bd.js
       |        |
       |        v
       |      SQLite
       |
       +--> repositorio_memoria.js
                |
                v
          Estruturas em memória
```

Essa separação permite que o modelo de negócio não dependa diretamente da implementação concreta do banco de dados.

## 2. Camadas

### Apresentação / API

O arquivo `server.js` implementa a API HTTP utilizando Express.

Entre as operações disponíveis estão:

- listar perguntas;
- cadastrar perguntas;
- editar perguntas;
- excluir perguntas;
- listar respostas de uma pergunta;
- cadastrar respostas.

O servidor recebe as requisições HTTP, extrai os dados necessários e delega as operações ao modelo.

### Modelo

O arquivo `modelo.js` concentra a interface utilizada pela aplicação para executar as operações do domínio.

O modelo utiliza uma variável `repositorio`, inicialmente configurada com `repositorio_bd.js`.

As funções do modelo delegam as operações ao repositório, por exemplo:

```javascript
function cadastrar_pergunta(texto) {
  return repositorio.criar_pergunta(texto);
}
```

Dessa forma, o modelo não precisa conhecer diretamente detalhes de SQL ou de armazenamento em memória.

### Repositório

A pasta `repositorio/` contém as implementações de persistência.

#### Repositório de banco

`repositorio/repositorio_bd.js` utiliza `bd/bd_utils.js` para executar operações SQLite.

Ele implementa operações como:

- `recuperar_todas_perguntas`;
- `recuperar_pergunta`;
- `recuperar_todas_respostas`;
- `recuperar_num_respostas`;
- `criar_pergunta`;
- `criar_resposta`;
- `editar_pergunta`;
- `deletar_pergunta`.

#### Repositório em memória

`repositorio/repositorio_memoria.js` implementa as mesmas operações utilizando arrays JavaScript.

Essa implementação é utilizada nos testes para evitar dependência do banco de dados real.

## 3. Banco de dados

O armazenamento persistente utiliza SQLite através da biblioteca `better-sqlite3`.

O esquema atual possui as tabelas:

```text
perguntas
  - id_pergunta
  - texto
  - id_usuario

respostas
  - id_resposta
  - id_pergunta
  - texto
```

As operações relacionadas ao banco estão encapsuladas em `bd/bd_utils.js` e no repositório de banco.

## 4. Testes

A arquitetura também permite separar os testes da implementação de persistência.

Nos testes do modelo, o `RepositorioMemoria` pode ser configurado através de:

```javascript
modelo.reconfig_repositorio(repositorio);
```

Assim, o mesmo modelo pode funcionar com diferentes implementações de repositório.

Os testes existentes incluem:

- testes unitários do modelo;
- teste do funcionamento do repositório em memória;
- testes end-to-end utilizando Cypress.

## 5. Benefícios da arquitetura

A organização adotada proporciona:

- separação de responsabilidades;
- menor acoplamento entre modelo e banco de dados;
- possibilidade de substituir a implementação de persistência;
- maior facilidade para testar o modelo;
- reutilização das operações de domínio independentemente do mecanismo de armazenamento.

## 6. Evolução prevista

A arquitetura pode ser evoluída para incorporar os padrões de projeto propostos no projeto.

Entre as propostas documentadas estão:

- Strategy para diferentes estratégias de busca;
- Observer para notificações;
- Factory Method para criação de diferentes tipos de notificação.

Essas extensões devem ser implementadas mantendo a separação existente entre API, modelo e persistência.
