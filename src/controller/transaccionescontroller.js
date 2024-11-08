import { getConnection } from "../database/database.js";

// Obtener todas las transacciones con transacción
export const getTransacciones = async (req, res) => {
    const connection = await getConnection();
    try {
        await connection.beginTransaction(); // Inicia la transacción

        // Obtener las transacciones
        const [result] = await connection.query('SELECT * FROM Transacciones');

        await connection.commit(); // Commit de la transacción
        res.json(result); // Responder con el resultado
    } catch (error) {
        await connection.rollback(); // Rollback en caso de error
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las transacciones' });
    } finally {
        connection.release(); // Liberar la conexión
    }
};

// Crear una nueva transacción con transacción
export const createTransaccion = async (req, res) => {
    const connection = await getConnection();
    const { descripcion, monto, fecha, estado } = req.body;
    try {
        await connection.beginTransaction(); // Inicia la transacción

        // Insertar la transacción en la base de datos
        const query = 'INSERT INTO Transacciones (descripcion, monto, fecha, estado) VALUES (?, ?, ?, ?)';
        const values = [descripcion, monto, fecha, estado];
        await connection.query(query, values);

        await connection.commit(); // Commit de la transacción
        res.status(201).json({ message: 'Transacción creada con éxito' });
    } catch (error) {
        await connection.rollback(); // Rollback en caso de error
        console.error(error);
        res.status(500).json({ message: 'Error al crear la transacción' });
    } finally {
        connection.release(); // Liberar la conexión
    }
};

// Eliminar una transacción con transacción
export const deleteTransaccion = async (req, res) => {
    const connection = await getConnection();
    const { id } = req.params;
    try {
        await connection.beginTransaction(); // Inicia la transacción

        // Eliminar la transacción de la base de datos
        await connection.query('DELETE FROM Transacciones WHERE id_transaccion = ?', [id]);

        await connection.commit(); // Commit de la transacción
        res.status(200).json({ message: 'Transacción eliminada con éxito' });
    } catch (error) {
        await connection.rollback(); // Rollback en caso de error
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la transacción' });
    } finally {
        connection.release(); // Liberar la conexión
    }
};

export const metodosTransacciones = {
    getTransacciones,
    createTransaccion,
    deleteTransaccion
};
