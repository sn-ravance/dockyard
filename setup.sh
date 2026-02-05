#!/bin/bash

#######################################
# Dockyard Complete Setup Script
# This script installs everything needed to run Dockyard
#######################################

set -e

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "  $1"
}

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
    print_error "This script only works on macOS"
    exit 1
fi

print_header "Dockyard Setup Script"
echo "This script will install everything needed to run Dockyard."
echo "It may take 15-30 minutes to complete."
echo ""
read -p "Press Enter to continue (or Ctrl+C to cancel)..."

#######################################
# Step 1: Xcode Command Line Tools
#######################################
print_header "Step 1/5: Xcode Command Line Tools"

if xcode-select -p &> /dev/null; then
    print_success "Already installed"
else
    print_info "Installing Xcode Command Line Tools..."
    print_info "A popup window will appear - click 'Install' and wait for it to complete."
    xcode-select --install

    echo ""
    read -p "Press Enter after the installation popup completes..."

    if xcode-select -p &> /dev/null; then
        print_success "Installed successfully"
    else
        print_error "Installation failed. Please try running: xcode-select --install"
        exit 1
    fi
fi

#######################################
# Step 2: Homebrew
#######################################
print_header "Step 2/5: Homebrew"

if command -v brew &> /dev/null; then
    print_success "Already installed"
else
    print_info "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ -f /opt/homebrew/bin/brew ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi

    if command -v brew &> /dev/null; then
        print_success "Installed successfully"
    else
        print_error "Installation failed"
        exit 1
    fi
fi

#######################################
# Step 3: Rancher Desktop
#######################################
print_header "Step 3/5: Rancher Desktop"

if [ -d "/Applications/Rancher Desktop.app" ]; then
    print_success "Already installed"
else
    print_info "Installing Rancher Desktop..."
    brew install --cask rancher

    if [ -d "/Applications/Rancher Desktop.app" ]; then
        print_success "Installed successfully"
    else
        print_error "Installation failed"
        exit 1
    fi
fi

# Check if Rancher Desktop is configured and running
print_info "Checking Docker connectivity..."

if docker info &> /dev/null; then
    print_success "Docker is running"
else
    echo ""
    print_warning "Rancher Desktop needs to be configured"
    echo ""
    echo "Please do the following:"
    echo "  1. Open Rancher Desktop from Applications"
    echo "  2. Select 'dockerd (moby)' as the Container Engine"
    echo "  3. Turn OFF Kubernetes (you don't need it)"
    echo "  4. Click Accept/OK and wait for it to start"
    echo ""
    read -p "Press Enter after Rancher Desktop is running..."

    # Check again
    if docker info &> /dev/null; then
        print_success "Docker is now running"
    else
        # Try Rancher Desktop socket
        if DOCKER_HOST="unix://$HOME/.rd/docker.sock" docker info &> /dev/null; then
            print_success "Docker is running (via Rancher Desktop socket)"
        else
            print_error "Docker is not responding. Make sure Rancher Desktop is fully started."
            exit 1
        fi
    fi
fi

#######################################
# Step 4: Node.js
#######################################
print_header "Step 4/5: Node.js"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        print_success "Already installed ($(node -v))"
    else
        print_info "Upgrading Node.js..."
        brew install node@20
        print_success "Upgraded successfully"
    fi
else
    print_info "Installing Node.js..."
    brew install node@20

    if command -v node &> /dev/null; then
        print_success "Installed successfully ($(node -v))"
    else
        print_error "Installation failed"
        exit 1
    fi
fi

#######################################
# Step 5: Configure Dockyard
#######################################
print_header "Step 5/5: Configuring Dockyard"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating configuration file..."
    cp .env.example .env

    # Update socket path for Rancher Desktop if needed
    if [ -S "$HOME/.rd/docker.sock" ]; then
        sed -i '' "s|DOCKER_SOCKET=.*|DOCKER_SOCKET=$HOME/.rd/docker.sock|" .env
        print_info "Configured for Rancher Desktop socket"
    fi

    print_success "Configuration file created"
else
    print_success "Configuration file already exists"
fi

#######################################
# Complete!
#######################################
print_header "Setup Complete!"

echo "Everything is installed and configured."
echo ""
echo "To start Dockyard, run:"
echo ""
echo -e "  ${GREEN}cd $PROJECT_DIR${NC}"
echo -e "  ${GREEN}./scripts/start.sh${NC}"
echo ""
echo "Then open your browser to: http://localhost:3030"
echo ""
