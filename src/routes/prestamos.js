// src/routes/prestamos.js
import { Router } from 'express';
import { metodosPrestamos } from '../controller/prestamoscontroller.js';
const router = Router();

router.get('/prestamos', metodosPrestamos.getPrestamos);


export default router;