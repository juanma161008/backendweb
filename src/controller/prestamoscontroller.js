
import { getConnection } from "../database/database.js";


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


export const metodosPrestamos = {
    getPrestamos,
    
};