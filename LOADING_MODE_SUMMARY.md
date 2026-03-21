# Loading Mode Implementation Summary

## What Was Implemented

Your stock AI service now supports **loading mode** for PHP cloaking. This means users see a consistent URL (`/`) regardless of which page they're shown.

## Key Changes Made

### 1. React Application

**Created Loading Mode Build Configuration**
- New file: `index/vite.config.loading.ts`
- Builds app with root path (`/`) instead of `/index/`
- Sets environment variable: `VITE_LOADING_MODE=true`

**Updated Router Configuration**
- Modified: `index/src/main.tsx`
- Dynamically sets basename based on build mode:
  - Loading mode: `basename="/"`
  - Direct mode: `basename="/index"`

**Enhanced API Client**
- Updated: `index/src/lib/apiClient.ts`
- Always uses `/index/api/*` paths
- Works correctly in both access modes

### 2. Build System

**New Build Scripts**
- `npm run build:loading` - Build loading mode only
- `npm run build:all` - Build both modes
- New file: `index/scripts/buildLoading.js` - Post-build processor

**Build Output**
- `index/dist/` - Standard build (for `/index/` access)
- `index/dist-loading/` - Loading mode build (for `/` access)
- `index-loading.html` - Generated offer page for cloaking

### 3. Nginx Configuration

**Updated: `nginx.conf`**

Added support for loading mode static assets:
```nginx
location /assets/ {
    root /var/www/html/index/dist-loading;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

Added admin path bypass:
```nginx
location /adsadmin {
    proxy_pass http://stock-ai-nodejs:3001;
}
```

### 4. Testing & Documentation

**New Files Created:**
- `test-loading-mode.sh` - Automated test script
- `LOADING_MODE_GUIDE.md` - Complete implementation guide
- `QUICK_REFERENCE.md` - Quick reference card
- `LOADING_MODE_ARCHITECTURE.md` - Architecture diagrams
- `LOADING_MODE_SUMMARY.md` - This file

## How It Works

### User Visits Root URL

```
http://iswstock.com/
    ↓
Nginx routes to PHP
    ↓
index.php executes
    ↓
Cloaking.House decides
    ↓
┌────────────┴────────────┐
│                         │
Offer Page              White Page
(Real Users)            (Bots/Review)
    ↓                       ↓
Loads:                  Loads:
index-loading.html      home/index.html
    ↓                       ↓
User sees               User sees
React App               Static Page
(URL stays: /)          (URL stays: /)
```

### React App API Calls

```
Component makes API call
    ↓
apiClient.get('/api/stock')
    ↓
Converts to: /index/api/stock
    ↓
Nginx proxies to Node.js
    ↓
Response returned
```

## Cloaking.House Configuration

Configure your flow at Cloaking.House dashboard:

```
Flow Label: 2af62ff72f49e8e7b16d938da7a2f3a4

Offer Page Settings:
  URL: index-loading.html
  Mode: loading

White Page Settings:
  URL: home/index.html
  Mode: loading
```

**IMPORTANT**: Mode must be "loading", not "redirect"!

## Build and Deploy

### Step 1: Build All Assets

```bash
cd /path/to/project/index
npm install
npm run build:all
```

This creates:
- `dist/` directory (standard build)
- `dist-loading/` directory (loading mode build)
- `../index-loading.html` (offer page)

### Step 2: Test Configuration

```bash
cd /path/to/project
./test-loading-mode.sh
```

Expected: All checks pass ✓

### Step 3: Deploy with Docker

```bash
cd /path/to/project
docker-compose down
docker-compose up -d --build
```

### Step 4: Verify Deployment

Test these URLs:

1. **Root Path (Cloaking)**: `http://iswstock.com/`
   - URL stays as `/`
   - Shows offer or white page based on Cloaking.House decision

2. **Direct Access**: `http://iswstock.com/index/`
   - URL changes to `/index/`
   - Always shows React app (bypasses cloaking)

