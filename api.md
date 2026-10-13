# Documentação da API REST — GameHub

API RESTful para o gerenciamento do catálogo de jogos eletrônicos do sistema **GameHub**.

---

## 1. URLs Base

- **Desenvolvimento local:** `http://localhost:5000`
- **Produção (Vercel):** `https://gamehub-backend-[seu-subdominio].vercel.app` (definida após o deploy)

Todas as rotas de jogos são prefixadas por `/api`.

---

## 2. Variáveis de Ambiente

Para executar o backend, configure o arquivo `.env` na raiz da pasta `backend/` seguindo o modelo `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/gamehub?retryWrites=true&w=majority
NODE_ENV=development
CLIENT_URL=http://localhost:3000,http://127.0.0.1:5500
```

> **Aviso de Segurança:** Nunca envie o arquivo `.env` com dados sensíveis para o GitHub. Use o arquivo `.env.example` como template.

---

## 3. Modelo de Dados (Jogo)

| Campo | Tipo | Obrigatório | Descrição / Valores Aceitos |
|---|---|---|---|
| `_id` | ObjectId | Sim (Gerado) | Identificador único do documento |
| `nome` | String | Sim | Nome do jogo (1 a 120 caracteres) |
| `desenvolvedora` | String | Sim | Estúdio/produtora desenvolvedora |
| `genero` | String | Sim | `Ação`, `Aventura`, `RPG`, `Corrida`, `Estratégia`, `Terror`, `Esportes`, `Outros` |
| `plataforma` | String | Sim | `PC`, `PlayStation`, `Xbox`, `Nintendo Switch`, `Multiplataforma` |
| `preco` | Number | Não (Padrão: 0) | Preço em reais (R$) (≥ 0) |
| `anoLancamento` | Number | Não | Ano de lançamento (1950 até ano atual + 5) |
| `imagem` | String | Não | URL da imagem de capa do jogo |
| `descricao` | String | Não | Sinopse ou breve resumo do jogo |
| `createdAt` | Date | Sim (Automático) | Data/hora de cadastro |
| `updatedAt` | Date | Sim (Automático) | Data/hora da última atualização |

---

## 4. Endpoints

### 4.1 Health Check (Verificação de Status)
Verifica se a API está online e se a conexão com o banco de dados está ativa.

- **Método:** `GET`
- **Rota:** `/api/health`
- **Autenticação:** Nenhuma

#### Resposta de Sucesso (200 OK)
```json
{
  "status": "ok",
  "message": "GameHub API em operação",
  "database": "conectado",
  "timestamp": "2026-10-13T17:00:00.000Z"
}
```

---

### 4.2 Listar Jogos
Retorna a lista de jogos cadastrados. Suporta filtros opcionais via Query Parameters.

- **Método:** `GET`
- **Rota:** `/api/jogos`
- **Query Parameters Opcionais:**
  - `busca` (string): Busca por texto no nome ou desenvolvedora.
  - `genero` (string): Filtra por gênero exato.
  - `plataforma` (string): Filtra por plataforma exata.
  - `ordenar` (string): Ordena os resultados (`nome_asc`, `nome_desc`, `preco_asc`, `preco_desc`, `ano_desc`).

#### Exemplo de Requisição
```http
GET /api/jogos?genero=RPG&ordenar=preco_asc HTTP/1.1
Host: localhost:5000
```

#### Resposta de Sucesso (200 OK)
```json
{
  "sucesso": true,
  "total": 1,
  "dados": [
    {
      "_id": "670c2a8f8e12ab34cd56ef78",
      "nome": "The Witcher 3: Wild Hunt",
      "desenvolvedora": "CD Projekt Red",
      "genero": "RPG",
      "plataforma": "Multiplataforma",
      "preco": 129.9,
      "anoLancamento": 2015,
      "imagem": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
      "descricao": "RPG de ação em mundo aberto focado na caçada de monstros.",
      "createdAt": "2026-10-13T16:50:00.000Z",
      "updatedAt": "2026-10-13T16:50:00.000Z"
    }
  ]
}
```

---

### 4.3 Buscar Jogo por ID
Obtém os detalhes completos de um jogo a partir de seu `_id`.

- **Método:** `GET`
- **Rota:** `/api/jogos/:id`

#### Resposta de Sucesso (200 OK)
```json
{
  "sucesso": true,
  "dados": {
    "_id": "670c2a8f8e12ab34cd56ef78",
    "nome": "The Witcher 3: Wild Hunt",
    "desenvolvedora": "CD Projekt Red",
    "genero": "RPG",
    "plataforma": "Multiplataforma",
    "preco": 129.9,
    "anoLancamento": 2015,
    "imagem": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
    "descricao": "RPG de ação em mundo aberto focado na caçada de monstros.",
    "createdAt": "2026-10-13T16:50:00.000Z",
    "updatedAt": "2026-10-13T16:50:00.000Z"
  }
}
```

#### Resposta de Erro — ID Não Encontrado (404 Not Found)
```json
{
  "sucesso": false,
  "mensagem": "Jogo não encontrado."
}
```

