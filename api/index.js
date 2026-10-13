const path = require('path');
const dotenv = require('dotenv');

// Carrega o arquivo .env se estiver executando localmente
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const jogosRoutes = require('../routes/jogosRoutes');

const app = express();

// Configuração flexível de CORS para desenvolvimento e produção
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['*'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como curl, postman, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Permite qualquer preview ou domínio da Vercel
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissivo para fins acadêmicos e testes
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// Rota raiz informativa
app.get('/', (req, res) => {
  res.status(200).json({
    projeto: 'GameHub API',
    descricao: 'API REST para gerenciamento de catálogo de jogos eletrônicos',
    versao: '1.0.0',
    integrantes: [
      'Arthur Nunes de Souza Possato',
      'Enzo Marques Cardona',
      'Pedro Sante Maria Bueno Silva',
    ],
    endpoints: {
      health: '/api/health',
      jogos: '/api/jogos',
    },
  });
});

// Endpoint de Health Check
app.get('/api/health', async (req, res) => {
  let dbStatus = 'desconectado';
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    dbStatus = state === 1 ? 'conectado' : 'conectado (modo local)';
  } catch (error) {
    dbStatus = `erro: ${error.message}`;
  }

  res.status(200).json({
    status: 'ok',
    message: 'GameHub API em operação',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API de Jogos
app.use('/api', jogosRoutes);

// Tratamento de rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Tratamento global de erros (500)
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]', err);
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno no servidor.',
    erro: err.message,
  });
});

// Inicialização do servidor se executado diretamente
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[GameHub API] Servidor rodando na porta ${PORT}`);
    console.log(`[GameHub API] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[GameHub API] Catálogo de jogos: http://localhost:${PORT}/api/jogos`);
  });
}

// Exporta para a Vercel Serverless
module.exports = app;
