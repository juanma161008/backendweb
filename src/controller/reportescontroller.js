import { getConnection } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid'; // Para generar UUIDs

// Obtener todos los reportes
export const getReportes = async (req, res) => {
    try {
        const connection = await getConnection();
        const [result] = await connection.query('SELECT * FROM Reportes');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los reportes' });
    }
};

// Crear un nuevo reporte
export const createReporte = async (req, res) => {
    try {
        const { descripcion, fecha, estado } = req.body;
        const id_reporte = uuidv4(); // Genera un UUID para id_reporte
        const connection = await getConnection();
        const query = 'INSERT INTO Reportes (id_reporte, descripcion, fecha, estado) VALUES (?, ?, ?, ?)';
        const values = [id_reporte, descripcion, fecha, estado];
        await connection.query(query, values);
        res.status(201).json({ message: 'Reporte creado con éxito', id_reporte });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el reporte' });
    }
};

// Eliminar un reporte
export const deleteReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        await connection.query('DELETE FROM Reportes WHERE id_reporte = ?', [id]);
        res.status(200).json({ message: 'Reporte eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el reporte' });
    }
};

export const metodosReportes = {
    getReportes,
    createReporte,
    deleteReporte
};
