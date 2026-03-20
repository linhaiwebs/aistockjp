# PHP Container Fixes Summary

## Issues Fixed

### 1. Invalid Docker Extension Installation
**Problem:** Attempting to install 'curl' as a PHP extension
```dockerfile
docker-php-ext-install curl mbstring
```

**Solution:** Removed 'curl' from docker-php-ext-install (curl is a core PHP functionality, not an extension)
```dockerfile
docker-php-ext-install mbstring
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

## Files Modified

1. **Dockerfile.php**
   - Removed 'curl' from docker-php-ext-install (line 10)
   - Added log directory creation (line 14-15)
   - Updated health check command (line 36-37)

2. **docker-compose.yml**
   - Updated health check test from `php-fpm -t` to `pgrep php-fpm` (line 29)

3. **docker-compose.optimized.yml**
   - Updated health check test from `php-fpm -t` to `pgrep php-fpm` (line 36)

## Verification Steps

To verify the fixes work:

```bash
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
