# 🚀 Deploy Loading Mode NOW - Step by Step

This guide will walk you through deploying your loading mode configuration **right now**.

## ⚡ Prerequisites Check

Run these commands to verify everything is ready:

```bash
# Check if build outputs exist
ls -lh index-loading.html
ls -lh index/dist-loading/

# Run test script
./test-loading-mode.sh
```

**Expected**: All files exist, all tests pass ✓

---

## 📋 Step 1: Configure Cloaking.House (5 minutes)

### 1.1 Login to Cloaking.House

Visit: https://cloakit.house/login

### 1.2 Navigate to Your Flow

Find your flow with label: `2af62ff72f49e8e7b16d938da7a2f3a4`

### 1.3 Configure Offer Page

Click on **Offer Page** settings:

```
URL: index-loading.html
Mode: loading
```

⚠️ **CRITICAL**: Must be "loading", NOT "redirect"!

### 1.4 Configure White Page

Click on **White Page** settings:

```
URL: home/index.html
Mode: loading
```

⚠️ **CRITICAL**: Must be "loading", NOT "redirect"!

### 1.5 Save and Activate

- [ ] Click **Save** button
- [ ] Ensure flow is **Active** (not paused)
- [ ] Note the flow label matches your `index.php`

---

## 🐳 Step 2: Deploy with Docker (5 minutes)

### 2.1 Stop Existing Services

```bash
docker-compose down
```

**Expected**: Services stopped cleanly

### 2.2 Build and Start Services

```bash
docker-compose up -d --build
```

**Expected**:
- nginx building...
- php building...
- nodejs building...
- All services started

### 2.3 Verify Services Running

```bash
docker-compose ps
```

**Expected output**:
```
NAME                STATUS      PORTS
stock-ai-nginx      running     0.0.0.0:80->80/tcp
stock-ai-php        running     9000/tcp
stock-ai-nodejs     running     3001/tcp
```

✓ All three services should be "running"

### 2.4 Check Initial Logs

```bash
docker-compose logs --tail=50
```

**Expected**: No critical errors, services initialized

---

## 🧪 Step 3: Test Deployment (10 minutes)

### 3.1 Test Root Path (Cloaking Mode)

**Open in browser**: `http://iswstock.com/`

