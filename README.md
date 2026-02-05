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

# The Docker Architecture                                                                                                                                                                                                                           
                                                                                                                                                                                                                                                    
  ┌─────────────────────────────────────────────────────────────┐                                                                                                                                                                                   
  │                        Your Mac                             │                                                                                                                                                                                  
  │  ┌─────────────────┐      ┌────────────────────────-─────┐  │                                                                                                                                                                                  
  │  │   Docker CLI    │      │      Linux Virtual Machine   │  │                                                                                                                                                                                   
  │  │   (docker)      │ ───► │  ┌─────────────────────────┐ │  │                                                                                                                                                                                   
  │  └─────────────────┘      │  │    Docker Engine        │ │  │                                                                                                                                                                                   
  │          │                │  │    (dockerd daemon)     │ │  │                                                                                                                                                                                   
  │          │                │  └─────────────────────────┘ │  │                                                                                                                                                                                   
  │          ▼                │             │                │  │                                                                                                                                                                                   
  │  ┌─────────────────┐      │             ▼                │  │                                                                                                                                                                                   
  │  │  Docker Socket  │ ◄────│  ┌─────────────────────────┐ │  │                                                                                                                                                                                   
  │  │  /var/run/      │      │  │     Containers          │ │  │                                                                                                                                                                                   
  │  │  docker.sock    │      │  │  ┌───┐ ┌───┐ ┌───┐      │ │  │                                                                                                                                                                                   
  │  └─────────────────┘      │  │  │ A │ │ B │ │ C │      │ │  │                                                                                                                                                                                   
  │                           │  │  └───┘ └───┘ └───┘      │ │  │                                                                                                                                                                                   
  │                           │  └─────────────────────────┘ │  │                                                                                                                                                                                   
  │                           └──────────────────────────────┘  │                                                                                                                                                                                
  └─────────────────────────────────────────────────────────────┘                                                                                                                                                                                   
                                                                                                                                                                                                                                                    
  ## The Key Components    
  
  ┌─────────────────────────┬──────────────────────────────────────┬─────────────────────┐                                                                                                                                                          
  │        Component        │             What It Does             │   Who Provides It   │                                                                                                                                                          
  ├─────────────────────────┼──────────────────────────────────────┼─────────────────────┤                                                                                                                                                          
  │ Docker CLI              │ Commands you type (docker run, etc.) │ Free, open source   │                                                                                                                                                          
  ├─────────────────────────┼──────────────────────────────────────┼─────────────────────┤                                                                                                                                                          
  │ Docker Engine (dockerd) │ Actually runs containers             │ Free, open source   │                                                                                                                                                          
  ├─────────────────────────┼──────────────────────────────────────┼─────────────────────┤                                                                                                                                                          
  │ Linux VM                │ Containers need Linux kernel         │ Provided by runtime │                                                                                                                                                          
  ├─────────────────────────┼──────────────────────────────────────┼─────────────────────┤                                                                                                                                                          
  │ Docker Socket           │ How CLI talks to Engine              │ Just a file         │                                                                                                                                                          
  └─────────────────────────┴──────────────────────────────────────┴─────────────────────┘                                                                                                                                                          
  
  ## What Docker Desktop Actually Is                                                                                                                                                    
  
  Docker Desktop is just a convenience wrapper that provides:                                                                                                                                                                                       
  1. A Linux VM (using Apple's Hypervisor framework)                                                                                                                                                                                                
  2. The Docker Engine running inside that VM                                                                                                                                                                                                       
  3. A GUI for settings                                                                                                                                                                                                                             
  4. Automatic socket setup                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                    
  That's it. There's nothing proprietary about running containers.                                                                                                                                                                                  
                                                                                                                                                                                                                                                    
  ## What Rancher Desktop Provides (Same Thing, Free)                                                                                                                                                                       
                                                                                                                                                                                                                                                    
  Rancher Desktop does the exact same thing:                                                                                                                                                                                                        
  1. A Linux VM (using Lima/QEMU)                                                                                                                                                                                                                   
  2. Docker Engine (dockerd) inside that VM                                                                                                                                                                                                         
  3. A GUI for settings                                                                                                                                                                                                                             
  4. Socket at ~/.rd/docker.sock                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                    
  The Real "Magic" - It's All Open Source                                                                                                                                                                                                           
                                                                                                                                                                                                                                                    
  Docker CLI        → Apache 2.0 License (FREE)                                                                                                                                                                                                     
  Docker Engine     → Apache 2.0 License (FREE)                                                                                                                                                                                                     
  containerd        → Apache 2.0 License (FREE)                                                                                                                                                                                                     
  runc              → Apache 2.0 License (FREE)                                                                                                                                                                                                     
  Linux kernel      → GPL License (FREE)                                                                                                                                                                                                            
                                                                                                                                                                                                                                                    
  ** Docker Inc. charges for Docker Desktop, not for the ability to run containers. **                                                                                                                                     
                                                                                                                                                                                                                                                    
  ## Other Free Alternatives                                                                                                                                                                                                 
  ┌─────────────────┬────────────────┬───────────────────────────────┐                                                                                                                                                                              
  │      Tool       │ VM Technology  │             Notes             │                                                                                                                                                                              
  ├─────────────────┼────────────────┼───────────────────────────────┤                                                                                                                                                                              
  │ Rancher Desktop │ Lima/QEMU      │ What we're using              │                                                                                                                                                                              
  ├─────────────────┼────────────────┼───────────────────────────────┤                                                                                                                                                                              
  │ Colima          │ Lima           │ CLI-only, lightweight         │                                                                                                                                                                              
  ├─────────────────┼────────────────┼───────────────────────────────┤                                                                                                                                                                              
  │ Podman Desktop  │ Podman machine │ Docker-compatible             │                                                                                                                                                                              
  ├─────────────────┼────────────────┼───────────────────────────────┤                                                                                                                                                                              
  │ OrbStack        │ Custom         │ Fast, but paid for commercial │                                                                                                                                                                              
  └─────────────────┴────────────────┴───────────────────────────────┘                                                                                                                                                                              
  
  ## Quick Demo                                                                                                                                                                    
                                                                                                                                                                                                                                                    
  You could run Docker without any GUI tool:                                                                                                                                                                                                        
                                                                                                                                                                                                                                                    
  # Install just Colima (ultra minimal)                                                                                                                                                                                                             
  brew install colima docker                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                    
  # Start a Linux VM with Docker                                                                                                                                                                                                                    
  colima start                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                    
  # Now docker works                                                                                                                                                                                                                                
  docker run hello-world                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                    
  Bottom line: Containers are a Linux kernel feature. You just need something to run a Linux VM on your Mac. Docker Desktop charges for their VM wrapper; Rancher Desktop gives you the same thing for free.

## License

MIT
