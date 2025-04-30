//prestamos.test.js

import request from 'supertest';
import app from '../app.js';
import { getConnection } from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
import { closeConnection } from './db-utils.js';

let connection;
let testUserId;
let createdLoanId;

beforeAll(async () => {
  connection = await getConnection();
  testUserId = uuidv4();
  await connection.query(`
    INSERT INTO Usuarios (id_usuario, nombre, email, contrasena, numero_cuenta, tipo, saldo)
    VALUES (?, 'Test User', 'testuser@example.com', 'testpass', '99999999999', 'ahorros', 5000.00)
  `, [testUserId]);
});

afterAll(async () => {
  if (createdLoanId) {
    await connection.query('DELETE FROM Prestamos WHERE id_prestamo = ?', [createdLoanId]);
  }
  await connection.query('DELETE FROM Usuarios WHERE id_usuario = ?', [testUserId]);
  await closeConnection();
});

describe('API /prestamos', () => {
  test('Debería devolver los préstamos de un usuario existente', async () => {
    const res = await request(app)
      .post('/prestamos')
      .send({ id_usuario: testUserId });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('Debería fallar si no se envía id_usuario', async () => {
    const res = await request(app)
      .post('/prestamos')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
  });

  test('Debería crear un nuevo préstamo válido', async () => {
    const res = await request(app)
      .post('/prestamos/crear')
      .send({
        id_usuario: testUserId,
        descripcion: 'Préstamo de prueba automatizado',
        monto: 1500,
        plazo: 6
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    createdLoanId = res.body.prestamo.id_prestamo;
  });

  test('Debería fallar si faltan campos requeridos', async () => {
    const res = await request(app)
      .post('/prestamos/crear')
      .send({
        id_usuario: testUserId,
        monto: 500
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
  });

  test('Debería fallar con un id_usuario inexistente', async () => {
    const res = await request(app)
      .post('/prestamos/crear')
      .send({
        id_usuario: uuidv4(),
        descripcion: 'Préstamo inválido',
        monto: 1000,
        plazo: 3
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('success', false);
  });

  test('Debería manejar error interno en getPrestamos', async () => {
    const res = await request(app)
      .post('/prestamos')
      .send({ id_usuario: {} });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Error al obtener préstamos');
  });

  test('Debería manejar error inesperado en createPrestamo', async () => {
    const res = await request(app)
      .post('/prestamos/crear')
      .send({
        id_usuario: testUserId,
        descripcion: ' ',
        monto: 'invalido',
        plazo: 'no-numero'
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('success', false);
  });
});
