const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const env = {
  port: toNumber(process.env.PORT, 8090),
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: toNumber(process.env.DB_PORT, 3306),
  dbUser: process.env.DB_USER || 'admin',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'mydb',
  dbConnectionLimit: toNumber(process.env.DB_CONNECTION_LIMIT, 10),
  jwtSecret: process.env.JWT_SECRET || 'change-this-jwt-secret-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h'
};

export { env };
