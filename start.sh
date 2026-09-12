#!/bin/bash
set -e

echo "================================================="
echo "🚀 Starting Presenton Presentation Automation Suite"
echo "================================================="

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "1. Installing backend dependencies..."
cd "$ROOT_DIR/backend"
npm install --quiet

echo "2. Installing & building MCP server..."
cd "$ROOT_DIR/mcp-server"
npm install --quiet
npm run build --quiet

echo "3. Starting Presentation Engine & Web Frontend on http://localhost:5001 ..."
# Clear any existing process listening on port 5001
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

cd "$ROOT_DIR/backend"
npm start

