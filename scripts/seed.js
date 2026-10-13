const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Jogo = require('../models/Jogo');

const JOGOS_INICIAIS = [
  {
    nome: 'The Witcher 3: Wild Hunt',
    desenvolvedora: 'CD Projekt Red',
    genero: 'RPG',
    plataforma: 'Multiplataforma',
    preco: 129.9,
    anoLancamento: 2015,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
    descricao:
      'Geralt de Rívia é um caçador de monstros em busca de Ciri, a Criança da Profecia, em um vasto mundo aberto repleto de escolhas e consequências.',
  },
  {
    nome: 'Minecraft',
    desenvolvedora: 'Mojang Studios',
    genero: 'Aventura',
    plataforma: 'Multiplataforma',
    preco: 99.9,
    anoLancamento: 2011,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg',
    descricao:
      'Jogo de mundo aberto infinito baseado em blocos, onde os jogadores podem explorar, minerar recursos, construir qualquer estrutura imaginável e sobreviver a criaturas noturnas.',
  },
  {
    nome: 'God of War Ragnarök',
    desenvolvedora: 'Santa Monica Studio',
    genero: 'Ação',
    plataforma: 'PlayStation',
    preco: 299.9,
    anoLancamento: 2022,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg',
    descricao:
      'Kratos e Atreus devem viajar pelos Nove Reinos nórdicos em busca de respostas enquanto as forças asgardianas se preparam para a profetizada batalha final.',
  },
  {
    nome: 'Forza Horizon 5',
    desenvolvedora: 'Playground Games',
    genero: 'Corrida',
    plataforma: 'Xbox',
    preco: 249.0,
    anoLancamento: 2021,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3ofx.jpg',
    descricao:
      'Sua maior aventura Horizon te espera! Lidere expedições em cenários vibrantes e em constante evolução no vasto mundo aberto do México.',
  },
  {
    nome: 'The Legend of Zelda: Breath of the Wild',
    desenvolvedora: 'Nintendo EPD',
    genero: 'Aventura',
    plataforma: 'Nintendo Switch',
    preco: 299.0,
    anoLancamento: 2017,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.jpg',
    descricao:
      'Após um sono de 100 anos, Link desperta em um reino de Hyrule em ruínas e deve redescobrir suas memórias para derrotar Calamity Ganon.',
  },
  {
    nome: 'Resident Evil 4 Remake',
    desenvolvedora: 'Capcom',
    genero: 'Terror',
    plataforma: 'Multiplataforma',
    preco: 199.0,
    anoLancamento: 2023,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg',
    descricao:
      'Sobrevivência é apenas o começo. Seis anos após o desastre biológico em Raccoon City, Leon S. Kennedy é enviado para resgatar a filha sequestrada do presidente.',
  },
  {
    nome: 'EA Sports FC 24',
    desenvolvedora: 'EA Sports',
    genero: 'Esportes',
    plataforma: 'Multiplataforma',
    preco: 299.0,
    anoLancamento: 2023,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6t8h.jpg',
    descricao:
      'A mais nova era do futebol virtual com tecnologia HyperMotionV, PlayStyles otimizados pela Opta e motores Frostbite aprimorados.',
  },
  {
    nome: 'Age of Empires IV',
    desenvolvedora: 'Relic Entertainment',
    genero: 'Estratégia',
    plataforma: 'PC',
    preco: 149.0,
    anoLancamento: 2021,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co38s5.jpg',
    descricao:
      'Evolua civilizações históricas, construa impérios magníficos e lidere tropas em batalhas táticas em tempo real através de eras marcantes.',
  },
];

async function seedDatabase() {
  console.log('[Seed] Iniciando povoamento da base de dados...');

  try {
    await connectDB();

    const countAntes = await Jogo.countDocuments();
    console.log(`[Seed] Total de jogos atualmente no banco: ${countAntes}`);

    for (const item of JOGOS_INICIAIS) {
      const existe = await Jogo.findOne({ nome: item.nome });
      if (!existe) {
        await Jogo.create(item);
        console.log(`[Seed] + Inserido: "${item.nome}" (${item.genero})`);
      } else {
        console.log(`[Seed] = Já existente: "${item.nome}"`);
      }
    }

    const countDepois = await Jogo.countDocuments();
    console.log(`[Seed] Povoamento concluído com sucesso! Total no catálogo: ${countDepois}`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Falha ao povoar o banco:', error.message);
    process.exit(1);
  }
}

seedDatabase();
