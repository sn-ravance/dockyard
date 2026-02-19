#######################################
# Restart Dockyard (Windows)
#######################################

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Yellow
}

# Get the project directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir

Set-Location $ProjectDir

Write-Host ""
Write-Info "Restarting Dockyard..."
Write-Host ""

# Check if Docker is running
$dockerRunning = $false
try {
    $null = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        $dockerRunning = $true
    }
} catch {
    $dockerRunning = $false
}

if (-not $dockerRunning) {
    Write-Error "Error: Docker is not running"
    Write-Host ""
    Write-Host "Please start Rancher Desktop first:"
    Write-Host "  1. Open Rancher Desktop from the Start menu"
    Write-Host "  2. Wait for the green status indicator"
    Write-Host "  3. Run this script again"
    Write-Host ""
    exit 1
}

# Stop if running
$containersRunning = docker compose ps --quiet 2>$null
if ($containersRunning) {
    Write-Host "Stopping current instance..."
    docker compose down
}

# Rebuild and start
Write-Host ""
Write-Host "Building and starting containers..."
Write-Host "(This may take a few minutes)"
Write-Host ""

docker compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  Dockyard has been restarted!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Open your browser to: http://localhost:3030"
    Write-Host ""
    Write-Host "To view logs: docker compose logs -f"
    Write-Host "To stop: .\scripts\stop.ps1"
    Write-Host ""
} else {
    Write-Host ""
    Write-Error "Failed to restart Dockyard"
    Write-Host ""
    Write-Host "Try running: docker compose logs"
    Write-Host "to see what went wrong."
    exit 1
}
