import { getConnection } from "../database/database.js";

export const getTransacciones = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM Transacciones'); 
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las transacciones' });
    }
};

export const metodosTransacciones = {
    getTransacciones,
};
