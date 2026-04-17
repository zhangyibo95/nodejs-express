# my-first-pro

一个基于 Express 和 MySQL 的简单后端服务示例，现已支持 JWT 鉴权。

## 安装依赖

```bash
npm install
```

## 配置环境变量

参考 `.env.example` 配置以下变量：
- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_CONNECTION_LIMIT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

如果你使用 Node.js 20+，可以这样启动：

```bash
node --env-file=.env src/server.js
```

或者先在终端里设置环境变量，再执行：

```bash
npm start
```

## 启动项目

```bash
npm start
```

默认端口为 `8090`。

## 鉴权接口

### `POST /api/auth/register`

注册并直接返回 JWT。请求体示例：

```json
{
  "name": "Alice",
  "password": "123456",
  "description": "Example user"
}
```

### `POST /api/auth/login`

登录并返回 JWT。请求体示例：

```json
{
  "name": "Alice",
  "password": "123456"
}
```

### `GET /api/auth/me`

获取当前登录用户信息，请在请求头中携带：

```http
Authorization: Bearer <token>
```

## 业务接口

### `GET /`

返回服务存活信息。

### `GET /api/test-db`

测试数据库连接。

### `GET /api/user`

查询用户列表，需要 JWT。

### `POST /api/user`

新增用户，需要 JWT。请求体示例：

```json
{
  "name": "Bob",
  "description": "New user"
}
```

### `DELETE /api/user/:name`

按用户名删除用户，需要 JWT。

## 目录结构

```text
src/
  config/
  controllers/
  middleware/
  routes/
  utils/
  app.js
  server.js
```
