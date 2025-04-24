import { getConnection } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';

// ✅ Obtener préstamos del usuario autenticado
export const getPrestamos = async (req, res) => {
    try {
        const { id_usuario } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ message: 'Falta el ID del usuario' });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            'SELECT * FROM prestamos WHERE id_usuario = ?',
            [id_usuario]
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener préstamos' });
    }
};

// ✅ Crear préstamo para un usuario
export const createPrestamo = async (req, res) => {
    try {
        const { id_usuario, descripcion, monto, plazo } = req.body;

        if (!id_usuario || !descripcion || !monto || !plazo) {
            return res.status(400).json({ message: 'Faltan datos del préstamo o del usuario' });
        }

        const id_prestamo = uuidv4();
        const connection = await getConnection();
        const query = `
            INSERT INTO prestamos (id_prestamo, id_usuario, descripcion, monto, plazo, estado)
            VALUES (?, ?, ?, ?, ?, "pendiente")
        `;
        const values = [id_prestamo, id_usuario, descripcion, monto, plazo];
        await connection.query(query, values);

        const [rows] = await connection.query(
            'SELECT * FROM prestamos WHERE id_prestamo = ?',
            [id_prestamo]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el préstamo' });
    }
};

export const metodosPrestamos = {
    getPrestamos,
    createPrestamo,
};
