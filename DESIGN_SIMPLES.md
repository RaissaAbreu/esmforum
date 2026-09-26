# Design Simples

## 1. Objetivo

Este documento analisa a aplicação do princípio de **Design Simples** e do conceito **YAGNI (You Aren't Gonna Need It)** no backend do ESM Forum.

A análise considera a implementação atual do sistema, especialmente o `server.js`, `modelo.js` e a separação realizada por meio do padrão Repository.

---

## 2. Aplicação do YAGNI

O princípio YAGNI orienta que funcionalidades ou estruturas não devem ser implementadas antes de existir uma necessidade concreta.

No estado atual do projeto, o backend possui somente operações necessárias para o funcionamento atual do fórum:

- listar perguntas;
- cadastrar perguntas;
- editar perguntas;
- excluir perguntas;
- listar respostas;
- cadastrar respostas;
- contar respostas.

As rotas correspondentes são simples e possuem responsabilidades bem definidas.

Por exemplo, o cadastro de uma pergunta é realizado de forma direta:

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

Não foram adicionadas camadas ou funcionalidades que não são necessárias para essa operação.

---

## 3. Separação de responsabilidades

Uma melhoria importante realizada no projeto foi a separação entre o modelo e o acesso aos dados.

O `modelo.js` não executa mais diretamente comandos SQL. Ele utiliza o Repository:

```javascript
function cadastrar_pergunta(texto) {
  return repositorio.criar_pergunta(texto);
}
```

O acesso ao banco fica concentrado em:

```text
repositorio/repositorio_bd.js
```

Enquanto uma implementação em memória é disponibilizada em:

```text
repositorio/repositorio_memoria.js
```

Essa estrutura mantém o código simples porque cada componente possui uma responsabilidade específica.

---

## 4. Exemplo de código simples

A função `get_respostas` possui uma responsabilidade direta:

```javascript
function get_respostas(id_pergunta) {
  return repositorio.recuperar_todas_respostas(id_pergunta);
}
```

Não existe processamento desnecessário no modelo. A função apenas encaminha a solicitação para o Repository.

---

## 5. Oportunidades de simplificação

Apesar da estrutura atual ser relativamente simples, existem alguns pontos que podem ser melhorados.

### 5.1 Validação de dados

Atualmente algumas rotas acessam diretamente propriedades do corpo da requisição:

```javascript
const texto = req.body.pergunta;
```

Uma evolução possível seria validar se `pergunta` foi realmente enviada antes de chamar o modelo.

Por exemplo:

```javascript
if (!req.body.pergunta) {
  return res.status(400).json({
    erro: 'O texto da pergunta é obrigatório'
  });
}
```

Essa melhoria deve ser feita somente quando houver necessidade funcional de validação mais rigorosa.

### 5.2 Tratamento de erros

O `server.js` possui blocos `try/catch` nas operações que acessam o modelo. Isso atende à necessidade atual, mas futuramente pode ser estudada uma estratégia centralizada de tratamento de erros caso o número de rotas aumente.

Não é necessário criar essa estrutura antecipadamente, pois isso poderia aumentar a complexidade sem uma necessidade concreta.

### 5.3 Evitar funcionalidades prematuras

As próximas funcionalidades previstas no projeto incluem:

- votação;
- busca;
- categorização;
- perfil de usuário;
- notificações.

Essas funcionalidades não devem ser implementadas antes da necessidade correspondente estar definida e planejada. Cada uma deve ser adicionada quando entrar no desenvolvimento do projeto.

---

## 6. Conclusão

O projeto apresenta características de Design Simples porque suas funções possuem responsabilidades relativamente pequenas e porque o acesso aos dados foi separado do modelo por meio do Repository.

A principal aplicação do YAGNI é evitar a criação antecipada de funcionalidades ou abstrações que ainda não são necessárias.

As melhorias identificadas devem ser implementadas conforme surgirem requisitos concretos, mantendo a solução simples e evoluindo-a de forma incremental.
