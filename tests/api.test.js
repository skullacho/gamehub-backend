const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const Jogo = require('../models/Jogo');
const app = require('../api/index');

describe('GameHub Backend — Testes de Validação do Modelo Jogo', () => {
  it('deve validar com sucesso um jogo preenchido corretamente', () => {
    const jogoValido = new Jogo({
      nome: 'God of War Ragnarök',
      desenvolvedora: 'Santa Monica Studio',
      genero: 'Ação',
      plataforma: 'PlayStation',
      preco: 299.9,
      anoLancamento: 2022,
      imagem: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg',
      descricao: 'Kratos e Atreus devem viajar pelos Nove Reinos em busca de respostas.',
    });

    const erro = jogoValido.validateSync();
    assert.strictEqual(erro, undefined, 'Não deve retornar erros para dados válidos');
  });

  it('deve reprovar caso campos obrigatórios estejam ausentes', () => {
    const jogoInvalido = new Jogo({});
    const erro = jogoInvalido.validateSync();

    assert.ok(erro, 'Deve retornar erro de validação');
    assert.ok(erro.errors['nome'], 'Deve exigir campo nome');
    assert.ok(erro.errors['desenvolvedora'], 'Deve exigir campo desenvolvedora');
    assert.ok(erro.errors['genero'], 'Deve exigir campo genero');
    assert.ok(erro.errors['plataforma'], 'Deve exigir campo plataforma');
  });

  it('deve reprovar gênero não permitido na lista oficial', () => {
    const jogoGeneroInvalido = new Jogo({
      nome: 'Jogo Teste',
      desenvolvedora: 'Dev Teste',
      genero: 'GeneroInexistente',
      plataforma: 'PC',
    });

    const erro = jogoGeneroInvalido.validateSync();
    assert.ok(erro, 'Deve rejeitar gênero inválido');
    assert.ok(erro.errors['genero']);
  });

  it('deve reprovar plataforma não permitida na lista oficial', () => {
    const jogoPlataformaInvalida = new Jogo({
      nome: 'Jogo Teste',
      desenvolvedora: 'Dev Teste',
      genero: 'RPG',
      plataforma: 'Atari2600',
    });

    const erro = jogoPlataformaInvalida.validateSync();
    assert.ok(erro, 'Deve rejeitar plataforma inválida');
    assert.ok(erro.errors['plataforma']);
  });

  it('deve reprovar preço negativo', () => {
    const jogoPrecoNegativo = new Jogo({
      nome: 'Jogo Barato',
      desenvolvedora: 'Indie Dev',
      genero: 'Aventura',
      plataforma: 'PC',
      preco: -15.5,
    });

    const erro = jogoPrecoNegativo.validateSync();
    assert.ok(erro, 'Deve rejeitar preço negativo');
    assert.ok(erro.errors['preco']);
  });

  it('deve reprovar ano de lançamento anterior a 1950', () => {
    const jogoAnoInvalido = new Jogo({
      nome: 'Jogo Muito Antigo',
      desenvolvedora: 'Pioneiros',
      genero: 'Estratégia',
      plataforma: 'PC',
      anoLancamento: 1900,
    });

    const erro = jogoAnoInvalido.validateSync();
    assert.ok(erro, 'Deve rejeitar ano anterior a 1950');
    assert.ok(erro.errors['anoLancamento']);
  });
});

describe('GameHub Backend — Testes de Rotas e Endpoints HTTP', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('deve responder à rota raiz (/) com status 200 e informações do projeto', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.projeto, 'GameHub API');
    assert.ok(Array.isArray(json.integrantes));
    assert.strictEqual(json.integrantes.length, 3);
  });

  it('deve responder à rota /api/health com status 200', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.status, 'ok');
    assert.ok(json.message);
    assert.ok(json.database);
  });

  it('deve retornar 404 em rota inexistente', async () => {
    const res = await fetch(`${baseUrl}/api/rota-inexistente-123`);
    assert.strictEqual(res.status, 404);

    const json = await res.json();
    assert.strictEqual(json.sucesso, false);
    assert.ok(json.mensagem.includes('Rota não encontrada'));
  });

  it('deve rejeitar ID inválido com status 400 ou 500 no endpoint /api/jogos/:id', async () => {
    const res = await fetch(`${baseUrl}/api/jogos/id-invalido-123`);
    // Se o banco estiver conectado, retorna 400 (ID inválido); se desconectado, o middleware retorna 500 informando falha de DB
    assert.ok(
      [400, 500].includes(res.status),
      `Status deve ser 400 ou 500 se banco offline, recebido: ${res.status}`
    );
    const json = await res.json();
    assert.strictEqual(json.sucesso, false);
  });
});
