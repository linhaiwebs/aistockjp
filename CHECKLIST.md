# Deployment Checklist

Use this checklist to ensure successful deployment of the restructured application.

## Pre-Deployment Checklist

### 1. Configuration Files

- [ ] **Cloaking.House Label** (`index.php` line 118)
  ```php
  'label' => 'YOUR_ACTUAL_LABEL_HERE',
  ```

- [ ] **Environment Variables** (`index/.env`)
  ```env
  SILICONFLOW_API_KEY=your_actual_api_key
  NODE_ENV=production
  API_PORT=3001
  CORS_ORIGIN=https://yourdomain.com
  TRUST_PROXY=true
  ```

- [ ] **Google Tracking** (Optional, in `index/.env`)
  ```env
  VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
  VITE_GOOGLE_ADS_ID=AW-XXXXXXXXXX
  ```

### 2. File Verification

- [ ] `index.php` exists in root
- [ ] `nginx.conf` exists in root
- [ ] `docker-compose.yml` exists in root
- [ ] `php.ini` exists in root
- [ ] `index/` directory contains React app
- [ ] `home/` directory contains static HTML
- [ ] `index/dist/` directory exists (after build)

### 3. Dependencies

- [ ] Docker installed (for Docker deployment)
  ```bash
  docker --version
  docker-compose --version
  ```

- [ ] OR Manual installation dependencies:
  - [ ] Nginx 1.20+
  - [ ] PHP 8.2+ with extensions (curl, mbstring, openssl, json)
  - [ ] Node.js 20+
  - [ ] npm or yarn

### 4. Build Process

- [ ] Install dependencies
  ```bash
  cd index && npm install
  ```

- [ ] Build React app
  ```bash
  cd index && npm run build
  ```

- [ ] Verify build output
  ```bash
  ls -la index/dist/
  # Should contain index.html and assets/
  ```

## Deployment Checklist

### Option A: Docker Deployment

- [ ] **Step 1**: Start services
  ```bash
  docker-compose up -d
  ```

- [ ] **Step 2**: Check status
  ```bash
  docker-compose ps
  # All services should show "Up"
  ```

- [ ] **Step 3**: View logs
  ```bash
  docker-compose logs -f
  ```

- [ ] **Step 4**: Verify services
  - [ ] Nginx: http://localhost/
  - [ ] React: http://localhost/index/
  - [ ] Static: http://localhost/home/
  - [ ] Health: http://localhost/index/health

### Option B: Manual Deployment

- [ ] **Step 1**: Configure Nginx
  ```bash
  sudo cp nginx.conf /etc/nginx/sites-available/stock-ai
  sudo ln -s /etc/nginx/sites-available/stock-ai /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl reload nginx
  ```

- [ ] **Step 2**: Start PHP-FPM
  ```bash
  sudo systemctl start php8.2-fpm
  sudo systemctl enable php8.2-fpm
  ```

- [ ] **Step 3**: Start Node.js
  ```bash
  cd index
  pm2 start npm --name "stock-ai" -- run start:prod
  pm2 save
  pm2 startup
  ```

- [ ] **Step 4**: Verify services
  ```bash
  sudo systemctl status nginx
  sudo systemctl status php8.2-fpm
  pm2 status
  ```

## Post-Deployment Checklist

### 1. Functionality Tests

- [ ] **Root Path Test**
  ```bash
  curl -I http://localhost/
  # Should return 200 or 302
  ```

- [ ] **React App Test**
  ```bash
  curl -I http://localhost/index/
  # Should return 200
  ```

- [ ] **Static Site Test**
  ```bash
  curl -I http://localhost/home/
  # Should return 200
  ```

- [ ] **API Test**
  ```bash
  curl http://localhost/index/api/stock/search?query=7203
  # Should return JSON with stock data
  ```

- [ ] **Health Check**
  ```bash
  curl http://localhost/index/health
  # Should return: {"status":"ok",...}
  ```

### 2. Manual Browser Tests

- [ ] Visit `http://yourdomain.com/` → PHP entry point loads
- [ ] Visit `http://yourdomain.com/index/` → React app loads
- [ ] Visit `http://yourdomain.com/home/` → Static site loads
- [ ] Test stock search functionality
- [ ] Test AI diagnosis generation
- [ ] Test LINE redirect button
- [ ] Test admin login at `/index/adsadmin`
- [ ] Test admin dashboard functionality

### 3. Analytics Verification

- [ ] Google Analytics tracking events fire
- [ ] Google Ads conversion tracking works
- [ ] Session tracking saves to database
- [ ] Event logging works correctly

### 4. Database Verification

- [ ] Database file exists: `index/server/data/database.db`
- [ ] Database is writable
- [ ] Automatic backups work
- [ ] Cache cleanup runs

### 5. Security Checks

