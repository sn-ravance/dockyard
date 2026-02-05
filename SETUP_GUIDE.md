# Dockyard Setup Guide for macOS

This guide will help you set up Dockyard, a Docker Desktop alternative UI, on your macOS system using Rancher Desktop.

## Prerequisites

### 1. Install Xcode Command Line Tools

```bash
xcode-select --install
```

### 2. Install Homebrew

If you don't have Homebrew installed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 3. Install Rancher Desktop

Rancher Desktop provides Docker runtime capabilities without Docker Desktop.

```bash
brew install --cask rancher
```

### 4. Configure Rancher Desktop

1. **Launch Rancher Desktop** from your Applications folder
2. **Initial Setup**:
   - Choose **dockerd (moby)** as the container engine (not containerd)
   - Disable Kubernetes if you don't need it (saves resources)
3. **Wait for initialization** - the first launch downloads required components
4. **Verify the Docker socket location**:
   ```bash
   ls -la ~/.rd/docker.sock
   ```

### 5. Install Node.js 20

```bash
brew install node@20
```

Add to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
```

Reload your shell:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

### 6. Verify Docker CLI Connectivity

```bash
# Test Docker connection
docker info

# If using Rancher Desktop socket explicitly
DOCKER_HOST=unix://$HOME/.rd/docker.sock docker info
```

## Installation

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**:
   ```bash
   cd /Users/rob.vance@sleepnumber.com/Documents/GitHub/docker-ui
   ```

2. **Configure environment**:
   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit for Rancher Desktop socket (if needed)
   # Change DOCKER_SOCKET to: ~/.rd/docker.sock
   ```

3. **Build and run**:
   ```bash
   # For production
   docker compose up --build -d

   # For development (with hot reload)
   docker compose -f docker-compose.dev.yml up --build
   ```

4. **Access the UI**: Open http://localhost:3000

### Option 2: Running Locally (Development)

1. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

3. **Start the backend**:
   ```bash
   cd ../backend

   # For Rancher Desktop
   DOCKER_SOCKET=$HOME/.rd/docker.sock npm run dev

   # For standard Docker
   npm run dev
   ```

4. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the UI**: Open http://localhost:3000 (or http://localhost:5173 if using Vite dev server)

## Rancher Desktop Configuration

### Docker Socket Location

Rancher Desktop uses a different socket path than Docker Desktop:

| Runtime | Socket Path |
|---------|-------------|
| Docker Desktop | `/var/run/docker.sock` |
| Rancher Desktop | `~/.rd/docker.sock` |

### Setting Up Symlink (Optional)

If you want to use the standard socket path:

```bash
sudo ln -s $HOME/.rd/docker.sock /var/run/docker.sock
```

**Note**: This symlink may need to be recreated after system restarts.

### Environment Variable

Alternatively, set the `DOCKER_HOST` environment variable:

```bash
export DOCKER_HOST=unix://$HOME/.rd/docker.sock
```

Add this to your `~/.zshrc` or `~/.bashrc` for persistence.

## Troubleshooting

### "Cannot connect to Docker daemon"

1. Ensure Rancher Desktop is running
2. Check the socket exists: `ls -la ~/.rd/docker.sock`
3. Verify Docker connectivity: `docker info`
4. Check the `DOCKER_SOCKET` environment variable in your `.env` file

### "Permission denied" on Docker socket

```bash
# Check socket permissions
ls -la ~/.rd/docker.sock

# The socket should be owned by your user
# If running via Docker Compose, ensure the volume mount is correct
```

### Frontend can't connect to backend

1. Check if backend is running: `curl http://localhost:3001/api/health`
2. Verify CORS settings in `.env` include your frontend URL
3. Check browser console for CORS errors

### WebSocket connections fail

1. Ensure the backend WebSocket server is running on port 3001
2. Check that no firewall is blocking WebSocket connections
3. Verify the proxy configuration in `vite.config.ts` (for dev mode)

## Verification

After setup, verify everything works:

1. **Check backend health**:
   ```bash
   curl http://localhost:3001/api/health
   # Expected: {"status":"healthy","docker":"connected",...}
   ```

2. **List containers via API**:
   ```bash
   curl http://localhost:3001/api/containers
   ```

3. **Access the UI**: Open http://localhost:3000
   - Dashboard should show system info
   - Containers page should list your containers
   - Images page should list your images

## Quick Reference

| Command | Description |
|---------|-------------|
| `docker compose up --build` | Build and start production |
| `docker compose down` | Stop all services |
| `docker compose logs -f` | View logs |
| `npm run dev` | Start development server |

## Resources

- [Rancher Desktop Documentation](https://docs.rancherdesktop.io/)
- [Docker CLI Reference](https://docs.docker.com/reference/cli/docker/)
- [Dockyard Repository](https://github.com/yourusername/docker-ui)
