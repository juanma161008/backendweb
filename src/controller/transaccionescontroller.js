import { getConnection } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';

// Obtener todas las transacciones (solo para pruebas o administrador)
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

// ✅ Obtener transacciones por ID de usuario (para mostrar solo las del usuario logueado)
export const getTransaccionesPorUsuario = async (req, res) => {
    const { id_usuario } = req.body;

    if (!id_usuario) {
        return res.status(400).json({ message: "Falta el ID del usuario" });
    }

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'SELECT * FROM Transacciones WHERE id_usuario = ?',
            [id_usuario]
        );

        await connection.commit();
        res.status(200).json(result);
    } catch (error) {
        await connection.rollback();
        console.error("Error al obtener transacciones por usuario:", error);
        res.status(500).json({ message: "Error al obtener transacciones del usuario" });
    } finally {
        connection.release();
    }
};

// Crear una nueva transacción
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

        const [rows] = await connection.query(
            'SELECT id_transaccion, id_usuario, tipo_transaccion, monto, fecha FROM Transacciones WHERE id_transaccion = ?',
            [id_transaccion]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error al crear la transacción:", error);
        res.status(500).json({ message: 'Error al crear la transacción' });
    }
};

// Exportar todos los métodos
export const metodosTransacciones = {
    getTransacciones,
    getTransaccionesPorUsuario, // Nuevo método agregado
    createTransaccion,
};
