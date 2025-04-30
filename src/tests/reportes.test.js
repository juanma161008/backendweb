//reportes.test.js

import request from 'supertest';
import app from '../app.js';
import { getConnection } from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
import { closeConnection } from './db-utils.js';

let connection;
let testUserId;
let testReporteId;

beforeAll(async () => {
  connection = await getConnection();

  testUserId = uuidv4();
  await connection.query(`
    INSERT INTO Usuarios (id_usuario, nombre, email, contrasena, numero_cuenta, tipo, saldo)
    VALUES (?, 'Usuario Reporte Test', 'reportetest@example.com', 'testpass', '88888888888', 'ahorros', 4000.00)
  `, [testUserId]);

  testReporteId = uuidv4();
  await connection.query(`
    INSERT INTO Reportes (id_reporte, id_usuario, historico_ingresos, historico_egresos, deudas)
    VALUES (?, ?, 10000.00, 2000.00, 500.00)
  `, [testReporteId, testUserId]);
});

afterAll(async () => {
  await connection.query('DELETE FROM Reportes WHERE id_reporte = ?', [testReporteId]);
  await connection.query('DELETE FROM Usuarios WHERE id_usuario = ?', [testUserId]);
  await closeConnection();
});

describe('API /reportes', () => {
  test('Debería obtener los reportes de un usuario válido', async () => {
    const res = await request(app)
      .post('/reportes')
      .send({ id_usuario: testUserId });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('Debería retornar error 404 si no hay reportes para el usuario', async () => {
    const noReportUserId = uuidv4();
    await connection.query(`
      INSERT INTO Usuarios (id_usuario, nombre, email, contrasena, numero_cuenta, tipo, saldo)
      VALUES (?, 'Sin Reportes', 'noreport@example.com', 'pass', '77777777777', 'ahorros', 2000.00)
    `, [noReportUserId]);

    const res = await request(app)
      .post('/reportes')
      .send({ id_usuario: noReportUserId });

    expect(res.statusCode).toBe(404);

    await connection.query('DELETE FROM Usuarios WHERE id_usuario = ?', [noReportUserId]);
  });

  test('Debería fallar si no se envía id_usuario', async () => {
    const res = await request(app)
      .post('/reportes')
      .send({});

    expect(res.statusCode).toBe(400);
  });
});
