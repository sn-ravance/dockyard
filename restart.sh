#!/bin/bash

#######################################
# Restart Dockyard
#######################################

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get the project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo ""
echo -e "${YELLOW}Restarting Dockyard...${NC}"
echo ""

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker is not running${NC}"
    echo ""
    echo "Please start Rancher Desktop first:"
    echo "  1. Open Rancher Desktop from Applications"
    echo "  2. Wait for it to fully start (green checkmark)"
    echo "  3. Run this script again"
    echo ""
    exit 1
fi

# Stop if running
if docker compose ps --quiet 2>/dev/null | grep -q .; then
    echo "Stopping current instance..."
    docker compose down
fi

# Rebuild and start
echo ""
echo "Building and starting containers..."
echo "(This may take a few minutes)"
echo ""

docker compose up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}  Dockyard has been restarted!${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo "Open your browser to: http://localhost:3030"
    echo ""
    echo "To view logs: docker compose logs -f"
    echo "To stop: ./scripts/stop.sh"
    echo ""
else
    echo ""
    echo -e "${RED}Failed to restart Dockyard${NC}"
    echo ""
    echo "Try running: docker compose logs"
    echo "to see what went wrong."
    exit 1
fi
