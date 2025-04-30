import request from 'supertest';
import app from '../app.js';
import { getConnection } from '../database/database.js';
import { v4 as uuidv4 } from 'uuid';
import { closeConnection } from './db-utils.js';

let connection;
let createdUserId;
const testEmail = 'testlogin@example.com';
const testPassword = 'testpass123';

beforeAll(async () => {
  connection = await getConnection();

  createdUserId = uuidv4();
  await connection.query(`
    INSERT INTO Usuarios (id_usuario, nombre, email, contrasena, numero_cuenta, tipo, saldo)
    VALUES (?, 'Usuario Login', ?, ?, '11111111111', 'ahorros', 1000.00)
  `, [createdUserId, testEmail, testPassword]);
});

afterAll(async () => {
  await connection.query('DELETE FROM Usuarios WHERE id_usuario = ?', [createdUserId]);
  await closeConnection();
});

describe('API /usuarios', () => {
  test('Debería crear un nuevo usuario correctamente', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        nombre: 'Nuevo Usuario',
        email: 'nuevo@example.com',
        contrasena: 'nuevoPass',
        numero_cuenta: '22222222222',
        tipo: 'corriente'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id_usuario');
    expect(res.body.nombre).toBe('Nuevo Usuario');

    await connection.query('DELETE FROM Usuarios WHERE id_usuario = ?', [res.body.id_usuario]);
  });

  test('Debería fallar si faltan campos al crear usuario', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        nombre: 'Usuario Incompleto',
        email: 'incompleto@example.com'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Todos los campos son requeridos');
  });

  test('Debería iniciar sesión exitosamente con credenciales válidas', async () => {
    const res = await request(app)
      .post('/usuarios/login')
      .send({
        email: testEmail,
        contrasena: testPassword
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Inicio de sesión exitoso');
    expect(res.body.user).toMatchObject({
      email: testEmail
    });
  });

  test('Debería fallar el login si el usuario no existe', async () => {
    const res = await request(app)
      .post('/usuarios/login')
      .send({
        email: 'noexiste@example.com',
        contrasena: 'fakepass'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Credenciales inválidas');
  });

  test('Debería fallar si faltan campos al hacer login', async () => {
    const res = await request(app)
      .post('/usuarios/login')
      .send({
        email: 'alguien@example.com'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email y contraseña son requeridos');
  });
});
