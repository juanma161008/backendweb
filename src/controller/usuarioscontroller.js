import { getConnection } from "../database/database.js";

export const getUsuarios = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM usuarios');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener usuarios");
    }
};

export const createUsuario = async (req, res) => {
    try {
        const { nombre, email, contrasena, numero_cuenta, tipo, saldo } = req.body;

        // Verificar que los campos obligatorios estén presentes
        if (!nombre || !email || !contrasena || !numero_cuenta || !tipo) {
            return res.status(400).json({ message: "Por favor, complete todos los campos obligatorios" });
        }

        const connection = await getConnection();
        const result = await connection.query(
            'INSERT INTO usuarios (nombre, email, contrasena, numero_cuenta, tipo, saldo) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, email, contrasena, numero_cuenta, tipo, saldo || 0] // saldo por defecto en 0 si no se especifica
        );

        res.status(201).json({ message: "Usuario registrado con éxito", userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al registrar el usuario");
    }
};

export const metodosUsuarios = {
    getUsuarios,
    createUsuario
};
