import { Router } from 'express';
import { realizarTransaccion, obtenerHistorialTransacciones } from '../controller/transaccionescontroller.js';

const router = Router();

// Ruta para obtener el historial de transacciones de un usuario
router.get('/:id_usuario', obtenerHistorialTransacciones);

// Ruta para realizar una transacción
router.post('/', realizarTransaccion);

export default router;
