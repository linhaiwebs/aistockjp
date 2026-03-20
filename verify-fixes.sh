#!/bin/bash

# Verification Script - Check if all 502 fixes are in place

echo "======================================"
echo "502 Error Fix Verification"
echo "======================================"
echo ""

ERRORS=0

# Check 1: Frontend build exists
echo "✓ Check 1: Frontend dist folder"
if [ -d "index/dist" ]; then
    echo "  ✅ PASS: dist folder exists"
    echo "     Files: $(ls -1 index/dist | wc -l) items"
else
    echo "  ❌ FAIL: dist folder missing"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 2: PHP curl check is fixed
echo "✓ Check 2: PHP curl extension check"
if grep -q "function_exists('curl_init')" index.php; then
    echo "  ✅ PASS: PHP uses function_exists() check"
else
    echo "  ❌ FAIL: PHP still uses extension_loaded() check"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 3: Nginx configuration
echo "✓ Check 3: Nginx direct proxy configuration"
if grep -q "location /index/" nginx.conf && grep -A 5 "location /index/" nginx.conf | grep -q "proxy_pass.*nodejs:3001"; then
    echo "  ✅ PASS: Nginx directly proxies to Node.js"
else
    echo "  ❌ FAIL: Nginx configuration issue"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 4: Docker health check
echo "✓ Check 4: Node.js container health check"
if grep -q "healthcheck:" docker-compose.yml && grep -A 5 "nodejs:" docker-compose.yml | grep -q "healthcheck:"; then
    echo "  ✅ PASS: Health check configured"
else
    echo "  ⚠️  WARNING: Health check not found in docker-compose"
fi
echo ""

# Check 5: Node.js dependencies
echo "✓ Check 5: Node.js dependencies installed"
if [ -d "index/node_modules" ]; then
    echo "  ✅ PASS: node_modules exists"
else
    echo "  ⚠️  WARNING: node_modules not found (run: cd index && npm install)"
fi
echo ""

# Summary
echo "======================================"
if [ $ERRORS -eq 0 ]; then
    echo "✅ All critical checks passed!"
    echo ""
    echo "Next steps:"
    echo "  1. Run: ./rebuild-and-deploy.sh"
    echo "  2. Wait for containers to start (30-60 seconds)"
    echo "  3. Test: curl http://localhost:8000/index/"
else
    echo "❌ $ERRORS critical check(s) failed!"
    echo ""
    echo "Please fix the errors above before deploying."
fi
echo "======================================"
echo ""
