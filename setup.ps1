#######################################
# Dockyard Complete Setup Script for Windows
# This script installs everything needed to run Dockyard
#######################################

# Requires running as Administrator for some steps

# Colors and formatting
function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[!] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[X] $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "    $Message" -ForegroundColor White
}

# Check if running as Administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Main script starts here
Clear-Host

Write-Header "Dockyard Setup Script for Windows"

Write-Host "This script will install everything needed to run Dockyard."
Write-Host "It may take 20-30 minutes to complete."
Write-Host ""
Write-Host "You may be asked to restart your computer during this process."
Write-Host ""

$continue = Read-Host "Press Enter to continue (or Ctrl+C to cancel)"

#######################################
# Step 1: Check Windows Version
#######################################
Write-Header "Step 1/5: Checking Windows Version"

$osVersion = [System.Environment]::OSVersion.Version
$buildNumber = $osVersion.Build

if ($buildNumber -ge 18362) {
    Write-Success "Windows version is compatible (Build $buildNumber)"
} else {
    Write-Error "Windows 10 version 1903 or newer is required"
    Write-Info "Your build number: $buildNumber (need 18362 or higher)"
    Write-Info "Please update Windows and try again."
    exit 1
}

#######################################
# Step 2: WSL2
#######################################
Write-Header "Step 2/5: WSL2 (Windows Subsystem for Linux)"

# Check if WSL is installed
$wslInstalled = $false
try {
    $wslVersion = wsl --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $wslInstalled = $true
    }
} catch {
    $wslInstalled = $false
}

if ($wslInstalled) {
    Write-Success "WSL2 is already installed"
} else {
    Write-Info "WSL2 needs to be installed..."
    Write-Host ""

    if (Test-Administrator) {
        Write-Info "Installing WSL2..."
        wsl --install --no-distribution

        Write-Host ""
        Write-Warning "RESTART REQUIRED"
        Write-Host ""
        Write-Info "WSL2 has been installed but requires a restart."
        Write-Info "Please restart your computer, then run this script again."
        Write-Host ""

        $restart = Read-Host "Would you like to restart now? (y/n)"
        if ($restart -eq 'y' -or $restart -eq 'Y') {
            Restart-Computer
        }
        exit 0
    } else {
        Write-Error "Administrator privileges required to install WSL2"
        Write-Info "Please run this script as Administrator:"
        Write-Info "  1. Right-click PowerShell"
        Write-Info "  2. Select 'Run as administrator'"
        Write-Info "  3. Run this script again"
        exit 1
    }
}

#######################################
# Step 3: Rancher Desktop
#######################################
Write-Header "Step 3/5: Rancher Desktop"

# Check if Rancher Desktop is installed
$rancherInstalled = Test-Path "C:\Program Files\Rancher Desktop\Rancher Desktop.exe"

if ($rancherInstalled) {
    Write-Success "Rancher Desktop is already installed"
} else {
    Write-Info "Installing Rancher Desktop..."

    # Check if winget is available
    $wingetAvailable = Get-Command winget -ErrorAction SilentlyContinue

    if ($wingetAvailable) {
        winget install suse.RancherDesktop --accept-source-agreements --accept-package-agreements

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Rancher Desktop installed successfully"
        } else {
            Write-Error "Failed to install Rancher Desktop"
            Write-Info "Please download manually from: https://rancherdesktop.io/"
            exit 1
        }
    } else {
        Write-Error "winget is not available"
        Write-Info "Please download Rancher Desktop manually from: https://rancherdesktop.io/"
        exit 1
    }
}

# Check if Docker is working
Write-Info "Checking Docker connectivity..."

$dockerWorking = $false
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        $dockerWorking = $true
    }
} catch {
    $dockerWorking = $false
}

if ($dockerWorking) {
    Write-Success "Docker is running"
} else {
    Write-Host ""
    Write-Warning "Rancher Desktop needs to be configured"
    Write-Host ""
    Write-Info "Please do the following:"
    Write-Info "  1. Open Rancher Desktop from the Start menu"
    Write-Info "  2. Select 'dockerd (moby)' as the Container Engine"
    Write-Info "  3. Turn OFF Kubernetes"
    Write-Info "  4. Click Accept/OK and wait for it to start"
    Write-Info "  5. Look for the green status indicator"
    Write-Host ""

    Read-Host "Press Enter after Rancher Desktop is running"

    # Check again
    try {
        $dockerInfo = docker info 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Docker is now running"
        } else {
            Write-Error "Docker is still not responding"
            Write-Info "Make sure Rancher Desktop shows a green status"
            exit 1
        }
    } catch {
        Write-Error "Docker is still not responding"
        exit 1
    }
}

#######################################
# Step 4: Node.js
#######################################
Write-Header "Step 4/5: Node.js"

# Check if Node.js is installed
$nodeInstalled = $false
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $nodeInstalled = $true
        $versionNum = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    }
} catch {
    $nodeInstalled = $false
}

if ($nodeInstalled -and $versionNum -ge 18) {
    Write-Success "Node.js is already installed ($nodeVersion)"
} else {
    Write-Info "Installing Node.js..."

    $wingetAvailable = Get-Command winget -ErrorAction SilentlyContinue

    if ($wingetAvailable) {
        winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements

        if ($LASTEXITCODE -eq 0) {
            Write-Success "Node.js installed successfully"
            Write-Warning "You may need to open a new PowerShell window for 'node' command to work"
        } else {
            Write-Error "Failed to install Node.js"
            Write-Info "Please download manually from: https://nodejs.org/"
            exit 1
        }
    } else {
        Write-Error "winget is not available"
        Write-Info "Please download Node.js manually from: https://nodejs.org/"
        exit 1
    }
}

#######################################
# Step 5: Configure Dockyard
#######################################
Write-Header "Step 5/5: Configuring Dockyard"

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir

Set-Location $ProjectDir

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Info "Creating configuration file..."

    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Success "Configuration file created"
    } else {
        Write-Warning "No .env.example found, skipping configuration"
    }
} else {
    Write-Success "Configuration file already exists"
}

#######################################
# Complete!
#######################################
Write-Header "Setup Complete!"

Write-Host "Everything is installed and configured." -ForegroundColor Green
Write-Host ""
Write-Host "To start Dockyard, run:"
Write-Host ""
Write-Host "  cd $ProjectDir" -ForegroundColor Yellow
Write-Host "  .\scripts\start.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then open your browser to: http://localhost:3030"
Write-Host ""
