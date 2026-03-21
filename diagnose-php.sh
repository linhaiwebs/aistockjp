#!/bin/bash

set -e

echo "==================================="
echo "PHP Container Diagnostic Tool"
echo "==================================="
echo ""

COMPOSE_CMD="docker compose"
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed"
        exit 1
    fi
fi

echo "📋 Checking container status..."
$COMPOSE_CMD ps

echo ""
echo "📋 Checking PHP container..."
if $COMPOSE_CMD ps | grep -q "stock-ai-php"; then
    echo "✅ PHP container exists"

    if $COMPOSE_CMD ps | grep "stock-ai-php" | grep -q "Up"; then
        echo "✅ PHP container is running"

        echo ""
        echo "📋 Checking PHP-FPM process..."
        if $COMPOSE_CMD exec php pgrep php-fpm > /dev/null 2>&1; then
            echo "✅ PHP-FPM is running"
            PIDS=$($COMPOSE_CMD exec php pgrep php-fpm | tr '\n' ' ')
            echo "   PIDs: $PIDS"
        else
            echo "❌ PHP-FPM is not running"
        fi

        echo ""
        echo "📋 PHP Version..."
        $COMPOSE_CMD exec php php -v

        echo ""
        echo "📋 PHP Extensions..."
        $COMPOSE_CMD exec php php -m | grep -E "(mbstring|curl|openssl|json|filter)" || echo "Some extensions missing"

        echo ""
        echo "📋 PHP Configuration Test..."
        $COMPOSE_CMD exec php php-fpm -t || echo "❌ PHP-FPM configuration test failed"

        echo ""
        echo "📋 Checking PHP-FPM configuration..."
        $COMPOSE_CMD exec php cat /usr/local/etc/php-fpm.d/www.conf | grep -E "(listen|pm)" | head -10

        echo ""
        echo "📋 Checking PHP error logs..."
        $COMPOSE_CMD exec php sh -c "[ -f /var/log/php/error.log ] && tail -20 /var/log/php/error.log || echo 'No error log found'"

        echo ""
        echo "📋 Testing network connectivity to PHP-FPM..."
        $COMPOSE_CMD exec nginx sh -c "nc -zv stock-ai-php 9000 || echo '❌ Cannot connect to PHP-FPM on port 9000'"

    else
        echo "❌ PHP container is not running"
        echo ""
        echo "📋 Container logs:"
        $COMPOSE_CMD logs --tail=50 php
    fi
else
    echo "❌ PHP container does not exist"
fi

echo ""
echo "📋 Checking Nginx configuration..."
if $COMPOSE_CMD ps | grep "stock-ai-nginx" | grep -q "Up"; then
    echo "✅ Nginx is running"
    $COMPOSE_CMD exec nginx nginx -t || echo "❌ Nginx configuration test failed"
else
    echo "❌ Nginx is not running"
fi

echo ""
echo "==================================="
echo "Diagnostic complete!"
echo "==================================="
