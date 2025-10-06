#!/bin/bash

# ========================================
# Ticketing System - Quick Start Script
# ========================================

set -e

echo "🚀 Starting Ticketing System..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker first: https://docs.docker.com/engine/install/"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    echo "Please install Docker Compose plugin"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"
echo ""

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ docker-compose.yml not found!${NC}"
    echo "Please make sure you're in the project root directory"
    exit 1
fi

# Warning about default credentials
echo -e "${YELLOW}⚠️  WARNING: Using default configuration${NC}"
echo "Please review and update the following in docker-compose.yml:"
echo "  - POSTGRES_PASSWORD"
echo "  - JWT_SECRET"
echo "  - NEXT_PUBLIC_API_URL"
echo ""
read -p "Have you updated the configuration? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please update docker-compose.yml before continuing${NC}"
    exit 0
fi

# Stop existing containers
echo "🔄 Stopping existing containers..."
docker compose down

# Build and start containers
echo "🔨 Building and starting containers..."
docker compose up -d --build

# Wait for containers to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check container status
echo ""
echo "📊 Container Status:"
docker compose ps

# Show logs
echo ""
echo "📝 Recent Logs:"
docker compose logs --tail=20

echo ""
echo -e "${GREEN}✅ Ticketing System is running!${NC}"
echo ""
echo "🌐 Access the application at: http://localhost:3000"
echo ""
echo "📝 Default Login:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo -e "${YELLOW}⚠️  Please change the password after first login!${NC}"
echo ""
echo "💡 Useful Commands:"
echo "   View logs:       docker compose logs -f"
echo "   Stop:            docker compose stop"
echo "   Start:           docker compose start"
echo "   Restart:         docker compose restart"
echo "   Remove all:      docker compose down -v"
echo ""

