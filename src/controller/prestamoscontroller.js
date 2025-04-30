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

const validarCampos = ({ id_usuario, descripcion, monto, plazo }) => {
    const errores = {};
    if (!id_usuario) errores.id_usuario = 'Falta ID usuario';
    if (!descripcion) errores.descripcion = 'Falta descripción';
    if (monto === undefined) errores.monto = 'Falta monto';
    if (plazo === undefined) errores.plazo = 'Falta plazo';
    return errores;
};

const verificarUsuarioExiste = async (connection, id_usuario) => {
    const [usuario] = await connection.query(
        'SELECT id_usuario FROM Usuarios WHERE id_usuario = ?', 
        [id_usuario]
    );
    return usuario.length > 0;
};

const insertarPrestamo = async (connection, { id_prestamo, id_usuario, monto, plazo, descripcion }) => {
    await connection.query(
        'INSERT INTO Prestamos (id_prestamo, id_usuario, monto, plazo, estado, descripcion) VALUES (?, ?, ?, ?, "pendiente", ?)',
        [id_prestamo, id_usuario, monto, plazo, descripcion.trim()]
    );
};

export const createPrestamo = async (req, res) => {
    let connection;
    try {
        const { id_usuario, descripcion, monto, plazo } = req.body;

        const errores = validarCampos({ id_usuario, descripcion, monto, plazo });
        if (Object.keys(errores).length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos',
                details: errores
            });
        }

        connection = await getConnection();
        await connection.beginTransaction();

        const usuarioExiste = await verificarUsuarioExiste(connection, id_usuario);
        if (!usuarioExiste) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const id_prestamo = uuidv4();
        const montoFinal = parseFloat(monto);
        const plazoFinal = parseInt(plazo);

        await insertarPrestamo(connection, {
            id_prestamo,
            id_usuario,
            monto: montoFinal,
            plazo: plazoFinal,
            descripcion
        });

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
