import bcrypt from 'bcrypt';

import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';
import { generateAccessToken } from '../utils/jwt.js';
import { getClientIp } from '../utils/request.js';

// 登录失败达到该次数后，自动将账号状态改为锁定。
const LOGIN_FAIL_LIMIT = 5;
// 默认状态：1 表示启用。
const DEFAULT_USER_STATUS = 1;
// 默认删除标记：0 表示未删除。
const DEFAULT_USER_DELETED = 0;

/**
 * 将数据库原始用户记录整理成更适合接口返回的对象结构。
 * 这里会把用户基础信息和扩展资料 profile 合并到同一个对象里。
 *
 * @param {object} user 数据库查询出的用户记录
 * @returns {object} 返回给前端的用户对象
 */
const toSafeUser = (user) => {
  return {
    userId: user.id,
    account: user.account,
    status: user.status,
    loginFailCount: user.login_fail_count,
    lastLoginAt: user.last_login_at,
    lastLoginIp: user.last_login_ip,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    profile: {
      profileId: user.profile_id,
      nickName: user.nick_name,
      realName: user.real_name,
      avatarUrl: user.avatar_url,
      mobile: user.mobile,
      email: user.email,
      gender: user.gender,
      birthday: user.birthday,
      address: user.address,
      bio: user.bio
    }
  };
};

/**
 * 按 account 查询用户，同时联表查询用户扩展资料。
 * 登录时会使用这个函数拿到密码、状态、失败次数等信息。
 *
 * @param {import('mysql2/promise').PoolConnection} connection 数据库连接
 * @param {string} account 用户账号
 * @returns {Promise<object|null>} 用户存在时返回用户记录，不存在返回 null
 */
const getUserWithProfileByAccount = async (connection, account) => {
  const sql = `
    SELECT
      u.id,
      u.account,
      u.password_hash,
      u.status,
      u.is_deleted,
      u.login_fail_count,
      u.last_login_at,
      u.last_login_ip,
      u.locked_at,
      u.created_at,
      u.updated_at,
      p.id AS profile_id,
      p.nick_name,
      p.real_name,
      p.avatar_url,
      p.mobile,
      p.email,
      p.gender,
      p.birthday,
      p.address,
      p.bio
    FROM tab_user_info AS u
    LEFT JOIN tab_user_profile AS p ON p.user_id = u.id AND p.is_deleted = 0
    WHERE u.account = ? AND u.is_deleted = 0
    LIMIT 1
  `;
  const [rows] = await connection.query(sql, [account]);
  return rows[0] || null;
};

/**
 * 按用户 ID 查询当前用户信息和扩展资料。
 * `/api/auth/me` 接口会使用它获取当前登录用户详情。
 *
 * @param {import('mysql2/promise').PoolConnection} connection 数据库连接
 * @param {number} userId 用户 ID
 * @returns {Promise<object|null>} 用户存在时返回用户记录，不存在返回 null
 */
const getUserWithProfileById = async (connection, userId) => {
  const sql = `
    SELECT
      u.id,
      u.account,
      u.status,
      u.is_deleted,
      u.login_fail_count,
      u.last_login_at,
      u.last_login_ip,
      u.created_at,
      u.updated_at,
      p.id AS profile_id,
      p.nick_name,
      p.real_name,
      p.avatar_url,
      p.mobile,
      p.email,
      p.gender,
      p.birthday,
      p.address,
      p.bio
    FROM tab_user_info AS u
    LEFT JOIN tab_user_profile AS p ON p.user_id = u.id AND p.is_deleted = 0
    WHERE u.id = ? AND u.is_deleted = 0
    LIMIT 1
  `;
  const [rows] = await connection.query(sql, [userId]);
  return rows[0] || null;
};

/**
 * 查询某个用户绑定的角色列表。
 * 这里只返回启用且未删除的角色。
 *
 * @param {import('mysql2/promise').PoolConnection} connection 数据库连接
 * @param {number} userId 用户 ID
 * @returns {Promise<object[]>} 角色列表
 */
