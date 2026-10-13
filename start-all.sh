#!/usr/bin/env bash
# Cadence Campus Pulse - System Launcher for macOS / Linux
echo "================================================================"
echo "  CADENCE CAMPUS PULSE - REAL-TIME ALERT PLATFORM"
echo "================================================================"
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not found in your PATH!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "[1/3] Verifying backend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "[2/3] Verifying frontend dependencies..."
if [ ! -d "frontend/node_modules" ]; then
    cd frontend && npm install && cd ..
fi

echo "[3/3] Starting full-stack system orchestrator..."
echo "Gateway:  http://localhost:4000"
echo "Frontend: http://localhost:3000"
echo ""
npm run dev:all
