#!/bin/bash

#######################################
# Start Dockyard
#######################################

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get the project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo ""
echo -e "${GREEN}Starting Dockyard...${NC}"
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

# Check if containers are already running
if docker compose ps --quiet 2>/dev/null | grep -q .; then
    echo -e "${YELLOW}Dockyard is already running${NC}"
    echo ""
    echo "To restart, run: ./scripts/restart.sh"
    echo "To stop, run: ./scripts/stop.sh"
    echo ""
    echo "Open your browser to: http://localhost:3030"
    exit 0
fi

# Start the containers
echo "Building and starting containers..."
echo "(This may take a few minutes the first time)"
echo ""

docker compose up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}  Dockyard is now running!${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo "Open your browser to: http://localhost:3030"
    echo ""
    echo "To view logs: docker compose logs -f"
    echo "To stop: ./scripts/stop.sh"
    echo ""
else
    echo ""
    echo -e "${RED}Failed to start Dockyard${NC}"
    echo ""
    echo "Try running: docker compose logs"
    echo "to see what went wrong."
    exit 1
fi
