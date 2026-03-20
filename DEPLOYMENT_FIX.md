# 502 Error Fix - Deployment Instructions

## Changes Made

The 502 error has been fixed by addressing Docker networking issues and build errors. Here are all the changes:

### 1. Node.js Server Configuration (`index/server/index.js`)
- Changed server binding from `localhost` to `0.0.0.0`
- This allows the server to accept connections from other containers

**Before:**
```javascript
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
```

**After:**
```javascript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
```

### 2. Nginx Configuration (`nginx.conf`)
- Changed proxy_pass from `http://localhost:3001` to `http://stock-ai-nodejs:3001`
- This uses Docker's internal DNS to route traffic to the correct container

**Before:**
```nginx
proxy_pass http://localhost:3001;
```

**After:**
```nginx
proxy_pass http://stock-ai-nodejs:3001;
```

### 3. Docker Compose (`docker-compose.yml`)
- Added health check for Node.js container
- Added `wget` installation to the Node.js container for health checks

### 4. Fixed Lucide React Import Issues
Fixed incompatible icon imports in multiple files:
- `AdminLogin.tsx` - Fixed `CircleAlert` import
- `SessionsTab.tsx` - Fixed `CircleCheck` and `ListFilter` imports
- `CacheManagementTab.tsx` - Fixed `CircleAlert` import
- `GoogleTrackingTab.tsx` - Fixed `CircleCheck`, `CircleAlert`, and `ChartBar` imports
- `AdminDashboard.tsx` - Fixed `ChartBar`, `CircleCheck`, and `Circle` imports
- `RedirectLinksTab.tsx` - Fixed `CreditCard` and `ChartBar` imports
- `LineRedirectsTab.tsx` - Fixed `CreditCard` and `ChartBar` imports

### 5. Build Verification
- ✅ Project now builds successfully
- ✅ All dependencies installed
- ✅ Frontend compiled without errors

## Deployment Steps

Follow these steps to apply the fixes:

### Step 1: Stop Current Containers
```bash
docker compose down
# or
docker-compose down
```

### Step 2: Restart Containers
```bash
docker compose up -d --build
# or
docker-compose up -d --build
```

The `--build` flag ensures the containers rebuild with the new changes.

### Step 3: Verify Container Status
```bash
# Check if all containers are running
docker ps

# Check logs for any errors
docker logs -f stock-ai-nginx
docker logs -f stock-ai-nodejs
docker logs -f stock-ai-php
```

### Step 4: Test the Application

1. **Health Check Endpoint:**
   ```bash
   curl http://iswstock.com/index/health
   ```
   Should return: `{"status":"ok","timestamp":"...","environment":"production"}`

2. **API Endpoint:**
   ```bash
   curl http://iswstock.com/index/api/stock
   ```

3. **Frontend:**
   Open browser to: `http://iswstock.com/index`

## Troubleshooting

### If you still see 502 errors:

1. **Check Node.js container logs:**
   ```bash
   docker logs -f stock-ai-nodejs
   ```
   Look for: `🚀 Server running on http://0.0.0.0:3001`

2. **Check Nginx logs:**
   ```bash
   docker logs -f stock-ai-nginx
   ```

3. **Verify network connectivity between containers:**
   ```bash
   docker exec stock-ai-nginx ping -c 3 stock-ai-nodejs
   ```

4. **Check if Node.js is listening on correct port:**
   ```bash
   docker exec stock-ai-nodejs wget -qO- http://localhost:3001/index/health
   ```

5. **Test Nginx to Node.js connection:**
   ```bash
   docker exec stock-ai-nginx curl -v http://stock-ai-nodejs:3001/index/health
   ```

### If Node.js container is not starting:

1. **Check the logs:**
   ```bash
   docker logs stock-ai-nodejs
   ```

2. **Rebuild the container:**
   ```bash
   docker compose up -d --force-recreate --build nodejs
   ```

### If you see build errors:

1. **Clear node_modules and rebuild:**
   ```bash
   cd index
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## What Was Wrong?

The issues included:

1. **Node.js was listening on `localhost` only**: This meant it could only accept connections from within its own container, not from the Nginx container.

2. **Nginx was trying to connect to `localhost:3001`**: In the Docker network context, `localhost` refers to the Nginx container itself, not the Node.js container. The correct way is to use the container name `stock-ai-nodejs`.

3. **Incompatible lucide-react icon imports**: Several components were using renamed imports (like `CircleAlert as AlertCircle`) that don't exist in the installed version of lucide-react.

## External Nginx Configuration

If you have an external Nginx (on the host machine) proxying to `stock-ai-nginx` container, ensure it's configured correctly:

```nginx
server {
    listen 80;
    server_name iswstock.com;

    location / {
        proxy_pass http://localhost:80;  # Assuming port 80 is mapped
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then reload your external Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Expected Result

After applying these fixes, you should see:

- ✅ No more 502 errors
- ✅ Project builds successfully
- ✅ Frontend loads correctly at `http://iswstock.com/index`
- ✅ API requests work properly
- ✅ Health check returns success status
- ✅ All containers running and healthy
