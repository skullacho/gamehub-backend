const mongoose = require('mongoose');

/**
 * Cache de conexão para Mongoose reutilizar instâncias em ambientes
 * serverless (como Vercel) e evitar limites de conexão simultânea.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    // Se a variável não estiver definida, ativamos o fallback local para testes sem travar a aplicação
    console.log('[Database] MONGODB_URI não definida no .env. Operando em modo de catálogo local (Memória).');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`[Database] Conectado ao MongoDB com sucesso: ${mongooseInstance.connection.name}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('[Database Error] Falha ao conectar ao MongoDB:', error.message);
    throw error;
  }

  return cached.conn;
}

module.exports = connectDB;
