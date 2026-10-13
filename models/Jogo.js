const mongoose = require('mongoose');

const GENEROS_PERMITIDOS = [
  'Ação',
  'Aventura',
  'RPG',
  'Corrida',
  'Estratégia',
  'Terror',
  'Esportes',
  'Outros',
];

const PLATAFORMAS_PERMITIDAS = [
  'PC',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'Multiplataforma',
];

const anoAtual = new Date().getFullYear();

const JogoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O campo 'nome' é obrigatório."],
      trim: true,
      minlength: [1, 'O nome deve ter no mínimo 1 caractere.'],
      maxlength: [120, 'O nome deve ter no máximo 120 caracteres.'],
    },
    desenvolvedora: {
      type: String,
      required: [true, "O campo 'desenvolvedora' é obrigatório."],
      trim: true,
      maxlength: [100, 'A desenvolvedora deve ter no máximo 100 caracteres.'],
    },
    genero: {
      type: String,
      required: [true, "O campo 'genero' é obrigatório."],
      enum: {
        values: GENEROS_PERMITIDOS,
        message: 'Gênero inválido. Opções aceitas: {VALUES}',
      },
    },
    plataforma: {
      type: String,
      required: [true, "O campo 'plataforma' é obrigatório."],
      enum: {
        values: PLATAFORMAS_PERMITIDAS,
        message: 'Plataforma inválida. Opções aceitas: {VALUES}',
      },
    },
    preco: {
      type: Number,
      default: 0,
      min: [0, 'O preço não pode ser negativo.'],
    },
    anoLancamento: {
      type: Number,
      min: [1950, 'O ano de lançamento deve ser a partir de 1950.'],
      max: [anoAtual + 5, `O ano de lançamento não pode ser superior a ${anoAtual + 5}.`],
    },
    imagem: {
      type: String,
      trim: true,
      default: '',
    },
    descricao: {
      type: String,
      trim: true,
      maxlength: [1000, 'A descrição deve ter no máximo 1000 caracteres.'],
      default: '',
    },
  },
  {
    collection: 'jogos',
    timestamps: true,
  }
);

// Índices para agilizar buscas por texto e ordenação
JogoSchema.index({ nome: 'text', desenvolvedora: 'text' });

module.exports = mongoose.models.Jogo || mongoose.model('Jogo', JogoSchema);
module.exports.GENEROS_PERMITIDOS = GENEROS_PERMITIDOS;
module.exports.PLATAFORMAS_PERMITIDAS = PLATAFORMAS_PERMITIDAS;