Expected behavior:
- [ ] Page loads without errors
- [ ] URL stays as `/` (doesn't change)
- [ ] Content shows (offer or white based on your user type)
- [ ] No JavaScript errors in console (F12)
- [ ] CSS styles applied correctly

**Test with curl**:

```bash
# Test as real user
curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  http://iswstock.com/ | head -20

# Test as bot
curl -s -H "User-Agent: Googlebot/2.1" \
  http://iswstock.com/ | head -20
```

Expected: Different content for different user agents

### 3.2 Test Direct Access

**Open in browser**: `http://iswstock.com/index/`

Expected behavior:
- [ ] Page loads successfully
- [ ] URL shows `/index/`
- [ ] React app loads normally
- [ ] No cloaking applied
- [ ] Full functionality available

### 3.3 Test Admin Access

**Open in browser**: `http://iswstock.com/index/adsadmin`

Expected behavior:
- [ ] Login page displays
- [ ] Can log in with admin credentials
- [ ] Dashboard loads after login
- [ ] No cloaking interference

### 3.4 Test API Endpoints

```bash
# Test stock API
curl http://iswstock.com/index/api/stock?code=7203
```

Expected:
- [ ] Returns JSON response
- [ ] Status code 200
- [ ] Contains stock data

### 3.5 Test Static Assets

Check browser DevTools (F12 → Network tab):

When visiting `http://iswstock.com/`:
- [ ] `/assets/index-*.js` loads (status 200)
- [ ] `/assets/index-*.css` loads (status 200)
- [ ] `/assets/vendor-*.js` loads (status 200)
- [ ] All assets served with cache headers

---

## ✅ Step 4: Verify Cloaking Works

### 4.1 Test with Different User Agents

**Using Browser Extensions**:

1. Install a User-Agent Switcher extension
2. Test with these agents:
   - Real browser: Should see offer page
   - Googlebot: Should see white page
   - Facebook bot: Should see white page

**Using curl**:

```bash
# Real user (should get offer page)
curl -H "User-Agent: Mozilla/5.0" http://iswstock.com/ | grep -o '<title>.*</title>'

# Bot (should get white page)
curl -H "User-Agent: Googlebot" http://iswstock.com/ | grep -o '<title>.*</title>'
```

Expected: Different `<title>` tags

### 4.2 Check Cloaking.House Statistics

1. Login to Cloaking.House dashboard
2. View your flow statistics
3. Verify requests are being tracked
4. Check offer/white page split

---

## 📊 Step 5: Monitor Initial Performance

### 5.1 Watch Logs in Real-Time

```bash
docker-compose logs -f
```

Watch for:
- [ ] Incoming requests logged
- [ ] No PHP errors
- [ ] No Node.js errors
- [ ] API calls succeed

Press `Ctrl+C` to stop watching

### 5.2 Check Individual Service Logs

```bash
# Nginx logs
docker-compose logs nginx | tail -50

# PHP logs
docker-compose logs php | tail -50

# Node.js logs
docker-compose logs nodejs | tail -50
```

Look for errors or warnings

### 5.3 Test Load Time

Use browser DevTools (F12 → Network tab):

When loading `http://iswstock.com/`:
- [ ] Initial load time < 3 seconds
- [ ] All resources load successfully
- [ ] No failed requests (red items)

---

## 🎯 Step 6: Final Verification

### 6.1 Complete Test Checklist

Run through this quickly:

| Test | URL | Expected | Status |
|------|-----|----------|--------|
| Root (real user) | `http://iswstock.com/` | Offer page, URL stays `/` | [ ] |
| Root (bot) | Same with bot UA | White page, URL stays `/` | [ ] |
| Direct access | `http://iswstock.com/index/` | React app, URL shows `/index/` | [ ] |
| Admin | `http://iswstock.com/index/adsadmin` | Login page | [ ] |
| API | `curl /index/api/stock?code=7203` | JSON response | [ ] |

### 6.2 Cross-Device Test

If possible, test on:
- [ ] Desktop browser
- [ ] Mobile browser
- [ ] Different networks (WiFi, mobile data)

### 6.3 Security Check

```bash
# Try to access hidden files (should fail)
curl -I http://iswstock.com/.env
curl -I http://iswstock.com/.git

# Should return 404 or 403
```

Expected: Access denied

---

## 🎉 Success Criteria

Your deployment is successful if:

✅ All Docker services running
✅ Root path triggers cloaking
✅ URL stays as `/` for cloaked content
✅ Different content for different user types
✅ Direct access works at `/index/`
✅ Admin panel accessible
✅ API endpoints functional
✅ No errors in logs
✅ All static assets load
✅ Performance is acceptable

---

## 🚨 If Something Goes Wrong

### Problem: Services won't start

**Solution**:
```bash
docker-compose down
docker-compose up -d --force-recreate
docker-compose logs
```

### Problem: Assets return 404

**Solution**:
```bash
cd index
npm run build:loading
docker-compose restart nginx
```

### Problem: Cloaking not working

**Check**:
1. Cloaking.House configuration (mode = "loading")
2. Flow is active
3. Flow label matches in index.php
4. PHP service running: `docker-compose ps`

**Debug**:
```bash
docker-compose logs php | grep -i error
```

### Problem: API not responding

**Check**:
```bash
docker-compose ps nodejs
docker-compose logs nodejs | tail -50
```

**Restart if needed**:
```bash
docker-compose restart nodejs
```

---

## 📞 Emergency Rollback

If you need to rollback quickly:

```bash
# Stop current services
docker-compose down

# Use old configuration (if you have backup)
# Or switch to direct access only:
# Comment out PHP cloaking in nginx.conf
# Restart with: docker-compose up -d
```

---

## 📚 Reference Documentation

During deployment, keep these open:

- **Quick Reference**: `QUICK_REFERENCE.md`
- **Troubleshooting**: `LOADING_MODE_GUIDE.md` (section: Troubleshooting)
- **Architecture**: `LOADING_MODE_ARCHITECTURE.md`

---

## 🎓 Post-Deployment Tasks

After successful deployment:

### Immediate (Today)

- [ ] Monitor logs for first hour: `docker-compose logs -f`
- [ ] Test from different locations/devices
- [ ] Verify Cloaking.House statistics updating
- [ ] Check server resource usage

### This Week

- [ ] Set up automated backups
- [ ] Configure monitoring/alerting
- [ ] Document any custom changes
- [ ] Train team on new system

### Ongoing

- [ ] Monitor Cloaking.House statistics
- [ ] Review logs weekly
- [ ] Update dependencies monthly
- [ ] Test disaster recovery quarterly

---

## 💡 Pro Tips

1. **Keep test-loading-mode.sh handy**: Run before every deployment
2. **Watch logs during traffic spikes**: `docker-compose logs -f`
3. **Test with multiple user agents**: Different bots see different content
4. **Monitor Cloaking.House dashboard**: Track offer/white split
5. **Keep both access modes working**: Direct access is useful for debugging

---

## ✅ Deployment Complete!

If all tests pass, congratulations! Your loading mode is deployed and operational.

**What you've achieved**:

✅ PHP cloaking with loading mode
✅ URL masking (always shows `/`)
✅ Dual access modes (cloaking + direct)
✅ Unified API for both modes
✅ Production-ready configuration

**Next steps**:

1. Monitor performance
2. Check Cloaking.House stats
3. Adjust traffic filters if needed
4. Enjoy your new cloaking system!

---

## 📊 Monitoring Commands

Keep these handy for daily monitoring:

```bash
# Check service status
docker-compose ps

# View recent logs
docker-compose logs --tail=100

# Follow logs live
docker-compose logs -f

# Check specific service
docker-compose logs nginx --tail=50

# Check resource usage
docker stats

# Restart service if needed
docker-compose restart [service-name]
```

---

**Questions?** Check the documentation files or run `./test-loading-mode.sh`

**Good luck with your deployment! 🚀**
