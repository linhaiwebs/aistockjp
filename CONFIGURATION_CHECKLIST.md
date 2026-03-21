# Loading Mode Configuration Checklist

Use this checklist to ensure your loading mode is properly configured and deployed.

## ✅ Pre-Deployment Checklist

### 1. Environment Setup

- [ ] Node.js installed (v18 or higher)
- [ ] npm installed and updated
- [ ] Docker and Docker Compose installed
- [ ] Cloaking.House account created
- [ ] Flow created in Cloaking.House dashboard

### 2. Project Files

- [ ] `index.php` exists in project root
- [ ] `home/index.html` exists (white page)
- [ ] `nginx.conf` updated with loading mode configuration
- [ ] `docker-compose.yml` configured correctly
- [ ] `.env` file configured in `index/` directory

### 3. Build Configuration

- [ ] `index/vite.config.ts` exists (standard build)
- [ ] `index/vite.config.loading.ts` exists (loading build)
- [ ] `index/scripts/buildLoading.js` exists
- [ ] `index/package.json` updated with build scripts

### 4. React Application

- [ ] `index/src/main.tsx` updated with dynamic basename
- [ ] `index/src/lib/apiClient.ts` updated with absolute paths
- [ ] Router configured to work with both modes

## 🔨 Build Process Checklist

### 1. Install Dependencies

```bash
cd index
npm install
```

- [ ] Dependencies installed successfully
- [ ] No critical errors in console
- [ ] `node_modules/` directory created

### 2. Run Standard Build

```bash
npm run build
```

- [ ] Build completes successfully
- [ ] `dist/` directory created
- [ ] `dist/index.html` exists
- [ ] `dist/assets/` contains JS and CSS files
- [ ] No build errors or warnings

### 3. Run Loading Mode Build

```bash
npm run build:loading
```

- [ ] Build completes successfully
- [ ] `dist-loading/` directory created
- [ ] `dist-loading/index.html` exists
- [ ] `dist-loading/assets/` contains JS and CSS files
- [ ] `../index-loading.html` generated
- [ ] No build errors or warnings

### 4. Verify Build Outputs

```bash
cd ..
ls -lh index-loading.html
ls -lh index/dist/
ls -lh index/dist-loading/
```

- [ ] `index-loading.html` exists (4-5 KB)
- [ ] `index/dist/` has 10+ files
- [ ] `index/dist-loading/` has 10+ files
- [ ] Asset file sizes are reasonable (< 400 KB per file)

## 🧪 Testing Checklist

### 1. Run Test Script

```bash
./test-loading-mode.sh
```

- [ ] Test script runs without errors
- [ ] All 6 checks pass ✓
- [ ] Configuration summary displayed

### 2. Verify File Structure

- [ ] `index-loading.html` exists in project root
- [ ] `home/index.html` exists
- [ ] `index/dist-loading/assets/` has JS/CSS files
- [ ] `nginx.conf` has `/assets/` location
- [ ] `docker-compose.yml` has 3 services

### 3. Check File Permissions

```bash
ls -la index-loading.html
ls -la test-loading-mode.sh
```

- [ ] `index-loading.html` readable
- [ ] `test-loading-mode.sh` executable
- [ ] All files owned by correct user

## 🐳 Docker Deployment Checklist

### 1. Pre-Deployment Verification

```bash
docker-compose config
```

- [ ] Configuration valid (no errors)
- [ ] All services defined
- [ ] Volumes correctly mapped
- [ ] Ports correctly exposed

### 2. Build Docker Images

```bash
docker-compose build
```

- [ ] nginx image builds successfully
- [ ] php image builds successfully
- [ ] nodejs image builds successfully
- [ ] No build errors

### 3. Start Services

```bash
docker-compose up -d
```

- [ ] All services start
- [ ] No immediate errors
- [ ] Containers stay running

### 4. Check Service Status

```bash
docker-compose ps
```

Expected output:
```
NAME                STATUS      PORTS
stock-ai-nginx      running     0.0.0.0:80->80/tcp
stock-ai-php        running     9000/tcp
stock-ai-nodejs     running     3001/tcp
```

- [ ] nginx running on port 80
- [ ] php running on port 9000
- [ ] nodejs running on port 3001

### 5. Check Logs

```bash
docker-compose logs nginx
docker-compose logs php
docker-compose logs nodejs
```

- [ ] nginx: No critical errors
- [ ] php: PHP-FPM started
- [ ] nodejs: Server listening on port 3001
- [ ] No connection errors

## 🌐 Cloaking.House Configuration Checklist

### 1. Flow Settings

- [ ] Logged into Cloaking.House dashboard
- [ ] Flow created or selected
- [ ] Flow label copied: `2af62ff72f49e8e7b16d938da7a2f3a4`

### 2. Offer Page Configuration

Settings to configure:
- [ ] URL: `index-loading.html`
- [ ] Mode: **loading** (NOT redirect!)
- [ ] File path is relative to web root
- [ ] Settings saved

### 3. White Page Configuration

Settings to configure:
- [ ] URL: `home/index.html`
- [ ] Mode: **loading** (NOT redirect!)
- [ ] File path is relative to web root
- [ ] Settings saved

### 4. Filter Rules

- [ ] Traffic filters configured (if needed)
- [ ] Geographic filters set (if needed)
- [ ] User agent filters set (if needed)
- [ ] Test mode enabled (optional)

### 5. Verify Configuration

- [ ] Flow label in Cloaking.House matches `index.php`
- [ ] Both pages set to "loading" mode
- [ ] File paths are correct
- [ ] Flow is active (not paused)

## 🔍 Post-Deployment Testing Checklist

### 1. Root Path Test (Cloaking Mode)

