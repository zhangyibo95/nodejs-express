import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

/**
 * 获取用户列表。
 * 这里只查询未删除用户，返回的是用户主表中的核心字段。
 *
 * @param {import('express').Request} req 请求对象
 * @param {import('express').Response} res 响应对象
 * @param {import('express').NextFunction} next Express next
 * @returns {Promise<void>}
 */
const getUsers = async (req, res, next) => {
  try {
    const sql = `
      SELECT
        id AS userId,
        account,
        status,
        is_deleted AS isDeleted,
        login_fail_count AS loginFailCount,
        last_login_at AS lastLoginAt,
        last_login_ip AS lastLoginIp,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM tab_user_info
      WHERE is_deleted = 0
      ORDER BY id DESC
    `;
    const [results] = await pool.query(sql);

    res.json({
      code: 0,
      data: results,
      msg: 'get users success'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 提示调用方不要走旧的创建用户接口。
 * 当前项目已经把注册统一收口到 `/api/auth/register`。
 *
 * @param {import('express').Request} req 请求对象
 * @param {import('express').Response} res 响应对象
 * @param {import('express').NextFunction} next Express next
 * @returns {Promise<void>}
 */
const createUser = async (req, res, next) => {
  try {
    const { account } = req.body;

    if (!account) {
      throw new AppError('account is required', 400);
    }

    return res.status(400).json({
      code: 1,
      data: null,
      msg: 'please use /api/auth/register to create a user'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 逻辑删除用户。
 * 这里不是直接删库，而是把 `is_deleted` 置为 1。
 *
 * @param {import('express').Request} req 请求对象
 * @param {import('express').Response} res 响应对象
 * @param {import('express').NextFunction} next Express next
 * @returns {Promise<void>}
 */
const deleteUser = async (req, res, next) => {
  try {
    const { account } = req.params;

    if (!account) {
      throw new AppError('account is required', 400);
    }

    const [existingUsers] = await pool.query(
      'SELECT id FROM tab_user_info WHERE account = ? AND is_deleted = 0 LIMIT 1',
      [account]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        code: 1,
        data: null,
        msg: 'user not found'
      });
    }

    await pool.execute(
      'UPDATE tab_user_info SET is_deleted = 1 WHERE account = ?',
      [account]
    );

    res.json({
      code: 0,
      data: { account },
      msg: 'delete user success'
    });
  } catch (error) {
    next(error);
  }
};

export { getUsers, createUser, deleteUser };
