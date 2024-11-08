import { getConnection } from '../database/database.js';

export const getUsuarios = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT numero_cuenta, tipo, saldo FROM usuarios');
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener usuarios");
    }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        // Verifica que email y contrasena sean proporcionados
        if (!email || !contrasena) {
            return res.status(400).send("El email y la contraseña son requeridos");
        }

        const connection = await getConnection();
        const result = await connection.query(
            'INSERT INTO usuarios (email, contrasena) VALUES (?, ?)', // Incluye id_usuario
            [email, contrasena] // Inserta el valor único para email y contrasena
        );

        res.status(201).json({ message: "Usuario registrado con éxito", userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al registrar el usuario");
    }
};

// Obtener usuario por email y contrasena
export const loginUsuario = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        // Verifica que email y contrasena sean proporcionados
        if (!email || !contrasena) {
            return res.status(400).send("El email y la contraseña son requeridos");
        }

        const connection = await getConnection();
        // Consulta para encontrar al usuario por email y contrasena
        const result = await connection.query(
            'SELECT * FROM usuarios WHERE email = ? AND contrasena = ?',
            [email, contrasena]
        );

        // Si no se encuentra el usuario, retorna un error
        if (result[0].length === 0) {
            return res.status(401).send("Credenciales incorrectas");
        }

        // Retorna el usuario encontrado
        res.json({ message: "Login exitoso", user: result[0][0] });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al procesar el login");
    }
};

// Exportar los métodos
export const metodosUsuarios = {
    getUsuarios,
    createUsuario,
    loginUsuario,  // Añadido el nuevo método de login
};
