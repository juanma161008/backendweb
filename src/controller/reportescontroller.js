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
// Crear un nuevo reporte
export const createReporte = async (req, res) => {
    try {
        const { id_usuario, historico_ingresos, historico_egresos, deudas } = req.body;

        // Validación de los campos requeridos
        if (id_usuario === undefined || historico_ingresos === undefined || historico_egresos === undefined || deudas === undefined) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            'INSERT INTO Reportes (id_usuario, historico_ingresos, historico_egresos, deudas) VALUES (?, ?, ?, ?)',
            [id_usuario, historico_ingre, historico_egresos, deudas]
        );

        res.status(201).json({ message: 'Reporte creado correctamente', id_reporte: result.insertId });
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
