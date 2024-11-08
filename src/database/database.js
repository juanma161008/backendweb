import mysql from 'mysql2/promise';
import config from '../config.js';

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
    waitForConnections: true,   // Esperar conexiones si el pool está lleno
    connectionLimit: 10,        // Límite de conexiones simultáneas
    queueLimit: 0               // No limitar las solicitudes en cola
});

// Función para obtener una conexión del pool
const getConnection = async () => {
    return await pool.getConnection();  // Obtiene una conexión del pool
};

export { getConnection };
