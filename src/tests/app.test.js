import request from 'supertest';
import app from '../app.js';

describe('Middleware y configuración general', () => {
  test('Debe manejar una ruta inexistente con error', async () => {
    const res = await request(app).get('/ruta-inexistente');
    expect(res.statusCode).toBe(404); // Esto prueba el middleware de error global
  });

  test('Debe permitir CORS desde localhost:5173', async () => {
    const res = await request(app)
      .get('/transacciones')
      .set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });
});
