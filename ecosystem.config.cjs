module.exports = {
  apps: [
    {
      name: 'express-api',
      script: './app.js',
      cwd: '/data/www/express-api/current',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}