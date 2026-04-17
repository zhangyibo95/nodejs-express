// 首先加载环境变量
import './config/loadEnv.js';

// 然后导入其他模块
import { app } from './app.js';
import { env } from './config/env.js';
import { testDatabaseConnection } from './config/database.js';

const startServer = async () => {
  await testDatabaseConnection();

  app.listen(env.port, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${env.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
