# Dockyard Setup Guide for Windows

This guide will help you set up everything needed to run Dockyard on Windows. No technical experience required - just follow the steps in order.

---

## What You'll Be Installing

| Software | What It Does | Cost |
|----------|--------------|------|
| WSL2 | Runs Linux inside Windows | Free (built into Windows) |
| Rancher Desktop | Runs Docker containers | Free |
| Node.js | Runs JavaScript code | Free |

**Total Cost: $0** - Everything is free and open source.

---

## Before You Start

- **Windows Version:** Windows 10 (version 1903 or newer) or Windows 11
- **RAM:** At least 8 GB (16 GB recommended)
- **Disk Space:** At least 10 GB free
- **Internet:** Required to download software
- **Time:** About 20-30 minutes
- **Admin Access:** You'll need administrator privileges

---

## Step-by-Step Setup

### Step 1: Open PowerShell as Administrator

1. Click the **Start** button (Windows icon)
2. Type `PowerShell`
3. Right-click on **Windows PowerShell**
4. Click **"Run as administrator"**
5. Click **Yes** when asked to allow changes

A blue window will open. This is where you'll type commands.

---

### Step 2: Enable WSL2

WSL2 (Windows Subsystem for Linux) lets Windows run Linux software, which is needed for Docker.

Copy and paste this command into PowerShell, then press `Enter`:

```powershell
wsl --install
```

**What happens:**
- Windows will download and install WSL2
- This may take 5-10 minutes
- **You'll need to restart your computer when it finishes**

After restarting, a Ubuntu window may open asking you to create a username and password. You can close it - we don't need it for Dockyard.

**How to know it worked:**

Open PowerShell again and run:
```powershell
wsl --version
```

You should see version information for WSL.

---

### Step 3: Install Rancher Desktop

**Option A: Using winget (Recommended)**

In PowerShell, run:
```powershell
winget install suse.RancherDesktop
```

**Option B: Manual Download**

1. Go to: https://rancherdesktop.io/
2. Click **Download for Windows**
3. Run the installer
4. Follow the installation wizard

**After installation:**

1. Open **Rancher Desktop** from the Start menu
2. On the first screen:
   - **Container Engine:** Select **dockerd (moby)**
   - **Kubernetes:** Toggle **OFF** (you don't need it)
   - Click **Accept** or **OK**
3. Wait for Rancher Desktop to start (first time takes 5-10 minutes)
4. You'll see a green status when it's ready

**How to know it worked:**

Open a **new** PowerShell window and run:
```powershell
docker --version
```
You should see something like: `Docker version 24.x.x`

```powershell
docker run hello-world
```
You should see: `Hello from Docker!`

---

### Step 4: Install Node.js

**Option A: Using winget (Recommended)**

In PowerShell, run:
```powershell
winget install OpenJS.NodeJS.LTS
```

**Option B: Manual Download**

1. Go to: https://nodejs.org/
2. Download the **LTS** version
3. Run the installer
4. Accept all defaults

**How to know it worked:**

Open a **new** PowerShell window and run:
```powershell
node --version
```
You should see something like: `v20.x.x`

---

### Step 5: Install Git (if not already installed)

```powershell
winget install Git.Git
```

**How to know it worked:**
```powershell
git --version
```

---

### Step 6: Get Dockyard

Open PowerShell and run:

```powershell
cd $HOME\Documents
git clone https://github.com/yourusername/docker-ui.git
cd docker-ui
```

Or if you already have the files, navigate to them:
```powershell
cd "C:\path\to\docker-ui"
```

---

## Setup Complete!

You now have everything needed to run Dockyard.

---

## Running Dockyard

### Option 1: Use the Scripts (Easiest)

Open PowerShell, navigate to the project folder, and run:

```powershell
cd $HOME\Documents\docker-ui
.\scripts\start.ps1
```

### Option 2: Manual Commands

```powershell
cd $HOME\Documents\docker-ui
docker compose up --build
```

**When it's working:**
- Open your web browser
- Go to: **http://localhost:3030**
- You should see the Dockyard dashboard

---

## Controlling Dockyard

Open PowerShell in the project folder, then:

| What You Want | Command |
|---------------|---------|
| Start Dockyard | `.\scripts\start.ps1` |
| Stop Dockyard | `.\scripts\stop.ps1` |
| Restart Dockyard | `.\scripts\restart.ps1` |

---

## Troubleshooting

### "docker: command not found" or "docker is not recognized"

1. Make sure Rancher Desktop is running (check system tray)
2. Close and reopen PowerShell
3. Try again

### "Cannot connect to Docker daemon"

1. Open Rancher Desktop from the Start menu
2. Wait for the green status indicator
3. Try again

### "WSL2 is not installed"

Run this in PowerShell (as Administrator):
```powershell
wsl --install
```
Then restart your computer.

### "port is already allocated"

Something else is using port 3030. Either:
- Close the other application
- Or edit `docker-compose.yml` and change `3030` to `3031`

### The page won't load in the browser

1. Make sure PowerShell shows "Dockyard API server running"
2. Try refreshing the page
3. Make sure you're going to `http://localhost:3030` (not https)

### Scripts won't run - "execution policy" error

Run this once in PowerShell (as Administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Getting Help

If you're stuck:
1. Take a screenshot of any error messages
2. Note which step you're on
3. Ask for help with the screenshot and step number

---

## Uninstalling (If Needed)

To remove everything:

```powershell
# Stop Dockyard first
.\scripts\stop.ps1

# Remove Rancher Desktop
winget uninstall suse.RancherDesktop

# Remove Node.js
winget uninstall OpenJS.NodeJS.LTS

# Disable WSL2 (optional)
wsl --unregister Ubuntu
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start Dockyard | `.\scripts\start.ps1` |
| Stop Dockyard | `.\scripts\stop.ps1` |
| Restart Dockyard | `.\scripts\restart.ps1` |
| View logs | `docker compose logs -f` |
| Check Docker status | `docker info` |
| Open Dockyard | http://localhost:3030 |
