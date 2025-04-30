import request from 'supertest';
import app from '../app.js';

describe('Cobertura de app.js', () => {

  test('Debe devolver 404 en ruta inexistente', async () => {
    const res = await request(app).get('/ruta-inexistente');
    expect(res.statusCode).toBe(404);
  });

  test('Middleware de error responde correctamente', async () => {
    const res = await request(app).get('/forzar-error');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Error interno del servidor');
    expect(res.body).toHaveProperty('message', 'Error forzado');
  });

  test('Verifica que el puerto esté configurado correctamente', () => {
    expect(app.get('port')).toBe(3000);
  });

  test('Simula uncaughtException sin romper el test', () => {
    process.emit('uncaughtException', new Error('Excepción simulada'), 'test');
  });

  test('Simula unhandledRejection sin romper el test', () => {
    process.emit('unhandledRejection', 'Rechazo simulado', Promise.resolve());
  });

});
