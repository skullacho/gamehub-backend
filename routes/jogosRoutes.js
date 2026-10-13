const express = require('express');
const mongoose = require('mongoose');
const Jogo = require('../models/Jogo');
const connectDB = require('../config/database');

const router = express.Router();

// Catálogo inicial em memória para testes locais quando não houver MongoDB Atlas configurado
let memoryJogos = [
  {
    _id: '670c2a8f8e12ab34cd56ef71',
    nome: 'The Witcher 3: Wild Hunt',
    desenvolvedora: 'CD Projekt Red',
    genero: 'RPG',
    plataforma: 'Multiplataforma',
    preco: 129.9,
    anoLancamento: 2015,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
    descricao:
      'Geralt de Rívia é um caçador de monstros em busca de Ciri, a Criança da Profecia, em um vasto mundo aberto repleto de escolhas e consequências.',
    createdAt: new Date('2026-10-13T10:00:00Z'),
    updatedAt: new Date('2026-10-13T10:00:00Z'),
  },
  {
    _id: '670c2a8f8e12ab34cd56ef72',
    nome: 'Minecraft',
    desenvolvedora: 'Mojang Studios',
    genero: 'Aventura',
    plataforma: 'Multiplataforma',
    preco: 99.9,
    anoLancamento: 2011,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg',
    descricao:
      'Jogo de mundo aberto infinito baseado em blocos, onde os jogadores podem explorar, minerar recursos, construir qualquer estrutura imaginável e sobreviver a criaturas noturnas.',
    createdAt: new Date('2026-10-13T10:05:00Z'),
    updatedAt: new Date('2026-10-13T10:05:00Z'),
  },
  {
    _id: '670c2a8f8e12ab34cd56ef73',
    nome: 'God of War Ragnarök',
    desenvolvedora: 'Santa Monica Studio',
    genero: 'Ação',
    plataforma: 'PlayStation',
    preco: 299.9,
    anoLancamento: 2022,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg',
    descricao:
      'Kratos e Atreus devem viajar pelos Nove Reinos nórdicos em busca de respostas enquanto as forças asgardianas se preparam para a profetizada batalha final.',
    createdAt: new Date('2026-10-13T10:10:00Z'),
    updatedAt: new Date('2026-10-13T10:10:00Z'),
  },
  {
    _id: '670c2a8f8e12ab34cd56ef74',
    nome: 'Forza Horizon 5',
    desenvolvedora: 'Playground Games',
    genero: 'Corrida',
    plataforma: 'Xbox',
    preco: 249.0,
    anoLancamento: 2021,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3ofx.jpg',
    descricao:
      'Sua maior aventura Horizon te espera! Lidere expedições em cenários vibrantes e em constante evolução no vasto mundo aberto do México.',
    createdAt: new Date('2026-10-13T10:15:00Z'),
    updatedAt: new Date('2026-10-13T10:15:00Z'),
  },
  {
    _id: '670c2a8f8e12ab34cd56ef75',
    nome: 'The Legend of Zelda: Breath of the Wild',
    desenvolvedora: 'Nintendo EPD',
    genero: 'Aventura',
    plataforma: 'Nintendo Switch',
    preco: 299.0,
    anoLancamento: 2017,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.jpg',
    descricao:
      'Após um sono de 100 anos, Link desperta em um reino de Hyrule em ruínas e deve redescobrir suas memórias para derrotar Calamity Ganon.',
    createdAt: new Date('2026-10-13T10:20:00Z'),
    updatedAt: new Date('2026-10-13T10:20:00Z'),
  },
  {
    _id: '670c2a8f8e12ab34cd56ef76',
    nome: 'Resident Evil 4 Remake',
    desenvolvedora: 'Capcom',
    genero: 'Terror',
    plataforma: 'Multiplataforma',
    preco: 199.0,
    anoLancamento: 2023,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg',
    descricao:
      'Sobrevivência é apenas o começo. Seis anos após o desastre biológico em Raccoon City, Leon S. Kennedy é enviado para resgatar a filha sequestrada do presidente.',
    createdAt: new Date('2026-10-13T10:25:00Z'),
    updatedAt: new Date('2026-10-13T10:25:00Z'),
  },
  {
    _id: '670c2a8f8e12ab34cd56ef77',
    nome: 'EA Sports FC 24',
    desenvolvedora: 'EA Sports',
    genero: 'Esportes',
    plataforma: 'Multiplataforma',
    preco: 299.0,
    anoLancamento: 2023,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6t8h.jpg',
    descricao:
      'A mais nova era do futebol virtual com tecnologia HyperMotionV, PlayStyles otimizados pela Opta e motores Frostbite aprimorados.',
    createdAt: new Date('2026-10-13T10:30:00Z'),
    updatedAt: new Date('2026-10-13T10:30:00Z'),
  },
  {
    _id: '670c2a8f8e12ab34cd56ef78',
    nome: 'Age of Empires IV',
    desenvolvedora: 'Relic Entertainment',
    genero: 'Estratégia',
    plataforma: 'PC',
    preco: 149.0,
    anoLancamento: 2021,
    imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co38s5.jpg',
    descricao:
      'Evolua civilizações históricas, construa impérios magníficos e lidere tropas em batalhas táticas em tempo real através de eras marcantes.',
    createdAt: new Date('2026-10-13T10:35:00Z'),
    updatedAt: new Date('2026-10-13T10:35:00Z'),
  },
];

