#######################################
# Stop Dockyard (Windows)
#######################################

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
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
Write-Info "Stopping Dockyard..."
Write-Host ""

# Check if containers are running
$containersRunning = docker compose ps --quiet 2>$null
if (-not $containersRunning) {
    Write-Host "Dockyard is not running."
    exit 0
}

# Stop the containers
docker compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Success "Dockyard has been stopped"
    Write-Host ""
    Write-Host "To start again, run: .\scripts\start.ps1"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "There was an issue stopping Dockyard." -ForegroundColor Red
    Write-Host "Try running: docker compose down --force"
    exit 1
}
