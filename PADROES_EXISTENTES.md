# Padrões de Projeto Existentes

## 1. Objetivo

Este documento identifica padrões de projeto já presentes, mesmo que parcialmente, no código atual do ESM Forum.

A análise considera a estrutura implementada no backend, especialmente `modelo.js`, `repositorio/repositorio_bd.js`, `repositorio/repositorio_memoria.js`, `bd/bd_utils.js` e os testes.

A Tarefa 3 solicita identificar os padrões, indicar onde estão aplicados e informar se a implementação está completa ou se pode ser melhorada.

## 2. Repository

### Identificação

O padrão **Repository** é o padrão mais claramente presente na implementação atual.

### Onde está aplicado

- `repositorio/repositorio_bd.js`
- `repositorio/repositorio_memoria.js`
- `modelo.js`

`repositorio_bd.js` concentra operações de persistência usando SQLite, enquanto `repositorio_memoria.js` fornece uma implementação em memória com a mesma interface de operações.

Exemplos da interface utilizada pelo modelo:

```javascript
recuperar_todas_perguntas()
recuperar_pergunta(id_pergunta)
recuperar_todas_respostas(id_pergunta)
recuperar_num_respostas(id_pergunta)
criar_pergunta(texto)
criar_resposta(id_pergunta, texto)
editar_pergunta(id_pergunta, texto)
deletar_pergunta(id_pergunta)
```

O `modelo.js` utiliza essas operações em vez de executar consultas SQL diretamente.

### Situação da implementação

**Parcialmente completa / funcional para o escopo atual.**

A separação entre modelo e persistência está implementada e já existe mais de uma implementação do repositório. Isso também facilita os testes automatizados com `RepositorioMemoria`.

Ainda pode ser melhorada com uma abstração explícita da interface do repositório. Em JavaScript, essa abstração poderia ser documentada ou representada por uma classe-base/interface por convenção, mantendo os mesmos métodos nas implementações.

---

## 3. Dependency Injection / Injeção de Dependência

### Identificação

Existe também uma aplicação de **injeção de dependência**, principalmente por meio da função `reconfig_repositorio()` do `modelo.js`.

### Onde está aplicado

Arquivo:

```text
modelo.js
```

Trecho:

```javascript
var repositorio = require('./repositorio/repositorio_bd.js');

function reconfig_repositorio(novo_repositorio) {
  repositorio = novo_repositorio;
}
```

Nos testes, o modelo pode receber uma implementação diferente:

```javascript
const RepositorioMemoria =
  require('../repositorio/repositorio_memoria.js');

const repositorio = new RepositorioMemoria();

modelo.reconfig_repositorio(repositorio);
```

Assim, o modelo não precisa conhecer a implementação interna do armazenamento em memória para executar os testes.

### Situação da implementação

**Funcional, mas pode ser melhorada.**

A dependência é substituível e isso foi utilizado nos testes. Porém, a implementação ainda começa com uma dependência concreta:

```javascript
require('./repositorio/repositorio_bd.js')
```

Uma evolução possível seria fazer a dependência ser fornecida na inicialização da aplicação, deixando a escolha da implementação fora do módulo de negócio.

---

## 4. Facade / Fachada

### Identificação

O `modelo.js` apresenta características de **Facade (Fachada)** em relação ao acesso aos repositórios.

### Onde está aplicado

Arquivo:

```text
modelo.js
```

O módulo oferece operações de alto nível para o restante da aplicação:

```javascript
listar_perguntas()
cadastrar_pergunta(texto)
cadastrar_resposta(id_pergunta, texto)
get_pergunta(id_pergunta)
get_respostas(id_pergunta)
editar_pergunta(id_pergunta, texto)
deletar_pergunta(id_pergunta)
```

O `server.js` utiliza essas operações sem precisar conhecer detalhes de SQL, SQLite ou da implementação em memória.

Por exemplo:

```javascript
app.post('/perguntas', (req, res) => {
  const id_pergunta =
    modelo.cadastrar_pergunta(req.body.pergunta);

  res.json({id_pergunta: id_pergunta});
});
```

### Situação da implementação

**Parcial.**

O `modelo.js` funciona como uma camada intermediária simples e esconde detalhes do repositório do servidor. Entretanto, ele também contém lógica de negócio, como o cálculo de `num_respostas`, portanto não é uma Fachada pura.

Por isso, é mais adequado dizer que o módulo possui **características de Fachada**, e não afirmar que existe uma implementação completa e formal do padrão.

---

## 5. Estratégia / Strategy

### Identificação

Existe uma estrutura que **se aproxima do padrão Strategy**, mas não é uma implementação formal completa.

### Onde aparece

As duas implementações de repositório podem ser vistas como estratégias intercambiáveis:

```text
RepositorioBD
      |
      +----> acesso ao SQLite

RepositorioMemoria
      |
      +----> armazenamento em memória
```

O `modelo.js` pode trabalhar com uma ou outra implementação através de:

```javascript
modelo.reconfig_repositorio(repositorio);
```

### Situação da implementação

**Parcial / aproximação.**

A substituição de implementações é real, mas não existe uma classe ou contexto explicitamente estruturado como `Strategy`. A estrutura foi criada principalmente para aplicar Repository, DIP e facilitar os testes.

Portanto, esta característica deve ser apresentada como uma **aproximação de Strategy**, e não como um padrão Strategy formalmente implementado.

---

## 6. Resumo

| Padrão / característica | Local | Situação |
|---|---|---|
| Repository | `repositorio/repositorio_bd.js`, `repositorio_memoria.js` | Funcional, com possibilidade de melhorias |
| Injeção de Dependência | `modelo.js` + testes | Funcional, mas pode ser refinada |
| Facade | `modelo.js` usado pelo `server.js` | Parcial / característica de Fachada |
| Strategy | `RepositorioBD` e `RepositorioMemoria` intercambiáveis | Aproximação, não implementação formal |

## 7. Conclusão

O padrão mais evidente no código atual é **Repository**, pois o acesso aos dados foi separado do modelo e existem duas implementações compatíveis: uma baseada em banco SQLite e outra em memória.

Também existem características de **injeção de dependência**, pois `modelo.js` pode receber outra implementação de repositório durante os testes.

O `modelo.js` funciona como uma interface simplificada para o servidor e, por isso, apresenta características de **Facade**. A existência de implementações intercambiáveis também se aproxima de **Strategy**, mas sem uma estrutura formal desse padrão.

Essas identificações devem ser consideradas de acordo com o grau de implementação existente: nem toda característica encontrada representa necessariamente uma implementação completa de um padrão de projeto.
