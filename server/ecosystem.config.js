module.exports = {
  apps : [{
    name: 'API',
    script: 'app.js',
    instances: 2,
    exec_mode : 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '../logs/pm2_err.log',
    out_file: '../logs/pm2_out.log',
    log_file: '../logs/pm2_combined.log',
    time: true
  }],
};
