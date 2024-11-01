import { getConnection } from "../database/database.js";

const getPrestamo = async (req, res) => {
    try{
        const connection = await getConnection()
        const result = await connection.query('SELECT * from prestamos');
        res.json(result);
    }catch(error){
        console.log(error)
        res.status(500)
    }
};

export const metodosprestamos = {
    getPrestamo,
}