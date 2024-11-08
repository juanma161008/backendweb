import express from 'express';
import cors from 'cors'; // Importa cors
import router from './routes/usuarios.js';

const app = express();
app.set('port', 3000);

// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());
app.use(router);

export default app;
