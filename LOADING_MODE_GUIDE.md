# Loading Mode Configuration Guide

This guide explains how to use PHP cloaking with **loading mode** for your stock AI service.

## What is Loading Mode?

Loading mode means that `index.php` directly loads and outputs the HTML content instead of redirecting users. This keeps the URL in the browser address bar as `/` regardless of which page is shown.

## Architecture Overview

```
User visits http://iswstock.com/
    ↓
[Nginx → PHP-FPM]
    ↓
[index.php executes]
    ↓
[Cloaking.House API determines user type]
    ↓
┌─────────────┴─────────────┐
↓                           ↓
[Offer Page]              [White Page]
↓                           ↓
Load index-loading.html    Load home/index.html
↓                           ↓
Output to browser          Output to browser
↓                           ↓
User sees content          User sees content
URL stays: /               URL stays: /
```

## Key Features

- **URL Masking**: User always sees the root URL (`/`)
- **Fast Loading**: Content served from local files
- **Dual Access**: Direct access via `/index/` still works
- **API Support**: API calls work from both paths

## File Structure

```
project/
├── index.php                    # PHP cloaking entry point
├── index-loading.html           # Offer page (React app, root path build)
├── home/
│   └── index.html              # White page (static HTML)
├── index/
│   ├── dist/                   # Standard build (for /index/ access)
│   └── dist-loading/           # Loading mode build (for / access)
│       └── assets/             # JS/CSS for loading mode
└── nginx.conf                  # Nginx configuration
```

## Build Process

### 1. Build for Loading Mode

```bash
cd index
npm run build:loading
```

This command:
- Builds React app with root path (`/`) using `vite.config.loading.ts`
- Generates `dist-loading/` directory
- Creates `index-loading.html` in project root
- Configures basename to `/` for React Router

### 2. Build for Direct Access (Optional)

```bash
cd index
npm run build
```

This builds the standard version for direct access at `/index/`.

### 3. Build Both Versions

```bash
cd index
npm run build:all
```

## Cloaking.House Configuration

Log in to your Cloaking.House dashboard and configure:

### Flow Settings
- **Flow Label**: `2af62ff72f49e8e7b16d938da7a2f3a4`

### Offer Page (Real Traffic)
- **URL**: `index-loading.html`
- **Mode**: `loading` ⚠️ Important!

### White Page (Bot/Review Traffic)
- **URL**: `home/index.html`
- **Mode**: `loading` ⚠️ Important!

## Deployment Steps

### Step 1: Build All Assets

```bash
cd /path/to/project
cd index && npm run build:all
```

### Step 2: Verify Files

```bash
./test-loading-mode.sh
```

Expected output: All checks should pass ✓

### Step 3: Deploy with Docker

```bash
docker-compose down
docker-compose up -d --build
```

### Step 4: Verify Deployment

Check that all services are running:

```bash
docker-compose ps
```

Expected output:
```
stock-ai-nginx    running   0.0.0.0:80->80/tcp
stock-ai-php      running   9000/tcp
stock-ai-nodejs   running   3001/tcp
```

## Testing

### 1. Root Path Test (Cloaking)

Visit: `http://iswstock.com/`

Expected behavior:
- URL stays as `/`
- Content determined by Cloaking.House
- Offer page for real users
- White page for bots

### 2. Direct Access Test

Visit: `http://iswstock.com/index/`

Expected behavior:
- URL changes to `/index/`
- React app loads normally
- Bypasses cloaking

### 3. Admin Access Test

Visit: `http://iswstock.com/index/adsadmin`

Expected behavior:
- Admin login page
- Bypasses cloaking
- Direct access to Node.js

### 4. API Test

```bash
curl http://iswstock.com/index/api/stock?code=7203
```

Expected: JSON response with stock data

## How It Works

### 1. React App Configuration

**Two Build Configurations:**

- `vite.config.ts`: Standard build with `base: '/index/'`
- `vite.config.loading.ts`: Loading mode with `base: '/'`

**Dynamic Router Basename:**

```typescript
// src/main.tsx
const isLoadingMode = import.meta.env.VITE_LOADING_MODE === 'true';
const basename = isLoadingMode ? '/' : '/index';

<BrowserRouter basename={basename}>
```

### 2. API Client

API calls always use absolute paths with `/index/` prefix:

```typescript
// src/lib/apiClient.ts
export const buildApiUrl = (endpoint: string): string => {
  // Always use /index/api/* paths
  if (!endpoint.startsWith('/index/')) {
    endpoint = `/index${endpoint}`;
  }
  return endpoint;
};
```

