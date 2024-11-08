
import { Router } from 'express';
import { metodosUsuarios } from '../controller/usuarioscontroller.js';
const router = Router();

router.get('/usuarios', metodosUsuarios.getUsuarios);
router.post('/usuarios', metodosUsuarios.createUsuario);


export default router;