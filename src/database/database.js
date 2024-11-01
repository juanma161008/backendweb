import mysql from 'mysql2/promise';
import config from '../config';

const conection = mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort
})

const getConnection = ()=> {
    return conection;
};

export {getConnection};