- [ ] HTTPS configured (production)
- [ ] SSL certificate valid
- [ ] Security headers present
  ```bash
  curl -I http://localhost/index/ | grep -E 'X-Frame-Options|X-Content-Type-Options'
  ```
- [ ] CORS properly configured
- [ ] Admin access requires authentication

## Monitoring Checklist

### Daily Checks

- [ ] Server is responding
- [ ] No errors in logs
- [ ] Database size manageable
- [ ] API quota not exceeded

### Weekly Checks

- [ ] Review analytics data
- [ ] Check conversion rates
- [ ] Monitor cache hit rates
- [ ] Review security logs
- [ ] Check disk space

### Monthly Checks

- [ ] Update dependencies
- [ ] Review and rotate logs
- [ ] Database optimization
- [ ] Performance review
- [ ] Security audit

## Troubleshooting Checklist

### If PHP Not Working

- [ ] Check PHP version: `php -v`
- [ ] Check PHP extensions: `php -m`
- [ ] Check PHP-FPM status: `systemctl status php8.2-fpm`
- [ ] Check PHP logs: `tail -f /var/log/php8.2-fpm.log`
- [ ] Verify `allow_url_fopen = On`

### If Node.js Not Working

- [ ] Check if process running: `ps aux | grep node`
- [ ] Check port 3001: `netstat -tlnp | grep 3001`
- [ ] Check Node.js logs: `pm2 logs` or `journalctl -u stock-ai`
- [ ] Restart service: `pm2 restart stock-ai`

### If Nginx Returns 502

- [ ] Node.js is running
- [ ] Port 3001 is accessible
- [ ] Nginx can connect to Node.js
- [ ] Check Nginx error log: `tail -f /var/log/nginx/error.log`

### If React App Shows 404

- [ ] Build completed successfully
- [ ] `dist/` folder exists
- [ ] Assets have `/index/` prefix
- [ ] Nginx config correct
- [ ] Restart Nginx: `systemctl reload nginx`

### If CORS Errors

- [ ] `CORS_ORIGIN` set in `.env`
- [ ] Origin matches exactly (protocol + domain)
- [ ] Node.js restarted after config change
- [ ] Browser cache cleared

## Maintenance Checklist

### Backup Procedures

- [ ] Database backed up automatically (every 24h)
- [ ] Manual backup command known
  ```bash
  cp index/server/data/database.db backup-$(date +%Y%m%d).db
  ```
- [ ] Backup storage location configured
- [ ] Backup restoration tested

### Update Procedures

- [ ] **Update Dependencies**
  ```bash
  cd index
  npm update
  npm audit fix
  ```

- [ ] **Update Docker Images**
  ```bash
  docker-compose pull
  docker-compose up -d
  ```

- [ ] **Update System Packages**
  ```bash
  sudo apt update
  sudo apt upgrade
  ```

### Performance Optimization

- [ ] Enable Gzip in Nginx
- [ ] Configure CDN for static assets
- [ ] Optimize images
- [ ] Review and tune cache settings
- [ ] Monitor database query performance

## Production Readiness Checklist

### Security

- [x] Environment variables not committed
- [x] API keys secured
- [x] HTTPS enabled
- [x] Security headers configured
- [x] CORS properly configured
- [x] Admin routes protected
- [ ] Firewall configured
- [ ] Regular security updates scheduled

### Performance

- [x] Production build optimized
- [x] Static assets cached
- [x] Database indexes created
- [x] API responses cached
- [ ] CDN configured (optional)
- [ ] Load balancing configured (if needed)

### Monitoring

- [ ] Health check endpoint working
- [ ] Log aggregation configured
- [ ] Error tracking setup
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Alert notifications configured

### Documentation

- [x] README.md complete
- [x] DEPLOYMENT.md available
- [x] QUICKSTART.md available
- [x] ARCHITECTURE.md available
- [ ] Team trained on deployment
- [ ] Runbook created
- [ ] Incident response plan

## Sign-Off

When all items are checked, deployment is ready!

**Deployed by:** _______________
**Date:** _______________
**Environment:** [ ] Development [ ] Staging [ ] Production
**Version:** _______________

---

## Quick Reference Commands

### Docker
```bash
docker-compose up -d        # Start services
docker-compose down         # Stop services
docker-compose ps           # Check status
docker-compose logs -f      # View logs
docker-compose restart      # Restart all
```

### PM2
```bash
pm2 status                  # Check status
pm2 logs stock-ai          # View logs
pm2 restart stock-ai       # Restart app
pm2 stop stock-ai          # Stop app
pm2 start stock-ai         # Start app
```

### Nginx
```bash
sudo systemctl status nginx     # Check status
sudo systemctl reload nginx     # Reload config
sudo systemctl restart nginx    # Restart
sudo nginx -t                   # Test config
```

### Database
```bash
cd index/server/data
ls -lh database.db              # Check size
ls -la backups/                 # List backups
```

---

**Note**: Print this checklist and check items as you complete them during deployment.
