// app.js
import express from 'express';
import cors from 'cors';
import router from './routes/rutas.js';

const app = express();

// 🔐 Desactivar el header "X-Powered-By" para evitar divulgación de tecnología
app.disable('x-powered-by');

// Configuración del puerto
app.set('port', 3000);

// CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parseo de JSON
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

// Middleware para formularios
app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));

// Rutas principales
app.use(router);

// 🔍 Ruta artificial para probar el middleware de error (solo en test)
if (process.env.NODE_ENV === 'test') {
    app.get('/forzar-error', (req, res, next) => {
        next(new Error('Error forzado'));
    });
}

// 🚨 Manejo global de errores del proceso
process.on('uncaughtException', (err, origin) => {
    console.error('Uncaught Exception:', err);
    console.error('Exception origin:', origin);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
});

// Middleware global de manejo de errores HTTP
app.use((err, req, res, next) => {
    console.error('Error middleware:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

export default app;
