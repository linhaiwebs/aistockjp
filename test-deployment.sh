#!/bin/bash

set -e

echo "🧪 Testing Docker Deployment Fixes..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_condition() {
    local test_name=$1
    local command=$2

    echo -n "Testing: $test_name... "

    if eval "$command" &> /dev/null; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
    fi
}

echo "=== Phase 1: File Existence Checks ==="
test_condition "docker-compose.yml exists" "[ -f docker-compose.yml ]"
test_condition "docker-compose.optimized.yml exists" "[ -f docker-compose.optimized.yml ]"
test_condition "Dockerfile.php exists" "[ -f Dockerfile.php ]"
test_condition "Dockerfile.nodejs exists" "[ -f Dockerfile.nodejs ]"
test_condition "php.ini exists" "[ -f php.ini ]"
test_condition ".dockerignore exists" "[ -f .dockerignore ]"
echo ""

echo "=== Phase 2: Configuration Validation ==="
test_condition "php.ini does not load openssl as extension" "! grep -q '^extension=openssl' php.ini"
test_condition "php.ini does not load json as extension" "! grep -q '^extension=json' php.ini"
test_condition "php.ini loads curl extension" "grep -q '^extension=curl' php.ini"
test_condition "php.ini loads mbstring extension" "grep -q '^extension=mbstring' php.ini"
echo ""

echo "=== Phase 3: Docker Compose Configuration ==="
test_condition "docker-compose has libonig-dev dependency" "grep -q 'libonig-dev' docker-compose.yml"
test_condition "docker-compose uses npm install --include=dev" "grep -q 'npm install --include=dev' docker-compose.yml"
test_condition "docker-compose has node_modules volume" "grep -q 'node_modules:' docker-compose.yml"
test_condition "docker-compose has health check dependency" "grep -q 'condition: service_healthy' docker-compose.yml"
echo ""

echo "=== Phase 4: Dockerfile Validation ==="
test_condition "Dockerfile.php installs libonig-dev" "grep -q 'libonig-dev' Dockerfile.php"
test_condition "Dockerfile.php installs curl and mbstring" "grep -q 'curl mbstring' Dockerfile.php"
test_condition "Dockerfile.nodejs uses npm install --include=dev" "grep -q 'npm install --include=dev' Dockerfile.nodejs"
test_condition "Dockerfile.nodejs builds the application" "grep -q 'npm run build' Dockerfile.nodejs"
echo ""

echo "=== Phase 5: Node.js Project Structure ==="
test_condition "index/package.json exists" "[ -f index/package.json ]"
test_condition "index/package.json has vite devDependency" "grep -q '\"vite\"' index/package.json"
test_condition "index/package.json has build script" "grep -q '\"build\"' index/package.json"
test_condition "index directory has node_modules (or can install)" "[ -d index/node_modules ] || [ -f index/package.json ]"
echo ""

echo "=== Phase 6: Build Test (Local) ==="
cd index 2>/dev/null || true
if [ -f package.json ] && [ -d node_modules ]; then
    test_condition "Frontend builds successfully" "npm run build"
else
    echo -e "${YELLOW}⚠ Skipping build test (dependencies not installed)${NC}"
fi
cd .. 2>/dev/null || true
echo ""

echo "=== Test Summary ==="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Deployment configuration is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run ./start.sh to deploy with standard configuration"
    echo "  2. Run ./start.sh --optimized to deploy with Dockerfile-based configuration"
    echo "  3. Run ./start.sh --rebuild to force rebuild containers"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the configuration.${NC}"
    exit 1
fi
