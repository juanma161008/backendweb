import { Router } from 'express';
import { metodosUsuarios } from '../controller/usuarioscontroller.js';
const router = Router();

router.get('/usuarios', metodosUsuarios.getUsuarios);
router.post('/login', metodosUsuarios.loginUsuario);  // Cambiado para usar loginUsuario

export default router;
