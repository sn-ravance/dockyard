#!/bin/bash

#######################################
# Stop Dockyard
#######################################

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get the project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo ""
echo -e "${YELLOW}Stopping Dockyard...${NC}"
echo ""

# Check if containers are running
if ! docker compose ps --quiet 2>/dev/null | grep -q .; then
    echo "Dockyard is not running."
    exit 0
fi

# Stop the containers
docker compose down

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}Dockyard has been stopped${NC}"
    echo ""
    echo "To start again, run: ./scripts/start.sh"
    echo ""
else
    echo ""
    echo "There was an issue stopping Dockyard."
    echo "Try running: docker compose down --force"
    exit 1
fi
