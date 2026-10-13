# GameHub — Backend API

API REST construída com Node.js, Express e MongoDB Atlas para o sistema de gerenciamento de jogos **GameHub**.

## Integrantes
- Arthur Nunes de Souza Possato
- Enzo Marques Cardona
- Pedro Sante Maria Bueno Silva

## Tecnologias
- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **dotenv**
- **cors**
- **Vercel Serverless Functions**

## Como Executar Localmente

1. Clone o repositório ou navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Preencha o `MONGODB_URI` com a sua string de conexão do MongoDB Atlas.

4. Inicie o servidor:
   ```bash
   npm run dev
   # ou
   npm start
   ```

5. Acesse no navegador ou Postman:
   - Status da API: `http://localhost:5000/api/health`
   - Listagem de Jogos: `http://localhost:5000/api/jogos`

## Documentação dos Endpoints
Consulte o arquivo `api.md` para a especificação completa de rotas, parâmetros, exemplos de payload e respostas em JSON.
