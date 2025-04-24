import express from 'express';
import cors from 'cors'; 
import router from './routes/rutas.js'; 

const app = express();
app.set('port', 3000);

// Configuración de middlewares
app.use(cors({ 
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración para manejar datos JSON y form-urlencoded
app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb'
}));

// Rutas principales
app.use(router);

// Manejo de errores global
process.on('uncaughtException', (err, origin) => {
    console.error('Uncaught Exception:', err);
    console.error('Exception origin:', origin);
    // Considerar reiniciar el proceso en producción
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
});

// Middleware para manejo de errores (debe ir después de las rutas)
app.use((err, req, res, next) => {
    console.error('Error middleware:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

export default app;