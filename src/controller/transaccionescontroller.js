import { getConnection } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';

export const getTransacciones = async (req, res) => {
    const connection = await getConnection();
    try {
        await connection.beginTransaction(); 

        const [result] = await connection.query('SELECT * FROM Transacciones');

        await connection.commit();
        res.json(result); 
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las transacciones' });
    } finally {
        connection.release(); 
    }
};

export const createTransaccion = async (req, res) => {
    try {
        const { id_usuario, tipo_transaccion, monto, fecha } = req.body;
        const id_transaccion = uuidv4(); 
        const connection = await getConnection();

        const query = `
            INSERT INTO Transacciones (id_transaccion, id_usuario, tipo_transaccion, monto, fecha)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [id_transaccion, id_usuario, tipo_transaccion, monto, fecha];
        await connection.query(query, values);

        const selectQuery = `
            SELECT id_transaccion, id_usuario, tipo_transaccion, monto, fecha
            FROM Transacciones
            WHERE id_transaccion = ?
        `;
        const [rows] = await connection.query(selectQuery, [id_transaccion]);

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la transacción' });
    }
};

export const metodosTransacciones = {
    getTransacciones,
    createTransaccion,
};
