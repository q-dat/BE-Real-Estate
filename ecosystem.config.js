module.exports = {
  apps: [
    {
      name: 'app1',
      script: 'dist/index.js',
      watch: true,
      ignore_watch: ['public/sitemap.xml', 'node_modules', 'logs'],
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy: {
    production: {
      user: 'your-user', // Tên user SSH trên server (ví dụ: ubuntu, root)
      host: 'your-server-ip', // Thay bằng IP server của bạn
      ref: 'origin/main', // Nhánh Git sẽ pull code (ví dụ: main hoặc master)
      repo: 'git@github.com:your-repo.git', // Địa chỉ repo Git (SSH)
      path: '/var/www/app', // Thư mục deploy trên server

      'post-deploy': 'npm install && npx tsc && pm2 reload ecosystem.config.js --env production'
      // Lệnh chạy sau khi code được pull:
      // - `npm install` => Cài dependencies
      // - `npx tsc` => Compile TypeScript thành JavaScript
      // - `pm2 reload` => Restart ứng dụng bằng PM2 với config production
    }
  }
}
