// transacciones.js
import { Router } from 'express';
import { metodosTransacciones } from '../controller/transaccionescontroller.js';

const router = Router();

router.get('/transacciones', metodosTransacciones.getTransacciones);
router.post('/transacciones', metodosTransacciones.createTransaccion);
router.delete('/transacciones/:id', metodosTransacciones.deleteTransaccion);

export default router;
