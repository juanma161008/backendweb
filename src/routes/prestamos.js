// src/routes/prestamos.js
import { Router } from 'express';
import { metodosPrestamos } from '../controller/prestamoscontroller.js';

const router = Router();

router.get('/', metodosPrestamos.getPrestamos);
router.post('/', metodosPrestamos.createPrestamo); 
export default router;
