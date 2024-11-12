
import { Router } from 'express';
import { metodosReportes } from '../controller/reportescontroller.js';
const router = Router();

router.get('/', metodosReportes.getReportes);


export default router;