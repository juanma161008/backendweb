import request from 'supertest';
import app from '../app.js';
import { getConnection } from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
import { closeConnection } from './db-utils.js';

let connection;
let testUserId;
let createdTransaccionId;

beforeAll(async () => {
  connection = await getConnection();

  testUserId = uuidv4();
  await connection.query(`
    INSERT INTO Usuarios (id_usuario, nombre, email, contrasena, numero_cuenta, tipo, saldo)
    VALUES (?, 'Usuario Transacciones Test', 'transacciontest@example.com', 'testpass', '66666666666', 'corriente', 7000.00)
  `, [testUserId]);
});

afterAll(async () => {
  if (createdTransaccionId) {
    await connection.query('DELETE FROM Transacciones WHERE id_transaccion = ?', [createdTransaccionId]);
  }
  await connection.query('DELETE FROM Usuarios WHERE id_usuario = ?', [testUserId]);
  await closeConnection();
});

describe('API /transacciones', () => {
  test('Debería obtener todas las transacciones', async () => {
    const res = await request(app)
      .get('/transacciones');

    expect(res.statusCode).toBe(200);
  });

  test('Debería crear una nueva transacción válida', async () => {
    const nuevaTransaccion = {
      id_usuario: testUserId,
      tipo_transaccion: 'depósito',
      monto: 2500
    };

    const res = await request(app)
      .post('/transacciones')
      .send(nuevaTransaccion);

    expect(res.statusCode).toBe(201);
    createdTransaccionId = res.body.id_transaccion;
  });

  test('Debería fallar si se envían datos incompletos', async () => {
    const res = await request(app)
      .post('/transacciones')
      .send({
        id_usuario: testUserId,
        monto: 1000
      });

    expect(res.statusCode).toBe(400);
  });

  test('Debería obtener transacciones de un usuario específico', async () => {
    const res = await request(app)
      .post('/transacciones/usuario')
      .send({ id_usuario: testUserId });

    expect(res.statusCode).toBe(200);
  });

  test('Debería fallar si no se envía id_usuario', async () => {
    const res = await request(app)
      .post('/transacciones/usuario')
      .send({});

    expect(res.statusCode).toBe(400);
  });
});