This ensures API works in both modes:
- Loading mode (`/`): API at `/index/api/*`
- Direct mode (`/index/`): API at `/index/api/*`

### 3. Nginx Configuration

**Static Assets for Loading Mode:**

```nginx
location /assets/ {
    root /var/www/html/index/dist-loading;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**API Proxy:**

```nginx
location /index/api/ {
    proxy_pass http://stock-ai-nodejs:3001;
    # ... proxy settings
}
```

**Admin Bypass:**

```nginx
location /adsadmin {
    proxy_pass http://stock-ai-nodejs:3001;
    # ... proxy settings
}
```

### 4. PHP Cloaking Logic

The `index.php` script:

1. Collects user information (IP, user agent, referrer)
2. Sends to Cloaking.House API
3. Receives decision: offer or white page
4. Loads appropriate local file with `file_get_contents()`
5. Outputs HTML to browser

## Access Modes Comparison

| Feature | Loading Mode (`/`) | Direct Mode (`/index/`) |
|---------|-------------------|------------------------|
| **URL displayed** | `/` | `/index/...` |
| **Cloaking active** | Yes | No |
| **Entry point** | PHP | Node.js |
| **Build config** | `vite.config.loading.ts` | `vite.config.ts` |
| **Router basename** | `/` | `/index` |
| **API path** | `/index/api/*` | `/index/api/*` |
| **Static assets** | `/assets/*` (dist-loading) | `/index/assets/*` (dist) |
| **Use case** | Production (traffic filtering) | Development/backup |

## Advantages of Loading Mode

1. **Perfect URL Masking**: User cannot detect page switching
2. **Local File Serving**: Fast response, no external requests
3. **SEO Friendly**: Search engines see static HTML
4. **Flexible**: Can still access app directly via `/index/`
5. **Secure**: API keys and logic hidden in PHP

## Troubleshooting

### Assets Not Loading

**Problem**: CSS/JS files return 404

**Solution**:
- Check `/assets/` location in nginx.conf
- Verify `dist-loading/assets/` exists
- Run `npm run build:loading` again

### API Calls Fail

**Problem**: API returns 404 or CORS errors

**Solution**:
- Check API client uses `/index/api/*` paths
- Verify nginx proxy for `/index/api/`
- Check Node.js server is running

### Cloaking Not Working

**Problem**: Always shows same page

**Solution**:
- Check Cloaking.House configuration
- Verify flow label matches in `index.php`
- Test with different user agents
- Check PHP-FPM logs

### Router Not Working

**Problem**: Routes show 404 or wrong content

**Solution**:
- Check `basename` in `main.tsx`
- Verify `VITE_LOADING_MODE` env var
- Rebuild with `npm run build:loading`

## Development Workflow

1. **Local Development**: Use `npm run dev:all`
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

2. **Build for Production**: `npm run build:all`
   - Creates both `dist/` and `dist-loading/`
   - Generates `index-loading.html`

3. **Test Locally**: `./test-loading-mode.sh`
   - Verifies all files exist
   - Checks configurations

4. **Deploy**: `docker-compose up -d --build`
   - Builds and starts all services
   - Nginx, PHP, Node.js

5. **Monitor**: `docker-compose logs -f`
   - Watch real-time logs
   - Debug issues

## Important Notes

1. **Always use loading mode** in Cloaking.House configuration
2. **Do not use redirect mode** - it defeats the purpose
3. **Keep both build versions** (dist and dist-loading)
4. **Test both access modes** before deploying
5. **Monitor logs** after deployment
6. **Update Cloaking.House** if file paths change

## Security Considerations

- Never expose `.env` files
- Keep admin path (`/adsadmin`) secret
- Use strong admin passwords
- Monitor access logs regularly
- Keep PHP and dependencies updated

## Performance Tips

- Enable PHP OPcache in production
- Use Nginx caching for static assets
- Compress assets during build
- Monitor server resources
- Use CDN for heavy traffic

## Support

If you encounter issues:

1. Run test script: `./test-loading-mode.sh`
2. Check Docker logs: `docker-compose logs`
3. Verify Cloaking.House settings
4. Test with curl for API issues
5. Check nginx error logs

## Summary

Loading mode provides the best user experience by:
- Keeping URLs clean and consistent
- Fast local file serving
- Transparent cloaking operation
- Flexible access options

The key is maintaining two build configurations and ensuring API paths work across both access modes.
