import { getConnection } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';

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

export const createPrestamo = async (req, res) => {
    try {
        const { descripcion, monto, plazo } = req.body;
        const id_prestamo = uuidv4(); 
        const connection = await getConnection();
        const query = `
            INSERT INTO prestamos (id_prestamo, descripcion, monto, plazo, estado)
            VALUES (?, ?, ?, ?, "pendiente")
        `;
        const values = [id_prestamo, descripcion, monto, plazo];
        await connection.query(query, values);
        const selectQuery = `
            SELECT id_prestamo, descripcion, monto, plazo, estado
            FROM prestamos
            WHERE id_prestamo = ?
        `;
        const [rows] = await connection.query(selectQuery, [id_prestamo]);

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
