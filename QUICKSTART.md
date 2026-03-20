# Quick Start Guide

## ✅ Deployment Issues Fixed

All Docker deployment errors have been resolved:
- ✅ PHP mbstring extension compiles successfully (oniguruma library added)
- ✅ No PHP extension warnings (removed core extensions from php.ini)
- ✅ Node.js build works correctly (npm install --include=dev)
- ✅ Proper container startup order (health check dependencies)
- ✅ Optimized configuration with caching

See `FIXES_APPLIED.md` for detailed technical information.

## 🚀 Deploy in 3 Simple Commands

### Quick Deployment
```bash
./start.sh
```

Or test configuration first:
```bash
./test-deployment.sh  # Validate fixes
./start.sh            # Deploy
```

---

## 🚀 Manual Setup (5 Minutes)

### Step 1: Configure Environment

```bash
cd index
cp .env.example .env
```

Edit `.env` and add your API key:

```env
SILICONFLOW_API_KEY=your_actual_api_key_here
NODE_ENV=production
API_PORT=3001
```

### Step 2: Configure Cloaking.House

Edit `index.php` (line 118) and replace with your Cloaking.House label:

```php
'label' => 'your_label_here',
```

### Step 3: Deploy with Docker

```bash
docker-compose up -d
```

That's it! Your application is now running:

- 🌐 Main entry: http://localhost/
- 📱 React app: http://localhost/index/
- 📄 Static site: http://localhost/home/

### Step 4: Verify Deployment

```bash
# Check all services are running
docker-compose ps

# View logs
docker-compose logs -f

# Test endpoints
curl http://localhost/
curl http://localhost/index/
curl http://localhost/home/
```

## 🛑 Stop Services

```bash
docker-compose down
```

## 📊 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nginx
docker-compose logs -f nodejs
docker-compose logs -f php
```

## 🔧 Troubleshooting

### Issue: Services won't start

**Check:**
1. Docker is running: `docker ps`
2. Ports 80 and 3001 are free: `sudo netstat -tlnp | grep -E '(80|3001)'`
3. Configuration files exist: `ls -l nginx.conf index.php`

### Issue: React app returns 404

**Solution:**
```bash
cd index
npm run build
docker-compose restart
```

### Issue: PHP errors

**Check PHP logs:**
```bash
docker-compose logs php
```

**Common fix:**
```bash
# Restart PHP service
docker-compose restart php
```

## 📚 Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment options
- Read [README.md](./README.md) for full documentation
- Configure Google Analytics in `/index/.env`
- Set up LINE redirect URLs in admin dashboard
- Create admin user: `cd index && npm run create-admin`

## 🎯 Access Admin Dashboard

1. Create admin user:
   ```bash
   cd index
   npm run create-admin
   ```

2. Access dashboard:
   ```
   http://localhost/index/adsadmin
   ```

3. Login with created credentials

## 🔒 Production Checklist

Before deploying to production:

- [ ] Update Cloaking.House label in `index.php`
- [ ] Set actual API keys in `/index/.env`
- [ ] Configure SSL certificate
- [ ] Update CORS_ORIGIN in `/index/.env`
- [ ] Set secure passwords
- [ ] Enable HTTPS in Nginx config
- [ ] Backup database regularly
- [ ] Monitor logs

## 💡 Development Mode

For local development without Docker:

```bash
# Terminal 1: Start backend
cd index
npm run server

# Terminal 2: Start frontend
cd index
npm run dev
```

Access at: http://localhost:5173/index/

---

Need help? Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