/**
 * Middleware para tentar conexão com o banco.
 * Se o MongoDB estiver indisponível ou não configurado, segue em modo fallback.
 */
router.use('/jogos', async (req, res, next) => {
  try {
    await connectDB();
  } catch (error) {
    console.warn('[Jogos Middleware] Falha de conexão ao MongoDB Atlas. Utilizando catálogo local.');
  }
  next();
});

/**
 * GET /api/jogos
 * Lista todos os jogos com suporte a filtros e ordenação
 */
router.get('/jogos', async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const { busca, genero, plataforma, ordenar } = req.query;

    if (isDbConnected) {
      const filtro = {};
      if (busca && busca.trim()) {
        const regex = new RegExp(busca.trim(), 'i');
        filtro.$or = [{ nome: regex }, { desenvolvedora: regex }];
      }
      if (genero && genero.trim() && genero !== 'todos') {
        filtro.genero = genero.trim();
      }
      if (plataforma && plataforma.trim() && plataforma !== 'todas') {
        filtro.plataforma = plataforma.trim();
      }

      let sortOption = { createdAt: -1 };
      if (ordenar === 'nome_asc') sortOption = { nome: 1 };
      else if (ordenar === 'nome_desc') sortOption = { nome: -1 };
      else if (ordenar === 'preco_asc') sortOption = { preco: 1 };
      else if (ordenar === 'preco_desc') sortOption = { preco: -1 };
      else if (ordenar === 'ano_desc') sortOption = { anoLancamento: -1 };
      else if (ordenar === 'ano_asc') sortOption = { anoLancamento: 1 };

      const jogos = await Jogo.find(filtro).sort(sortOption).lean();
      return res.status(200).json({ sucesso: true, total: jogos.length, dados: jogos });
    }

    // Modo Fallback Local (Em Memória)
    let filtrados = [...memoryJogos];

    if (busca && busca.trim()) {
      const term = busca.trim().toLowerCase();
      filtrados = filtrados.filter(
        (j) =>
          j.nome.toLowerCase().includes(term) ||
          j.desenvolvedora.toLowerCase().includes(term)
      );
    }

    if (genero && genero.trim() && genero !== 'todos') {
      filtrados = filtrados.filter((j) => j.genero === genero.trim());
    }

    if (plataforma && plataforma.trim() && plataforma !== 'todas') {
      filtrados = filtrados.filter((j) => j.plataforma === plataforma.trim());
    }

    if (ordenar === 'nome_asc') {
      filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordenar === 'nome_desc') {
      filtrados.sort((a, b) => b.nome.localeCompare(a.nome));
    } else if (ordenar === 'preco_asc') {
      filtrados.sort((a, b) => (a.preco || 0) - (b.preco || 0));
    } else if (ordenar === 'preco_desc') {
      filtrados.sort((a, b) => (b.preco || 0) - (a.preco || 0));
    } else if (ordenar === 'ano_desc') {
      filtrados.sort((a, b) => (b.anoLancamento || 0) - (a.anoLancamento || 0));
    } else if (ordenar === 'ano_asc') {
      filtrados.sort((a, b) => (a.anoLancamento || 0) - (b.anoLancamento || 0));
    } else {
      filtrados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.status(200).json({
      sucesso: true,
      total: filtrados.length,
      dados: filtrados,
      modo: 'offline_local',
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar jogos no banco de dados.',
      erro: error.message,
    });
  }
});

/**
 * GET /api/jogos/:id
 * Retorna os detalhes de um jogo específico por ID
 */
router.get('/jogos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Identificador de jogo inválido.',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const jogo = await Jogo.findById(id).lean();
      if (!jogo) {
        return res.status(404).json({ sucesso: false, mensagem: 'Jogo não encontrado.' });
      }
      return res.status(200).json({ sucesso: true, dados: jogo });
    }

    const jogo = memoryJogos.find((j) => j._id.toString() === id);
    if (!jogo) {
      return res.status(404).json({ sucesso: false, mensagem: 'Jogo não encontrado.' });
    }

    return res.status(200).json({ sucesso: true, dados: jogo });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar detalhes do jogo.',
      erro: error.message,
    });
  }
});

