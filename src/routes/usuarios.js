
import { Router } from 'express';
import { metodosUsuarios } from '../controller/usuarioscontroller.js';
const router = Router();

router.get('/usuarios', metodosUsuarios.getUsuarios);


export default router;