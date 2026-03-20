#!/bin/bash

# Rebuild and Deploy Script for Stock AI Service
# This script fixes the 502 error by ensuring proper build and deployment

set -e

echo "======================================"
echo "Stock AI Service - Rebuild & Deploy"
echo "======================================"
echo ""

# Navigate to project root
cd "$(dirname "$0")"

echo "✅ Step 1: Building frontend application..."
cd index
npm install
npm run build
cd ..

echo ""
echo "✅ Step 2: Verifying dist folder exists..."
if [ -d "index/dist" ]; then
    echo "   ✓ dist folder found with $(ls -1 index/dist | wc -l) items"
    ls -lh index/dist/
else
    echo "   ✗ ERROR: dist folder not found!"
    exit 1
fi

echo ""
echo "✅ Step 3: Stopping existing containers..."
docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true

echo ""
echo "✅ Step 4: Removing old images..."
docker rmi stock-ai-nodejs 2>/dev/null || true
docker rmi stock-ai-php 2>/dev/null || true

echo ""
echo "✅ Step 5: Building Docker images (this may take a few minutes)..."
docker compose build --no-cache || docker-compose build --no-cache

echo ""
echo "✅ Step 6: Starting containers..."
docker compose up -d || docker-compose up -d

echo ""
echo "✅ Step 7: Waiting for containers to be healthy..."
sleep 10

echo ""
echo "✅ Step 8: Checking container status..."
docker compose ps || docker-compose ps

echo ""
echo "✅ Step 9: Testing endpoints..."
echo ""

echo "Testing PHP endpoint (/)..."
sleep 5
curl -I http://localhost:8000/ 2>&1 | head -10 || echo "Warning: PHP endpoint test failed"

echo ""
echo "Testing Node.js health endpoint (/index/health)..."
sleep 2
curl -s http://localhost:8000/index/health 2>&1 || echo "Warning: Health endpoint test failed"

echo ""
echo "Testing React app (/index/)..."
sleep 2
curl -I http://localhost:8000/index/ 2>&1 | head -5 || echo "Warning: React app test failed"

echo ""
echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo ""
echo "Service URLs:"
echo "  PHP Cloaking:     http://localhost:8000/"
echo "  React App:        http://localhost:8000/index/"
echo "  API Endpoints:    http://localhost:8000/index/api/"
echo "  Admin Dashboard:  http://localhost:8000/index/admin/login"
echo ""
echo "Container logs:"
echo "  All logs:    docker compose logs -f"
echo "  Node.js:     docker compose logs -f nodejs"
echo "  PHP:         docker compose logs -f php"
echo "  Nginx:       docker compose logs -f nginx"
echo ""
echo "Health check:"
echo "  docker compose ps"
echo ""
