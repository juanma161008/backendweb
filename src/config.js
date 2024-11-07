import { config } from 'dotenv';
config();

export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000, // Valor del puerto
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT
};
