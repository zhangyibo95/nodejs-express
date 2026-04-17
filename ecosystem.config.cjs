module.exports = {
  apps: [
    {
      name: 'express-api',
      script: './src/server.js',
      cwd: '/data/www/express-api/current',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 8090
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8090
      }
    }
  ]
}