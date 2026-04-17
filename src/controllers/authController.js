import { pool } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';

const login = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        code: 1,
        data: null,
        msg: '用户名和密码不能为空'
      });
    }

    const sql = 'SELECT id, name, password, description FROM Tab_User_Info WHERE name = ?';
    const [users] = await pool.query(sql, [name]);

    if (users.length === 0) {
      return res.status(404).json({
        code: 1,
        data: null,
        msg: '用户不存在'
      });
    }

    const user = users[0];

    if (user.password !== password) {
      return res.status(401).json({
        code: 1,
        data: null,
        msg: '密码错误'
      });
    }

    const token = generateToken({ id: user.id, name: user.name });

    res.json({
      code: 0,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          description: user.description ?? null
        }
      },
      msg: '登录成功'
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, password, description } = req.body;

    if (!name || !password || !description) {
      return res.status(400).json({
        code: 1,
        data: null,
        msg: '用户名、密码和描述不能为空'
      });
    }

    const checkSql = 'SELECT id FROM Tab_User_Info WHERE name = ?';
    const [existingUsers] = await pool.query(checkSql, [name]);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        code: 1,
        data: null,
        msg: '用户名已存在'
      });
    }

    const insertSql = 'INSERT INTO Tab_User_Info (`name`, `password`, `description`) VALUES (?, ?, ?)';
    const [result] = await pool.execute(insertSql, [name, password, description]);

    const token = generateToken({ id: result.insertId, name });

    res.status(201).json({
      code: 0,
      data: {
        token,
        user: {
          id: result.insertId,
          name,
          description
        }
      },
      msg: '注册成功'
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const sql = 'SELECT id, name, description FROM Tab_User_Info WHERE id = ?';
    const [users] = await pool.query(sql, [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({
        code: 1,
        data: null,
        msg: '用户不存在'
      });
    }

    res.json({
      code: 0,
      data: users[0],
      msg: '获取当前用户成功'
    });
  } catch (error) {
    next(error);
  }
};

export { login, register, getProfile };