/**
 * POST /api/jogos
 * Cadastra um novo jogo
 */
router.post('/jogos', async (req, res) => {
  try {
    const {
      nome,
      desenvolvedora,
      genero,
      plataforma,
      preco,
      anoLancamento,
      imagem,
      descricao,
    } = req.body;

    const jogoInstance = new Jogo({
      nome,
      desenvolvedora,
      genero,
      plataforma,
      preco: preco !== undefined && preco !== '' ? Number(preco) : 0,
      anoLancamento: anoLancamento ? Number(anoLancamento) : undefined,
      imagem: imagem ? imagem.trim() : '',
      descricao: descricao ? descricao.trim() : '',
    });

    // Validação estrita do Mongoose Schema
    const validationError = jogoInstance.validateSync();
    if (validationError) {
      const erros = Object.values(validationError.errors).map((e) => e.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Erro de validação nos campos informados.',
        erros,
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const jogoSalvo = await jogoInstance.save();
      return res.status(201).json({
        sucesso: true,
        mensagem: 'Jogo cadastrado com sucesso!',
        dados: jogoSalvo,
      });
    }

    // Salva no repositório em memória
    const novoJogoMemoria = {
      _id: new mongoose.Types.ObjectId().toString(),
      nome: jogoInstance.nome,
      desenvolvedora: jogoInstance.desenvolvedora,
      genero: jogoInstance.genero,
      plataforma: jogoInstance.plataforma,
      preco: jogoInstance.preco,
      anoLancamento: jogoInstance.anoLancamento,
      imagem: jogoInstance.imagem,
      descricao: jogoInstance.descricao,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryJogos.unshift(novoJogoMemoria);

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Jogo cadastrado com sucesso!',
      dados: novoJogoMemoria,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Erro de validação nos campos informados.',
        erros,
      });
    }

    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao cadastrar jogo.',
      erro: error.message,
    });
  }
});

/**
 * PUT /api/jogos/:id
 * Atualiza os dados de um jogo existente
 */
router.put('/jogos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Identificador de jogo inválido.',
      });
    }

    const {
      nome,
      desenvolvedora,
      genero,
      plataforma,
      preco,
      anoLancamento,
      imagem,
      descricao,
    } = req.body;

    const dadosAtualizacao = {};
    if (nome !== undefined) dadosAtualizacao.nome = nome.trim();
    if (desenvolvedora !== undefined) dadosAtualizacao.desenvolvedora = desenvolvedora.trim();
    if (genero !== undefined) dadosAtualizacao.genero = genero;
    if (plataforma !== undefined) dadosAtualizacao.plataforma = plataforma;
    if (preco !== undefined) dadosAtualizacao.preco = Number(preco);
    if (anoLancamento !== undefined) {
      dadosAtualizacao.anoLancamento = anoLancamento ? Number(anoLancamento) : undefined;
    }
    if (imagem !== undefined) dadosAtualizacao.imagem = imagem.trim();
    if (descricao !== undefined) dadosAtualizacao.descricao = descricao.trim();

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const jogoAtualizado = await Jogo.findByIdAndUpdate(
        id,
        { $set: dadosAtualizacao },
        { new: true, runValidators: true }
      );

      if (!jogoAtualizado) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Jogo não encontrado para atualização.',
        });
      }

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Jogo atualizado com sucesso!',
        dados: jogoAtualizado,
      });
    }

    const index = memoryJogos.findIndex((j) => j._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Jogo não encontrado para atualização.',
      });
    }

    const jogoAtualizado = {
      ...memoryJogos[index],
      ...dadosAtualizacao,
      updatedAt: new Date(),
    };

    memoryJogos[index] = jogoAtualizado;

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Jogo atualizado com sucesso!',
      dados: jogoAtualizado,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Erro de validação nos campos informados.',
        erros,
      });
    }

    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar jogo.',
      erro: error.message,
    });
  }
});

/**
 * DELETE /api/jogos/:id
 * Exclui um jogo por ID
 */
router.delete('/jogos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Identificador de jogo inválido.',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const jogoExcluido = await Jogo.findByIdAndDelete(id);

      if (!jogoExcluido) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Jogo não encontrado para exclusão.',
        });
      }

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Jogo excluído com sucesso!',
        dados: {
          _id: jogoExcluido._id,
          nome: jogoExcluido.nome,
        },
      });
    }

    const index = memoryJogos.findIndex((j) => j._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Jogo não encontrado para exclusão.',
      });
    }

    const [jogoExcluido] = memoryJogos.splice(index, 1);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Jogo excluído com sucesso!',
      dados: {
        _id: jogoExcluido._id,
        nome: jogoExcluido.nome,
      },
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao excluir o jogo.',
      erro: error.message,
    });
  }
});

module.exports = router;
