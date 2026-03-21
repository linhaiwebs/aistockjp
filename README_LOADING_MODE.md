# PHP Cloaking with Loading Mode - Complete Implementation

This project implements a PHP cloaking system with **loading mode** for your stock AI service. The system uses Cloaking.House API to filter traffic and serve different content to different user types while maintaining a clean URL structure.

## 🎯 What is Loading Mode?

Loading mode is a PHP cloaking technique where:
- The PHP script directly loads and outputs HTML content
- No HTTP redirects are used
- The browser URL always stays as `/`
- Content is determined server-side by Cloaking.House API
- Users cannot detect page switching from the URL

## 🏗️ Architecture Overview

```
Root Access (/)          Direct Access (/index/)
      ↓                          ↓
   PHP-FPM                   Node.js
      ↓                          ↓
Cloaking.House API         React App
      ↓                          ↓
  ┌───┴───┐                 Standard
  │       │                  Version
Offer   White
Page    Page
  ↓       ↓
React   Static
App     HTML
```

## 📁 Project Structure

```
project/
├── index.php                      # PHP cloaking entry point
├── index-loading.html             # Generated offer page (React app)
├── home/index.html                # Static white page
├── nginx.conf                     # Web server configuration
├── docker-compose.yml             # Docker services
│
├── index/                         # React application
│   ├── vite.config.ts            # Standard build config
│   ├── vite.config.loading.ts    # Loading mode build config
│   ├── src/
│   │   ├── main.tsx              # Router with dynamic basename
│   │   └── lib/apiClient.ts      # API client with path handling
│   ├── dist/                     # Standard build output
│   ├── dist-loading/             # Loading mode build output
│   └── scripts/
│       └── buildLoading.js       # Post-build HTML generator
│
└── Documentation/
    ├── LOADING_MODE_GUIDE.md          # Complete implementation guide
    ├── LOADING_MODE_SUMMARY.md        # Quick summary
    ├── LOADING_MODE_ARCHITECTURE.md   # Architecture diagrams
    ├── QUICK_REFERENCE.md             # Quick reference card
    ├── LOADING_MODE_简体中文.md        # Chinese guide
    └── README_LOADING_MODE.md         # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd index
npm install
```

### 2. Build for Loading Mode

```bash
npm run build:all
```

This creates:
- `dist/` - Standard build for direct access
- `dist-loading/` - Loading mode build
- `../index-loading.html` - Generated offer page

### 3. Test Configuration

```bash
cd ..
./test-loading-mode.sh
```

### 4. Deploy with Docker

```bash
docker-compose up -d --build
```

### 5. Configure Cloaking.House

Visit your Cloaking.House dashboard and set:

```
Flow Label: 2af62ff72f49e8e7b16d938da7a2f3a4

Offer Page:
  URL: index-loading.html
  Mode: loading

White Page:
  URL: home/index.html
  Mode: loading
```

## 📋 Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build standard version (for `/index/`) |
| `npm run build:loading` | Build loading mode version (for `/`) |
| `npm run build:all` | Build both versions |

## 🌐 Access URLs

| URL | Mode | Description |
|-----|------|-------------|
| `http://iswstock.com/` | Cloaking | Shows offer or white page based on Cloaking.House |
| `http://iswstock.com/index/` | Direct | Always shows React app, bypasses cloaking |
| `http://iswstock.com/index/adsadmin` | Admin | Admin panel, bypasses cloaking |
| `http://iswstock.com/index/api/*` | API | Backend API endpoints |

## 🔧 How It Works

### Loading Mode Flow

1. User visits `http://iswstock.com/`
2. Nginx routes request to PHP-FPM
3. `index.php` executes and collects user data
4. PHP calls Cloaking.House API with user data
5. Cloaking.House returns decision: offer or white page
6. PHP loads appropriate local file:
   - Offer: `index-loading.html` (React app)
   - White: `home/index.html` (static HTML)
7. PHP outputs HTML to browser
8. Browser URL stays as `/`
9. React app loads assets from `/assets/*`
10. API calls go to `/index/api/*`

### Direct Access Flow

1. User visits `http://iswstock.com/index/`
2. Nginx proxies to Node.js (port 3001)
3. Express serves React app from `dist/`
4. Browser URL shows `/index/...`
5. React app loads assets from `/index/assets/*`
6. API calls go to `/index/api/*`

## 🎯 Key Features

### Dual Build System

- **Standard Build** (`dist/`): For direct access at `/index/`
  - Base path: `/index/`
  - Router basename: `/index`
  - Assets: `/index/assets/*`

- **Loading Build** (`dist-loading/`): For loading mode at `/`
  - Base path: `/`
  - Router basename: `/`
  - Assets: `/assets/*`

### Dynamic Router Configuration

```typescript
// Automatically detects build mode
const isLoadingMode = import.meta.env.VITE_LOADING_MODE === 'true';
const basename = isLoadingMode ? '/' : '/index';
```

### Unified API Paths

Both access modes use the same API endpoints:
- `/index/api/stock`
- `/index/api/gemini`
- `/index/api/admin`

This ensures consistency and simplifies backend development.

## 📊 Access Modes Comparison

| Feature | Loading Mode (`/`) | Direct Mode (`/index/`) |
|---------|-------------------|------------------------|
| **URL Displayed** | `/` (stays constant) | `/index/...` (changes) |
| **Cloaking** | ✓ Active | ✗ Bypassed |
| **Entry Point** | PHP-FPM | Node.js |
| **Build Source** | `dist-loading/` | `dist/` |
| **Router Basename** | `/` | `/index` |
| **Static Assets** | `/assets/*` | `/index/assets/*` |
| **API Endpoints** | `/index/api/*` | `/index/api/*` |
| **Use Case** | Production (traffic filtering) | Development / Direct access |

