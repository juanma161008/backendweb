// src/routes/prestamos.js
import { Router } from 'express';
import { metodosPrestamos } from '../controller/prestamoscontroller.js';

const router = Router();

router.get('/prestamos', metodosPrestamos.getPrestamos);
router.post('/crearprestamos', metodosPrestamos.createPrestamo);
router.delete('/prestamos/:id', metodosPrestamos.deletePrestamo);

export default router;