const getUserRolesByUserId = async (connection, userId) => {
  const sql = `
    SELECT DISTINCT
      r.id,
      r.role_code,
      r.role_name,
      r.remark
    FROM tab_role AS r
    INNER JOIN tab_user_role AS ur ON ur.role_id = r.id
    WHERE ur.user_id = ?
      AND ur.is_deleted = 0
      AND r.status = 1
      AND r.is_deleted = 0
    ORDER BY r.id ASC
  `;
  const [rows] = await connection.query(sql, [userId]);
  return rows;
};

/**
 * 查询某个用户拥有的权限列表。
 * 权限通过 用户 -> 角色 -> 权限 的关系链进行查询。
 *
 * @param {import('mysql2/promise').PoolConnection} connection 数据库连接
 * @param {number} userId 用户 ID
 * @returns {Promise<object[]>} 权限列表
 */
const getUserPermissionsByUserId = async (connection, userId) => {
  const sql = `
    SELECT DISTINCT
      p.id,
      p.permission_code,
      p.permission_name,
      p.remark
    FROM tab_permission AS p
    INNER JOIN tab_role_permission AS rp ON rp.permission_id = p.id
    INNER JOIN tab_user_role AS ur ON ur.role_id = rp.role_id
    INNER JOIN tab_role AS r ON r.id = ur.role_id
    WHERE ur.user_id = ?
      AND ur.is_deleted = 0
      AND rp.is_deleted = 0
      AND p.status = 1
      AND p.is_deleted = 0
      AND r.status = 1
      AND r.is_deleted = 0
    ORDER BY p.id ASC
  `;
  const [rows] = await connection.query(sql, [userId]);
  return rows;
};

/**
 * 写入登录日志。
 * 无论登录成功还是失败，都统一写到 `tab_login_log` 中。
 *
 * @param {import('mysql2/promise').PoolConnection} connection 数据库连接
 * @param {object} payload 日志内容
 * @returns {Promise<void>}
 */
