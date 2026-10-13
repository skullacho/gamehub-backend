const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Carrega .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.log('[Diagnóstico] Arquivo backend/.env não encontrado.');
}

const mongoose = require('mongoose');

async function testConnection() {
  console.log('====================================================');
  console.log('   GameHub — Diagnóstico de Conexão MongoDB Atlas   ');
  console.log('====================================================');

  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('seu_usuario') || uri.includes('<usuario>')) {
    console.error('❌ MONGODB_URI não está preenchida com credenciais reais no arquivo backend/.env.');
    console.log('\nPor favor, edite o arquivo backend/.env com a sua string de conexão:');
    console.log('MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/gamehub?retryWrites=true&w=majority\n');
    process.exit(1);
  }

  // Mascarar senha para exibição segura nos logs
  const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
  console.log(`Tentando conectar ao MongoDB Atlas: ${maskedUri}`);

  try {
    const startTime = Date.now();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    const elapsed = Date.now() - startTime;

    console.log(`✅ Conexão estabelecida com sucesso em ${elapsed}ms!`);
    console.log(`   Banco de dados: "${mongoose.connection.name}"`);
    console.log(`   Host: "${mongoose.connection.host}"`);

    // Testa listagem da collection jogos
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasJogos = collections.some((c) => c.name === 'jogos');
    console.log(`   Collection "jogos" existente: ${hasJogos ? 'Sim' : 'Não (será criada ao cadastrar o primeiro jogo)'}`);

    if (hasJogos) {
      const count = await mongoose.connection.db.collection('jogos').countDocuments();
      console.log(`   Total de documentos em "jogos": ${count}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Diagnóstico concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Falha ao conectar com o MongoDB Atlas:');
    console.error(`   Mensagem de erro: ${error.message}`);

    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('\n💡 DICA: Usuário ou senha incorretos no arquivo .env.');
      console.log('   Verifique suas credenciais em Database Access no painel do MongoDB Atlas.');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('queryTxt ETIMEOUT') || error.message.includes('whitelist')) {
      console.log('\n💡 DICA: O endereço de IP da sua conexão pode estar bloqueado no Atlas.');
      console.log('   Acesse "Network Access" no painel do Atlas e adicione o IP 0.0.0.0/0 (Allow Access from Anywhere).');
    }

    process.exit(1);
  }
}

testConnection();
