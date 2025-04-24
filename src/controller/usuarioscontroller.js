import { getConnection } from '../database/database.js';

// ✅ Login - Filtra usuario por email y contraseña
export const loginUsuario = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        if (!email || !contrasena) {
            return res.status(400).json({ message: 'El email y la contraseña son requeridos' });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            'SELECT id_usuario, nombre, email, numero_cuenta, tipo, saldo FROM usuarios WHERE email = ? AND contrasena = ?',
            [email, contrasena]
        );

        if (result.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        res.status(200).json({ message: "Login exitoso", user: result[0] });
    } catch (error) {
        console.error('Error en loginUsuario:', error);
        res.status(500).json({ message: 'Error al procesar el login' });
    }
};



// ✅ Crear un nuevo usuario
export const createUsuario = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        if (!email || !contrasena) {
            return res.status(400).json({ message: "El email y la contraseña son requeridos" });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            'INSERT INTO usuarios (email, contrasena) VALUES (?, ?)',
            [email, contrasena]
        );

        res.status(201).json({ message: "Usuario registrado con éxito", userId: result.insertId });
    } catch (error) {
        console.error('Error en createUsuario:', error);
        res.status(500).json({ message: "Error al registrar el usuario" });
    }
};

// Exportar los métodos
export const metodosUsuarios = {
    createUsuario,
    loginUsuario,
};
