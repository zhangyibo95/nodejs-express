import mysql from 'mysql2/promise';

import { env } from './env.js';

const pool = mysql.createPool({
  connectionLimit: env.dbConnectionLimit,
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName
});

const testDatabaseConnection = async () => {
  const connection = await pool.getConnection();
  try {
    console.log('Connected to MySQL successfully');
  } finally {
    connection.release();
  }
};

export { pool, testDatabaseConnection };
