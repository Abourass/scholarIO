'use strict';

require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'scholar',
      script: './config/server.js',
      instances: -3,
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
        DEV: 'scholar:server',
      },
      env_production: {
        NODE_ENV: 'production',
        DEV: 'scholar:server',
      },
    },
  ],
};
