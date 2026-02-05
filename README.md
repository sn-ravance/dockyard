# Dockyard - Docker Desktop Alternative

A modern, web-based Docker management UI built with React and Node.js. Designed to work with Rancher Desktop on macOS as a lightweight alternative to Docker Desktop.

## Features

- **Container Management**: List, start, stop, restart, remove containers
- **Real-time Logs**: Stream container logs via WebSocket with xterm.js
- **Live Stats**: Monitor CPU, memory, network, and I/O in real-time
- **Image Management**: List, pull (with progress), remove, and prune images
- **Volume Management**: Create, list, and remove volumes
- **Network Management**: Create, list, remove networks; connect/disconnect containers
- **Dashboard**: Overview of your Docker environment with system information
- **Dark Mode**: Beautiful dark theme optimized for long coding sessions
- **Search**: Filter containers, images, volumes, and networks

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

- macOS with Rancher Desktop (or Docker Desktop)
- Node.js 20+
- Docker CLI

### Using Docker Compose

```bash
# Clone and navigate to the project
cd /Users/rob.vance@sleepnumber.com/Documents/GitHub/docker-ui

# Copy environment configuration
cp .env.example .env

# For Rancher Desktop, edit .env and set:
# DOCKER_SOCKET=~/.rd/docker.sock

# Build and start
docker compose up --build

# Access at http://localhost:3000
```

### Local Development

```bash
# Backend
cd backend
npm install
DOCKER_SOCKET=$HOME/.rd/docker.sock npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# Access at http://localhost:5173
```

## Project Structure

```
docker-ui/
├── docker-compose.yml        # Production orchestration
├── docker-compose.dev.yml    # Development with hot reload
├── .env.example              # Environment template
├── SETUP_GUIDE.md            # Detailed setup instructions
├── README.md
│
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express app entry
│   │   ├── config.ts         # Environment config
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── websocket/        # WebSocket handlers
│   │   ├── middleware/       # Express middleware
│   │   └── types/            # TypeScript types
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── stores/           # Zustand stores
│   │   ├── api/              # API client
│   │   └── types/            # TypeScript types
│   ├── Dockerfile
│   └── package.json
│
└── scripts/
    └── setup-macos.sh        # Automated setup script
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
# Rancher Desktop: ~/.rd/docker.sock
DOCKER_SOCKET=/var/run/docker.sock

# Backend
PORT=3001
CORS_ORIGINS=http://localhost:3000
```

## Security Considerations

- Docker socket is mounted read-only where possible
- Input validation on all API endpoints (using Zod)
- CORS restricted to configured origins
- Rate limiting on resource-intensive operations
- No credential storage

## License

MIT
