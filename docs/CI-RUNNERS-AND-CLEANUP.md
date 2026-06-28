# CI/CD Runners: Understanding Remote Computers and Cleanup

## Overview

This document explains how CI/CD platforms (GitHub Actions, Jenkins, Bitbucket Pipelines) use remote computers to run tests, what happens to your files after execution, and the differences between ephemeral (temporary) and persistent (self-hosted) runners.

---

## 📚 Table of Contents

1. [Remote Runners Explained](#remote-runners-explained)
2. [GitHub Actions: Ephemeral Runners](#github-actions-ephemeral-runners)
3. [Self-Hosted Runners: Persistent Setup](#self-hosted-runners-persistent-setup)
4. [File Lifecycle and Cleanup](#file-lifecycle-and-cleanup)
5. [Comparison Table](#comparison-table)
6. [Real-World Examples](#real-world-examples)
7. [Best Practices](#best-practices)

---

## Remote Runners Explained

### What is a Runner?

A **runner** is a remote computer (physical or virtual) that:
- Receives your code
- Installs dependencies
- Runs your tests/builds
- Reports results back

**Think of it like**: Ordering food delivery 🍕
- You (local) → Place order (trigger CI)
- Restaurant kitchen (remote runner) → Cooks food (runs tests)
- You (local) → Receive results (view test reports)

---

### Two Types of Runners

#### 1. **Ephemeral (Temporary) Runners**
- **Examples**: GitHub Actions (default), GitLab CI (default)
- **Lifecycle**: Created → Used → Destroyed
- **Duration**: Minutes to hours
- **State**: Nothing persists between runs

#### 2. **Persistent (Self-Hosted) Runners**
- **Examples**: Jenkins, Self-hosted GitHub Actions, Bitbucket self-hosted
- **Lifecycle**: Always running
- **Duration**: Days/months/years
- **State**: Tools and caches persist

---

## GitHub Actions: Ephemeral Runners

### How It Works

```
┌─────────────────────────────────────────────────┐
│  Step 1: You push code to GitHub               │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 2: GitHub Actions reads workflow YAML    │
│  (.github/workflows/playwright.yml)             │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 3: GitHub creates fresh VM                │
│                                                 │
│  Pool of Available VMs:                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ VM-001  │ │ VM-002  │ │ VM-003  │          │
│  │ Ubuntu  │ │ Ubuntu  │ │ Windows │          │
│  └─────────┘ └─────────┘ └─────────┘          │
│       ↑                                         │
│       └── Your job gets VM-001                  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 4: VM starts completely empty             │
│                                                 │
│  /home/runner/work/                             │
│    └── (nothing here)                           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 5: Checkout downloads your code           │
│                                                 │
│  /home/runner/work/Playwright_New_Skills.../    │
│    ├── tests/                                   │
│    ├── package.json                             │
│    ├── playwright.config.js                     │
│    └── .github/                                 │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 6: Install everything from scratch        │
│                                                 │
│  - Install Node.js (20-30 seconds)              │
│  - npm ci (30-60 seconds)                       │
│  - Install Playwright browsers (60-90 seconds)  │
│                                                 │
│  /home/runner/work/Playwright_New_Skills.../    │
│    ├── node_modules/ (400 MB downloaded)        │
│    └── ~/.cache/ms-playwright/ (500 MB)         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 7: Run tests                              │
│                                                 │
│  $ npx playwright test                          │
│                                                 │
│  Results saved to:                              │
│  ├── playwright-report/                         │
│  └── test-results/                              │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 8: Upload artifacts to GitHub             │
│                                                 │
│  Files moved to GitHub's storage servers:       │
│  ✅ playwright-report.zip (saved 30 days)       │
│  ✅ test-results.zip (saved 7 days)             │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 9: VM DESTROYED 💥                        │
│                                                 │
│  Everything deleted:                            │
│  ❌ Your code                                   │
│  ❌ node_modules/ (900 MB)                      │
│  ❌ Browsers (500 MB)                           │
│  ❌ Test results (already uploaded)             │
│  ❌ All temporary files                         │
│                                                 │
│  The computer itself is gone!                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Step 10: VM returned to pool (or recycled)     │
│                                                 │
│  VM-001 is now available for:                   │
│  - Another job from you                         │
│  - A job from a different user                  │
│  - A job from a different repository            │
└─────────────────────────────────────────────────┘
```

---

### Key Characteristics

#### ✅ **Advantages**

1. **Clean Slate Every Time**
   ```
   Run #1: Uses package v1.0
   → VM destroyed
   Run #2: Uses package v2.0
   
   NO conflicts possible ✅
   ```

2. **No Maintenance**
   - GitHub manages everything
   - No disk cleanup needed
   - No security patches to apply

3. **Isolation**
   ```
   Job A: Company secrets in .env
   → VM destroyed (secrets wiped)
   Job B: Random person's job
   → Cannot access Job A's data ✅
   ```

4. **Reproducibility**
   ```
   Every run starts from identical state
   → "Works on my machine" problems reduced
   ```

#### ❌ **Disadvantages**

1. **Slow Setup Time**
   ```
   Every single run:
   - Download Node.js:    20s
   - npm install:         60s
   - Download browsers:   90s
   ──────────────────────────
   Total overhead:        170s (~3 minutes)
   ```

2. **Bandwidth Usage**
   ```
   Every run downloads:
   - npm packages:  400 MB
   - Browsers:      500 MB
   ──────────────────────────
   Total per run:   900 MB
   
   100 runs/month = 90 GB bandwidth
   ```

3. **Cost**
   ```
   GitHub Actions pricing (private repos):
   - 2,000 free minutes/month
   - $0.008/minute after that
   
   5-minute tests × 100 runs = 500 minutes = Free ✅
   5-minute tests × 500 runs = 2,500 minutes = $4/month
   ```

---

### Mitigation: Caching

You can speed up ephemeral runners by caching:

```yaml
name: Playwright Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Cache node_modules
      - uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
      # Cache Playwright browsers
      - uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-playwright-${{ hashFiles('**/package-lock.json') }}
      
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

**Result**:
- First run: 5 minutes (downloads everything)
- Cached runs: 2 minutes (reuses downloads) ⚡

**But still slower than persistent runners!**

---

## Self-Hosted Runners: Persistent Setup

### How It Works

This is how companies typically run CI/CD (Jenkins, self-hosted Bitbucket, etc.):

```
┌─────────────────────────────────────────────────┐
│  Company's Infrastructure                       │
│  (Data Center / AWS / Azure)                    │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Windows Server 1                          │ │
│  │ - Always Running 24/7                     │ │
│  │ - Node.js installed (permanent)           │ │
│  │ - Browsers installed (permanent)          │ │
│  │ - Registered with CI system               │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Windows Server 2                          │ │
│  │ - Always Running 24/7                     │ │
│  │ - Node.js installed (permanent)           │ │
│  │ - Browsers installed (permanent)          │ │
│  │ - Registered with CI system               │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Linux Server 1                            │ │
│  │ - Always Running 24/7                     │ │
│  │ ...                                       │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

### Example: Bitbucket Self-Hosted Runner

#### Configuration File

```yaml
# bitbucket-pipelines.yml
definitions:
  steps:
    - step: &run-tests
        name: Run Playwright Tests
        runs-on:
          - 'self.hosted'      ← Use our own computers
          - 'windows'          ← Windows OS only
          - 'automation'       ← Custom label
        script:
          - powershell ui-regression-windows.ps1
        artifacts:
          - playwright-report/**
```

#### PowerShell Script (Smart Caching)

```powershell
# ui-regression-windows.ps1

# Step 1: Check if Node.js already installed
Write-Host "Checking Node.js..."
$nodePath = "C:\Program Files\nodejs"
if (Test-Path $nodePath) {
    Write-Host "Node.js already installed ✅"
} else {
    Write-Host "Installing Node.js..."
    # Download and install
}

# Step 2: Install npm packages
Write-Host "Installing dependencies..."
npm install  # ← Reuses node_modules/ if package.json unchanged

# Step 3: Check if browsers already installed
$chromePath = "$env:LOCALAPPDATA\ms-playwright\chromium-*"
if (Test-Path $chromePath) {
    Write-Host "Browsers already installed, skipping ✅⚡"
} else {
    Write-Host "Installing browsers..."
    npx playwright install chromium --with-deps
}

# Step 4: Run tests
npx playwright test
```

**Key Point**: The `if (Test-Path)` checks only work because the machine is **persistent**!

---

### Lifecycle Comparison

#### **Run #1 (First time on this machine)**

```
Machine: WIN-AUTOMATION-01 (already running)
   ↓
C:\BuildAgent\work\
  └── (might have old projects)
   ↓
Bitbucket cleans workspace
   ↓
C:\BuildAgent\work\project-123\
  └── (empty)
   ↓
Clone your code
   ↓
C:\BuildAgent\work\project-123\
  ├── tests/
  ├── package.json
  └── ...
   ↓
PowerShell script runs:

[Check Node.js]
  → Not found
  → Download & install (90 seconds)
  → C:\Program Files\nodejs\ ✅

[npm install]
  → node_modules/ doesn't exist
  → Download packages (60 seconds)
  → C:\BuildAgent\work\project-123\node_modules\ ✅

[Check browsers]
  → Not found
  → Download & install (120 seconds)
  → C:\Users\BuildAgent\AppData\Local\ms-playwright\ ✅

[Run tests]
  → Execute Playwright tests (120 seconds)
   ↓
Total time: ~6 minutes

Machine status after job:
  ✅ Still running (NOT destroyed)
  ✅ Node.js still installed
  ✅ Browsers still installed
  ✅ Workspace might stay or be cleaned
```

#### **Run #2 (Same machine, 10 minutes later)**

```
Machine: WIN-AUTOMATION-01 (same machine, still running)
   ↓
Clean old workspace (or reuse)
   ↓
Clone your code
   ↓
PowerShell script runs:

[Check Node.js]
  → Found at C:\Program Files\nodejs\
  → "Already installed ✅" (instant!)

[npm install]
  → node_modules/ exists
  → package-lock.json unchanged
  → "up to date" (5 seconds) ⚡

[Check browsers]
  → Found at C:\Users\...\ms-playwright\
  → "Already installed, skipping ✅" (instant!) ⚡⚡⚡

[Run tests]
  → Execute Playwright tests (120 seconds)
   ↓
Total time: ~2.5 minutes ⚡⚡⚡

OVER 2x FASTER than first run!
```

#### **Run #3, #4, #5... (Same pattern)**

```
Setup time: ~10 seconds ⚡⚡⚡
Test time: 120 seconds
───────────────────────
Total: ~2.5 minutes

Every subsequent run reuses:
✅ Node.js installation
✅ Playwright browsers
✅ npm cache
```

---

## File Lifecycle and Cleanup

### What Gets Cleaned vs What Persists

#### **Ephemeral Runners (GitHub Actions)**

```
During Job:
┌──────────────────────────────────────┐
│ /home/runner/work/YourProject/       │
│   ├── .git/                          │
│   ├── tests/                         │
│   ├── node_modules/                  │
│   ├── playwright-report/             │
│   └── test-results/                  │
│                                      │
│ /home/runner/.cache/                 │
│   └── ms-playwright/                 │
│       ├── chromium-1140/             │
│       └── firefox-1463/              │
└──────────────────────────────────────┘

After Job:
┌──────────────────────────────────────┐
│ 💥 EVERYTHING DELETED 💥             │
│                                      │
│ The VM itself is destroyed           │
│ Nothing persists to next run         │
└──────────────────────────────────────┘

Artifacts (uploaded to GitHub):
┌──────────────────────────────────────┐
│ ✅ playwright-report.zip (30 days)   │
│ ✅ test-results.zip (7 days)         │
│                                      │
│ Stored on GitHub's servers           │
│ Downloadable from Actions tab        │
└──────────────────────────────────────┘
```

---

#### **Persistent Runners (Self-Hosted)**

```
During Job:
┌──────────────────────────────────────┐
│ C:\BuildAgent\work\project-123\      │
│   ├── .git/                          │
│   ├── tests/                         │
│   ├── node_modules/                  │
│   ├── playwright-report/             │
│   └── test-results/                  │
│                                      │
│ C:\Program Files\nodejs\             │ ← Permanent
│   └── (Node.js installed)            │
│                                      │
│ C:\Users\BuildAgent\AppData\Local\   │
│   └── ms-playwright\                 │ ← Permanent
│       ├── chromium-1140/             │
│       └── firefox-1463/              │
└──────────────────────────────────────┘

After Job (Workspace cleaned before next job):
┌──────────────────────────────────────┐
│ C:\BuildAgent\work\project-123\      │
│   └── 🗑️ DELETED (next job cleans)   │
│                                      │
│ C:\Program Files\nodejs\             │
│   └── ✅ PERSISTS                    │
│                                      │
│ C:\Users\BuildAgent\AppData\Local\   │
│   └── ms-playwright\                 │
│       └── ✅ PERSISTS                │
└──────────────────────────────────────┘

Machine Status:
┌──────────────────────────────────────┐
│ ✅ Machine stays running             │
│ ✅ Tools/browsers remain installed   │
│ ✅ Ready for next job immediately    │
└──────────────────────────────────────┘
```

---

### Cleanup Timing

| Event | Ephemeral | Persistent |
|-------|-----------|------------|
| **Before job starts** | VM created fresh | Workspace cleaned |
| **During job** | Files accumulate | Files accumulate |
| **After job completes** | VM destroyed (~1-2 mins) | Workspace stays (until next job) |
| **Next job starts** | New VM created | Same machine, workspace cleaned |

---

### Disk Space Over Time

#### **Ephemeral Runners**

```
Run #1: Start with 0 GB → Use 2 GB → Destroyed → End with 0 GB
Run #2: Start with 0 GB → Use 2 GB → Destroyed → End with 0 GB
Run #3: Start with 0 GB → Use 2 GB → Destroyed → End with 0 GB

Disk usage: Always 0 GB between jobs ✅
No accumulation, no cleanup needed ✅
```

#### **Persistent Runners**

```
Initial:    50 GB used
After Run #1: 52 GB used (Node.js + browsers + cache)
After Run #2: 52 GB used (reuses existing)
After Run #3: 52 GB used (reuses existing)
...
Week 1:     52 GB
Week 2:     54 GB (npm cache grows)
Week 4:     58 GB (more packages cached)
Month 3:    70 GB (accumulated cruft)

Eventually needs manual cleanup:
$ npm cache clean --force
$ Remove old Playwright versions
$ Clean temp files
```

---

## Comparison Table

### Complete Feature Comparison

| Feature | GitHub Actions (Cloud) | Self-Hosted (Company) |
|---------|------------------------|----------------------|
| **Runner Type** | Ephemeral VM | Persistent Server |
| **Lifespan** | Minutes | Months/Years |
| **After Job** | Destroyed 💥 | Stays running ✅ |
| **Setup Time (First Run)** | 3-5 minutes | 3-6 minutes |
| **Setup Time (Subsequent)** | 3-5 minutes (same) | 10-30 seconds ⚡ |
| **Node.js Installation** | Every run | Once, then reused |
| **npm packages** | Downloaded every run | Cached on disk |
| **Playwright Browsers** | Downloaded every run | Installed once |
| **Bandwidth (per run)** | ~900 MB | ~10 MB (after first run) |
| **Disk Space Management** | Auto (VM destroyed) | Manual cleanup needed |
| **Isolation** | Perfect (new VM) | Shared machine |
| **Cost Model** | Pay per minute | Fixed infrastructure |
| **Maintenance** | None (GitHub manages) | DevOps team manages |
| **Security** | Data wiped automatically | Must implement cleanup |
| **Customization** | Limited | Full control |
| **Startup Speed** | Slow (VM creation) | Instant (already running) |
| **Workspace Persistence** | Never | Between jobs (optional) |
| **System-level Tools** | Fresh install | Installed once |

---

## Real-World Examples

### Example 1: GitHub Actions Workflow

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest  # ← Ephemeral VM
    
    steps:
      # Start: Empty VM
      
      - name: Checkout code
        uses: actions/checkout@v4
        # Downloads your repository
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
        # Installs Node.js (20-30s)
        
      - name: Install dependencies
        run: npm ci
        # Downloads all npm packages (60s)
        # Creates node_modules/ folder
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        # Downloads browsers (90s)
        # ~500 MB download
        
      - name: Run tests
        run: npx playwright test
        # Executes your tests
        
      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
        # Saves report to GitHub's storage
        
      # End: VM destroyed
      # All files deleted
      # Only artifacts remain in GitHub storage
```

**Timeline:**
```
0:00 - VM created (empty)
0:10 - Code downloaded
0:40 - Node.js installed
1:40 - npm packages installed
3:10 - Browsers installed
5:10 - Tests complete
5:20 - Artifacts uploaded
5:22 - VM DESTROYED 💥
```

---

### Example 2: Self-Hosted Bitbucket Pipeline

```yaml
# bitbucket-pipelines.yml
definitions:
  steps:
    - step: &run-tests
        name: Playwright Tests
        runs-on:
          - 'self.hosted'
          - 'windows'
          - 'automation'
        clone:
          depth: 1  # Shallow clone
        caches:
          - node
        script:
          - powershell ./run-tests.ps1
        artifacts:
          - playwright-report/**
          - test-results/**

pipelines:
  custom:
    run-tests-manually:
      - step: *run-tests
```

```powershell
# run-tests.ps1
Write-Host "Step 1: Checking Node.js..."
$nodePath = "C:\Program Files\nodejs"
if (Test-Path $nodePath) {
    Write-Host "Node.js found ✅ (skipped installation)"
} else {
    Write-Host "Installing Node.js..."
    # Install logic
}

Write-Host "Step 2: Installing dependencies..."
npm install  # Uses cached node_modules/ if unchanged

Write-Host "Step 3: Checking browsers..."
$browserPath = "$env:LOCALAPPDATA\ms-playwright\chromium-*"
if (Test-Path $browserPath) {
    Write-Host "Browsers found ✅ (skipped installation)"
} else {
    Write-Host "Installing browsers..."
    npx playwright install chromium --with-deps
}

Write-Host "Step 4: Running tests..."
npx playwright test
```

**Timeline (First Run):**
```
0:00 - Job assigned to WIN-SERVER-01 (already running)
0:05 - Workspace cleaned
0:10 - Code cloned
0:15 - Node.js check (not found)
0:25 - Node.js installed
1:25 - npm install (downloads packages)
2:30 - Browsers installed
5:30 - Tests complete
5:35 - Artifacts saved
      - Machine STAYS RUNNING ✅
```

**Timeline (Subsequent Runs):**
```
0:00 - Job assigned to WIN-SERVER-01 (same machine)
0:05 - Workspace cleaned
0:10 - Code cloned
0:12 - Node.js check ✅ (found, skip)
0:17 - npm install ✅ (cached, ~5s)
0:18 - Browsers check ✅ (found, skip)
0:20 - Tests start immediately
3:20 - Tests complete
      - Total: 3 minutes ⚡⚡⚡ (vs 5.5 minutes first run)
```

---

## Best Practices

### For Ephemeral Runners (GitHub Actions)

#### 1. **Use Caching**

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ~/.cache/ms-playwright
    key: ${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

**Benefit**: Speeds up runs from 5 mins → 2-3 mins

---

#### 2. **Optimize Artifact Uploads**

```yaml
# Bad: Uploads everything (slow, wastes storage)
- uses: actions/upload-artifact@v4
  with:
    name: all-files
    path: ./**

# Good: Only what you need
- uses: actions/upload-artifact@v4
  if: failure()  # Only on failures
  with:
    name: test-failures
    path: |
      test-results/
      playwright-report/
    retention-days: 7  # Auto-delete after 7 days
```

---

#### 3. **Use Shallow Clones**

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 1  # Only latest commit, not full history
```

**Benefit**: Faster checkout (especially for large repos)

---

#### 4. **Matrix for Parallel Testing**

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        browser: [chromium, firefox, webkit]
    runs-on: ${{ matrix.os }}
    steps:
      - run: npx playwright test --project=${{ matrix.browser }}
```

**Benefit**: 6 jobs run in parallel (6x faster wall-clock time)

---

### For Persistent Runners (Self-Hosted)

#### 1. **Smart Installation Checks**

```powershell
# Always check before installing
if (Test-Path "C:\Program Files\nodejs") {
    Write-Host "Node.js already installed ✅"
} else {
    Write-Host "Installing Node.js..."
    # Install
}
```

**Benefit**: Saves 60-120 seconds per run

---

#### 2. **Periodic Cleanup**

```powershell
# Run weekly via scheduled task
npm cache clean --force
Remove-Item "$env:LOCALAPPDATA\ms-playwright\*-old" -Recurse -Force
Remove-Item "C:\BuildAgent\work\*" -Recurse -Force -ErrorAction SilentlyContinue
```

**Benefit**: Prevents disk space issues

---

#### 3. **Workspace Cleanup Strategy**

```yaml
# Option 1: Clean before every job (safest)
script:
  - git clean -fdx  # Remove all untracked files
  - git reset --hard  # Discard changes
  - git pull

# Option 2: Reuse node_modules (faster)
script:
  - git clean -fdx -e node_modules/  # Keep node_modules
  - npm ci --prefer-offline  # Use cache
```

---

#### 4. **Monitor Disk Usage**

```powershell
# Add to your CI script
$disk = Get-PSDrive C
$freeGB = [math]::Round($disk.Free / 1GB, 2)
Write-Host "Disk free: $freeGB GB"

if ($freeGB -lt 10) {
    Write-Warning "Low disk space! Running cleanup..."
    npm cache clean --force
}
```

---

#### 5. **Label Your Runners Properly**

```yaml
# Bad: Generic label
runs-on:
  - self.hosted

# Good: Specific labels
runs-on:
  - self.hosted
  - windows           # OS
  - playwright        # Purpose
  - high-memory       # Resource requirement
```

**Benefit**: Route jobs to appropriate machines

---

## Security Considerations

### Ephemeral Runners

✅ **Automatic Security**
- Secrets wiped on VM destruction
- No state carries between jobs
- Jobs from different users isolated

❌ **Potential Issues**
- Public repos = public logs (be careful with secrets)
- Third-party actions can be malicious

---

### Persistent Runners

⚠️ **Requires Active Management**

#### Must Implement:
1. **Secrets Management**
   ```powershell
   # Don't store secrets in environment permanently
   # Load them per-job, clear after
   $env:API_KEY = Get-Secret "ApiKey"
   # ... use it ...
   Remove-Item Env:\API_KEY
   ```

2. **Workspace Isolation**
   ```
   C:\BuildAgent\work\
   ├── job-123\  ← Isolated workspace
   ├── job-124\  ← Isolated workspace
   └── job-125\  ← Isolated workspace
   ```

3. **User Permissions**
   ```
   Run build agent as limited user, not Administrator
   Restrict file system access
   Network isolation where possible
   ```

4. **Audit Logging**
   ```powershell
   # Log all job activity
   Write-Host "Job started by: $env:BITBUCKET_USER"
   Write-Host "Commit: $env:BITBUCKET_COMMIT"
   ```

---

## Troubleshooting

### Common Issues

#### Issue 1: "Disk Full" (Persistent Runners)

**Symptoms:**
```
Error: ENOSPC: no space left on device
```

**Solution:**
```powershell
# Check disk usage
Get-PSDrive C

# Clean npm cache
npm cache clean --force

# Clean old Playwright browsers
Remove-Item "$env:LOCALAPPDATA\ms-playwright\chromium-*-old" -Recurse

# Clean old workspaces
Remove-Item "C:\BuildAgent\work\*" -Recurse -Force
```

---

#### Issue 2: "Tests Slower Than Local" (Ephemeral)

**Cause:** Downloading browsers every run

**Solution:** Add caching
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ hashFiles('**/package-lock.json') }}
```

---

#### Issue 3: "Port Already in Use" (Persistent)

**Cause:** Previous job didn't clean up

**Solution:**
```powershell
# Kill lingering processes before tests
Get-Process | Where-Object {$_.Name -like "*playwright*"} | Stop-Process -Force
Get-Process | Where-Object {$_.Name -like "*chrome*"} | Stop-Process -Force
```

---

#### Issue 4: "Node Version Mismatch" (Persistent)

**Cause:** System Node.js different from project requirement

**Solution:** Use version managers
```powershell
# Install nvm-windows
nvm install 20.11.0
nvm use 20.11.0
npm install
npx playwright test
```

---

## FAQ

### Q: How long does a GitHub Actions VM stay alive?

**A:** Only during your job execution + ~1-2 minutes for cleanup. Usually 5-10 minutes total.

---

### Q: Can I SSH into a GitHub Actions runner to debug?

**A:** Not after the job. But you can use action-tmate to pause and SSH during the job:

```yaml
- name: Setup tmate session
  uses: mxschmitt/action-tmate@v3
  if: failure()  # Only on test failure
```

---

### Q: Do self-hosted runners need to be Windows?

**A:** No. They can be:
- Windows
- Linux
- macOS
- Docker containers
- Even Raspberry Pi!

---

### Q: How much does it cost to run self-hosted vs cloud?

**Rough estimates for 1000 test runs/month:**

**GitHub Actions (cloud):**
```
1000 runs × 5 minutes = 5,000 minutes
Free tier: 2,000 minutes
Paid: 3,000 minutes × $0.008 = $24/month
```

**Self-hosted:**
```
Windows Server VM (AWS):  $50-100/month (fixed)
Maintenance time:         $200/month (DevOps hours)
────────────────────────────────────────
Total:                    $250-300/month
```

**Break-even point:** ~2,000-3,000 minutes/month

---

### Q: What happens to uploaded artifacts?

**GitHub Actions:**
- Stored on GitHub's servers
- Downloadable from Actions tab
- Auto-deleted after retention period (default 90 days, configurable down to 1 day)

**Self-hosted:**
- Usually archived on the runner machine
- Or uploaded to company's artifact storage (Artifactory, S3, etc.)
- Manual retention policies

---

### Q: Can GitHub Actions runners reuse state?

**A:** Only via caching. Example:

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ hashFiles('package-lock.json') }}
```

Cache hits restore files from previous runs, but:
- Cache can expire (7 days unused)
- Cache size limit (10 GB total per repo)
- Slower than true persistence

---

## Summary

### Key Takeaways

1. **Ephemeral Runners (GitHub Actions Default)**
   - ✅ Zero maintenance
   - ✅ Perfect isolation
   - ✅ Automatic cleanup
   - ❌ Slower (downloads every time)
   - ❌ More bandwidth usage

2. **Persistent Runners (Self-Hosted)**
   - ✅ Faster (reuses installations)
   - ✅ Less bandwidth
   - ✅ Full control
   - ❌ Requires maintenance
   - ❌ Manual cleanup needed
   - ❌ Infrastructure costs

3. **File Cleanup**
   - **Ephemeral**: Automatic (VM destroyed)
   - **Persistent**: Manual (workspace cleaned between jobs, tools persist)

4. **Best Choice**
   - Small projects → Ephemeral (simpler)
   - High-frequency testing → Persistent (faster)
   - Sensitive data → Ephemeral (auto-wiped) or well-secured persistent
   - Complex dependencies → Persistent (avoid re-downloading)

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Self-hosted Runners Setup](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Bitbucket Pipelines Self-hosted](https://support.atlassian.com/bitbucket-cloud/docs/runners/)

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-28  
**Author:** Hashir - R&D Playwright Project  
**Purpose:** Reference guide for understanding CI/CD runners, file lifecycle, and cleanup mechanisms
