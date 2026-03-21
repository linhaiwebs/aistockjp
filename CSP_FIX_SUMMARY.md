# Content Security Policy (CSP) Violation Fix

## Problem Summary
The application was experiencing CSP violations when trying to make API calls to `http://iswstock.com/index/`. The browser blocked these requests because the domain wasn't included in the `connect-src` Content Security Policy directive.

## Root Causes
1. **Inconsistent API URL construction**: Some parts of the code were constructing absolute URLs manually instead of using the centralized `apiClient` utility
2. **Missing production domains in CSP**: The CSP configuration didn't include the production domains (`iswstock.com`, `ostosk.jp`) in the `connect-src` directive
3. **Direct fetch calls**: `googleTracking.ts` and `RefactoredHome.tsx` were using direct `fetch()` calls instead of the `apiClient` utility

## Changes Made

### 1. Standardized API Calls (`index/src/lib/apiClient.ts`)
- Exported `buildApiUrl` function as part of `apiClient` object for consistent URL construction across the application

### 2. Fixed Google Tracking (`index/src/lib/googleTracking.ts`)
- Changed from direct `fetch('/api/google-tracking')` to `apiClient.get('/api/google-tracking')`
- This ensures proper URL construction based on environment configuration

### 3. Fixed Diagnosis API Call (`index/src/pages/RefactoredHome.tsx`)
- Replaced manual URL construction with `apiClient.post('/api/gemini/diagnosis', ...)`
- Removed hardcoded `VITE_API_URL` concatenation

### 4. Updated CSP Configuration (`index/server/index.js`)
- Added production domains to `connect-src` directive:
  - `http://iswstock.com`
  - `https://iswstock.com`
  - `http://ostosk.jp`
  - `https://ostosk.jp`
- These domains are only added when `NODE_ENV=production`
- Also added missing `https://cloudflareinsights.com` and `https://static.cloudflareinsights.com`

### 5. Updated Apache Configuration (`.htaccess`)
- Added the same production domains to the CSP `connect-src` directive
- Added Cloudflare Insights domains

### 6. Improved Environment Configuration (`index/.env.production`)
- Added comprehensive documentation about two API configuration options:
  - **Option 1 (Recommended)**: Use relative paths with `VITE_USE_PROXY=true`
  - **Option 2**: Use absolute URLs with proper CSP whitelist

## How It Works Now

### Development Environment
- `VITE_API_URL=http://localhost:3001`
- `VITE_USE_PROXY=false`
- API calls use full URL: `http://localhost:3001/index/api/...`

### Production Environment (Recommended)
- `VITE_API_URL=` (empty)
- `VITE_USE_PROXY=true`
- API calls use relative path: `/index/api/...`
- The browser resolves this relative to the current domain

### Production Environment (Alternative)
- `VITE_API_URL=http://iswstock.com` (or your domain)
- `VITE_USE_PROXY=false`
- API calls use full URL: `http://iswstock.com/index/api/...`
- Domain must be whitelisted in CSP (already done)

## Benefits
1. **No more CSP violations**: All API calls are now properly handled
2. **Consistent API handling**: All API calls go through `apiClient` utility
3. **Flexible deployment**: Works with both relative paths (proxy mode) and absolute URLs
4. **Better maintainability**: Single source of truth for API URL construction
5. **Enhanced security**: CSP still blocks unauthorized connections while allowing legitimate ones

## Testing Recommendations
1. Test API calls work correctly with relative URLs (`VITE_USE_PROXY=true`)
2. Test API calls work correctly with absolute URLs (`VITE_USE_PROXY=false`)
3. Verify Google Tracking initialization works
4. Verify stock diagnosis functionality works
5. Check browser console for any remaining CSP violations

## Migration Path
If currently deployed with absolute URLs:
1. Keep current configuration (absolute URLs will now work due to CSP updates)
2. OR migrate to recommended relative path approach:
   - Set `VITE_API_URL=` (empty)
   - Set `VITE_USE_PROXY=true`
   - Rebuild and redeploy

Both approaches will work correctly with the updated CSP configuration.
