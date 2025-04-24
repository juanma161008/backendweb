import { Router } from 'express';
import { metodosUsuarios } from '../controller/usuarioscontroller.js';

const router = Router();

router.post('/login', metodosUsuarios.loginUsuario);
router.post('/', metodosUsuarios.createUsuario); // Cambiado de '/usuarios' a '/'

export default router;