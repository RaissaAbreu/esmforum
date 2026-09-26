# PROPOSTA DE ARQUITETURA

## 1. Objetivo

Esta proposta apresenta uma evolução da arquitetura atual do ESM Forum, mantendo a separação entre API, modelo de negócio e persistência e preparando o sistema para a aplicação dos padrões de projeto propostos.

A proposta busca preservar o funcionamento existente e reduzir o acoplamento entre as diferentes partes do sistema.

## 2. Arquitetura proposta

```text
                    Cliente / Front-end
                            |
                            v
                     +-------------+
                     |  server.js  |
                     |  API HTTP   |
                     +-------------+
                            |
                            v
                     +-------------+
                     |  modelo.js  |
                     |   Domínio   |
                     +-------------+
                            |
                            v
                  +---------------------+
                  |    Repositório      |
                  +---------------------+
                    /                                    v                   v
          +----------------+   +---------------------+
          | Repositório BD |   | Repositório Memória |
          +----------------+   +---------------------+
                   |                   |
                   v                   v
                SQLite             Memória
```

## 3. Componentes

### API

`server.js` permanece responsável pelas requisições HTTP.

A API não deve executar diretamente operações SQL. Ela delega as operações ao modelo.

### Modelo

`modelo.js` permanece como ponto de entrada das operações de negócio.

O modelo utiliza a abstração do repositório, permitindo trocar a implementação de persistência sem alterar as operações expostas pela camada de negócio.

### Repositório

A interface conceitual do repositório reúne operações de perguntas e respostas.

As implementações existentes são:

- `repositorio_bd.js`, para persistência em SQLite;
- `repositorio_memoria.js`, para armazenamento em memória e testes.

## 4. Padrões de projeto na arquitetura proposta

### Strategy

O padrão Strategy poderá ser utilizado para representar diferentes estratégias de busca de perguntas.

Uma estratégia poderá ser selecionada sem que a camada de API precise conhecer os detalhes da implementação da busca.

Exemplo conceitual:

```text
Modelo
  |
  v
Estratégia de busca
  |
  +--> Busca por texto
  |
  +--> Busca por usuário
  |
  +--> Outra estratégia
```

### Observer

O padrão Observer poderá ser utilizado para desacoplar a criação de uma resposta das ações que devem ocorrer quando uma nova resposta é cadastrada.

Exemplo conceitual:

```text
Nova resposta
      |
      v
   Subject
      |
      +----> Observer de notificação
      |
      +----> Outros observers futuros
```

Assim, novas formas de notificação podem ser adicionadas sem modificar diretamente o fluxo principal de cadastro de respostas.

### Factory Method

O Factory Method poderá centralizar a criação dos objetos de notificação.

Exemplo conceitual:

```text
Factory de notificações
          |
          +--> Notificação por e-mail
          |
          +--> Notificação no sistema
          |
          +--> Outro tipo de notificação
```

Isso evita espalhar decisões de instanciação pela aplicação.

## 5. Relação com a arquitetura atual

A proposta não substitui a separação já implementada entre modelo e persistência.

Pelo contrário, utiliza essa separação como base para futuras extensões.

A estrutura pode evoluir da seguinte maneira:

```text
API
 |
 v
Modelo
 |
 +----------------------+
 |                      |
 v                      v
Repositório          Serviços de domínio
 |                      |
 +--> BD                +--> Strategy
 +--> Memória           +--> Observer
                        +--> Factory Method
```

## 6. Benefícios esperados

A arquitetura proposta pretende:

- manter as responsabilidades separadas;
- facilitar testes automatizados;
- reduzir dependências diretas entre componentes;
- permitir substituição das estratégias de busca;
- permitir novas formas de notificação;
- centralizar a criação de notificações;
- facilitar futuras extensões do sistema.

## 7. Cuidados de implementação

Os novos componentes devem ser introduzidos de forma incremental.

A implementação deve preservar os comportamentos já existentes e manter os testes atuais funcionando.

Cada alteração deve ser acompanhada por testes correspondentes antes de ser incorporada à aplicação.

## 8. Próximas etapas

A partir desta proposta, a evolução pode seguir esta ordem:

1. manter e validar a abstração de repositório existente;
2. implementar a Strategy de busca;
3. adicionar o mecanismo Observer para eventos de resposta;
4. introduzir o Factory Method para criação das notificações;
5. criar testes unitários para cada novo componente;
6. executar os testes existentes e os novos testes;
7. atualizar a documentação e os diagramas da arquitetura.
