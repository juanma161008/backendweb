// src/routes/usuarios.js
import express from 'express';
import { obtenerUsuarios } from '../controller/usuarioscontroller.js';

const router = express.Router();

// Define la ruta para obtener los usuarios
router.get('/', obtenerUsuarios);

export default router;
