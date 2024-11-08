// src/routes/prestamos.js
import { Router } from 'express';
import { metodosPrestamos } from '../controller/prestamoscontroller.js';

const router = Router();

router.get('/prestamos', metodosPrestamos.getPrestamos);
router.post('/prestamos', metodosPrestamos.createPrestamo); 
router.delete('/prestamos/:id', metodosPrestamos.deletePrestamo); 

export default router;
