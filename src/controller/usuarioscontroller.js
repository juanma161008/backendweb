//usuarioscontroller.js

import { getConnection } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';

export const loginUsuario = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        if (!email || !contrasena) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        const connection = await getConnection();
        const [users] = await connection.query(
            'SELECT * FROM Usuarios WHERE email = ? AND contrasena = ?',
            [email, contrasena]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const usuario = users[0];
        delete usuario.contrasena;

        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: usuario
        });

    } catch (error) {
        console.error('Error en loginUsuario:', error);
        return res.status(500).json({ message: 'Error en el proceso de inicio de sesión' });
    }
};

export const createUsuario = async (req, res) => {
    try {
        const { nombre, email, contrasena, numero_cuenta, tipo } = req.body;

        if (!nombre || !email || !contrasena || !numero_cuenta || !tipo) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const id_usuario = uuidv4();
        const saldo = 0.00;

        const connection = await getConnection();
        await connection.query(
            'INSERT INTO Usuarios (id_usuario, nombre, email, contrasena, numero_cuenta, tipo, saldo) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_usuario, nombre, email, contrasena, numero_cuenta, tipo, saldo]
        );

        res.status(201).json({
            id_usuario,
            nombre,
            email,
            numero_cuenta,
            tipo,
            saldo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
};

export const metodosUsuarios = {
    loginUsuario,
    createUsuario
};
