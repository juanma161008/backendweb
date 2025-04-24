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
            'SELECT id_prestamo, id_usuario, descripcion, monto, plazo, estado, fecha_solicitud FROM prestamos WHERE id_usuario = ?',
            [id_usuario]
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener préstamos' });
    }
};

// ✅ Crear préstamo para un usuario (versión mejorada)
export const createPrestamo = async (req, res) => {
    let connection;
    try {
        const { id_usuario, descripcion, monto, plazo } = req.body;

        // Validaciones robustas
        if (!id_usuario) {
            return res.status(400).json({ message: 'Usuario no autenticado' });
        }
        if (!descripcion?.trim()) {
            return res.status(400).json({ message: 'Descripción requerida' });
        }
        if (isNaN(monto)) {
            return res.status(400).json({ message: 'Monto debe ser numérico' });
        }
        if (isNaN(plazo)) {
            return res.status(400).json({ message: 'Plazo debe ser numérico' });
        }
        if (parseFloat(monto) <= 0) {
            return res.status(400).json({ message: 'Monto debe ser positivo' });
        }
        if (parseInt(plazo) <= 0) {
            return res.status(400).json({ message: 'Plazo debe ser mayor a 0' });
        }

        connection = await getConnection();
        await connection.beginTransaction();

        const id_prestamo = uuidv4();
        const fecha_solicitud = new Date();

        await connection.query(
            `INSERT INTO prestamos 
            (id_prestamo, id_usuario, descripcion, monto, plazo, estado, fecha_solicitud)
            VALUES (?, ?, ?, ?, ?, "pendiente", ?)`,
            [id_prestamo, id_usuario, descripcion.trim(), parseFloat(monto), parseInt(plazo), fecha_solicitud]
        );

        const [prestamosActualizados] = await connection.query(
            'SELECT * FROM prestamos WHERE id_usuario = ? ORDER BY fecha_solicitud DESC',
            [id_usuario]
        );

        await connection.commit();
        res.status(201).json(prestamosActualizados);

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error en createPrestamo:', error);
        res.status(500).json({ 
            message: 'Error al procesar el préstamo',
            error: error.message 
        });
    } finally {
        if (connection) connection.release();
    }
};

export const metodosPrestamos = {
    getPrestamos,
    createPrestamo,
};
