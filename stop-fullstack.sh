#!/bin/bash

# CivicLedger Fullstack Stop Script

echo "🛑 Stopping CivicLedger Fullstack Application..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Stop backend
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping Backend (port 4000)..."
    lsof -ti:4000 | xargs kill -9 2>/dev/null
    echo "${GREEN}✓${NC} Backend stopped"
else
    echo "${RED}✗${NC} Backend not running"
fi

# Stop frontend
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "Stopping Frontend (port 8080)..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    echo "${GREEN}✓${NC} Frontend stopped"
else
    echo "${RED}✗${NC} Frontend not running"
fi

# Clean up log files
echo ""
echo "Cleaning up logs..."
rm -f /tmp/civicledger-backend.log
rm -f /tmp/civicledger-frontend.log
echo "${GREEN}✓${NC} Logs cleaned"

echo ""
echo "✅ All services stopped!"

