import mysql from 'mysql2/promise';

import { env } from './env.js';

// 创建 MySQL 连接池，整个项目共用这一份连接配置。
const pool = mysql.createPool({
  connectionLimit: env.dbConnectionLimit,
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName
});

/**
 * 在服务启动时主动测试数据库连接是否可用。
 * 如果这里抛错，通常说明数据库配置、账号密码或网络存在问题。
 *
 * @returns {Promise<void>}
 */
const testDatabaseConnection = async () => {
  const connection = await pool.getConnection();
  try {
    console.log('Connected to MySQL successfully');
  } finally {
    connection.release();
  }
};

export { pool, testDatabaseConnection };
