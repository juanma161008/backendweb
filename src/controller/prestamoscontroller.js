    import { getConnection } from "../database/database.js";
    import { v4 as uuidv4 } from 'uuid';

    // ✅ Obtener préstamos del usuario autenticado
    export const getPrestamos = async (req, res) => {
        try {
            const { id_usuario } = req.body;

            if (!id_usuario) {
                return res.status(400).json({ message: 'Falta el ID del usuario' });
            }

            const connection = await getConnection();
            const [result] = await connection.query(
                'SELECT id_prestamo, id_usuario, descripcion, monto, plazo, estado, fecha_solicitud FROM prestamos WHERE id_usuario = ?',
                [id_usuario]
            );

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener préstamos' });
        }
    };

    // ✅ Crear préstamo para un usuario (versión mejorada)
    export const createPrestamo = async (req, res) => {
        let connection;
        try {
            console.log("Solicitud recibida:", req.body); // 🧪
    
            const { id_usuario, descripcion, monto, plazo } = req.body;
    
            if (!id_usuario) return res.status(400).json({ message: 'Usuario no autenticado' });
            if (!descripcion?.trim()) return res.status(400).json({ message: 'Descripción requerida' });
            if (isNaN(monto) || parseFloat(monto) <= 0) return res.status(400).json({ message: 'Monto inválido' });
            if (isNaN(plazo) || parseInt(plazo) <= 0) return res.status(400).json({ message: 'Plazo inválido' });
    
            connection = await getConnection();
    
            const [usuarioExiste] = await connection.query(
                'SELECT 1 FROM Usuarios WHERE id_usuario = ?',
                [id_usuario]
            );
            if (usuarioExiste.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    
            await connection.beginTransaction();
    
            const id_prestamo = uuidv4();
            const fecha_solicitud = new Date();
    
            await connection.query(
                `INSERT INTO prestamos 
                 (id_prestamo, id_usuario, monto, plazo, estado, fecha_solicitud, descripcion)
                 VALUES (?, ?, ?, ?, "pendiente", ?, ?)`,
                [id_prestamo, id_usuario, parseFloat(monto), parseInt(plazo), fecha_solicitud, descripcion.trim()]
              );
    
            const [nuevoPrestamo] = await connection.query(
                'SELECT * FROM prestamos WHERE id_prestamo = ?',
                [id_prestamo]
            );
    
            await connection.commit();
            res.status(201).json(nuevoPrestamo[0]);
    
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('❌ Error en createPrestamo:', error);
            res.status(500).json({ message: 'Error al crear el préstamo', error: error.message });
        } finally {
            if (connection) connection.release();
        }
    };
    
    export const metodosPrestamos = {
        getPrestamos,
        createPrestamo,
    };
