// src/routes/prestamos.js
import { Router } from 'express';
import { metodosPrestamos } from '../controller/prestamoscontroller.js';

const router = Router();

router.get('/prestamos', metodosPrestamos.getPrestamos);
router.post('/prestamos', metodosPrestamos.createPrestamo); // Ruta para crear préstamo
router.delete('/prestamos/:id', metodosPrestamos.deletePrestamo); // Ruta para eliminar préstamo

export default router;
