# Processo Ágil

## 1. Objetivo

Este documento descreve o processo de desenvolvimento adotado para o projeto ESM Forum e a forma como as funcionalidades solicitadas pelo cliente serão organizadas e acompanhadas no GitHub Projects.

As funcionalidades consideradas são:

1. Sistema de votação em perguntas (upvote/downvote)
2. Busca de perguntas por palavra-chave
3. Categorização de perguntas por tags
4. Perfil de usuário com histórico
5. Notificações de novas respostas

## 2. Processo escolhido: Kanban

O processo escolhido para o projeto é o **Kanban**.

A escolha é adequada porque as funcionalidades podem ser acompanhadas individualmente desde o planejamento até a conclusão. O quadro permite visualizar o trabalho em andamento, identificar tarefas pendentes e acompanhar a evolução de cada funcionalidade.

Além disso, o projeto possui um conjunto definido de funcionalidades solicitadas pelo cliente, e o uso de um fluxo visual facilita acompanhar o estado de cada uma sem exigir uma divisão rígida em iterações.

## 3. Fluxo do quadro

O GitHub Projects será organizado com as seguintes etapas:

```text
Backlog → A Fazer → Em Desenvolvimento → Em Revisão → Concluído
```

### Backlog

Funcionalidades que foram identificadas, mas ainda não foram selecionadas para execução.

### A Fazer

Funcionalidades priorizadas e prontas para serem iniciadas.

### Em Desenvolvimento

Funcionalidades que estão sendo implementadas.

### Em Revisão

Funcionalidades cuja implementação foi concluída e que precisam ser revisadas e testadas.

### Concluído

Funcionalidades implementadas, revisadas e consideradas concluídas.

## 4. Itens do projeto

O quadro deverá possuir um card para cada uma das cinco funcionalidades solicitadas pelo cliente.

### Card 1 — Sistema de votação em perguntas

Permitir que usuários votem positivamente ou negativamente nas perguntas.

Objetivo:

- registrar votos;
- permitir upvote;
- permitir downvote;
- apresentar a pontuação da pergunta.

### Card 2 — Busca de perguntas por palavra-chave

Permitir localizar perguntas utilizando palavras-chave.

Objetivo:

- receber um termo de busca;
- localizar perguntas relacionadas ao termo;
- apresentar os resultados ao usuário.

### Card 3 — Categorização por tags

Permitir associar tags às perguntas.

Objetivo:

- cadastrar tags;
- associar tags às perguntas;
- permitir identificar perguntas por categoria/tag.

### Card 4 — Perfil de usuário com histórico

Disponibilizar informações relacionadas à atividade do usuário.

Objetivo:

- apresentar o perfil;
- mostrar perguntas realizadas pelo usuário;
- mostrar respostas realizadas pelo usuário.

### Card 5 — Notificações de novas respostas

Notificar o usuário quando uma pergunta receber uma nova resposta.

Objetivo:

- identificar novas respostas;
- relacioná-las à pergunta do usuário;
- disponibilizar a notificação.

## 5. Priorização inicial

A ordenação inicial dos cards no quadro deverá ser:

1. Sistema de votação em perguntas
2. Busca de perguntas por palavra-chave
3. Categorização por tags
4. Perfil de usuário com histórico
5. Notificações de novas respostas

Essa ordem representa a prioridade inicial definida para o planejamento do projeto e deve ser refletida na ordenação dos itens no GitHub Projects.

## 6. Organização no GitHub Projects

Deve ser criado um projeto no GitHub para acompanhar essas cinco funcionalidades.

O quadro deve conter:

```text
Backlog
A Fazer
Em Desenvolvimento
Em Revisão
Concluído
```

Cada uma das cinco funcionalidades deve existir como um card separado.

Os cards devem ser movimentados entre as colunas conforme o trabalho avançar.

## 7. Acompanhamento do trabalho

Durante o desenvolvimento, o estado de cada funcionalidade será atualizado no quadro.

Exemplo:

```text
A Fazer
   ↓
Em Desenvolvimento
   ↓
Em Revisão
   ↓
Concluído
```

Dessa forma, o quadro fornece uma visão do trabalho pendente, do trabalho em andamento e das funcionalidades já concluídas.

## 8. Link do GitHub Projects

Após a criação do projeto, inserir aqui o endereço do GitHub Projects utilizado na entrega:

```text
<URL_DO_GITHUB_PROJECTS>
```

> O placeholder deve ser substituído pelo link real do projeto antes da entrega.

## 9. Conclusão

O Kanban será utilizado para organizar visualmente as cinco funcionalidades solicitadas para o ESM Forum.

O GitHub Projects servirá como ferramenta de acompanhamento, mantendo cada funcionalidade em um card e permitindo visualizar sua evolução desde o planejamento até a conclusão.
