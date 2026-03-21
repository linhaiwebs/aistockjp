# Loading Mode Quick Reference

## Cloaking.House Configuration

```
Flow Label: 2af62ff72f49e8e7b16d938da7a2f3a4

Offer Page:
  URL: index-loading.html
  Mode: loading ⚠️

White Page:
  URL: home/index.html
  Mode: loading ⚠️
```

## Build Commands

```bash
# Build loading mode only
cd index && npm run build:loading

# Build standard mode only
cd index && npm run build

# Build both modes
cd index && npm run build:all
```

## Test Commands

```bash
# Run test suite
./test-loading-mode.sh

# Deploy with Docker
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Access URLs

```
Root (Cloaking):  http://iswstock.com/
Direct Access:    http://iswstock.com/index/
Admin Panel:      http://iswstock.com/index/adsadmin
API Endpoint:     http://iswstock.com/index/api/*
```

## File Locations

```
index-loading.html           # Offer page (root build)
home/index.html             # White page (static)
index/dist/                 # Standard build (/index/)
index/dist-loading/         # Loading build (/)
index/dist-loading/assets/  # JS/CSS for loading mode
```

## Key Configurations

### React Router Basename
```typescript
// Auto-detected based on build mode
isLoadingMode ? '/' : '/index'
```

### API Paths
```typescript
// Always use /index/api/*
/index/api/stock
/index/api/gemini
/index/api/admin
```

### Static Assets
```
Loading mode: /assets/*
Direct mode:  /index/assets/*
```

## Troubleshooting Quick Fixes

### Assets 404
```bash
cd index && npm run build:loading
```

### API Fails
Check: `/index/api/` proxy in nginx.conf

### Cloaking Not Working
Verify: Flow label in Cloaking.House and index.php match

### Router Issues
Rebuild: `npm run build:loading`

## Deployment Checklist

- [ ] Run `npm run build:all`
- [ ] Run `./test-loading-mode.sh`
- [ ] Configure Cloaking.House (loading mode)
- [ ] Deploy: `docker-compose up -d --build`
- [ ] Test root URL: `/`
- [ ] Test direct URL: `/index/`
- [ ] Test admin: `/index/adsadmin`
- [ ] Test API: `curl /index/api/stock?code=7203`

## Important Files

| File | Purpose |
|------|---------|
| `index.php` | PHP cloaking entry point |
| `index-loading.html` | Offer page output |
| `nginx.conf` | Web server config |
| `vite.config.loading.ts` | Loading mode build config |
| `src/main.tsx` | Router basename logic |
| `src/lib/apiClient.ts` | API path handling |

## Common Issues

| Problem | Solution |
|---------|----------|
| Assets not loading | Check `/assets/` in nginx.conf |
| API 404 | Verify `/index/api/` proxy |
| Cloaking not working | Check flow label match |
| Router broken | Rebuild with loading config |

## Support Resources

- Full Guide: `LOADING_MODE_GUIDE.md`
- Test Script: `./test-loading-mode.sh`
- Docker Logs: `docker-compose logs -f`
- Nginx Logs: `/var/log/nginx/error.log`
