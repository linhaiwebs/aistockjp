# Deployment Guide - AI Stock Diagnosis Service

## Architecture Overview

This project uses a PHP-based traffic routing system with three main components:

```
/ (root)          → index.php (Cloaking.House traffic filter)
/index/*          → React App + Node.js API (Stock diagnosis service)
/home/*           → Static HTML site (Alternative landing page)
```

## Directory Structure

```
project/
├── index.php              # PHP entry point (Cloaking.House script)
├── nginx.conf             # Nginx configuration
├── docker-compose.yml     # Docker deployment config
├── php.ini                # PHP configuration
├── index/                 # React app subdirectory
│   ├── src/              # React source code
│   ├── server/           # Node.js Express backend
│   ├── package.json      # Node.js dependencies
│   └── vite.config.ts    # Vite config with /index base
└── home/                  # Static HTML site
    ├── index.html        # Landing page
    └── styles.css        # Styles
```

## Prerequisites

- Docker and Docker Compose
- OR Manual installation:
  - Nginx 1.20+
  - PHP 8.2+ with extensions: curl, mbstring, openssl, json, filter
  - Node.js 20+
  - npm or yarn

## Environment Configuration

### 1. Configure Environment Variables

Create `.env` files in the `/index` directory:

```bash
cd index
cp .env.example .env
```

Edit `.env` with your configuration:

```env
SILICONFLOW_API_KEY=your_actual_api_key_here
NODE_ENV=production
API_PORT=3001
CORS_ORIGIN=http://yourdomain.com
TRUST_PROXY=true
```

### 2. Configure Cloaking.House

Edit `index.php` and set your Cloaking.House label (line 118):

```php
'label' => '2af62ff72f49e8e7b16d938da7a2f3a4',  // Replace with your label
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

1. Build and start all services:

```bash
docker-compose up -d
```

2. Check service status:

```bash
docker-compose ps
```

3. View logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nginx
docker-compose logs -f nodejs
docker-compose logs -f php
```

4. Stop services:

```bash
docker-compose down
```

### Option 2: Manual Deployment

#### Step 1: Install PHP and Extensions

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install -y php8.2-fpm php8.2-curl php8.2-mbstring php8.2-cli
sudo systemctl enable php8.2-fpm
sudo systemctl start php8.2-fpm
```

**CentOS/RHEL:**

```bash
sudo yum install -y php82 php82-php-fpm php82-php-curl php82-php-mbstring
sudo systemctl enable php82-php-fpm
sudo systemctl start php82-php-fpm
```

#### Step 2: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Step 3: Build React Application

```bash
cd index
npm install
npm run build
```

#### Step 4: Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/stock-ai
sudo ln -s /etc/nginx/sites-available/stock-ai /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### Step 5: Start Node.js Backend

Using PM2 (recommended):

```bash
# Install PM2
sudo npm install -g pm2

# Start application
cd index
pm2 start npm --name "stock-ai-api" -- run start:prod

# Save PM2 configuration
pm2 save
pm2 startup
```

Or using systemd:

Create `/etc/systemd/system/stock-ai.service`:

```ini
[Unit]
Description=Stock AI Node.js Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/html/index
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable stock-ai
sudo systemctl start stock-ai
```

## Traffic Routing Configuration

The `index.php` script routes traffic based on Cloaking.House rules:

- **Offer Page Mode**: Users see the React application at `/index`
- **White Page Mode**: Users see the static HTML at `/home`

Configure routing rules in your Cloaking.House dashboard.

## Verification

### Test PHP Entry Point

```bash
curl http://localhost/
```

### Test React App

```bash
curl http://localhost/index/
```

### Test Static Site

```bash
curl http://localhost/home/
```

### Test Node.js API

```bash
curl http://localhost/index/api/stock/search?query=7203
```

## Monitoring

### View Application Logs

**Docker:**

```bash
docker-compose logs -f nodejs
```

**PM2:**

```bash
pm2 logs stock-ai-api
```

**Systemd:**

```bash
sudo journalctl -u stock-ai -f
```

### Check Service Health

```bash
# Node.js health check
curl http://localhost:3001/index/health

# Nginx status
sudo systemctl status nginx

# PHP-FPM status
sudo systemctl status php8.2-fpm
```

## Troubleshooting

### Issue: PHP index.php returns errors

**Solution:**

1. Check PHP extensions:

```bash
php -m | grep -E "curl|mbstring|openssl|json"
```

2. Verify php.ini settings:

```bash
php -i | grep allow_url_fopen
```

### Issue: Node.js API returns 502

**Solution:**

1. Check if Node.js is running:

```bash
# Docker
docker-compose ps nodejs

# PM2
pm2 status

# Systemd
sudo systemctl status stock-ai
```

2. Check port 3001 is listening:

```bash
sudo netstat -tlnp | grep 3001
```

### Issue: React app shows 404

**Solution:**

1. Verify build was successful:

```bash
cd index
ls -la dist/
```

2. Check Nginx configuration:

```bash
sudo nginx -t
```

3. Verify base path in vite.config.ts:

```typescript
base: '/index/',
```

### Issue: CORS errors

**Solution:**

Update CORS_ORIGIN in `/index/.env`:

```env
CORS_ORIGIN=http://yourdomain.com,https://yourdomain.com
```

Then restart Node.js service.

## Security Considerations

1. **HTTPS**: Configure SSL certificates for production
2. **Environment Variables**: Never commit `.env` files
3. **API Keys**: Keep SiliconFlow API key secure
4. **Database**: Backup SQLite database regularly
5. **Updates**: Keep PHP, Node.js, and Nginx updated

## Performance Optimization

1. **Enable caching**: Nginx static file caching is configured
2. **Gzip compression**: Add to Nginx configuration
3. **CDN**: Consider using Cloudflare or similar
4. **Database**: Monitor SQLite database size
5. **PM2 cluster mode**: Scale Node.js with multiple processes

## Backup

### Database Backup

```bash
# Automatic backups are created in index/server/data/backups/
cd index/server/data/backups
ls -lh
```

### Manual Backup

```bash
# Backup entire application
tar -czf backup-$(date +%Y%m%d).tar.gz index/ home/ index.php nginx.conf
```

## Support

For issues related to:
- Cloaking.House: Contact Cloaking.House support
- Application bugs: Check application logs
- Server issues: Check Nginx and PHP-FPM logs
