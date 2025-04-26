import { getConnection } from "../database/database.js";
import { v4 as uuidv4 } from 'uuid';

export const getPrestamos = async (req, res) => {
    try {
        const { id_usuario } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ 
                success: false,
                message: 'ID de usuario es requerido' 
            });
        }

        const connection = await getConnection();
        const [result] = await connection.query(
            `SELECT 
                id_prestamo, 
                id_usuario, 
                monto, 
                plazo, 
                estado, 
                descripcion,
                DATE_FORMAT(fecha_solicitud, '%Y-%m-%d %H:%i:%s') as fecha_solicitud
             FROM prestamos 
             WHERE id_usuario = ? 
             ORDER BY fecha_solicitud DESC`,
            [id_usuario]
        );

        res.json({
            success: true,
            data: result,
            count: result.length
        });
    } catch (error) {
        console.error('Error en getPrestamos:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener préstamos',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

export const createPrestamo = async (req, res) => {
    let connection;
    try {
        const { id_usuario, descripcion, monto, plazo } = req.body;
        
        // Validaciones mejoradas
        if (!id_usuario || !descripcion || monto === undefined || plazo === undefined) {
            return res.status(400).json({ 
                success: false,
                message: 'Todos los campos son requeridos',
                details: {
                    id_usuario: !id_usuario ? 'Falta ID usuario' : 'OK',
                    descripcion: !descripcion ? 'Falta descripción' : 'OK',
                    monto: monto === undefined ? 'Falta monto' : 'OK',
                    plazo: plazo === undefined ? 'Falta plazo' : 'OK'
                }
            });
        }

        connection = await getConnection();
        await connection.beginTransaction();

        // Validar que el usuario existe
        const [usuario] = await connection.query(
            'SELECT id_usuario FROM Usuarios WHERE id_usuario = ?', 
            [id_usuario]
        );
        
        if (usuario.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const id_prestamo = uuidv4();
        const montoFinal = parseFloat(monto);
        const plazoFinal = parseInt(plazo);

        await connection.query(
            'INSERT INTO Prestamos (id_prestamo, id_usuario, monto, plazo, estado, descripcion) VALUES (?, ?, ?, ?, "pendiente", ?)',
            [id_prestamo, id_usuario, montoFinal, plazoFinal, descripcion.trim()]
        );

        await connection.commit();
        
        res.status(201).json({
            success: true,
            message: 'Préstamo creado exitosamente',
            prestamo: {
                id_prestamo,
                id_usuario,
                monto: montoFinal,
                plazo: plazoFinal,
                estado: 'pendiente',
                descripcion: descripcion.trim()
            }
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error en createPrestamo:', error);
        
        res.status(500).json({ 
            success: false,
            message: 'Error al procesar el préstamo',
            error: process.env.NODE_ENV === 'development' ? error.message : null,
            sqlError: process.env.NODE_ENV === 'development' ? error.sqlMessage : null
        });
    } finally {
        if (connection) connection.release();
    }
};

export const metodosPrestamos = {
    getPrestamos,
    createPrestamo
};