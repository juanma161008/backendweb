import { Router } from 'express';
import { metodosTransacciones } from '../controller/transaccionescontroller.js';

const router = Router();

router.get('/transacciones', metodosTransacciones.getTransacciones);

export default router;