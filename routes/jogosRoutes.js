const express = require('express');
const mongoose = require('mongoose');
const Jogo = require('../models/Jogo');
const connectDB = require('../config/database');

const router = express.Router();

/**
 * Middleware para garantir conexão ativa com o banco antes de processar rotas de jogos.
 */
router.use('/jogos', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Falha de comunicação com o banco de dados MongoDB Atlas.',
      erro: error.message,
    });
  }
});

/**
 * GET /api/jogos
 * Lista todos os jogos com suporte a filtros e ordenação
 */
router.get('/jogos', async (req, res) => {
  try {
    const { busca, genero, plataforma, ordenar } = req.query;
    const filtro = {};

    // Filtro por termo de busca (no nome ou desenvolvedora)
    if (busca && busca.trim()) {
      const regex = new RegExp(busca.trim(), 'i');
      filtro.$or = [{ nome: regex }, { desenvolvedora: regex }];
    }

    // Filtro por gênero
    if (genero && genero.trim() && genero !== 'todos') {
      filtro.genero = genero.trim();
    }

    // Filtro por plataforma
    if (plataforma && plataforma.trim() && plataforma !== 'todas') {
      filtro.plataforma = plataforma.trim();
    }

    // Ordenação
    let sortOption = { createdAt: -1 }; // Padrão: mais recentes primeiro
    if (ordenar === 'nome_asc') {
      sortOption = { nome: 1 };
    } else if (ordenar === 'nome_desc') {
      sortOption = { nome: -1 };
    } else if (ordenar === 'preco_asc') {
      sortOption = { preco: 1 };
    } else if (ordenar === 'preco_desc') {
      sortOption = { preco: -1 };
    } else if (ordenar === 'ano_desc') {
      sortOption = { anoLancamento: -1 };
    } else if (ordenar === 'ano_asc') {
      sortOption = { anoLancamento: 1 };
    }

    const jogos = await Jogo.find(filtro).sort(sortOption).lean();

    return res.status(200).json({
      sucesso: true,
      total: jogos.length,
      dados: jogos,
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

    const jogo = await Jogo.findById(id).lean();

    if (!jogo) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Jogo não encontrado.',
      });
    }

    return res.status(200).json({
      sucesso: true,
      dados: jogo,
    });
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

    const novoJogo = new Jogo({
      nome,
      desenvolvedora,
      genero,
      plataforma,
      preco: preco !== undefined && preco !== '' ? Number(preco) : 0,
      anoLancamento: anoLancamento ? Number(anoLancamento) : undefined,
      imagem: imagem ? imagem.trim() : '',
      descricao: descricao ? descricao.trim() : '',
    });

    const jogoSalvo = await novoJogo.save();

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Jogo cadastrado com sucesso!',
      dados: jogoSalvo,
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
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao excluir o jogo.',
      erro: error.message,
    });
  }
});

module.exports = router;
