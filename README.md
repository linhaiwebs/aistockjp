# AI Stock Diagnosis Service (AI株式診断サービス)

A sophisticated Japanese stock analysis platform with intelligent traffic routing using PHP, React, and Node.js.

## 🏗️ Architecture

This project uses a three-tier architecture with PHP-based traffic filtering:

```
┌─────────────────────────────────────────────────┐
│            Root (/) - index.php                 │
│        Cloaking.House Traffic Filter            │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│  /index/*    │    │   /home/*    │
│  React App   │    │  Static HTML │
│  + Node.js   │    │              │
└──────────────┘    └──────────────┘
```

### Components

- **PHP Entry Point** (`index.php`): Cloaking.House script that filters traffic and routes users
- **React Application** (`/index`): Main stock diagnosis service with AI-powered analysis
- **Static HTML Site** (`/home`): Alternative landing page for filtered traffic
- **Node.js Backend**: Express API server handling stock data and AI integration

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# 1. Configure environment
cd index
cp .env.example .env
# Edit .env with your API keys

# 2. Deploy all services
docker-compose up -d

# 3. View logs
docker-compose logs -f
```

The application will be available at:
- Root: `http://localhost/` (PHP traffic filter)
- React App: `http://localhost/index/`
- Static Site: `http://localhost/home/`

### Manual Installation

```bash
# 1. Install dependencies
npm run install:all

# 2. Configure environment
cd index
cp .env.example .env
# Edit .env with your configuration

# 3. Build the application
cd ..
npm run build

# 4. Start services (requires Nginx and PHP-FPM configured)
npm run start:prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
project/
├── index.php              # PHP entry point (Cloaking.House)
├── nginx.conf             # Nginx configuration
├── docker-compose.yml     # Docker orchestration
├── php.ini                # PHP settings
├── package.json           # Root package manager
├── README.md              # This file
├── DEPLOYMENT.md          # Deployment guide
│
├── index/                 # React + Node.js application
│   ├── src/              # React frontend
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities
│   │   ├── hooks/        # Custom hooks
│   │   └── types/        # TypeScript types
│   │
│   ├── server/           # Node.js backend
│   │   ├── routes/       # API routes
│   │   ├── database/     # SQLite setup
│   │   ├── utils/        # Server utilities
│   │   └── middleware/   # Express middleware
│   │
│   ├── public/           # Static assets
│   ├── package.json      # Node.js dependencies
│   └── vite.config.ts    # Vite configuration
│
└── home/                 # Static HTML site
    ├── index.html        # Landing page
    └── styles.css        # Styles
```

## 🔧 Configuration

### Environment Variables

Create `/index/.env`:

```env
# API Configuration
SILICONFLOW_API_KEY=your_api_key_here
NODE_ENV=production
API_PORT=3001

# CORS
CORS_ORIGIN=http://yourdomain.com

# Proxy
TRUST_PROXY=true

# Google Tracking
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### PHP Configuration

Edit `index.php` (line 118) with your Cloaking.House label:

```php
'label' => 'your_cloaking_house_label_here',
```

### Nginx Configuration

The `nginx.conf` file is pre-configured for:
- PHP-FPM on Unix socket
- Node.js proxy on port 3001
- Static file serving for `/home`
- Security headers

Adjust paths and ports as needed for your environment.

## 🛠️ Development

### Run Development Servers

```bash
# Terminal 1: Backend server
npm run dev:backend

# Terminal 2: Frontend dev server
npm run dev:frontend

# Or run both together
npm run dev:all
```

### Available Scripts

```bash
npm run install:all     # Install all dependencies
npm run build          # Build React app for production
npm run dev:frontend   # Start Vite dev server
npm run dev:backend    # Start Express API server
npm run dev:all        # Start both dev servers
npm run start          # Start production server
npm run create-admin   # Create admin user
npm run deploy         # Build and deploy with Docker
npm run logs           # View Docker logs
npm run stop           # Stop Docker containers
```

## 🎯 Features

### Main Application (`/index`)

- ✅ AI-powered stock analysis using SiliconFlow API
- ✅ Real-time stock data from Kabutan.jp
- ✅ Streaming AI responses
- ✅ DOCX report generation
- ✅ LINE messenger integration
- ✅ Google Analytics & Ads tracking
- ✅ Admin dashboard with analytics
- ✅ Caching system for cost optimization
- ✅ Session tracking and conversion funnels

### Static Site (`/home`)

- ✅ Lightweight landing page
- ✅ SEO optimized
- ✅ Fast loading times
- ✅ Mobile responsive

### Traffic Routing (`index.php`)

- ✅ Cloaking.House integration
- ✅ User filtering based on various criteria
- ✅ Automatic routing to `/index` or `/home`
- ✅ Support for redirect and iframe modes

## 📊 Database Schema

The application uses SQLite with the following main tables:

- `admin_users`: Admin authentication
- `user_sessions`: User session tracking
- `user_events`: Event analytics
- `stocks`: Stock information cache
- `diagnosis_cache`: AI diagnosis cache
- `redirect_links`: LINE redirect management
- `google_tracking_config`: Google tracking settings

## 🔒 Security

- HTTPS recommended for production
- Environment variables for sensitive data
- CORS configuration
- Security headers (CSP, X-Frame-Options, etc.)
- JWT authentication for admin
- Rate limiting
- Input validation
- SQL injection prevention

## 📈 Monitoring

### Health Checks

```bash
# Node.js API
curl http://localhost:3001/index/health

# Nginx
curl http://localhost/

# Check services
docker-compose ps
```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nodejs
docker-compose logs -f nginx
docker-compose logs -f php
```

## 🐛 Troubleshooting

Common issues and solutions are documented in [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting).

Quick checks:

1. **PHP not working**: Check extensions with `php -m`
2. **Node.js API 502**: Verify Node.js is running on port 3001
3. **React app 404**: Check build output in `index/dist/`
4. **CORS errors**: Update `CORS_ORIGIN` in `.env`

## 📝 License

ISC

## 🤝 Contributing

This is a private project. Contact the repository owner for contribution guidelines.

## 📧 Support

For issues related to:
- **Cloaking.House**: Contact Cloaking.House support
- **Application bugs**: Check logs and open an issue
- **Deployment**: See DEPLOYMENT.md

## 🎓 Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, SQLite
- **Traffic Routing**: PHP 8.2+, Cloaking.House
- **Server**: Nginx, PHP-FPM
- **AI**: SiliconFlow API (Qwen2.5-7B-Instruct)
- **Analytics**: Google Analytics 4, Google Ads
- **Deployment**: Docker, Docker Compose

---

**Note**: This project includes the Cloaking.House traffic filtering system. Ensure you have proper authorization and comply with all applicable laws and regulations when using traffic filtering technologies.
