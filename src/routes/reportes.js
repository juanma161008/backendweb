
import { Router } from 'express';
import { metodosreportes } from '../controller/reportescontroller.js';
const router = Router();

router.get('/reportes', metodosreportes.getReportes);


export default router;