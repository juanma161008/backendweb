// transacciones.js
import { Router } from 'express';
import { metodosTransacciones } from '../controller/transaccionescontroller.js';

const router = Router();

router.get('/transacciones', metodosTransacciones.getTransacciones);
router.post('/transacciones', metodosTransacciones.createTransaccion);

export default router;
