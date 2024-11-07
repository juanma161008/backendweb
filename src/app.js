// src/app.js
import express from 'express';
import usuariosRouter from './routes/usuarios.js';
import transaccionesRouter from './routes/transacciones.js';
import config from './config.js';

const app = express();
app.set('port', config.port);

// Middleware para parsear JSON
app.use(express.json());

// Usa la ruta para usuarios y transacciones
app.use('/usuarios', usuariosRouter);
app.use('/transacciones', transaccionesRouter);

export default app;