#### Resposta de Erro — ID Inválido (400 Bad Request)
```json
{
  "sucesso": false,
  "mensagem": "Identificador de jogo inválido."
}
```

---

### 4.4 Cadastrar Jogo
Cadastra um novo jogo na base de dados.

- **Método:** `POST`
- **Rota:** `/api/jogos`
- **Headers:** `Content-Type: application/json`

#### Corpo da Requisição (JSON)
```json
{
  "nome": "Minecraft",
  "desenvolvedora": "Mojang Studios",
  "genero": "Aventura",
  "plataforma": "Multiplataforma",
  "preco": 99.9,
  "anoLancamento": 2011,
  "imagem": "https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg",
  "descricao": "Jogo de exploração e construção em blocos infinitos."
}
```

#### Resposta de Sucesso (201 Created)
```json
{
  "sucesso": true,
  "mensagem": "Jogo cadastrado com sucesso!",
  "dados": {
    "_id": "670c2b9f8e12ab34cd56ef79",
    "nome": "Minecraft",
    "desenvolvedora": "Mojang Studios",
    "genero": "Aventura",
    "plataforma": "Multiplataforma",
    "preco": 99.9,
    "anoLancamento": 2011,
    "imagem": "https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg",
    "descricao": "Jogo de exploração e construção em blocos infinitos.",
    "createdAt": "2026-10-13T17:02:00.000Z",
    "updatedAt": "2026-10-13T17:02:00.000Z"
  }
}
```

#### Resposta de Erro — Falha de Validação (400 Bad Request)
```json
{
  "sucesso": false,
  "mensagem": "Erro de validação nos campos informados.",
  "erros": [
    "O campo 'nome' é obrigatório.",
    "Gênero 'Invalido' não é permitido."
  ]
}
```

---

### 4.5 Atualizar Jogo
Atualiza as informações de um jogo existente.

- **Método:** `PUT`
- **Rota:** `/api/jogos/:id`
- **Headers:** `Content-Type: application/json`

#### Corpo da Requisição (JSON)
```json
{
  "nome": "Minecraft Bedrock Edition",
  "preco": 149.9
}
```

#### Resposta de Sucesso (200 OK)
```json
{
  "sucesso": true,
  "mensagem": "Jogo atualizado com sucesso!",
  "dados": {
    "_id": "670c2b9f8e12ab34cd56ef79",
    "nome": "Minecraft Bedrock Edition",
    "desenvolvedora": "Mojang Studios",
    "genero": "Aventura",
    "plataforma": "Multiplataforma",
    "preco": 149.9,
    "anoLancamento": 2011,
    "imagem": "https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg",
    "descricao": "Jogo de exploração e construção em blocos infinitos.",
    "createdAt": "2026-10-13T17:02:00.000Z",
    "updatedAt": "2026-10-13T17:05:00.000Z"
  }
}
```

---

### 4.6 Excluir Jogo
Remove um jogo da base de dados.

- **Método:** `DELETE`
- **Rota:** `/api/jogos/:id`

#### Resposta de Sucesso (200 OK)
```json
{
  "sucesso": true,
  "mensagem": "Jogo excluído com sucesso!",
  "dados": {
    "_id": "670c2b9f8e12ab34cd56ef79"
  }
}
```

---

## 5. Códigos de Status HTTP

| Código | Descrição |
|---|---|
| `200 OK` | Requisição executada com sucesso |
| `201 Created` | Recurso criado com sucesso |
| `400 Bad Request` | Parâmetros inválidos ou campos obrigatórios ausentes |
| `404 Not Found` | Recurso não localizado |
| `500 Internal Server Error` | Erro inesperado no servidor ou falha de banco de dados |

---

## 6. Instruções de Teste

### Testando com cURL

```bash
# 1. Health check
curl -X GET http://localhost:5000/api/health

# 2. Listar todos os jogos
curl -X GET http://localhost:5000/api/jogos

# 3. Cadastrar um jogo
curl -X POST http://localhost:5000/api/jogos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Chrono Trigger",
    "desenvolvedora": "Square",
    "genero": "RPG",
    "plataforma": "Multiplataforma",
    "preco": 59.90,
    "anoLancamento": 1995,
    "imagem": "https://exemplo.com/chrono.jpg",
    "descricao": "Clássico RPG de viagem no tempo."
  }'

# 4. Atualizar um jogo
curl -X PUT http://localhost:5000/api/jogos/<ID_DO_JOGO> \
  -H "Content-Type: application/json" \
  -d '{"preco": 49.90}'

# 5. Excluir um jogo
curl -X DELETE http://localhost:5000/api/jogos/<ID_DO_JOGO>
```

### Testando com Postman
1. Crie uma nova Collection chamada **GameHub API**.
2. Defina uma variável de ambiente `baseUrl = http://localhost:5000`.
3. Crie requisições para cada um dos métodos e rotas listados nesta documentação.
4. Verifique os status codes e os JSONs de resposta.
