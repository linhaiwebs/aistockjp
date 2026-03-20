# Docker Deployment Fixes

## Problems Identified and Fixed

### 1. PHP Container - Missing oniguruma Library
**Problem:** mbstring extension compilation failed with error:
```
Package 'oniguruma', required by 'virtual:world', not found
```

**Solution:** Added `libonig-dev` package to apt-get install command.

### 2. PHP Container - Invalid Extension Loading
**Problem:** PHP warnings about openssl and json extensions:
```
PHP Warning: PHP Startup: Unable to load dynamic library 'openssl'
PHP Warning: PHP Startup: Unable to load dynamic library 'json'
```

**Solution:** Removed openssl and json from php.ini as they are core extensions in PHP 8.2.

### 3. Node.js Container - Vite Not Found
**Problem:** Build failed with:
```
sh: vite: not found
```

**Cause:** In NODE_ENV=production, `npm install` skips devDependencies by default, but vite is a devDependency.

**Solution:** Changed to `npm install --include=dev` to install all dependencies including build tools.

### 4. PHP-FPM Configuration
**Problem:** PHP-FPM configuration was being appended without proper section header.

**Solution:** Created proper PHP-FPM pool configuration with [www] section header and proper settings.

### 5. Container Startup Order
**Problem:** Node.js container started before PHP was ready.

**Solution:** Added `condition: service_healthy` to depends_on configuration.

## Deployment Options

### Option 1: Use Fixed docker-compose.yml (Current File)
The main docker-compose.yml has been updated with all fixes:

```bash
# Stop existing containers
docker-compose down -v

# Rebuild and start
docker-compose up --build -d

# Check logs
docker-compose logs -f
```

### Option 2: Use Optimized Dockerfiles
For better build caching and cleaner separation:

```bash
# Use the optimized configuration
docker-compose -f docker-compose.optimized.yml up --build -d

# Check logs
docker-compose -f docker-compose.optimized.yml logs -f
```

## Verification Steps

1. **Check PHP-FPM is running:**
   ```bash
   docker exec stock-ai-php php-fpm -t
   ```

2. **Check PHP extensions:**
   ```bash
   docker exec stock-ai-php php -m | grep -E "curl|mbstring"
   ```

3. **Check Node.js build:**
   ```bash
   docker exec stock-ai-nodejs ls -la /app/dist
   ```

4. **Check all services are healthy:**
   ```bash
   docker-compose ps
   ```

5. **Test the application:**
   ```bash
   curl http://localhost
   ```

## Key Changes Summary

### docker-compose.yml
- Added `libonig-dev` to PHP dependencies
- Fixed PHP-FPM configuration with proper section header
- Changed npm install to `npm install --include=dev`
- Added node_modules volume for caching
- Added health check dependencies

### php.ini
- Removed `extension=openssl` (core extension)
- Removed `extension=json` (core extension)
- Kept only `extension=curl` and `extension=mbstring`

### New Files Created
- `Dockerfile.php` - Optimized PHP container build
- `Dockerfile.nodejs` - Optimized Node.js container build
- `docker-compose.optimized.yml` - Production-ready compose file

## Troubleshooting

### If PHP container still fails:
```bash
docker logs stock-ai-php
```

### If Node.js build fails:
```bash
docker logs stock-ai-nodejs
docker exec stock-ai-nodejs npm list vite
```

### Clean rebuild:
```bash
docker-compose down -v
docker system prune -af
docker-compose up --build -d
```

## Production Recommendations

1. Use the optimized Dockerfiles for production
2. Build images separately and push to registry
3. Use specific image tags instead of latest
4. Configure proper resource limits
5. Set up monitoring and log aggregation
6. Use secrets management for sensitive data
7. Implement proper backup strategy for database files
