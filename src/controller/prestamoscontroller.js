import { getConnection } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid'; // Para generar UUIDs

// Obtener todos los préstamos
export const getPrestamos = async (req, res) => {
    try {
        const connection = await getConnection();
        const [result] = await connection.query('SELECT * FROM prestamos');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener préstamos' });
    }
};

// Crear un nuevo préstamo
export const createPrestamo = async (req, res) => {
    try {
        const { descripcion, monto, fecha_solicitud, plazo } = req.body;
        const id_prestamo = uuidv4(); // Genera un UUID para id_prestamo
        const connection = await getConnection();
        const query = `
            INSERT INTO prestamos (id_prestamo, descripcion, monto, fecha_solicitud, plazo, estado)
            VALUES (?, ?, ?, ?, ?, "pendiente")
        `;
        const values = [id_prestamo, descripcion, monto, fecha_solicitud, plazo];
        await connection.query(query, values);
        res.status(201).json({ message: 'Préstamo creado con éxito', id_prestamo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el préstamo' });
    }
};

// Eliminar un préstamo
export const deletePrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        await connection.query('DELETE FROM prestamos WHERE id_prestamo = ?', [id]);
        res.status(200).json({ message: 'Préstamo eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el préstamo' });
    }
};

export const metodosPrestamos = {
    getPrestamos,
    createPrestamo,
    deletePrestamo
};
