import { getConnection } from "../database/database.js";

// ✅ Obtener reportes solo del usuario autenticado
export const getReportesPorUsuario = async (req, res) => {
    const { id_usuario } = req.body;

    if (!id_usuario) {
        return res.status(400).json({ message: "Falta el ID del usuario" });
    }

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
            WHERE 
                Reportes.id_usuario = ?
        `, [id_usuario]);

        if (result.length === 0) {
            return res.status(404).json({ message: "No hay reportes disponibles para este usuario" });
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los reportes' });
    }
};

export const metodosReportes = {
    getReportesPorUsuario,
};
