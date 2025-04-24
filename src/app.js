// app.js
import express from 'express';
import cors from 'cors';
import router from './routes/rutas.js';

const app = express();
const PORT = 3000;

app.set('port', PORT);

// Middleware de CORS para permitir acceso desde el frontend
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware para parsear JSON y formularios grandes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas principales
app.use(router);

// Middleware global de manejo de errores (opcional pero recomendado)
app.use((err, req, res, next) => {
    console.error('Error global:', err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Captura de errores no manejados a nivel del proceso
process.on('uncaughtException', (err) => {
    console.error('Excepción no capturada:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Rechazo de promesa no manejado:', err);
});

export default app;
