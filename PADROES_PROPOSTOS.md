# Padrões Propostos

## 1. Objetivo

Este documento propõe padrões de projeto para apoiar a evolução do ESM Forum nas cinco funcionalidades solicitadas na Parte 1:

1. Sistema de votação em perguntas (upvote/downvote);
2. Busca de perguntas por palavra-chave;
3. Categorização de perguntas por tags;
4. Perfil de usuário com histórico de perguntas e respostas;
5. Notificação de novas respostas às suas perguntas.

As propostas consideram a estrutura atual do sistema, que possui backend em Node.js/Express, modelo de domínio e Repository para acesso aos dados.

---

## 2. Padrões selecionados

Foram selecionados três padrões que podem ser aplicados às novas funcionalidades:

| Padrão | Funcionalidade principal relacionada | Justificativa |
|---|---|---|
| Strategy | Busca de perguntas | Permite encapsular diferentes estratégias de busca sem alterar o restante da aplicação. |
| Observer | Notificação de novas respostas | Permite que a criação de uma resposta notifique os interessados sem acoplar diretamente o cadastro à lógica de notificações. |
| Factory Method | Criação de notificações | Centraliza a criação dos diferentes tipos de notificação e facilita a inclusão de novos tipos. |

A escolha não significa que cada padrão será utilizado exclusivamente em uma funcionalidade. Eles representam propostas de organização para os pontos de variação que podem surgir durante a implementação.

---

# 3. Strategy

## 3.1 Problema

A funcionalidade de busca de perguntas por palavra-chave pode evoluir para diferentes formas de pesquisa.

Por exemplo, inicialmente pode existir uma busca simples por texto. Posteriormente, podem ser necessárias outras estratégias, como busca por título, busca por texto completo ou busca combinada com tags.

Colocar todas essas possibilidades diretamente em uma única função aumentaria a quantidade de condicionais e dificultaria a evolução.

## 3.2 Solução proposta

O padrão Strategy permite encapsular cada estratégia de busca em um objeto separado.

Uma interface conceitual poderia ser:

```javascript
class EstrategiaBusca {
  buscar(perguntas, termo) {
    throw new Error('Método não implementado');
  }
}
```

Uma estratégia simples:

```javascript
class BuscaPorTexto extends EstrategiaBusca {
  buscar(perguntas, termo) {
    return perguntas.filter(pergunta =>
      pergunta.texto.toLowerCase().includes(termo.toLowerCase())
    );
  }
}
```

Outra estratégia poderia futuramente buscar por tags:

```javascript
class BuscaPorTag extends EstrategiaBusca {
  buscar(perguntas, tag) {
    // implementação da busca por categoria
  }
}
```

O serviço de busca receberia a estratégia:

```javascript
class ServicoBusca {
  constructor(estrategia) {
    this.estrategia = estrategia;
  }

  buscar(perguntas, termo) {
    return this.estrategia.buscar(perguntas, termo);
  }
}
```

## 3.3 Benefícios

- separa diferentes algoritmos de busca;
- reduz condicionais;
- facilita testes individuais das estratégias;
- permite adicionar novas estratégias sem alterar o código existente;
- mantém o serviço de busca focado em coordenar a operação.

## 3.4 Relação com as funcionalidades

O Strategy está diretamente relacionado à **busca de perguntas por palavra-chave** e pode também apoiar a futura combinação da busca com **categorização por tags**.

---

# 4. Observer

## 4.1 Problema

Quando uma nova resposta é cadastrada, a funcionalidade solicitada pelo cliente determina que o autor da pergunta possa receber uma notificação.

Se o código responsável por cadastrar respostas também tiver que conhecer todos os detalhes de notificações, haverá maior acoplamento entre essas responsabilidades.

## 4.2 Solução proposta

O padrão Observer permite que componentes interessados sejam notificados quando ocorrer um evento.

Conceitualmente:

```javascript
class EventoResposta {
  constructor() {
    this.observadores = [];
  }

  adicionarObservador(observador) {
    this.observadores.push(observador);
  }

  notificar(resposta) {
    this.observadores.forEach(observador =>
      observador.atualizar(resposta)
    );
  }
}
```

Um observador poderia representar o serviço de notificações:

```javascript
class ServicoNotificacao {
  atualizar(resposta) {
    // cria ou encaminha a notificação
  }
}
```

Quando uma resposta for cadastrada, o evento poderá notificar os observadores interessados.

## 4.3 Benefícios

- reduz o acoplamento entre respostas e notificações;
- permite adicionar novos interessados no evento;
- facilita testes do comportamento de notificação;
- permite que novas ações sejam associadas ao evento sem modificar diretamente o cadastro de respostas.

## 4.4 Relação com as funcionalidades

O Observer está diretamente relacionado à **notificação de novas respostas às perguntas do usuário**.

---

# 5. Factory Method

## 5.1 Problema

A funcionalidade de notificações pode possuir diferentes tipos de notificação no futuro.

Por exemplo:

- notificação de nova resposta;
- notificação relacionada a uma pergunta;
- outros tipos de eventos do fórum.

Se a criação desses objetos estiver espalhada pelo sistema, a manutenção ficará mais difícil.

## 5.2 Solução proposta

O Factory Method pode centralizar a criação dos objetos de notificação.

Exemplo conceitual:

```javascript
class FabricaNotificacao {
  criar(tipo, dados) {
    if (tipo === 'nova_resposta') {
      return new NotificacaoNovaResposta(dados);
    }

    throw new Error('Tipo de notificação desconhecido');
  }
}
```

O código que precisa de uma notificação não precisa conhecer todos os detalhes de construção:

```javascript
const fabrica = new FabricaNotificacao();

const notificacao =
  fabrica.criar('nova_resposta', dados);
```

## 5.3 Benefícios

- centraliza a criação das notificações;
- reduz o acoplamento entre clientes e classes concretas;
- facilita a inclusão de novos tipos;
- concentra regras de construção em um único ponto.

## 5.4 Relação com as funcionalidades

O Factory Method apoia principalmente a funcionalidade de **notificação de novas respostas**, podendo também ser utilizado caso novas modalidades de notificação sejam adicionadas.

---

# 6. Relação entre os padrões

Os três padrões podem trabalhar em conjunto.

Um possível fluxo para uma nova resposta seria:

```text
Cadastro de resposta
        |
        v
      Evento
        |
        v
     Observer
        |
        v
Serviço de notificação
        |
        v
Factory Method
        |
        v
NotificaçãoNovaResposta
```

Para a busca:

```text
Requisição de busca
        |
        v
Serviço de Busca
        |
        v
     Strategy
        |
        +---- BuscaPorTexto
        |
        +---- BuscaPorTag
```

Dessa forma, cada padrão resolve um ponto específico de variação.

---

# 7. Impacto na arquitetura atual

A aplicação dos padrões não exige que toda a arquitetura atual seja reescrita.

O Repository existente continua responsável pelo acesso aos dados.

Os novos componentes poderiam ser adicionados gradualmente:

```text
server.js
    |
    v
modelo.js
    |
    +----------------------+
    |                      |
    v                      v
Repository             Serviços
                            |
                    +-------+-------+
                    |       |       |
                 Strategy Observer Factory
```

Essa abordagem permite evolução incremental do sistema.

---

# 8. Cuidados

Os padrões devem ser aplicados somente onde houver uma necessidade concreta.

O objetivo não é adicionar classes ou abstrações apenas para aumentar a quantidade de padrões no projeto.

Por isso:

- Strategy deve ser usado quando houver estratégias de busca que realmente variem;
- Observer deve ser usado quando houver eventos com mais de um possível interessado ou necessidade clara de desacoplamento;
- Factory Method deve ser usado quando a criação de diferentes tipos de objetos justificar a centralização.

A implementação deve permanecer compatível com o princípio de Design Simples documentado no projeto.

---

# 9. Conclusão

Os padrões Strategy, Observer e Factory Method oferecem formas de organizar as principais áreas de variação previstas para as novas funcionalidades do ESM Forum.

O **Strategy** atende principalmente às diferentes estratégias de busca.

O **Observer** permite desacoplar eventos do fórum das ações executadas em resposta a esses eventos, especialmente as notificações.

O **Factory Method** centraliza a criação de diferentes tipos de notificações.

As propostas devem ser implementadas de forma incremental, acompanhadas por testes e sem introduzir abstrações antes que exista uma necessidade concreta.
