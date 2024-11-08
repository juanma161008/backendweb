// src/routes/usuarios.js

import express from 'express';
import { registroUsuario, loginUsuario, obtenerPerfil } from '../controller/usuarioscontroller.js';

const router = express.Router();

// Ruta para registrar un usuario
router.post('/registro', registroUsuario);

// Ruta para iniciar sesión
router.post('/login', loginUsuario);

// Ruta para obtener el perfil del usuario
router.get('/:id/perfil', obtenerPerfil);

export default router;
