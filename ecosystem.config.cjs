/**
 * PM2 ecosystem file for production.
 * Usage:
 *   pm2 start ecosystem.config.cjs
 *   pm2 start ecosystem.config.cjs --env production
 */
module.exports = {
  apps: [
    {
      name: 'hrms-lite-api',
      script: 'dist/index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
