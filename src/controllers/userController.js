import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

const getUsers = async (req, res, next) => {
  try {
    const sql = 'SELECT * FROM Tab_User_Info ORDER BY id DESC';
    const [results] = await pool.query(sql);

    res.json({
      code: 0,
      data: results,
      msg: '获取用户列表成功'
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new AppError('Name and description are required', 400);
    }

    // 检查数据是否已存在
    const checkSql = 'SELECT id FROM Tab_User_Info WHERE name = ?';
    const [existingUsers] = await pool.query(checkSql, [name]);

    if (existingUsers.length > 0) {
      return res.status(200).json({
        code: 1,
        data: null,
        msg: '用户已存在，请使用其他用户名'
      });
    }

    const sql = 'INSERT INTO Tab_User_Info (`name`, `description`) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [name, description]);

    res.status(201).json({
      code: 0,
      data: { id: result.insertId },
      msg: '用户创建成功'
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { name } = req.params;

    // 检查用户是否存在
    const checkSql = 'SELECT id FROM Tab_User_Info WHERE name = ?';
    const [existingUsers] = await pool.query(checkSql, [name]);

    if (existingUsers.length === 0) {
      return res.status(200).json({
        code: 1,
        data: null,
        msg: '用户不存在'
      });
    }

    const sql = 'DELETE FROM Tab_User_Info WHERE name = ?';
    await pool.execute(sql, [name]);

    res.status(200).json({
      code: 0,
      data: { name },
      msg: '用户删除成功'
    });
  } catch (error) {
    next(error);
  }
};

export { getUsers, createUser, deleteUser };
