# Loading Mode Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Internet Users                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
      ┌──────────────────────────────────┐
      │         Nginx (Port 80)          │
      │    iswstock.com                  │
      └──────────────┬───────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
    [Route: /]            [Route: /index/]
          │                     │
          ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│   PHP-FPM       │   │   Node.js       │
│   (Port 9000)   │   │   (Port 3001)   │
│                 │   │                 │
│  index.php      │   │  Express Server │
└────┬────────────┘   └─────────────────┘
     │
     │ Cloaking.House API Check
     │
     ▼
┌─────────────────────────────┐
│   Cloaking Decision         │
├─────────────┬───────────────┤
│   Offer     │    White      │
│  (Real)     │   (Bot)       │
└──────┬──────┴───────┬───────┘
       │              │
       ▼              ▼
┌──────────────┐ ┌───────────┐
│ index-       │ │   home/   │
│ loading.html │ │ index.html│
└──────────────┘ └───────────┘
       │              │
       ▼              ▼
   User sees     User sees
   React App    Static Page
   (URL: /)     (URL: /)
```

## Request Flow Diagram

### Loading Mode (Root Path Access)

```
1. User → http://iswstock.com/
         │
         ▼
2. Nginx receives request
         │
         ▼
3. Routes to index.php (PHP-FPM)
         │
         ▼
4. PHP collects user data:
   - IP address
   - User agent
   - Referrer
   - Query params
         │
         ▼
5. Sends to Cloaking.House API
   POST https://cloakit.house/api/v1/check
         │
         ▼
6. Cloaking.House analyzes and returns:
   {
     "filter_page": "offer" | "white",
     "mode_offer_page": "loading",
     "url_offer_page": "index-loading.html",
     "mode_white_page": "loading",
     "url_white_page": "home/index.html"
   }
         │
    ┌────┴────┐
    │         │
offer│         │white
    ▼         ▼
