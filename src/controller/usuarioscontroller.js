// src/controller/usuarioscontroller.js

import { getConnection } from '../database/database.js';
import bcrypt from 'bcrypt';

// Registrar un usuario
export const registroUsuario = async (req, res) => {
    const { nombre, email, contraseña, numeroCuenta, tipo, saldo } = req.body;
    try {
        const connection = await getConnection();
        
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Guardar el nuevo usuario en la base de datos
        const [result] = await connection.query(
            'INSERT INTO Usuarios (nombre, email, contraseña, numero_cuenta, tipo, saldo) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, email, hashedPassword, numeroCuenta, tipo, saldo]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente', usuarioId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
};

// Iniciar sesión
export const loginUsuario = async (req, res) => {
    const { email, contraseña } = req.body;
    try {
        const connection = await getConnection();

        // Buscar el usuario por su email
        const [rows] = await connection.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
        const usuario = rows[0];

        if (usuario && await bcrypt.compare(contraseña, usuario.contraseña)) {
            res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

// Obtener el perfil del usuario
export const obtenerPerfil = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();

        // Obtener los detalles del usuario por su ID
        const [rows] = await connection.query('SELECT nombre, email, numero_cuenta, tipo, saldo FROM Usuarios WHERE id = ?', [id]);
        const usuario = rows[0];

        if (usuario) {
            res.status(200).json({ usuario });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil del usuario', error });
    }
};
// src/controller/usuarioscontroller.js
export const obtenerUsuarios = (req, res) => {
    // Lógica para obtener usuarios, por ejemplo:
    res.send('Lista de usuarios');
};

