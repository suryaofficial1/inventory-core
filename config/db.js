import pkg from 'mysql2/promise';
const { createPool } = pkg; // Destructure createPool from the imported package
import dotenv from 'dotenv';
dotenv.config();

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    charset: 'utf8mb4',
    decimalNumbers: true,
    connectTimeout: 20 * 1000,
    namedPlaceholders: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT) : 10
});

pool.on('acquire', (connection) => {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', (connection) => {
    console.log('Connection %d released', connection.threadId);
});

const getConnection = () => {
    return pool.getConnection();
}

const db = {
    getConnection,
};

export default db;