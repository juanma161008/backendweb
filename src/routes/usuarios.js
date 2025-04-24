import { Router } from 'express';
import { metodosUsuarios } from '../controller/usuarioscontroller.js';

const router = Router();

router.post('/login', metodosUsuarios.loginUsuario);  // para login
router.post('/usuarios', metodosUsuarios.createUsuario);      // para crear

export default router;