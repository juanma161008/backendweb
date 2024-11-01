
import { getConnection } from "../database/database.js";


export const getReportes = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM Reportes');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
};


export const metodosreportes = {
    getReportes,
    
};