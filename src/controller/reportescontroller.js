import { getConnection } from "../database/database.js";

export const getReportes = async (req, res) => {
    try {
        const connection = await getConnection();
        const [result] = await connection.query(`
            SELECT 
                Reportes.id_reporte,
                Reportes.id_usuario,
                Reportes.historico_ingresos,
                Reportes.historico_egresos,
                Reportes.deudas,
                Usuarios.nombre,
                Usuarios.email,
                Usuarios.numero_cuenta,
                Usuarios.tipo
            FROM 
                Reportes
            JOIN 
                Usuarios ON Reportes.id_usuario = Usuarios.id_usuario
        `);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los reportes' });
    }
};

export const metodosReportes = {
    getReportes,
};
