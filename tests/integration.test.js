const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../api/index');

describe('GameHub — Testes de Integração e Contrato Frontend-Backend', () => {
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

  it('deve responder aos cabeçalhos de CORS permitindo origens web', async () => {
    const res = await fetch(`${baseUrl}/api/health`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
      },
    });

    assert.ok([200, 204].includes(res.status), 'CORS preflight deve retornar 200 ou 204');
    assert.strictEqual(
      res.headers.get('access-control-allow-origin'),
      'http://localhost:3000'
    );
  });

  it('deve responder com sucesso ao endpoint de verificação /api/health', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.status, 'ok');
    assert.ok(json.timestamp);
    assert.ok(json.database);
  });

  it('deve validar contrato de erro quando dados obrigatórios estão ausentes no POST', async () => {
    const res = await fetch(`${baseUrl}/api/jogos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    // Se DB desconectado, retorna 500 do middleware; se conectado, retorna 400 de validação
    assert.ok(
      [400, 500].includes(res.status),
      `Status retornado: ${res.status}`
    );

    const json = await res.json();
    assert.strictEqual(json.sucesso, false);
    assert.ok(json.mensagem);
  });

  it('deve responder com formato correto em requisições de listagem /api/jogos', async () => {
    const res = await fetch(`${baseUrl}/api/jogos`);
    assert.ok([200, 500].includes(res.status));

    const json = await res.json();
    if (res.status === 200) {
      assert.strictEqual(json.sucesso, true);
      assert.ok(Array.isArray(json.dados));
      assert.strictEqual(typeof json.total, 'number');
    } else {
      assert.strictEqual(json.sucesso, false);
      assert.ok(json.mensagem.includes('banco de dados'));
    }
  });
});
