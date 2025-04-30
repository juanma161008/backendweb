//reportes.js

import { Router } from 'express';
import { metodosReportes } from '../controller/reportescontroller.js';

const router = Router();

// Ruta POST para obtener reportes por ID del usuario
router.post('/', metodosReportes.getReportesPorUsuario);

export default router;
