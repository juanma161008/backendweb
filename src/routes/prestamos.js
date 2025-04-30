//prestamos.js

import { Router } from 'express';
import { metodosPrestamos } from '../controller/prestamoscontroller.js';

const router = Router();

// Filtrar por usuario
router.post('/', metodosPrestamos.getPrestamos);

// Crear nuevo
router.post('/crear', metodosPrestamos.createPrestamo);

export default router;
