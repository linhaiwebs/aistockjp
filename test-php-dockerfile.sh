#!/bin/bash

echo "Testing PHP Dockerfile configuration..."

# Create a temporary test directory
TEST_DIR=$(mktemp -d)
echo "Test directory: $TEST_DIR"

# Copy necessary files
cp Dockerfile.php "$TEST_DIR/"
cp php.ini "$TEST_DIR/"
cp index.php "$TEST_DIR/"

cd "$TEST_DIR"

# Create a simple docker-compose for testing
cat > docker-compose.test.yml << 'EOF'
services:
  php:
    build:
      context: .
      dockerfile: Dockerfile.php
    container_name: test-php-fpm
    volumes:
      - ./:/var/www/html
    working_dir: /var/www/html
    command: ["sh", "-c", "php-fpm -t && php-fpm -F"]
EOF

echo "Building PHP container..."
if docker compose -f docker-compose.test.yml build; then
    echo "✅ Build successful"

    echo "Starting PHP container..."
    docker compose -f docker-compose.test.yml up -d

    sleep 5

    echo "Checking if PHP-FPM is running..."
    if docker compose -f docker-compose.test.yml exec php pgrep php-fpm; then
        echo "✅ PHP-FPM is running"
    else
        echo "❌ PHP-FPM is not running"
        docker compose -f docker-compose.test.yml logs
    fi

    echo "Testing PHP configuration..."
    docker compose -f docker-compose.test.yml exec php php -v
    docker compose -f docker-compose.test.yml exec php php -m | grep -E "(mbstring|openssl|json|filter)"

    echo "Cleaning up..."
    docker compose -f docker-compose.test.yml down
else
    echo "❌ Build failed"
    exit 1
fi

cd -
rm -rf "$TEST_DIR"

echo "Test complete!"
