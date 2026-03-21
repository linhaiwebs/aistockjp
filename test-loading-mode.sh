#!/bin/bash

echo "🧪 Testing Loading Mode Configuration"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if index-loading.html exists
echo "1. Checking index-loading.html..."
if [ -f "index-loading.html" ]; then
    echo -e "${GREEN}✓${NC} index-loading.html exists"
    SIZE=$(du -h index-loading.html | cut -f1)
    echo "  File size: $SIZE"
else
    echo -e "${RED}✗${NC} index-loading.html not found"
    echo "  Run: cd index && npm run build:loading"
    exit 1
fi

# Check if dist-loading exists
echo ""
echo "2. Checking dist-loading directory..."
if [ -d "index/dist-loading" ]; then
    echo -e "${GREEN}✓${NC} dist-loading directory exists"
    ASSET_COUNT=$(find index/dist-loading/assets -type f 2>/dev/null | wc -l)
    echo "  Asset files: $ASSET_COUNT"
else
    echo -e "${RED}✗${NC} dist-loading directory not found"
    echo "  Run: cd index && npm run build:loading"
    exit 1
fi

# Check if home/index.html exists
echo ""
echo "3. Checking white page (home/index.html)..."
if [ -f "home/index.html" ]; then
    echo -e "${GREEN}✓${NC} home/index.html exists"
else
    echo -e "${RED}✗${NC} home/index.html not found"
    exit 1
fi

# Check PHP cloaking script
echo ""
echo "4. Checking PHP cloaking script..."
if [ -f "index.php" ]; then
    echo -e "${GREEN}✓${NC} index.php exists"

    # Check if it contains loading mode logic
    if grep -q "mode_offer_page.*loading" index.php; then
        echo -e "${GREEN}✓${NC} Loading mode logic found"
    else
        echo -e "${YELLOW}⚠${NC} Loading mode logic not found (this is OK, handled by Cloaking.House)"
    fi
else
    echo -e "${RED}✗${NC} index.php not found"
    exit 1
fi

# Check Nginx configuration
echo ""
echo "5. Checking Nginx configuration..."
if [ -f "nginx.conf" ]; then
    echo -e "${GREEN}✓${NC} nginx.conf exists"

    # Check for assets location
    if grep -q "location /assets/" nginx.conf; then
        echo -e "${GREEN}✓${NC} Assets location configured"
    else
        echo -e "${RED}✗${NC} Assets location not configured"
    fi

    # Check for API proxy
    if grep -q "location /index/api/" nginx.conf; then
        echo -e "${GREEN}✓${NC} API proxy configured"
    else
        echo -e "${RED}✗${NC} API proxy not configured"
    fi
else
    echo -e "${YELLOW}⚠${NC} nginx.conf not found"
fi

# Check Docker configuration
echo ""
echo "6. Checking Docker configuration..."
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✓${NC} docker-compose.yml exists"
else
    echo -e "${YELLOW}⚠${NC} docker-compose.yml not found"
fi

echo ""
echo "======================================="
echo "📋 Cloaking.House Configuration:"
echo "======================================="
echo ""
echo "Flow Label: 2af62ff72f49e8e7b16d938da7a2f3a4"
echo ""
echo "Offer Page Settings:"
echo "  URL: index-loading.html"
echo "  Mode: loading"
echo ""
echo "White Page Settings:"
echo "  URL: home/index.html"
echo "  Mode: loading"
echo ""
echo "======================================="
echo "📝 Testing Instructions:"
echo "======================================="
echo ""
echo "1. Direct Access Test (should go to Node.js):"
echo "   http://iswstock.com/index/"
echo ""
echo "2. Root Access Test (should trigger cloaking):"
echo "   http://iswstock.com/"
echo ""
echo "3. Admin Access Test (should bypass cloaking):"
echo "   http://iswstock.com/index/adsadmin"
echo ""
echo "4. API Test (should work from both paths):"
echo "   curl http://iswstock.com/index/api/stock?code=7203"
echo ""
echo "======================================="
echo -e "${GREEN}✓${NC} All checks completed!"
echo ""