┌─────────┐ ┌─────────┐
│ Read    │ │ Read    │
│ index-  │ │ home/   │
│ loading │ │ index   │
│ .html   │ │ .html   │
└────┬────┘ └────┬────┘
     │           │
     └─────┬─────┘
           ▼
    Output HTML to user
    (URL stays: /)
           │
           ▼
    Browser loads:
    - /assets/*.js
    - /assets/*.css
           │
           ▼
    React app initializes
    Router basename: /
           │
           ▼
    User interacts
    API calls: /index/api/*
```

### Direct Access Mode

```
1. User → http://iswstock.com/index/
         │
         ▼
2. Nginx receives request
         │
         ▼
3. Proxies to Node.js (Port 3001)
         │
         ▼
4. Express serves:
   - index/dist/index.html
   - Static assets
         │
         ▼
5. Browser loads:
   - /index/assets/*.js
   - /index/assets/*.css
         │
         ▼
6. React app initializes
   Router basename: /index
         │
         ▼
7. User interacts
   API calls: /index/api/*
```

## Build Process Flow

```
Source Code (src/)
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Standard    │ │   Loading    │ │    Both      │
│   Build      │ │    Build     │ │   Builds     │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ npm run      │ │ npm run      │ │ npm run      │
│ build        │ │ build:loading│ │ build:all    │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ vite.config  │ │ vite.config  │ │   Runs both  │
│ .ts          │ │ .loading.ts  │ │              │
│              │ │              │ │              │
│ base:        │ │ base: /      │ │              │
│ /index/      │ │              │ │              │
│              │ │ VITE_LOADING │ │              │
│              │ │ _MODE: true  │ │              │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       ▼                ▼                ▼
  dist/           dist-loading/      dist/ +
  index.html      index.html        dist-loading/
  assets/         assets/           index-loading.html
       │                │                │
       │                ▼                │
       │         buildLoading.js         │
       │         generates:              │
       │         index-loading.html      │
       │                │                │
       └────────────────┴────────────────┘
                        │
                        ▼
              Ready for Deployment
```

## File Structure & Responsibilities

```
project/
│
├── index.php                    ← PHP cloaking entry
│   ├─ Receives all / requests
│   ├─ Calls Cloaking.House API
│   ├─ Loads local files
│   └─ Outputs HTML
│
├── index-loading.html           ← Offer page (generated)
│   ├─ React app built for /
│   ├─ Contains: <base href="/">
│   ├─ References: /assets/*
│   └─ Router basename: /
│
├── home/
│   └── index.html              ← White page (static)
│       ├─ Simple HTML/CSS
│       ├─ Static content
│       └─ No JavaScript needed
│
├── nginx.conf                   ← Web server config
│   ├─ Routes / to PHP
│   ├─ Routes /index/ to Node.js
│   ├─ Serves /assets/ from dist-loading
│   └─ Proxies /index/api/ to Node.js
│
├── index/
│   ├── vite.config.ts          ← Standard build config
│   │   └─ base: '/index/'
│   │
│   ├── vite.config.loading.ts  ← Loading mode config
│   │   └─ base: '/'
│   │
│   ├── src/
│   │   ├── main.tsx            ← Router config
│   │   │   └─ Dynamic basename
│   │   │
│   │   └── lib/
│   │       └── apiClient.ts    ← API path builder
│   │           └─ Always /index/api/*
│   │
│   ├── dist/                   ← Standard build output
│   │   ├── index.html          (for /index/ access)
│   │   └── assets/
│   │
│   └── dist-loading/           ← Loading mode output
│       ├── index.html          (source for index-loading.html)
│       └── assets/             (served as /assets/)
│
└── scripts/
    └── buildLoading.js         ← Post-build script
        └─ Generates index-loading.html
```

## Data Flow: API Requests

### Loading Mode (/)

```
User Action
    │
    ▼
React Component
    │
    ▼
apiClient.get('/api/stock')
    │
    ▼
buildApiUrl() adds /index prefix
    │
    ▼
Fetch: /index/api/stock
    │
    ▼
Nginx receives request
    │
    ▼
Matches: location /index/api/
    │
    ▼
Proxies to Node.js (Port 3001)
    │
    ▼
Express Router
    │
    ▼
Route Handler
    │
    ▼
Database Query
    │
    ▼
JSON Response
    │
    ▼
React Component Updates
```

### Key Insight

Both access modes use the **same API path**: `/index/api/*`

This is crucial because:
- Nginx proxy configuration is shared
- API endpoints don't need duplication
- Authentication works consistently
- Database connections are unified

## Static Asset Loading

### Loading Mode

```
Browser requests: /assets/index-Cb6M9rqJ.js
                          │
                          ▼
              Nginx location /assets/
                          │
                          ▼
          root /var/www/html/index/dist-loading
                          │
                          ▼
          Serves: index/dist-loading/assets/index-Cb6M9rqJ.js
```

### Direct Mode

```
Browser requests: /index/assets/index-CT6k-vmP.js
                          │
                          ▼
              Nginx location /index/
                          │
                          ▼
          Proxy to Node.js (Port 3001)
                          │
                          ▼
          Express static middleware
                          │
                          ▼
          Serves: index/dist/assets/index-CT6k-vmP.js
```

## Router Configuration Logic

```typescript
// src/main.tsx

┌─────────────────────────────────┐
│ Check: VITE_LOADING_MODE        │
└───────────┬─────────────────────┘
            │
     ┌──────┴──────┐
     │             │
  true          false
     │             │
     ▼             ▼
┌─────────┐   ┌─────────┐
│basename │   │basename │
│   /     │   │ /index  │
└────┬────┘   └────┬────┘
     │             │
     └──────┬──────┘
            ▼
    <BrowserRouter basename={basename}>
            │
            ▼
    Routes resolve correctly
    for both access modes
```

## Environment Variables

```
┌──────────────────────────────────────┐
│        Build Time Variables           │
├──────────────────────────────────────┤
│                                      │
│  VITE_LOADING_MODE                   │
│  ├─ Set by: vite.config.loading.ts  │
│  ├─ Value: 'true' | undefined        │
│  └─ Used by: main.tsx (basename)     │
│                                      │
│  VITE_API_URL                        │
│  ├─ Set by: .env                     │
│  ├─ Value: '' (use proxy)            │
│  └─ Used by: apiClient.ts            │
│                                      │
│  VITE_USE_PROXY                      │
│  ├─ Set by: .env                     │
│  ├─ Value: 'true'                    │
│  └─ Used by: apiClient.ts            │
│                                      │
└──────────────────────────────────────┘
```

## Cloaking Decision Matrix

```
┌────────────────┬──────────────┬──────────────┐
│  User Type     │  Decision    │  Result      │
├────────────────┼──────────────┼──────────────┤
│ Real User      │ Offer Page   │ React App    │
│ (Human)        │ (loading)    │ Full Service │
├────────────────┼──────────────┼──────────────┤
│ Bot            │ White Page   │ Static HTML  │
│ (Crawler)      │ (loading)    │ Safe Content │
├────────────────┼──────────────┼──────────────┤
│ Review Service │ White Page   │ Static HTML  │
│ (Moderator)    │ (loading)    │ Safe Content │
├────────────────┼──────────────┼──────────────┤
│ Suspicious IP  │ White Page   │ Static HTML  │
│ (VPN/Proxy)    │ (loading)    │ Safe Content │
└────────────────┴──────────────┴──────────────┘
```

## Summary

### Key Components

1. **PHP Cloaking**: Entry point, decision maker
2. **Two Builds**: Different base paths for different access modes
3. **Dynamic Router**: Adapts to access method
4. **Unified API**: Same endpoints for both modes
5. **Nginx Routing**: Handles static assets correctly

### Critical Configurations

1. Cloaking.House: **loading mode** (not redirect!)
2. Two build outputs: `dist/` and `dist-loading/`
3. Router basename: Dynamic based on build mode
4. API paths: Always `/index/api/*`
5. Static assets: Different locations for different modes

### Access Modes

- **Loading (`/`)**: Cloaking active, URL masking
- **Direct (`/index/`)**: Bypass cloaking, direct access

Both modes access the same backend API and database.
