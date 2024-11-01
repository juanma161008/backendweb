
import { getConnection } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';

export const getPrestamos = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM Prestamos');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
};

// Crear un nuevo préstamo
export const createPrestamo = async (req, res) => {
    const { id_usuario, monto, plazo, estado, fecha_solicitud } = req.body; // Extraer los datos del cuerpo de la solicitud
    try {
        const connection = await getConnection();
        const id_prestamo = uuidv4()  
        const result = await connection.query(
            'INSERT INTO Prestamos (id_prestamo, id_usuario, monto, plazo, estado, fecha_solicitud) VALUES (?, ?, ?, ?, ?, ?)',
            [id_prestamo, id_usuario, monto, plazo, estado, fecha_solicitud]
        );
        res.status(201).json({ message: 'Préstamo creado', id: id_prestamo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el préstamo' });
    }
};

// Eliminar un préstamo por ID
export const deletePrestamo = async (req, res) => {
    const { id } = req.params; 
    try {
        const connection = await getConnection();
        const result = await connection.query('DELETE FROM Prestamos WHERE id_prestamo = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }
        res.json({ message: 'Préstamo eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el préstamo' });
    }
};



// Exportar los métodos
export const metodosPrestamos = {
    getPrestamos,
    createPrestamo,
    deletePrestamo,
};