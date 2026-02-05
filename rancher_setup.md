# Rancher Desktop Setup Guide

A free, open-source alternative to Docker Desktop for macOS.

## Step 1: Stop/Uninstall Docker Desktop (if present)

```bash
# Quit Docker Desktop from the menu bar, then optionally uninstall:
# Drag Docker from Applications to Trash, or:
brew uninstall --cask docker
```

## Step 2: Install Rancher Desktop

```bash
brew install --cask rancher
```

## Step 3: Configure Rancher Desktop

1. **Launch Rancher Desktop** from Applications
2. On first launch, you'll see a configuration screen:
   - **Container Engine**: Select **dockerd (moby)** - this provides Docker compatibility
   - **Kubernetes**: Disable it if you don't need it (saves resources)
   - Click **Accept** or **OK**

3. Wait for Rancher Desktop to download and start the VM (first time takes a few minutes)

## Step 4: Verify Installation

```bash
# Check Docker CLI works
docker --version

# Check Docker daemon is running
docker info

# Test running a container
docker run hello-world
```

## Key Differences from Docker Desktop

| Feature | Docker Desktop | Rancher Desktop |
|---------|---------------|-----------------|
| License | Paid for commercial use | Free (Apache 2.0) |
| Docker Socket | `/var/run/docker.sock` | `~/.rd/docker.sock` |
| Docker CLI | Included | Included |
| Kubernetes | Optional | Optional |
| GUI | Yes | Yes |

## Step 5: Configure Dockyard for Rancher Desktop

Create a `.env` file in the project:

```bash
cd /Users/rob.vance@sleepnumber.com/Documents/GitHub/docker-ui
cp .env.example .env
```

Edit `.env` to use Rancher Desktop's socket:

```
DOCKER_SOCKET=/Users/rob.vance@sleepnumber.com/.rd/docker.sock
```

Then run:

```bash
docker compose down && docker compose build --no-cache && docker compose up
```

## Optional: Symlink for Compatibility

If some tools expect the standard socket path:

```bash
sudo ln -sf ~/.rd/docker.sock /var/run/docker.sock
```

## Troubleshooting

### "Cannot connect to Docker daemon"

1. Ensure Rancher Desktop is running (check menu bar icon)
2. Verify the socket exists:
   ```bash
   ls -la ~/.rd/docker.sock
   ```
3. Try restarting Rancher Desktop

### Docker commands hang or timeout

1. Open Rancher Desktop preferences
2. Increase allocated CPU/Memory if needed
3. Restart Rancher Desktop

### Permission denied on socket

```bash
# Check socket permissions
ls -la ~/.rd/docker.sock

# Should show your user as owner
# If not, restart Rancher Desktop
```

## Resources

- [Rancher Desktop Documentation](https://docs.rancherdesktop.io/)
- [Rancher Desktop GitHub](https://github.com/rancher-sandbox/rancher-desktop)
- [Docker CLI Reference](https://docs.docker.com/reference/cli/docker/)
