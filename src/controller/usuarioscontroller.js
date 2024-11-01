
import { getConnection } from "../database/database.js";


export const getUsuarios = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * Usuarios');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
};


export const metodosUsuarios = {
    getUsuarios,
    
};