## 🔒 Security Features

1. **PHP Cloaking**: Filters traffic before it reaches React app
2. **URL Masking**: Hides actual page routing from users
3. **Admin Path Protection**: `/adsadmin` bypasses cloaking
4. **API Authentication**: JWT tokens for admin operations
5. **Nginx Security Headers**: XSS protection, frame options, etc.

## 🧪 Testing

### Run Test Suite

```bash
./test-loading-mode.sh
```

### Manual Testing

```bash
# Test root path (cloaking mode)
curl -H "User-Agent: Mozilla/5.0" http://iswstock.com/

# Test direct access
curl http://iswstock.com/index/

# Test API
curl http://iswstock.com/index/api/stock?code=7203

# Test admin (should redirect to login)
curl http://iswstock.com/index/adsadmin
```

## 🛠️ Troubleshooting

### Assets Not Loading (404)

**Problem**: CSS/JS files return 404 in loading mode

**Solution**:
```bash
cd index
npm run build:loading
docker-compose restart nginx
```

Verify nginx.conf has:
```nginx
location /assets/ {
    root /var/www/html/index/dist-loading;
}
```

### API Calls Fail

**Problem**: API returns 404 or CORS errors

**Solution**:
- Check API client uses `/index/api/*` paths
- Verify nginx proxy configuration
- Ensure Node.js server is running:
  ```bash
  docker-compose ps
  docker-compose logs nodejs
  ```

### Cloaking Not Working

**Problem**: Always shows same page regardless of user type

**Solution**:
1. Check Cloaking.House configuration
2. Verify flow label matches in `index.php`
3. Test with different user agents:
   ```bash
   curl -H "User-Agent: Mozilla/5.0" http://iswstock.com/
   curl -H "User-Agent: Googlebot" http://iswstock.com/
   ```
4. Check PHP logs:
   ```bash
   docker-compose logs php
   ```

### Router Not Working

**Problem**: Routes show 404 or incorrect content

**Solution**:
1. Check build mode environment variable
2. Rebuild loading mode:
   ```bash
   cd index
   npm run build:loading
   ```
3. Verify `main.tsx` basename configuration

## 📚 Documentation

- **[LOADING_MODE_GUIDE.md](LOADING_MODE_GUIDE.md)** - Complete implementation guide with detailed explanations
- **[LOADING_MODE_SUMMARY.md](LOADING_MODE_SUMMARY.md)** - Quick summary of changes and implementation
- **[LOADING_MODE_ARCHITECTURE.md](LOADING_MODE_ARCHITECTURE.md)** - Architecture diagrams and flow charts
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick reference card for common tasks
- **[LOADING_MODE_简体中文.md](LOADING_MODE_简体中文.md)** - Chinese language guide

## 🐳 Docker Services

```yaml
services:
  nginx:        # Port 80 - Web server
  php:          # Port 9000 - PHP-FPM
  nodejs:       # Port 3001 - Express/React app
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nginx
docker-compose logs -f php
docker-compose logs -f nodejs
```

## 📦 Deployment Checklist

Before deploying to production:

- [ ] Build both versions: `npm run build:all`
- [ ] Test configuration: `./test-loading-mode.sh`
- [ ] Configure Cloaking.House with "loading" mode
- [ ] Verify flow label matches in index.php
- [ ] Set admin credentials: `npm run create-admin`
- [ ] Update `.env` with production values
- [ ] Deploy: `docker-compose up -d --build`
- [ ] Test root path: `http://iswstock.com/`
- [ ] Test direct access: `http://iswstock.com/index/`
- [ ] Test admin: `http://iswstock.com/index/adsadmin`
- [ ] Test API: `curl http://iswstock.com/index/api/stock?code=7203`
- [ ] Monitor logs: `docker-compose logs -f`
- [ ] Verify cloaking with different user agents

## 🎓 Learning Resources

### Understanding Loading Mode

1. Read [LOADING_MODE_SUMMARY.md](LOADING_MODE_SUMMARY.md) for overview
2. Review [LOADING_MODE_ARCHITECTURE.md](LOADING_MODE_ARCHITECTURE.md) for diagrams
3. Check [LOADING_MODE_GUIDE.md](LOADING_MODE_GUIDE.md) for details

### Key Concepts

- **Cloaking**: Serving different content to different users
- **Loading Mode**: Direct HTML output without redirect
- **Dual Build**: Two versions for different access paths
- **Dynamic Router**: Adapts basename based on build mode
- **Unified API**: Same endpoints for both modes

## 💡 Best Practices

1. **Always use loading mode** in Cloaking.House (not redirect)
2. **Build both versions** before deploying
3. **Test all access modes** after deployment
4. **Monitor logs regularly** for errors
5. **Keep admin path secret** (don't share `/adsadmin`)
6. **Update dependencies** regularly for security
7. **Backup database** before major changes
8. **Use HTTPS** in production

## 🤝 Support

If you encounter issues:

1. Run test script: `./test-loading-mode.sh`
2. Check Docker logs: `docker-compose logs`
3. Review documentation files
4. Test with curl for debugging
5. Check Cloaking.House dashboard

## 📝 License

This implementation is part of your stock AI service project.

## 🎉 Summary

Your stock AI service now has a complete loading mode implementation:

- ✅ Dual build system (standard + loading mode)
- ✅ PHP cloaking with Cloaking.House integration
- ✅ Dynamic router configuration
- ✅ Unified API paths for both modes
- ✅ Nginx configuration for static assets
- ✅ Docker deployment setup
- ✅ Comprehensive documentation
- ✅ Automated testing script

**Ready to deploy!** Follow the Quick Start guide above.
