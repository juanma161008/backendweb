
import { Router } from 'express';
import { metodosPrestamos } from '../controller/usuarioscontroller.js';

const router = Router();

router.get('/usuarios', metodosPrestamos.getPrestamos);


export default router;