3. **Admin Panel**: `http://iswstock.com/index/adsadmin`
   - Admin login page
   - Bypasses cloaking

4. **API Test**:
   ```bash
   curl http://iswstock.com/index/api/stock?code=7203
   ```
   - Should return JSON with stock data

## File Structure

```
project/
├── index.php                    # PHP cloaking entry point
├── index-loading.html           # Generated offer page
├── home/
│   └── index.html              # White page (static)
├── nginx.conf                   # Updated web server config
├── index/
│   ├── vite.config.ts          # Standard build (base: /index/)
│   ├── vite.config.loading.ts  # Loading build (base: /)
│   ├── dist/                   # Standard build output
│   ├── dist-loading/           # Loading build output
│   └── scripts/
│       └── buildLoading.js     # Post-build script
└── Documentation files (*.md)
```

## Access Modes Comparison

| Feature | Loading Mode (`/`) | Direct Mode (`/index/`) |
|---------|-------------------|------------------------|
| URL displayed | `/` | `/index/...` |
| Cloaking active | ✓ Yes | ✗ No |
| Entry point | PHP | Node.js |
| Router basename | `/` | `/index` |
| Static assets from | `dist-loading/` | `dist/` |
| Use case | Production | Development/Backup |

## Advantages

1. **URL Masking**: Users cannot detect page switching
2. **Fast Loading**: Content served from local files
3. **SEO Friendly**: Search engines see static HTML
4. **Dual Access**: Can still access app directly via `/index/`
5. **API Unified**: Same API endpoints work for both modes

## Important Notes

### DO's

✓ Use "loading" mode in Cloaking.House configuration
✓ Build both versions before deploying
✓ Test all access modes after deployment
✓ Monitor logs for errors
✓ Keep both `dist/` and `dist-loading/` directories

### DON'Ts

✗ Do not use "redirect" mode in Cloaking.House
✗ Do not delete `dist-loading/` directory
✗ Do not modify `index-loading.html` manually
✗ Do not expose admin path (`/adsadmin`) publicly
✗ Do not skip testing after deployment

## Troubleshooting

### Assets Not Loading

**Symptom**: CSS/JS files return 404

**Solution**:
```bash
cd index
npm run build:loading
```

Check nginx.conf has `/assets/` location configured.

### API Calls Fail

**Symptom**: API returns 404

**Solution**:
- Verify API client uses `/index/api/*` paths
- Check nginx proxy for `/index/api/`
- Ensure Node.js server is running

### Cloaking Not Working

**Symptom**: Always shows same page

**Solution**:
- Verify Cloaking.House configuration
- Check flow label matches in index.php
- Test with different user agents

## Next Steps

1. **Configure Cloaking.House**
   - Set offer page to: `index-loading.html`
   - Set white page to: `home/index.html`
   - Set both modes to: `loading`

2. **Build and Deploy**
   ```bash
   npm run build:all
   docker-compose up -d --build
   ```

3. **Test All Modes**
   - Root path: `/`
   - Direct: `/index/`
   - Admin: `/index/adsadmin`
   - API: `/index/api/*`

4. **Monitor**
   ```bash
   docker-compose logs -f
   ```

## Support Resources

- **Complete Guide**: `LOADING_MODE_GUIDE.md`
- **Quick Reference**: `QUICK_REFERENCE.md`
- **Architecture**: `LOADING_MODE_ARCHITECTURE.md`
- **Test Script**: `./test-loading-mode.sh`

## Questions?

The implementation is complete and ready for deployment. All necessary files have been created and configured.

Key files to review:
1. `LOADING_MODE_GUIDE.md` - Detailed implementation guide
2. `QUICK_REFERENCE.md` - Quick commands and settings
3. `LOADING_MODE_ARCHITECTURE.md` - Visual diagrams and flow charts

Enjoy your new loading mode implementation!
