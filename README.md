# my-first-pro

一个基于 Node.js、Express 和 MySQL 的用户中心后端示例，直接落地在现有项目结构中。

## 这次调整前存在的问题

- 现有登录逻辑仍使用明文密码，不符合企业级鉴权要求
- 现有 JWT 载荷只包含简单用户信息，未包含角色
- `src/routes/authRoutes.js` 和 `src/routes/userRoutes.js` 存在重复 `/api` 路径拼接问题
- 错误处理中间件返回错误时 `code` 仍是 `0`

## 依赖安装

```bash
npm install bcrypt
```

## 环境变量

参考 `.env.example`：

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_CONNECTION_LIMIT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## 启动

```bash
npm start
```

## 已实现接口

### `POST /api/auth/register`

请求体：

```json
{
  "account": "zhangsan",
  "password": "123456",
  "nickName": "张三",
  "realName": "张三",
  "phone": "13800000000",
  "email": "zhangsan@example.com"
}
```

### `POST /api/auth/login`

请求体：

```json
{
  "account": "zhangsan",
  "password": "123456"
}
```

### `GET /api/auth/me`

请求头：

```http
Authorization: Bearer <accessToken>
```

### `GET /api/auth/roles`

请求头：

```http
Authorization: Bearer <accessToken>
```

### `GET /api/auth/permissions`

请求头：

```http
Authorization: Bearer <accessToken>
```

## 相关 SQL

完整建表和初始化脚本见 [user-center.sql](D:/张艺学习/node-test/user-center.sql)。
