#!/bin/bash

set -e

echo "🚀 Starting Stock AI Service Deployment..."

# Check if docker and docker-compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Determine which docker-compose command to use
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Parse command line arguments
COMPOSE_FILE="docker-compose.yml"
REBUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --optimized)
            COMPOSE_FILE="docker-compose.optimized.yml"
            shift
            ;;
        --rebuild)
            REBUILD=true
            shift
            ;;
        --clean)
            echo "🧹 Cleaning up existing containers and volumes..."
            $DOCKER_COMPOSE -f $COMPOSE_FILE down -v
            docker system prune -f
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --optimized    Use optimized Dockerfile-based deployment"
            echo "  --rebuild      Force rebuild of containers"
            echo "  --clean        Clean up containers and volumes before starting"
            echo "  --help         Show this help message"
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1"
            echo "Use --help to see available options"
            exit 1
            ;;
    esac
done

echo "📝 Using configuration: $COMPOSE_FILE"

# Stop existing containers
echo "🛑 Stopping existing containers..."
$DOCKER_COMPOSE -f $COMPOSE_FILE down

# Rebuild if requested
if [ "$REBUILD" = true ]; then
    echo "🔨 Building containers..."
    $DOCKER_COMPOSE -f $COMPOSE_FILE build --no-cache
fi

# Start containers
echo "▶️  Starting containers..."
$DOCKER_COMPOSE -f $COMPOSE_FILE up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 5

# Check status
echo ""
echo "📊 Container Status:"
$DOCKER_COMPOSE -f $COMPOSE_FILE ps

# Check health
echo ""
echo "🏥 Health Check:"
for i in {1..30}; do
    if $DOCKER_COMPOSE -f $COMPOSE_FILE ps | grep -q "healthy"; then
        echo "✅ Services are healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "⚠️  Services are taking longer than expected to become healthy."
        echo "Check logs with: $DOCKER_COMPOSE -f $COMPOSE_FILE logs"
        break
    fi
    sleep 2
done

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Quick commands:"
echo "  View logs:       $DOCKER_COMPOSE -f $COMPOSE_FILE logs -f"
echo "  Stop services:   $DOCKER_COMPOSE -f $COMPOSE_FILE down"
echo "  Restart:         $DOCKER_COMPOSE -f $COMPOSE_FILE restart"
echo "  Status:          $DOCKER_COMPOSE -f $COMPOSE_FILE ps"
echo ""
echo "🌐 Access the application at: http://localhost"
