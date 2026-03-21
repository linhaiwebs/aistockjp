# PHP Container Fixes Summary

## Issues Fixed (Latest Update - v2)

### 1. Invalid Docker Extension Installation
**Problem:** Attempting to install 'curl' as a PHP extension
```dockerfile
docker-php-ext-install curl mbstring
```

**Solution:** Removed 'curl' from docker-php-ext-install and explicitly enabled mbstring
```dockerfile
docker-php-ext-install mbstring && docker-php-ext-enable mbstring
```

### 2. Missing Log Directory
**Problem:** php.ini references `/var/log/php/error.log` but directory doesn't exist
**Solution:** Added command to create log directory in Dockerfile.php:
```dockerfile
RUN mkdir -p /var/log/php && chmod 777 /var/log/php
```

### 3. Ineffective Health Check
**Problem:** Health check used `php-fpm -t` which only tests syntax, not if the process is running
**Solution:** Changed to use `pgrep php-fpm` in both Dockerfile.php and docker-compose files:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD pgrep php-fpm || exit 1
```

### 4. PHP-FPM Configuration Overwrite (NEW)
**Problem:** Creating a new config file with `echo` was overwriting the default pool configuration
**Solution:** Use `sed` to modify existing www.conf instead of creating new config:
```dockerfile
RUN sed -i 's/listen = .*/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/;listen.owner = .*/listen.owner = www-data/' /usr/local/etc/php-fpm.d/www.conf && \
    # ... other sed commands
    php-fpm -t
```

### 5. PHP-FPM Not Running in Foreground (NEW)
**Problem:** CMD was using `php-fpm` without foreground flag, causing container to exit
**Solution:** Changed CMD to run PHP-FPM in foreground mode:
```dockerfile
CMD ["php-fpm", "-F"]
```

## Files Modified

1. **Dockerfile.php** (Major Update)
   - Removed 'curl' from docker-php-ext-install (line 10)
   - Added explicit docker-php-ext-enable for mbstring (line 11)
   - Added log directory creation (line 15-16)
   - Changed from creating new config to modifying existing www.conf (line 22-31)
   - Added php-fpm configuration test at build time (line 31)
   - Updated CMD to use foreground mode (line 41)
   - Updated health check command (line 38-39)

2. **docker-compose.yml**
   - Updated health check test from `php-fpm -t` to `pgrep php-fpm` (line 29)

3. **docker-compose.optimized.yml**
   - Updated health check test from `php-fpm -t` to `pgrep php-fpm` (line 36)

4. **New Files Created**
   - `diagnose-php.sh` - Comprehensive PHP container diagnostic tool
   - `test-php-dockerfile.sh` - Dockerfile build test script

## Verification Steps

To verify the fixes work:

```bash
# Method 1: Use diagnostic script (Recommended)
chmod +x diagnose-php.sh
./diagnose-php.sh

# Method 2: Manual verification
# Rebuild the PHP container
docker compose build php --no-cache

# Start all services
docker compose up -d

# Check PHP container status
docker compose ps

# View PHP container logs
docker compose logs php

# Test PHP-FPM is running
docker compose exec php pgrep php-fpm

# Test PHP-FPM configuration
docker compose exec php php-fpm -t

# Check PHP extensions
docker compose exec php php -m | grep -E "(mbstring|openssl|json|filter)"

# Test network connectivity
docker compose exec nginx nc -zv stock-ai-php 9000
```

## Expected Behavior

- PHP container should start successfully
- Health check should pass
- PHP-FPM should be listening on port 9000
- Error logs should be written to /var/log/php/error.log

## Additional Notes

- curl functionality is available through system libraries (libcurl4-openssl-dev)
- The curl PHP extension doesn't exist; curl functions are built into PHP core
- mbstring extension is properly installed for multibyte string handling
- All required PHP extensions for index.php are satisfied:
  - curl (core)
  - mbstring (installed)
  - openssl (core)
  - json (core)
  - filter (core)
