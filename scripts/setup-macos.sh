#!/bin/bash

# Dockyard Setup Script for macOS
# This script automates the setup process for Dockyard

set -e

echo "=========================================="
echo "  Dockyard Setup Script for macOS"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
info() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
    error "This script is designed for macOS only"
fi

# Step 1: Check Xcode CLI tools
info "Checking Xcode Command Line Tools..."
if xcode-select -p &> /dev/null; then
    info "Xcode CLI tools are installed"
else
    warn "Installing Xcode CLI tools..."
    xcode-select --install
    echo "Please wait for installation to complete, then run this script again"
    exit 0
fi

# Step 2: Check Homebrew
info "Checking Homebrew..."
if command -v brew &> /dev/null; then
    info "Homebrew is installed"
else
    warn "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add Homebrew to PATH for Apple Silicon
    if [[ -f /opt/homebrew/bin/brew ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi

# Step 3: Check Rancher Desktop
info "Checking Rancher Desktop..."
if [ -d "/Applications/Rancher Desktop.app" ]; then
    info "Rancher Desktop is installed"
else
    warn "Installing Rancher Desktop..."
    brew install --cask rancher
    echo ""
    warn "Please launch Rancher Desktop and complete initial setup:"
    echo "  1. Open Rancher Desktop from Applications"
    echo "  2. Select 'dockerd (moby)' as the container engine"
    echo "  3. Disable Kubernetes if not needed"
    echo "  4. Wait for initialization to complete"
    echo ""
    read -p "Press Enter after Rancher Desktop is configured..."
fi

# Step 4: Check Node.js
info "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        info "Node.js $(node -v) is installed"
    else
        warn "Node.js version is too old, installing Node.js 20..."
        brew install node@20
    fi
else
    warn "Installing Node.js 20..."
    brew install node@20
fi

# Step 5: Verify Docker connectivity
info "Checking Docker connectivity..."

# Try standard socket first
if docker info &> /dev/null; then
    info "Docker is accessible via default socket"
    DOCKER_SOCKET="/var/run/docker.sock"
# Try Rancher Desktop socket
elif DOCKER_HOST="unix://$HOME/.rd/docker.sock" docker info &> /dev/null; then
    info "Docker is accessible via Rancher Desktop socket"
    DOCKER_SOCKET="$HOME/.rd/docker.sock"
else
    error "Cannot connect to Docker. Please ensure Rancher Desktop is running and configured."
fi

# Step 6: Setup project
PROJECT_DIR="/Users/rob.vance@sleepnumber.com/Documents/GitHub/docker-ui"

if [ -d "$PROJECT_DIR" ]; then
    info "Project directory exists"
    cd "$PROJECT_DIR"
else
    error "Project directory not found: $PROJECT_DIR"
fi

# Step 7: Create .env file
info "Creating environment configuration..."
if [ ! -f .env ]; then
    cp .env.example .env

    # Update Docker socket path if using Rancher Desktop
    if [[ "$DOCKER_SOCKET" == *".rd"* ]]; then
        sed -i '' "s|DOCKER_SOCKET=.*|DOCKER_SOCKET=$DOCKER_SOCKET|" .env
    fi

    info ".env file created"
else
    info ".env file already exists"
fi

# Step 8: Install dependencies
info "Installing backend dependencies..."
cd backend
npm install

info "Installing frontend dependencies..."
cd ../frontend
npm install

cd ..

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "  Option 1: Using Docker Compose (recommended)"
echo "    docker compose up --build"
echo ""
echo "  Option 2: Development mode"
echo "    Terminal 1: cd backend && npm run dev"
echo "    Terminal 2: cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Docker socket configured: $DOCKER_SOCKET"
echo ""
