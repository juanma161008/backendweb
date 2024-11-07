import { getConnection } from '../database/database.js';

// Obtener el historial de transacciones de un usuario
export const obtenerHistorialTransacciones = async (req, res) => {
    const { id_usuario } = req.params; // Obtener el id_usuario desde los parámetros de la ruta

    try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM Transacciones WHERE id_usuario = ?',
            [id_usuario]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron transacciones.' });
        }

        res.json(rows); // Devolver las transacciones encontradas
    } catch (error) {
        console.error('Error al obtener el historial de transacciones:', error);
        res.status(500).json({ message: 'Error al obtener el historial de transacciones.' });
    }
};

// Realizar una transacción (depósito, retiro o transferencia)
export const realizarTransaccion = async (req, res) => {
    const { id_usuario, tipo_transaccion, monto } = req.body;

    // Validar los datos de entrada
    if (!id_usuario || !tipo_transaccion || !monto) {
        return res.status(400).json({ message: 'Faltan datos requeridos.' });
    }

    try {
        const connection = await getConnection();
        const fecha = new Date();

        // Insertar la transacción en la base de datos
        const [result] = await connection.execute(
            'INSERT INTO Transacciones (id_transaccion, id_usuario, tipo_transaccion, monto, fecha) VALUES (UUID(), ?, ?, ?, ?)',
            [id_usuario, tipo_transaccion, monto, fecha]
        );

        // Actualizar el saldo del usuario si es necesario
        if (tipo_transaccion === 'depósito' || tipo_transaccion === 'retiro') {
            const [usuario] = await connection.execute(
                'SELECT saldo FROM Usuarios WHERE id_usuario = ?',
                [id_usuario]
            );

            if (usuario.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            let nuevoSaldo = usuario[0].saldo;
            if (tipo_transaccion === 'depósito') {
                nuevoSaldo += monto; // Aumentar saldo para depósito
            } else if (tipo_transaccion === 'retiro') {
                if (nuevoSaldo < monto) {
                    return res.status(400).json({ message: 'Saldo insuficiente para retiro.' });
                }
                nuevoSaldo -= monto; // Reducir saldo para retiro
            }

            // Actualizar el saldo del usuario
            await connection.execute(
                'UPDATE Usuarios SET saldo = ? WHERE id_usuario = ?',
                [nuevoSaldo, id_usuario]
            );
        }

        res.status(201).json({ message: 'Transacción realizada con éxito.' });
    } catch (error) {
        console.error('Error al realizar la transacción:', error);
        res.status(500).json({ message: 'Error al realizar la transacción.' });
    }
};
