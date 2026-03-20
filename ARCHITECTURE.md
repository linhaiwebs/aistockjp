# Architecture Documentation

## System Overview

This document describes the three-tier architecture with PHP-based traffic routing.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Nginx (Port 80/443)                           │
│  • Static file serving                                           │
│  • Reverse proxy                                                 │
│  • SSL termination                                               │
│  • Security headers                                              │
└──────┬──────────────────┬───────────────────┬────────────────────┘
       │                  │                   │
       │ /                │ /index/*          │ /home/*
       ▼                  ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  index.php   │  │   Node.js    │  │ Static HTML  │
│  (PHP-FPM)   │  │   Express    │  │    Files     │
│              │  │   (Port      │  │              │
│ Cloaking     │  │    3001)     │  │ Landing Page │
│ House        │  │              │  │              │
│ Traffic      │  │ React App +  │  │ CSS/Images   │
│ Filter       │  │ API Backend  │  │              │
└──────┬───────┘  └──────┬───────┘  └──────────────┘
       │                 │
       │ Redirect        │ Database Access
       ▼                 ▼
   /index or        ┌──────────────┐
   /home            │   SQLite     │
                    │   Database   │
                    │              │
                    │ • Sessions   │
                    │ • Analytics  │
                    │ • Cache      │
                    │ • Admin      │
                    └──────────────┘
```

## Request Flow Diagrams

### 1. Root Path Request (`/`)

```
User → Nginx → PHP-FPM → index.php (Cloaking.House)
                              │
                              ├─→ Analyze User (IP, User-Agent, Referer)
                              │
                              ├─→ API Call to cloakit.house
                              │
                              ├─→ Decision: Offer or White Page?
                              │
                   ┌──────────┴──────────┐
                   ▼                     ▼
          filter_page='offer'   filter_page='white'
                   │                     │
          ┌────────┴────────┐   ┌───────┴────────┐
          ▼                 ▼   ▼                ▼
      Redirect 302     Load URL  Redirect 302  Load URL
      to /index        /index    to /home      /home
```

### 2. React App Request (`/index/*`)

```
User → Nginx → Try Static Files (dist/)
                      │
                      ├─→ Found? → Serve File
                      │
                      └─→ Not Found?
                              │
                              ▼
                        Proxy to Node.js:3001
                              │
                              ├─→ API Request (/index/api/*)?
                              │   └─→ Express Route Handler
                              │       └─→ Process & Return JSON
                              │
                              └─→ SPA Route?
                                  └─→ Return index.html
                                      └─→ React Router handles
```

### 3. Static Site Request (`/home/*`)

```
User → Nginx → Static Files (/home/)
                      │
                      ├─→ /home/index.html
                      ├─→ /home/styles.css
                      └─→ /home/images/*
                              │
                              ▼
                        Serve with Cache Headers
                        (expires: 30d)
```

### 4. API Request (`/index/api/*`)

```
User → Nginx → Proxy to Node.js:3001
                      │
                      ▼
              Express Server (/index/api/*)
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
    /api/stock  /api/gemini  /api/admin
         │            │            │
         ▼            ▼            ▼
   SQLite Cache   SiliconFlow   JWT Auth
         │            API          │
         ▼            │            ▼
   Return JSON   Stream AI    Admin Data
                 Response
```

## Component Details

### 1. Nginx Layer

**Responsibilities:**
- HTTP/HTTPS request handling
- Static file serving with caching
- Reverse proxy to Node.js
- FastCGI proxy to PHP-FPM
- Security headers
- Request routing

**Configuration:**
```nginx
# Root → PHP
location / {
    try_files $uri $uri/ /index.php?$query_string;
}

# /index/* → Node.js
location /index/ {
    try_files $uri @nodejs;
}

# /home/* → Static
location /home/ {
    alias /var/www/html/home/;
}
```

### 2. PHP Layer (index.php)

**Responsibilities:**
- Traffic filtering via Cloaking.House API
- User fingerprinting (IP, UA, Referer)
- Decision making (Offer vs White page)
- Redirect or load content

**Flow:**
1. Collect user information
2. POST to cloakit.house API
3. Receive filter decision
4. Execute action (redirect/load/iframe)

**Modes:**
- `redirect`: 302 redirect to target
- `loading`: Fetch and render target
- `iframe`: Embed target in iframe

### 3. Node.js Layer (Express)

**Responsibilities:**
- React app serving (production)
- RESTful API endpoints
- Database operations
- External API integration
- Session management
- Authentication

**Key Routes:**
```javascript
/index/api/stock      → Stock data & search
/index/api/gemini     → AI analysis (SiliconFlow)
/index/api/admin      → Admin operations
/index/api/tracking   → Analytics
/index/api/line-redirects → LINE links
/index/api/google-tracking → GA/Ads config
/index/health         → Health check
```

### 4. React Layer (Frontend)

**Responsibilities:**
- User interface
- Form handling
- API communication
- State management
- Client-side routing
- Analytics tracking

**Key Pages:**
```
/                     → Home (Stock diagnosis)
/adsadmin            → Admin login
/adsadmin/dashboard  → Admin dashboard
/contact             → Contact page
/privacy             → Privacy policy
/terms               → Terms of service
/company             → Company info
```

### 5. Database Layer (SQLite)

**Tables:**
- `admin_users`: Admin authentication
- `user_sessions`: Session tracking
- `user_events`: Event analytics
- `stocks`: Stock information cache
- `diagnosis_cache`: AI diagnosis cache
- `diagnosis_queue`: AI processing queue
- `redirect_links`: LINE redirect URLs
- `google_tracking_config`: GA/Ads settings
- `api_usage_stats`: API statistics

## Data Flow

### Stock Diagnosis Flow

```
1. User inputs stock code (4 digits)
   ↓
2. Frontend validates input
   ↓
3. POST /index/api/stock/search
   ↓
4. Backend checks cache
   ↓
5a. Cache hit → Return cached data
   ↓
5b. Cache miss → Fetch from kabutan.jp
   ↓
6. POST /index/api/gemini/diagnose
   ↓
7. Backend checks diagnosis cache
   ↓
8a. Cache hit → Return cached analysis
   ↓
8b. Cache miss → Call SiliconFlow API
   ↓
9. Stream AI response to frontend
   ↓
10. Save to cache
   ↓
11. User views analysis
   ↓
12. User clicks LINE button
   ↓
13. POST /index/api/line-redirects/get-redirect
   ↓
14. Backend selects URL (weighted round-robin)
   ↓
15. Track conversion event
   ↓
16. Redirect to LINE
```

### Traffic Filtering Flow

```
1. User visits domain.com/
   ↓
2. Nginx → index.php
   ↓
3. Collect user data:
   - IP address
   - User agent
   - Referer
   - Query params
   - Browser language
   ↓
4. POST to cloakit.house API
   ↓
5. API analyzes user:
   - Bot detection
   - Geo-location
   - Device type
   - Traffic source
   ↓
6. Return decision:
   - filter_page: 'offer' | 'white'
   - mode: 'redirect' | 'loading' | 'iframe'
   ↓
7a. Offer Page → Show /index (React app)
   ↓
7b. White Page → Show /home (Static HTML)
```

## Security Architecture

### Defense Layers

```
┌─────────────────────────────────────────┐
│ Layer 1: Nginx Security Headers         │
│ • CSP                                    │
│ • X-Frame-Options                        │
│ • X-Content-Type-Options                 │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│ Layer 2: Cloaking.House Filter          │
│ • Bot detection                          │
│ • Geo-blocking                           │
│ • Source filtering                       │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│ Layer 3: Express Middleware              │
│ • CORS validation                        │
│ • Rate limiting                          │
│ • JWT authentication                     │
└─────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│ Layer 4: Application Logic               │
│ • Input validation                       │
│ • SQL injection prevention               │
│ • XSS protection                         │
└─────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling

```
                    ┌─────────────┐
                    │ Load        │
                    │ Balancer    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │ Node.js │       │ Node.js │       │ Node.js │
   │ Instance│       │ Instance│       │ Instance│
   │    1    │       │    2    │       │    3    │
   └────┬────┘       └────┬────┘       └────┬────┘
        │                 │                  │
        └─────────────────┼──────────────────┘
                          ▼
                   ┌─────────────┐
                   │   SQLite    │
                   │  (Shared)   │
                   └─────────────┘
```

### Caching Strategy

```
Level 1: Browser Cache (Static Assets)
         ↓
Level 2: Nginx Cache (Static Files)
         ↓
Level 3: Application Cache (Stock Data)
         ↓
Level 4: Database (Diagnosis Cache)
         ↓
Level 5: External API (SiliconFlow)
```

## Monitoring Points

### Health Checks

```
1. Nginx Status
   → systemctl status nginx

2. PHP-FPM Status
   → systemctl status php8.2-fpm

3. Node.js Health
   → curl http://localhost:3001/index/health

4. Database Connection
   → Check SQLite file locks

5. External APIs
   → Monitor response times
```

### Metrics to Track

- Request rate (per endpoint)
- Response time (p50, p95, p99)
- Error rate (4xx, 5xx)
- Cache hit rate
- Database query time
- API quota usage
- Concurrent connections
- Memory usage
- CPU usage

## Deployment Architecture

### Development

```
Developer Machine
├── Frontend: Vite Dev Server (5173)
├── Backend: Node.js (3001)
└── Database: SQLite (local file)
```

### Production (Docker)

```
Docker Host
├── nginx:latest (80, 443)
├── php:8.2-fpm (9000)
├── node:20-alpine (3001)
└── Shared Volumes
    ├── /var/www/html
    └── /var/log/nginx
```

### Production (Manual)

```
Linux Server
├── Nginx (systemd)
├── PHP-FPM (systemd)
├── Node.js (PM2/systemd)
└── SQLite (file system)
```

## Technology Stack Summary

| Layer       | Technology        | Version | Purpose                |
|-------------|-------------------|---------|------------------------|
| Web Server  | Nginx            | 1.20+   | Reverse proxy          |
| PHP Runtime | PHP-FPM          | 8.2+    | Traffic filtering      |
| Backend     | Node.js          | 20+     | API server             |
| Framework   | Express          | 4.18    | Web framework          |
| Frontend    | React            | 18      | UI library             |
| Build Tool  | Vite             | 5.4     | Build & dev server     |
| Database    | SQLite           | 3       | Data persistence       |
| AI API      | SiliconFlow      | -       | Stock analysis         |
| Analytics   | Google GA4       | -       | User tracking          |
| Traffic     | Cloaking.House   | -       | User filtering         |
| Container   | Docker           | -       | Deployment             |

---

This architecture provides:
- ✅ Flexibility in traffic routing
- ✅ High performance
- ✅ Security through layers
- ✅ Easy maintenance
- ✅ Horizontal scalability
- ✅ Clear separation of concerns
