// src/routes/prestamos.js
import { Router } from 'express';
import { metodosPrestamos } from '../controller/reportescontroller.js';

const router = Router();

router.get('/reportes', metodosPrestamos.getPrestamos);


export default router;