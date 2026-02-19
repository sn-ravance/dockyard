# Dockyard - Free Docker Desktop Alternative

A modern, web-based Docker management UI that replaces Docker Desktop's interface. Combined with Rancher Desktop, you get a complete, **free** Docker Desktop alternative.

## Why Dockyard?

**Docker Desktop requires a paid license** for commercial use (companies with 250+ employees or $10M+ revenue).

**Dockyard + Rancher Desktop = 100% Free Alternative**

| Component | What It Replaces | Cost |
|-----------|------------------|------|
| Rancher Desktop | Docker Desktop's **engine** (the VM that runs containers) | Free |
| Dockyard | Docker Desktop's **UI** (the management interface) | Free |

## Rancher Desktop vs Dockyard

| Feature | Rancher Desktop GUI | Dockyard |
|---------|---------------------|----------|
| **Purpose** | Configure Docker runtime | Manage containers/images |
| **List Containers** | Basic | Detailed with status |
| **Start/Stop Containers** | Limited | One-click actions |
| **View Logs** | No | Real-time streaming |
| **View Stats** | No | CPU/memory/network charts |
| **Pull Images** | No | Yes, with progress bar |
| **Create Volumes** | No | Yes |
| **Create Networks** | No | Yes |
| **Terminal (exec)** | No | Yes |
| **Search/Filter** | No | Yes |

## Do You Need Dockyard?

**If you prefer the command line**, you don't need Dockyard:
```bash
docker ps                        # List containers
docker logs <container>          # View logs
docker stats                     # View stats
docker exec -it <container> sh   # Terminal access
```

**If you want a visual interface** like Docker Desktop provides, Dockyard gives you:
- Dashboard overview of your Docker environment
- One-click container management (start, stop, restart, remove)
- Real-time log streaming with search
- Live resource monitoring (CPU, memory, network, I/O)
- Image management with pull progress
- Volume and network CRUD operations

## Features

- **Container Management**: List, start, stop, restart, remove containers
- **Real-time Logs**: Stream container logs via WebSocket with xterm.js
- **Live Stats**: Monitor CPU, memory, network, and I/O in real-time
- **Image Management**: List, pull (with progress), remove, and prune images
- **Volume Management**: Create, list, and remove volumes
- **Network Management**: Create, list, remove networks; connect/disconnect containers
- **Dashboard**: Overview of your Docker environment with system information
- **Dark Mode**: Beautiful dark theme optimized for long sessions
- **Search**: Filter containers, images, volumes, and networks

## Screenshots

*Coming soon*

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| State Management | Zustand + React Query |
| Backend | Node.js + Express + TypeScript |
| Docker API | Dockerode |
| Real-time | WebSocket (ws) |
| Terminal | xterm.js |

## Quick Start

### Prerequisites

- macOS or Windows
- Rancher Desktop (or any Docker-compatible runtime)

### Installation

**macOS:**
```bash
# One-time setup (installs Rancher Desktop, Node.js, etc.)
./scripts/setup.sh

# Start Dockyard
./scripts/start.sh
```

**Windows (PowerShell):**
```powershell
# One-time setup
.\scripts\setup.ps1

# Start Dockyard
.\scripts\start.ps1
```

**Then open:** http://localhost:3030

### Control Scripts

| Action | macOS | Windows |
|--------|-------|---------|
| Start | `./scripts/start.sh` | `.\scripts\start.ps1` |
| Stop | `./scripts/stop.sh` | `.\scripts\stop.ps1` |
| Restart | `./scripts/restart.sh` | `.\scripts\restart.ps1` |

## Documentation

| Document | Description |
|----------|-------------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | macOS setup guide (beginner-friendly) |
| [SETUP_GUIDE_WINDOWS.md](SETUP_GUIDE_WINDOWS.md) | Windows setup guide (beginner-friendly) |
| [rancher_setup.md](rancher_setup.md) | Rancher Desktop specific setup |

## Project Structure

```
docker-ui/
├── docker-compose.yml        # Production orchestration
├── docker-compose.dev.yml    # Development with hot reload
├── .env.example              # Environment template
│
├── backend/
│   └── src/
│       ├── routes/           # API endpoints
│       ├── services/         # Docker operations
│       ├── websocket/        # Real-time handlers
│       └── middleware/       # Express middleware
│
├── frontend/
│   └── src/
│       ├── components/       # React components
│       ├── pages/            # Page components
│       ├── hooks/            # Custom React hooks
│       ├── stores/           # Zustand stores
│       └── api/              # API client
│
└── scripts/
    ├── setup.sh / setup.ps1       # Full setup
    ├── start.sh / start.ps1       # Start app
    ├── stop.sh / stop.ps1         # Stop app
    └── restart.sh / restart.ps1   # Restart app
```

## API Endpoints

### Containers
- `GET /api/containers` - List all containers
- `GET /api/containers/:id` - Get container details
- `POST /api/containers/:id/start` - Start container
- `POST /api/containers/:id/stop` - Stop container
- `POST /api/containers/:id/restart` - Restart container
- `DELETE /api/containers/:id` - Remove container
- `WS /ws/containers/:id/logs` - Stream logs
- `WS /ws/containers/:id/stats` - Stream stats
- `WS /ws/containers/:id/exec` - Interactive shell

### Images
- `GET /api/images` - List all images
- `POST /api/images/pull` - Pull image (SSE progress)
- `DELETE /api/images/:id` - Remove image
- `POST /api/images/prune` - Remove unused images

### Volumes
- `GET /api/volumes` - List all volumes
- `POST /api/volumes` - Create volume
- `DELETE /api/volumes/:name` - Remove volume

### Networks
- `GET /api/networks` - List all networks
- `POST /api/networks` - Create network
- `DELETE /api/networks/:id` - Remove network
- `POST /api/networks/:id/connect` - Connect container
- `POST /api/networks/:id/disconnect` - Disconnect container

### System
- `GET /api/health` - Health check
- `GET /api/system/info` - Docker system info
- `GET /api/system/version` - Docker version

## Configuration

Environment variables (`.env`):

```env
# Docker socket path
# Default: /var/run/docker.sock
# Rancher Desktop macOS: ~/.rd/docker.sock
DOCKER_SOCKET=/var/run/docker.sock

# Backend port
PORT=3001

# CORS origins
CORS_ORIGINS=http://localhost:3030
```

## Security Considerations

- Docker socket is mounted read-only where possible
- Input validation on all API endpoints (using Zod)
- CORS restricted to configured origins
- Rate limiting on resource-intensive operations
- No credential storage

## Troubleshooting

### "Cannot connect to Docker daemon"
1. Make sure Rancher Desktop is running
2. Check for the green status indicator
3. Try restarting Rancher Desktop

### "Port already allocated"
Change the port in `docker-compose.yml` from `3030` to another port.

### Container list not loading
```bash
# Check if Docker is responding
curl http://localhost:3001/api/health

# Check backend logs
docker compose logs backend
```

## License

MIT

## Acknowledgments

- [Dockerode](https://github.com/apocas/dockerode) - Docker API client for Node.js
- [Rancher Desktop](https://rancherdesktop.io/) - Free Docker Desktop alternative runtime
- [xterm.js](https://xtermjs.org/) - Terminal emulator for the web