const insertLoginLog = async (connection, payload) => {
  const sql = `
    INSERT INTO tab_login_log (
      user_id,
      account,
      login_result,
      fail_reason,
      login_ip,
      user_agent
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;
  await connection.execute(sql, [
    payload.userId || null,
    payload.account,
    payload.login_result,
    payload.fail_reason || null,
    payload.loginIp || null,
    payload.userAgent || null
  ]);
};

/**
 * 生成 accessToken。
 * token 中会带上 userId、account、roles，方便后续接口直接做鉴权。
 *
 * @param {object} user 用户对象
 * @param {object[]} roles 角色列表
 * @returns {string} JWT accessToken
 */
const buildAccessToken = (user, roles) => {
  return generateAccessToken({
    userId: user.id,
    account: user.account,
    roles: roles.map((role) => role.role_code)
  });
};

/**
 * 用户注册。
 * 核心流程：
 * 1. 校验 account/password
 * 2. 检查 account 是否唯一
 * 3. 使用 bcrypt 生成 password_hash
 * 4. 写入用户主表和用户资料表
 * 5. 签发 accessToken 返回给前端
 *
 * @param {import('express').Request} req 请求对象
 * @param {import('express').Response} res 响应对象
 * @param {import('express').NextFunction} next Express next
 * @returns {Promise<void>}
 */
const register = async (req, res, next) => {
  let connection;
  // 用于标记事务是否已经开始，避免异常时重复回滚。
  let transactionStarted = false;

  try {
    connection = await pool.getConnection();
    const {
      account,
      password,
      nickName = null,
      realName = null,
      mobile = null,
      email = null
    } = req.body;

    if (!account || !password) {
      return res.status(400).json({
        code: 1,
        data: null,
        msg: 'account and password are required'
      });
    }

    // 注册涉及多次写库，必须放在一个事务中保证一致性。
    await connection.beginTransaction();
    transactionStarted = true;

    // account 唯一校验。
    const [existingUsers] = await connection.query(
      'SELECT id FROM tab_user_info WHERE account = ? LIMIT 1',
      [account]
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      transactionStarted = false;
      return res.status(409).json({
        code: 1,
        data: null,
        msg: 'account already exists'
      });
    }

    // 使用 bcrypt 生成密码哈希，避免明文密码入库。
    const passwordHash = await bcrypt.hash(password, 10);

    // 写入用户主表。
    const [userResult] = await connection.execute(
      `
        INSERT INTO tab_user_info (
          account,
          password_hash,
          status,
          is_deleted,
          login_fail_count
        ) VALUES (?, ?, ?, ?, 0)
      `,
      [account, passwordHash, DEFAULT_USER_STATUS, DEFAULT_USER_DELETED]
    );

    // 写入用户扩展资料表。
    await connection.execute(
      `
        INSERT INTO tab_user_profile (
          user_id,
          nick_name,
          real_name,
          mobile,
          email,
          is_deleted
        ) VALUES (?, ?, ?, ?, ?, 0)
      `,
      [userResult.insertId, nickName, realName, mobile, email]
    );

    // 注册完成后顺手查询角色并签发 token，前端可以直接进入登录态。
    const roles = await getUserRolesByUserId(connection, userResult.insertId);
    const accessToken = buildAccessToken(
      { id: userResult.insertId, account },
      roles
    );

    await connection.commit();
    transactionStarted = false;

    res.status(201).json({
      code: 0,
      data: {
        accessToken,
        user: {
          userId: userResult.insertId,
          account,
          roles: roles.map((role) => role.role_code)
        }
      },
      msg: 'register success'
    });
  } catch (error) {
    if (connection && transactionStarted) {
      await connection.rollback();
    }
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 用户登录。
 * 核心流程：
 * 1. 根据 account 查询用户
 * 2. 检查账号状态、删除标记、锁定状态
 * 3. 使用 bcrypt 校验密码
 * 4. 失败则累计登录失败次数，达到上限自动锁定
 * 5. 成功则重置失败次数，更新最后登录时间/IP，写入登录日志
 * 6. 查询角色和权限后返回 accessToken
 *
 * @param {import('express').Request} req 请求对象
 * @param {import('express').Response} res 响应对象
 * @param {import('express').NextFunction} next Express next
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
  let connection;
  let transactionStarted = false;

  try {
    connection = await pool.getConnection();
    const { account, password } = req.body;
    const loginIp = getClientIp(req);
    const userAgent = req.headers['user-agent'] || null;

    if (!account || !password) {
      return res.status(400).json({
        code: 1,
        data: null,
        msg: 'account and password are required'
      });
    }

    // 登录流程中会更新失败次数、状态、日志，所以也使用事务。
    await connection.beginTransaction();
    transactionStarted = true;

    const user = await getUserWithProfileByAccount(connection, account);

    if (!user) {
      // 账号不存在也要记失败日志，方便审计。
      await insertLoginLog(connection, {
        account,
        login_result: 0,
        fail_reason: 'ACCOUNT_NOT_FOUND',
        loginIp,
        userAgent
      });
      await connection.commit();
      transactionStarted = false;
      return res.status(404).json({
        code: 1,
        data: null,
        msg: 'account not found'
      });
    }

    if (user.status === 0) {
      await insertLoginLog(connection, {
        userId: user.id,
        account,
        login_result: 0,
        fail_reason: 'ACCOUNT_DISABLED',
        loginIp,
        userAgent
      });
      await connection.commit();
      transactionStarted = false;
      return res.status(403).json({
        code: 1,
        data: null,
        msg: 'account disabled'
      });
    }

    if (user.status === 2) {
      await insertLoginLog(connection, {
        userId: user.id,
        account,
        login_result: 0,
        fail_reason: 'ACCOUNT_LOCKED',
        loginIp,
        userAgent
      });
      await connection.commit();
      transactionStarted = false;
      return res.status(423).json({
        code: 1,
        data: null,
        msg: 'account locked'
      });
    }

    // 用 bcrypt 比对明文密码和数据库里的 password_hash。
    const passwordMatched = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatched) {
      // 登录失败时累计次数，达到阈值后直接把账号置为锁定状态。
      const nextFailCount = user.login_fail_count + 1;
      const nextStatus = nextFailCount >= LOGIN_FAIL_LIMIT ? 2 : user.status;

      await connection.execute(
        `
          UPDATE tab_user_info
          SET login_fail_count = ?, status = ?, locked_at = IF(? = 2, NOW(), locked_at)
          WHERE id = ?
        `,
        [nextFailCount, nextStatus, nextStatus, user.id]
      );

      await insertLoginLog(connection, {
        userId: user.id,
        account,
        login_result: 0,
        fail_reason: nextStatus === 2 ? 'PASSWORD_ERROR_LOCKED' : 'PASSWORD_ERROR',
        loginIp,
        userAgent
      });

      await connection.commit();
      transactionStarted = false;

      return res.status(nextStatus === 2 ? 423 : 401).json({
        code: 1,
        data: {
          loginFailCount: nextFailCount,
          isLocked: nextStatus === 2
        },
        msg: nextStatus === 2 ? 'account locked after too many failed attempts' : 'password incorrect'
      });
    }

    // 登录成功后清空失败次数，并刷新最后登录信息。
    await connection.execute(
      `
        UPDATE tab_user_info
        SET
          login_fail_count = 0,
          status = 1,
          locked_at = NULL,
          last_login_at = NOW(),
          last_login_ip = ?
        WHERE id = ?
      `,
      [loginIp, user.id]
    );

    // 登录成功后把角色和权限都查询出来，便于前端初始化用户上下文。
    const roles = await getUserRolesByUserId(connection, user.id);
    const permissions = await getUserPermissionsByUserId(connection, user.id);
    const accessToken = buildAccessToken(user, roles);

    await insertLoginLog(connection, {
      userId: user.id,
      account,
      login_result: 1,
      loginIp,
      userAgent
    });

    await connection.commit();
    transactionStarted = false;

    res.json({
      code: 0,
      data: {
        accessToken,
        user: {
          ...toSafeUser({
            ...user,
            login_fail_count: 0,
            last_login_ip: loginIp,
            last_login_at: new Date()
          }),
          roles: roles.map((role) => role.role_code),
          permissions: permissions.map((permission) => permission.permission_code)
        }
      },
      msg: 'login success'
    });
  } catch (error) {
    if (connection && transactionStarted) {
      await connection.rollback();
    }
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 获取当前登录用户信息。
 * 当前用户 ID 来自 `protect` 中间件解出的 JWT 载荷。
 *
 * @param {import('express').Request} req 请求对象
 * @param {import('express').Response} res 响应对象
 * @param {import('express').NextFunction} next Express next
 * @returns {Promise<void>}
 */
const getProfile = async (req, res, next) => {
  let connection;

  try {
    connection = await pool.getConnection();
    const user = await getUserWithProfileById(connection, req.user.userId);

    if (!user) {
      throw new AppError('current user not found', 404);
    }

    const roles = await getUserRolesByUserId(connection, req.user.userId);

    res.json({
      code: 0,
      data: {
        ...toSafeUser(user),
        roles: roles.map((role) => role.role_code)
      },
      msg: 'get current user success'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 获取当前登录用户的角色列表。
 *
 * @param {import('express').Request} req 请求对象
 * @param {import('express').Response} res 响应对象
 * @param {import('express').NextFunction} next Express next
 * @returns {Promise<void>}
 */
const getCurrentUserRoles = async (req, res, next) => {
  let connection;

  try {
    connection = await pool.getConnection();
    const roles = await getUserRolesByUserId(connection, req.user.userId);

    res.json({
      code: 0,
      data: roles,
      msg: 'get current user roles success'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * 获取当前登录用户的权限列表。
 *
 * @param {import('express').Request} req 请求对象
 * @param {import('express').Response} res 响应对象
 * @param {import('express').NextFunction} next Express next
 * @returns {Promise<void>}
 */
const getCurrentUserPermissions = async (req, res, next) => {
  let connection;

  try {
    connection = await pool.getConnection();
    const permissions = await getUserPermissionsByUserId(connection, req.user.userId);

    res.json({
      code: 0,
      data: permissions,
      msg: 'get current user permissions success'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export {
  register,
  login,
  getProfile,
  getCurrentUserRoles,
  getCurrentUserPermissions
};
