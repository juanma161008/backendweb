import { getConnection } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';

// Obtener todas las transacciones
export const getTransacciones = async (req, res) => {
    try {
        const connection = await getConnection();
        const [result] = await connection.query('SELECT * FROM Transacciones');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener transacciones' });
    }
};

// Obtener transacciones por usuario
export const getTransaccionesPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.body;
        
        if (!id_usuario) {
            return res.status(400).json({ message: 'ID de usuario es requerido' });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            'SELECT * FROM Transacciones WHERE id_usuario = ?',
            [id_usuario]
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener transacciones del usuario' });
    }
};

// Crear nueva transacción
export const createTransaccion = async (req, res) => {
    try {
        const { id_usuario, tipo_transaccion, monto } = req.body;
        
        if (!id_usuario || !tipo_transaccion || !monto) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }

        const id_transaccion = uuidv4();
        const fecha = new Date();

        const connection = await getConnection();
        await connection.query(
            'INSERT INTO Transacciones (id_transaccion, id_usuario, tipo_transaccion, monto, fecha) VALUES (?, ?, ?, ?, ?)',
            [id_transaccion, id_usuario, tipo_transaccion, monto, fecha]
        );

        res.status(201).json({ 
            id_transaccion, 
            id_usuario, 
            tipo_transaccion, 
            monto, 
            fecha 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear transacción' });
    }
};

export const metodosTransacciones = {
    getTransacciones,
    getTransaccionesPorUsuario,
    createTransaccion
};