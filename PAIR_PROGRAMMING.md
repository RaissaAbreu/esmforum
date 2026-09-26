# Pair Programming

## 1. Objetivo

Este documento descreve como a prática de **Pair Programming** será aplicada no desenvolvimento do ESM Forum.

A prática consiste no trabalho conjunto de duas pessoas sobre a mesma tarefa, alternando os papéis de **Driver** e **Navigator**.

---

## 2. Estratégia

O desenvolvimento das novas funcionalidades será dividido em pequenas tarefas.

Para cada funcionalidade, a dupla deverá:

1. analisar o requisito;
2. definir os testes;
3. implementar a funcionalidade;
4. executar os testes;
5. revisar o código;
6. realizar o commit.

A prática de Pair Programming será utilizada principalmente nas partes que envolvem alterações no modelo, Repository, servidor e testes.

---

## 3. Papéis

### Driver

O Driver é responsável por escrever o código.

Durante a sessão, ele executa os comandos e implementa a solução discutida pela dupla.

### Navigator

O Navigator acompanha a implementação e analisa:

- lógica da solução;
- possíveis erros;
- cobertura dos testes;
- organização do código;
- aderência ao requisito.

O Navigator deve participar ativamente da sessão, orientando o Driver e propondo melhorias.

---

## 4. Rotação dos papéis

Os papéis serão alternados durante o desenvolvimento.

Um possível ciclo será:

```text
Pessoa A → Driver
Pessoa B → Navigator

        ↓

Troca de papéis

Pessoa A → Navigator
Pessoa B → Driver
```

A troca pode ocorrer depois da conclusão de uma tarefa ou de um pequeno conjunto de alterações.

O objetivo é evitar que uma única pessoa fique responsável permanentemente pela implementação.

---

## 5. Ferramentas

As ferramentas previstas para a prática são:

### VS Code Live Share

O VS Code Live Share pode ser utilizado para permitir que as duas pessoas trabalhem simultaneamente no mesmo código.

### Discord

O Discord pode ser utilizado para comunicação por voz durante a sessão.

### Git e GitHub

O Git será utilizado para registrar as alterações realizadas durante o desenvolvimento.

O fluxo pode ser:

```text
Analisar requisito
       ↓
Escrever testes
       ↓
Driver implementa
       ↓
Navigator revisa
       ↓
Executar testes
       ↓
Revisar código
       ↓
Commit
```

---

## 6. Aplicação aos testes

O Pair Programming também será utilizado na criação e revisão dos testes.

Antes de implementar uma funcionalidade, a dupla pode definir conjuntamente:

- comportamento esperado;
- entradas;
- saídas;
- casos de erro;
- testes de integração ou end-to-end necessários.

O Driver implementa os testes enquanto o Navigator verifica se eles representam corretamente o requisito.

---

## 7. Aplicação às novas funcionalidades

### Votação

A dupla deverá discutir como representar votos, quais operações serão necessárias e quais testes devem validar o comportamento.

### Busca

A dupla deverá definir o comportamento da busca e os casos que precisam ser testados.

### Categorização

Deverão ser discutidos os dados necessários para representar as categorias e os impactos no banco.

### Perfil de usuário

A dupla deverá definir quais informações pertencem ao perfil e como perguntas e respostas serão relacionadas ao usuário.

### Notificações

Deverão ser discutidos os eventos que geram notificações e como o comportamento será testado.

---

## 8. Benefícios esperados

A utilização de Pair Programming pretende:

- detectar erros mais cedo;
- compartilhar conhecimento do código;
- melhorar a revisão durante o desenvolvimento;
- discutir decisões de implementação antes de codificá-las;
- aumentar a cobertura dos testes;
- reduzir decisões tomadas sem revisão.

---

## 9. Conclusão

O Pair Programming será aplicado de maneira incremental nas funcionalidades do projeto.

A alternância entre Driver e Navigator permite que as duas pessoas participem tanto da implementação quanto da revisão.

No desenvolvimento individual, a prática também pode ser simulada utilizando etapas explícitas de implementação e revisão: primeiro desenvolver a solução e depois assumir uma postura de Navigator para revisar o código, executar os testes e verificar o atendimento ao requisito.
