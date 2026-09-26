# Instalação e Execução do Projeto

## 1. Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm
- Git

O projeto utiliza Node.js e npm para instalação das dependências e execução do backend/frontend.

## 2. Clonar os repositórios

O projeto possui dois repositórios:

- `esmforum` — backend
- `esmforum-react` — frontend

Depois de realizar os forks no GitHub, clone os seus respectivos repositórios localmente.

Exemplo:

```bash
git clone <https://github.com/RaissaAbreu/esmforum.git>
git clone <https://github.com/RaissaAbreu/esmforum.git>
```

Entre na pasta do backend:

```bash
cd esmforum
```

## 3. Instalação das dependências do backend

Na pasta do `esmforum`, execute:

```bash
npm install
```

Para verificar se as dependências foram instaladas corretamente:

```bash
npm test
```

No estado atual do projeto, os testes automatizados do backend devem ser executados com:

```bash
npx jest --runInBand
```

O parâmetro `--runInBand` executa os testes sequencialmente e evita o problema de encerramento do processo nativo observado com `better-sqlite3` quando os testes são executados em paralelo.

## 4. Execução do backend

Na pasta do backend:

```bash
node server.js
```

O servidor é iniciado na porta `5000` e fica disponível em:

```text
http://localhost:5000
```

A mensagem esperada no terminal é semelhante a:

```text
ESM Forum rodando em 5000
```

### Problema: porta 5000 já está em uso

Se aparecer:

```text
Error: listen EADDRINUSE: address already in use 127.0.0.1:5000
```

significa que já existe outro processo utilizando a porta 5000.

Nesse caso, verifique o processo:

```bash
lsof -i :5000
```

Depois, encerre o processo correspondente, se necessário:

```bash
kill <PID>
```

E execute novamente:

```bash
node server.js
```

## 5. Instalação e execução do frontend

Entre na pasta do repositório `esmforum-react`:

```bash
cd esmforum-react
```

Instale as dependências:

```bash
npm install
```

Depois execute o frontend conforme o script definido no `package.json`:

```bash
npm start
```

ou, caso o projeto utilize outro script:

```bash
npm run dev
```

O endereço exato de execução deve ser confirmado pela mensagem exibida pelo próprio projeto no terminal.

Nos testes E2E atualmente configurados no projeto, a aplicação frontend é acessada em:

```text
http://localhost:3000
```

Portanto, quando o frontend estiver configurado para essa porta, ele deverá estar disponível em:

```text
http://localhost:3000
```

## 6. Execução dos testes E2E

Os testes E2E utilizam Cypress.

Com o backend e o frontend em execução, a partir da raiz do projeto backend, podem ser executados os testes configurados em:

```text
testes/e2e/cypress/e2e/
```

Para executar um teste específico:

```bash
npx cypress run   --config-file testes/e2e/cypress.config.js   --spec "cypress/e2e/spec4.cy.js"
```

A configuração atual utiliza:

```text
testes/e2e/cypress.config.js
```

e os testes ficam em:

```text
testes/e2e/cypress/e2e/
```

Os testes existentes cobrem, entre outros comportamentos:

- cadastro de pergunta;
- cadastro e visualização de resposta;
- edição de pergunta;
- exclusão de pergunta.

## 7. Banco de dados

O backend utiliza SQLite através do pacote `better-sqlite3`.

O banco principal está em:

```text
bd/esmforum.db
```

O esquema está definido em:

```text
bd/schema.sql
```

Também existe um banco utilizado pelos testes:

```text
bd/esmforum-teste.db
```

## 8. Estrutura relevante

A estrutura utilizada no backend inclui:

```text
esmforum/
├── bd/
│   ├── bd_utils.js
│   ├── criar_bd.sh
│   ├── schema.sql
│   ├── esmforum.db
│   └── esmforum-teste.db
├── repositorio/
│   ├── repositorio_bd.js
│   └── repositorio_memoria.js
├── testes/
│   ├── modelo.test.js
│   ├── listar_perguntas.test.js
│   └── e2e/
├── modelo.js
├── server.js
├── package.json
└── package-lock.json
```

## 9. Verificação rápida

Para verificar o backend:

```bash
npm install
npx jest --runInBand
node server.js
```

Depois, em outro terminal, verifique o frontend em:

```text
http://localhost:3000
```

Com backend e frontend funcionando, os testes E2E podem ser executados.

## 10. Repositórios

Os links dos forks utilizados na entrega devem ser registrados abaixo:

- Backend (`esmforum`): `<URL_DO_SEU_FORK>`
- Frontend (`esmforum-react`): `<URL_DO_SEU_FORK_DO_FRONTEND>`

> Substitua os dois placeholders acima pelos links reais dos seus forks antes da entrega.