Test URL: `http://iswstock.com/`

Using real browser:
- [ ] Page loads successfully
- [ ] URL stays as `/`
- [ ] Content appears (offer or white based on cloaking)
- [ ] No 404 errors in browser console
- [ ] CSS styles load correctly
- [ ] JavaScript functions work

Using curl with user agent:
```bash
curl -H "User-Agent: Mozilla/5.0" http://iswstock.com/
```

- [ ] Returns HTML content
- [ ] No PHP errors
- [ ] Content is from offer page (React app)

Using curl as bot:
```bash
curl -H "User-Agent: Googlebot" http://iswstock.com/
```

- [ ] Returns HTML content
- [ ] Content is from white page (static)

### 2. Direct Access Test

Test URL: `http://iswstock.com/index/`

- [ ] Page loads successfully
- [ ] URL shows `/index/`
- [ ] React app loads
- [ ] No cloaking applied
- [ ] CSS and JavaScript load correctly
- [ ] Navigation works

### 3. Admin Panel Test

Test URL: `http://iswstock.com/index/adsadmin`

- [ ] Login page displays
- [ ] No cloaking applied
- [ ] Can log in with credentials
- [ ] Dashboard functions work

### 4. API Endpoint Tests

```bash
# Stock API
curl http://iswstock.com/index/api/stock?code=7203

# Expected: JSON response with stock data
```

- [ ] API returns valid JSON
- [ ] Status code is 200
- [ ] Data structure is correct
- [ ] No CORS errors

### 5. Static Assets Test

Check browser network tab:
- [ ] `/assets/*.js` loads (status 200)
- [ ] `/assets/*.css` loads (status 200)
- [ ] Cache headers present
- [ ] Gzip compression enabled

### 6. Router Test

Navigate to different routes:
- [ ] Home route works: `/`
- [ ] Stock route works (if applicable)
- [ ] 404 page shows for invalid routes
- [ ] Browser back/forward works

### 7. Cross-Browser Testing

Test in different browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

## 🔒 Security Checklist

### 1. File Permissions

- [ ] PHP files not directly accessible
- [ ] `.env` file not accessible
- [ ] Database files not accessible
- [ ] Config files not accessible

### 2. Nginx Security

- [ ] Security headers configured
- [ ] Hidden files blocked (`.htaccess`, `.git`)
- [ ] PHP info disabled
- [ ] Directory listing disabled

### 3. Admin Security

- [ ] Strong admin password set
- [ ] Admin path (`/adsadmin`) not publicized
- [ ] JWT secret configured
- [ ] Session timeout configured

### 4. Cloaking Security

- [ ] Flow label kept secret
- [ ] API credentials secured
- [ ] PHP script not modifiable by web users

## 📊 Performance Checklist

### 1. Load Time

Test with browser DevTools:
- [ ] Initial page load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] Assets cached properly
- [ ] No unnecessary requests

### 2. Asset Optimization

- [ ] JavaScript minified
- [ ] CSS minified
- [ ] Images optimized
- [ ] Gzip compression enabled

### 3. Caching

- [ ] Static assets cached (1 year)
- [ ] HTML not cached or short cache
- [ ] Cache headers set correctly

## 📝 Monitoring Checklist

### 1. Log Monitoring

Setup monitoring for:
- [ ] Nginx access logs
- [ ] Nginx error logs
- [ ] PHP error logs
- [ ] Node.js application logs

### 2. Health Checks

- [ ] All Docker containers running
- [ ] No memory leaks
- [ ] Disk space sufficient
- [ ] CPU usage normal

### 3. Error Tracking

- [ ] 404 errors logged
- [ ] 500 errors logged
- [ ] PHP errors logged
- [ ] Cloaking API errors logged

## 🔄 Maintenance Checklist

### Daily

- [ ] Check service status: `docker-compose ps`
- [ ] Monitor error logs
- [ ] Check disk space

### Weekly

- [ ] Review access patterns
- [ ] Check for security updates
- [ ] Backup database
- [ ] Review Cloaking.House statistics

### Monthly

- [ ] Update dependencies: `npm update`
- [ ] Update Docker images
- [ ] Review performance metrics
- [ ] Test disaster recovery

## ✅ Final Verification

Before considering deployment complete:

- [ ] All build processes successful
- [ ] All tests pass
- [ ] All Docker services running
- [ ] Cloaking.House configured correctly
- [ ] Root path shows dynamic content
- [ ] Direct access works
- [ ] API endpoints functional
- [ ] Admin panel accessible
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Monitoring configured
- [ ] Documentation reviewed
- [ ] Backup plan established

## 🎉 Success Criteria

Your loading mode implementation is successful if:

✓ Root path (`/`) triggers cloaking
✓ URL stays as `/` regardless of content
✓ Different content for different user types
✓ Direct access (`/index/`) bypasses cloaking
✓ API calls work from both paths
✓ No 404 errors for assets
✓ Performance is acceptable
✓ Security is properly configured

## 📞 Troubleshooting Resources

If any checks fail:

1. Review error logs: `docker-compose logs`
2. Run test script: `./test-loading-mode.sh`
3. Check documentation: `LOADING_MODE_GUIDE.md`
4. Verify Cloaking.House settings
5. Test with curl for debugging

## 📚 Additional Resources

- **Complete Guide**: `LOADING_MODE_GUIDE.md`
- **Architecture**: `LOADING_MODE_ARCHITECTURE.md`
- **Quick Reference**: `QUICK_REFERENCE.md`
- **Summary**: `LOADING_MODE_SUMMARY.md`
- **Chinese Guide**: `LOADING_MODE_简体中文.md`

---

**Remember**: Loading mode requires both "loading" configuration in Cloaking.House, not "redirect"!
