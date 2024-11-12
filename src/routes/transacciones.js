// transacciones.js
import { Router } from 'express';
import { metodosTransacciones } from '../controller/transaccionescontroller.js';

const router = Router();

router.get('/', metodosTransacciones.getTransacciones);
router.post('/', metodosTransacciones.createTransaccion);

export default router;
