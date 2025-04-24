import express from 'express';
import usuariosRoutes from './usuarios.js';
import transaccionesRoutes from './transacciones.js';
import prestamosRoutes from './prestamos.js';
import reportesRoutes from './reportes.js'

const router = express.Router();

// Centralizar las rutas
router.use('/usuarios', usuariosRoutes);
router.use('/transacciones', transaccionesRoutes);
router.use('/prestamos', prestamosRoutes);
router.use('/reportes', reportesRoutes);


export default router;




