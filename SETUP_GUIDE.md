# Dockyard Setup Guide

This guide will help you set up everything needed to run Dockyard, a web-based Docker management tool. No technical experience required - just follow the steps in order.

---

## What You'll Be Installing

| Software | What It Does | Cost |
|----------|--------------|------|
| Xcode Command Line Tools | Basic development tools for macOS | Free |
| Homebrew | A tool that makes installing software easy | Free |
| Rancher Desktop | Runs Docker containers (replaces Docker Desktop) | Free |
| Node.js | Runs JavaScript code | Free |

**Total Cost: $0** - Everything is free and open source.

---

## Before You Start

- Make sure you have at least **10 GB of free disk space**
- You'll need an **internet connection** to download software
- The setup process takes about **15-30 minutes**
- You may be asked for your **Mac password** during installation

---

## Step-by-Step Setup

### Step 1: Open Terminal

1. Press `Command + Space` on your keyboard (opens Spotlight search)
2. Type `Terminal`
3. Press `Enter`

A window with a command line will open. This is where you'll type commands.

---

### Step 2: Install Xcode Command Line Tools

Copy and paste this command into Terminal, then press `Enter`:

```bash
xcode-select --install
```

**What happens:**
- A popup window will appear asking you to install
- Click **"Install"**
- Wait for it to complete (5-10 minutes)

**How to know it worked:**
```bash
xcode-select -p
```
You should see: `/Library/Developer/CommandLineTools`

---

### Step 3: Install Homebrew

Copy and paste this entire command into Terminal, then press `Enter`:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**What happens:**
- You'll be asked to press `Enter` to continue
- You may need to enter your Mac password (you won't see characters as you type - that's normal)
- Wait for it to complete (5-10 minutes)

**Important for Apple Silicon Macs (M1/M2/M3):**

After installation, run these two commands:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**How to know it worked:**
```bash
brew --version
```
You should see something like: `Homebrew 4.x.x`

---

### Step 4: Install Rancher Desktop

Copy and paste this command into Terminal:

```bash
brew install --cask rancher
```

**What happens:**
- Homebrew will download and install Rancher Desktop
- Wait for it to complete (2-5 minutes)

**Now configure Rancher Desktop:**

1. Open **Finder**
2. Go to **Applications**
3. Double-click **Rancher Desktop**
4. On the first screen:
   - For **Container Engine**, select: **dockerd (moby)**
   - For **Kubernetes**, toggle it **OFF** (you don't need it)
   - Click **Accept** or **OK**
5. Wait for Rancher Desktop to start (first time takes 5-10 minutes)
6. You'll see a green checkmark or "Running" status when ready

**How to know it worked:**
```bash
docker --version
```
You should see something like: `Docker version 24.x.x`

```bash
docker run hello-world
```
You should see: `Hello from Docker!`

---

### Step 5: Install Node.js

Copy and paste this command into Terminal:

```bash
brew install node@20
```

**What happens:**
- Homebrew will download and install Node.js
- Wait for it to complete (2-3 minutes)

**How to know it worked:**
```bash
node --version
```
You should see something like: `v20.x.x`

---

## Setup Complete!

You now have everything needed to run Dockyard.

---

## Running Dockyard

### Option 1: Use the Scripts (Easiest)

Navigate to the project folder and run the start script:

```bash
cd /Users/rob.vance@sleepnumber.com/Documents/GitHub/docker-ui
./scripts/start.sh
```

### Option 2: Manual Commands

```bash
cd /Users/rob.vance@sleepnumber.com/Documents/GitHub/docker-ui
docker compose up --build
```

**When it's working:**
- Open your web browser
- Go to: **http://localhost:3030**
- You should see the Dockyard dashboard

---

## Controlling Dockyard

| What You Want | Command |
|---------------|---------|
| Start Dockyard | `./scripts/start.sh` |
| Stop Dockyard | `./scripts/stop.sh` |
| Restart Dockyard | `./scripts/restart.sh` |

---

## Troubleshooting

### "command not found: docker"

Rancher Desktop isn't running. Open it from Applications.

### "Cannot connect to Docker daemon"

1. Make sure Rancher Desktop is running (check for icon in menu bar)
2. Wait a minute for it to fully start
3. Try again

### "port is already allocated"

Something else is using port 3030. Either:
- Close the other application using that port
- Or edit `docker-compose.yml` and change `3030` to another number like `3031`

### The page won't load in the browser

1. Make sure Terminal shows "Dockyard API server running"
2. Try refreshing the page
3. Make sure you're going to `http://localhost:3030` (not https)

---

## Getting Help

If you're stuck:
1. Take a screenshot of any error messages
2. Note which step you're on
3. Ask for help with the screenshot and step number

---

## Uninstalling (If Needed)

To remove everything:

```bash
# Stop Dockyard
./scripts/stop.sh

# Remove Rancher Desktop
brew uninstall --cask rancher

# Remove Node.js
brew uninstall node@20

# Remove Homebrew (optional)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
```
