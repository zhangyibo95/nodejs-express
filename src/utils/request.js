/**
 * 获取客户端 IP。
 * 如果项目部署在 Nginx、负载均衡之后，优先使用 `x-forwarded-for`。
 *
 * @param {import('express').Request} req 请求对象
 * @returns {string|null} 客户端 IP
 */
const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || null;
};

export { getClientIp };
