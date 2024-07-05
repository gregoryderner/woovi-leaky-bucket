# Woovi Leaky Bucket Challenge

## Desafio Proposto

Este desafio tem como foco implementar uma estratégia de "Leaky Bucket" similar à utilizada pelo BACEN. Os requisitos são:

1. Um servidor HTTP em Node.js.
2. Estratégia de multi-tenancy para gerenciamento de requisições.
3. Autenticação de usuários com Bearer Token.
4. Uma mutação que simula uma consulta de chave Pix.
5. Estratégia do Leaky Bucket completa.
6. Validação da estratégia de token com Jest.
7. Geração de uma coleção Postman para a API.

## Resolução do Desafio

### 1. Servidor HTTP em Node.js

O servidor foi implementado usando Koa, um framework minimalista para Node.js. Utilizamos o `koa-router` para gerenciar as rotas HTTP.

### 2. Estratégia de Multi-Tenancy

Foi implementada uma classe `TenantService` que gerencia múltiplos tenants (usuários), cada um com sua própria quantidade de tokens. A classe `Tenant` representa cada usuário e controla o número de tokens disponíveis.

### 3. Autenticação com Bearer Token

Utilizamos JSON Web Tokens (JWT) para autenticação. A classe `AuthService` é responsável por gerar e verificar tokens. A autenticação é feita através do header `Authorization`.

### 4. Mutação para Consulta de Chave Pix

Foi criada uma mutação GraphQL `initiatePixTransaction` que simula uma transação Pix. A resposta é baseada em uma lógica de sucesso/fracasso aleatória para demonstrar a funcionalidade.

### 5. Estratégia do Leaky Bucket

Implementamos a estratégia do Leaky Bucket na classe `TenantService`. Cada requisição consome um token. Se a requisição falha, o token é decrementado. A cada hora, um token é adicionado até o limite máximo de 10 tokens por usuário.

### 6. Validação com Jest

Testes foram escritos usando Jest para validar a estratégia do Leaky Bucket, autenticação, e a lógica de consumo de tokens. Os testes garantem que a aplicação se comporta conforme esperado.

### 7. Geração de Coleção Postman

Uma coleção Postman foi criada para facilitar o consumo da API.

## Clean Architecture e Estrutura em Camadas

### Arquitetura Limpa (Clean Architecture)

A Clean Architecture é um conjunto de princípios e práticas para estruturar o código de forma que ele seja altamente testável, independente de frameworks, e fácil de manter. Neste projeto, utilizamos os seguintes princípios da Clean Architecture:

- **Separation of Concerns**: Separação clara entre lógica de negócios, lógica de aplicação e detalhes de infraestrutura.
- **Dependency Inversion Principle**: A camada de aplicação não depende diretamente de frameworks ou bibliotecas externas.

### Estrutura em Camadas

1. **Domain (src/domain)**:
    - Contém as entidades e regras de negócios.
    - Exemplo: `Tenant` e `AuthenticationService`.

2. **Application (src/application)**:
    - Contém a lógica de aplicação, orquestrando a interação entre a camada de domínio e a camada de infraestrutura.
    - Exemplo: `TenantService` e `AuthService`.

3. **Infrastructure (src/infrastructure)**:
    - Contém a implementação de detalhes como frameworks, bibliotecas e adaptadores.
    - Exemplo: Resolvers GraphQL, Rotas Koa, e configuração do servidor.

4. **Interface (src/infrastructure/graphql e src/infrastructure/http)**:
    - Define os pontos de entrada e saída do sistema.
    - Exemplo: Resolvers GraphQL e rotas HTTP.

### Estrutura do Projeto

```plain
src/
│
├── application/
│ ├── services/
│ │ ├── authService.ts
│ │ └── tenantService.ts
│
├── domain/
│ ├── entities/
│ │ └── tenant.ts
│ └── services/
│ └── authenticationService.ts
│
├── infrastructure/
│ ├── graphql/
│ │ ├── resolvers.ts
│ │ └── schema.ts
│ │ 
│ ├── http/
│ │ ├── routes/
│ │ │ ├── auth/
│ │ │ │ └── authRoutes.ts
│ │ │ ├── tenant/
│ │ │ │ └── tenantRoutes.ts
│ │ │ └── index.ts
│ │ └── server.ts
│
├── main.ts
└── tests/
├── authService.spec.ts
├── leakyBucket.spec.ts
├── leakyBucketLoad.spec.ts
└── tenantService.spec.ts
```

### Executando o Projeto

1. **Instalar dependências:**

```sh
npm install
npm start
```

Testes
```sh
npm test
```
# woovi-leaky-bucket
