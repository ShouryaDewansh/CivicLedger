#!/bin/bash

# CivicLedger Fullstack Startup Script

echo "🚀 Starting CivicLedger Fullstack Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backend is already running
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null ; then
    echo "${GREEN}✓${NC} Backend already running on port 4000"
else
    echo "${BLUE}Starting Backend...${NC}"
    cd /Users/shouryadewansh/Downloads/CivicLedger
    npm run dev > /tmp/civicledger-backend.log 2>&1 &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    sleep 3
    echo "${GREEN}✓${NC} Backend started on http://localhost:4000"
fi

# Check if frontend is already running
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "${GREEN}✓${NC} Frontend already running on port 8080"
else
    echo "${BLUE}Starting Frontend...${NC}"
    cd /Users/shouryadewansh/Downloads/ledger-witness-hub
    npm run dev > /tmp/civicledger-frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    sleep 5
    echo "${GREEN}✓${NC} Frontend started on http://localhost:8080"
fi

echo ""
echo "════════════════════════════════════════════════"
echo "   CivicLedger Fullstack Running!"
echo "════════════════════════════════════════════════"
echo ""
echo "📡 Backend API:  http://localhost:4000/api"
echo "🎨 Frontend App: http://localhost:8080"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f /tmp/civicledger-backend.log"
echo "   Frontend: tail -f /tmp/civicledger-frontend.log"
echo ""
echo "🛑 To stop:"
echo "   pkill -f 'node.*server.js'"
echo "   pkill -f 'vite'"
echo ""
echo "Opening browser..."
sleep 2
open http://localhost:8080

echo ""
echo "✅ Application ready!"

