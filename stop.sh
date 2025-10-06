#!/bin/bash

# ========================================
# Ticketing System - Stop Script
# ========================================

echo "🛑 Stopping Ticketing System..."
echo ""

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found!"
    echo "Please make sure you're in the project root directory"
    exit 1
fi

# Stop containers
docker compose stop

echo ""
echo "✅ Ticketing System stopped"
echo ""
echo "💡 To start again: ./start.sh or docker compose start"
echo "💡 To remove all: docker compose down -v"
echo ""

