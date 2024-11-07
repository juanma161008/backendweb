import { getConnection } from "../database/database.js";

export const getTransacciones = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM Transacciones'); 
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
};

export const metodosTransacciones = {
    getTransacciones,
};
