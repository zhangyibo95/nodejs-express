import { pool } from '../config/database.js';

const getRoot = (req, res) => {
  res.send('Hello World!');
};

const testDatabase = async (req, res, next) => {
  try {
    const [results] = await pool.query('SELECT 1 AS ok');

    res.json({
      message: 'Database connection successful',
      data: results
    });
  } catch (error) {
    next(error);
  }
};

export { getRoot, testDatabase };
