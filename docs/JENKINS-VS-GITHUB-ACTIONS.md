# Jenkins vs GitHub Actions: Comprehensive Comparison

## Overview

This document provides a detailed comparison between Jenkins and GitHub Actions for CI/CD automation, specifically focusing on test automation workflows.

---

## 🏗️ Architecture & Setup

### Jenkins
- **Type**: Self-hosted CI/CD server
- **Installation**: Requires dedicated server/infrastructure
- **Maintenance**: Manual updates, plugin management, backups
- **Cost**: Infrastructure costs (server, storage, bandwidth)
- **Scalability**: Requires manual scaling and load balancing
- **Setup Time**: Hours to days (install, configure, secure)

### GitHub Actions
- **Type**: Cloud-native, serverless CI/CD
- **Installation**: No installation required (built into GitHub)
- **Maintenance**: Fully managed by GitHub
- **Cost**: Free tier available (2,000 minutes/month for private repos)
- **Scalability**: Automatic scaling
- **Setup Time**: Minutes (create YAML file)

---

## ⚙️ Configuration Approaches

### Jenkins: UI + Code (Flexible)

#### Option 1: UI-Based (Freestyle Project)
```
✅ No code files required
✅ Configure via web dashboard
✅ Click "Build Now" button
✅ Good for quick/simple jobs
❌ Configuration not in version control
❌ Hard to replicate across environments
```

**Example Setup**:
1. Create "New Item" → Freestyle Project
2. Configure:
   - Source Code Management: Git repo URL
   - Build Triggers: Poll SCM, webhooks
   - Build Steps: Execute shell commands
   - Post-build Actions: Publish reports
3. Click "Build Now"

#### Option 2: Pipeline as Code (Jenkinsfile)
```groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npx playwright test'
            }
        }
    }
}
```

**Pros**:
- Version controlled
- Portable across Jenkins instances
- Complex workflows supported

**Cons**:
- Groovy syntax learning curve
- Still requires Jenkins server setup

---

### GitHub Actions: Code ONLY (Mandatory)

#### YAML-Based (Only Option)
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright test
```

**Requirements**:
- ✅ MUST have `.github/workflows/*.yml` file
- ✅ Configuration is ALWAYS in repository
- ✅ No UI alternative
- ✅ Same config across all forks/branches

---

## 🔧 Job Configuration Comparison

| Feature | Jenkins (Freestyle) | Jenkins (Pipeline) | GitHub Actions |
|---------|-------------------|-------------------|----------------|
| **Configuration File** | ❌ Optional | ✅ `Jenkinsfile` | ✅ `.github/workflows/*.yml` |
| **UI Configuration** | ✅ Full UI | ⚠️ Limited UI | ❌ No UI |
| **Version Control** | ❌ Server-only | ✅ In repo | ✅ In repo |
| **Manual Trigger** | ✅ "Build Now" | ✅ "Build Now" | ✅ `workflow_dispatch` |
| **Portability** | ❌ Low | ⚠️ Medium | ✅ High |

---

## 🎯 Running Tests: Step-by-Step

### Jenkins (UI-Based)

**Setup**:
1. Install Jenkins on server
2. Install required plugins (Git, NodeJS, HTML Publisher)
3. Create New Item → Freestyle Project
4. Configure Source Control:
   ```
   Repository URL: https://github.com/user/repo.git
   Credentials: Add GitHub token
   Branch: */main
   ```
5. Add Build Step → Execute Shell:
   ```bash
   npm ci
   npx playwright install --with-deps
   npx playwright test
   ```
6. Add Post-build Action → Publish HTML Reports
7. Save

**Run Tests**:
- Click "Build Now" button
- OR Configure triggers (SCM polling, webhooks)

**No file needed in repository** ✅

---

### Jenkins (Pipeline)

**Setup**:
1. Create `Jenkinsfile` in repository root:
```groovy
pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
    
    post {
        always {
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}
```

2. Create Pipeline Project in Jenkins UI
3. Point to Jenkinsfile (from SCM)
4. Save

**Run Tests**:
- Click "Build Now"
- OR Configure triggers

**File needed: `Jenkinsfile`** ⚠️

---

### GitHub Actions

**Setup**:
1. Create `.github/workflows/tests.yml` in repository:
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:  # Manual trigger

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npx playwright test
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

2. Commit and push to GitHub
3. Done! ✅

**Run Tests**:
- Automatic: Push code or create PR
- Manual: Actions tab → "Run workflow" button

**File MANDATORY: `.github/workflows/*.yml`** ⚠️

---

## 🚀 Triggering Tests

### Jenkins

#### Automatic Triggers:
```groovy
// Jenkinsfile
triggers {
    pollSCM('H/5 * * * *')  // Poll every 5 mins
    cron('H 2 * * *')        // Daily at 2 AM
}
```

**OR via UI**:
- Build Triggers → Poll SCM
- Build Triggers → Build periodically
- GitHub webhook configuration

#### Manual Trigger:
- Click "Build Now" button (always available)

---

### GitHub Actions

#### Automatic Triggers:
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

#### Manual Trigger:
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to test'
        required: true
        type: choice
        options:
          - staging
          - production
```

Access via: **Actions tab → "Run workflow" button**

---

## 🎨 Parameterized Builds

### Jenkins (UI)

**Configure**:
1. Check "This project is parameterized"
2. Add parameters:
   - String Parameter: `BROWSER`
   - Choice Parameter: `ENVIRONMENT` (staging, prod)
   - Boolean Parameter: `HEADED_MODE`

**Use in Build**:
```bash
npx playwright test --project=$BROWSER --headed=$HEADED_MODE
```

**Run**: Click "Build with Parameters"

---

### Jenkins (Pipeline)

```groovy
pipeline {
    parameters {
        choice(name: 'BROWSER', 
               choices: ['chromium', 'firefox', 'webkit'],
               description: 'Browser to test')
        string(name: 'TEST_PATH', 
               defaultValue: 'tests/',
               description: 'Test path')
    }
    
    stages {
        stage('Test') {
            steps {
                sh "npx playwright test --project=${params.BROWSER} ${params.TEST_PATH}"
            }
        }
    }
}
```

---

### GitHub Actions

```yaml
on:
  workflow_dispatch:
    inputs:
      browser:
        description: 'Browser to test'
        required: true
        type: choice
        options:
          - chromium
          - firefox
          - webkit
      test_path:
        description: 'Test path'
        required: false
        type: string
        default: 'tests/'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright test --project=${{ inputs.browser }} ${{ inputs.test_path }}
```

**Access**: Actions tab → Workflow → "Run workflow" dropdown

---

## 🔐 Secrets Management

### Jenkins
- **Location**: Jenkins Credentials Store (server-level)
- **Access**: Via UI or Credentials Plugin
- **Usage**:
  ```groovy
  withCredentials([string(credentialsId: 'api-key', variable: 'API_KEY')]) {
      sh 'echo $API_KEY'
  }
  ```
- **Scope**: Global or folder-level
- **Backup**: Manual export required

### GitHub Actions
- **Location**: Repository/Organization/Environment secrets
- **Access**: Settings → Secrets and variables → Actions
- **Usage**:
  ```yaml
  env:
    API_KEY: ${{ secrets.API_KEY }}
  ```
- **Scope**: Repository, Environment, or Organization
- **Backup**: Encrypted, managed by GitHub

---

## 📊 Reporting & Artifacts

### Jenkins
```groovy
post {
    always {
        // HTML Reports
        publishHTML(target: [
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Test Report'
        ])
        
        // Archive artifacts
        archiveArtifacts artifacts: 'test-results/**/*',
                         allowEmptyArchive: true
        
        // JUnit reports
        junit 'results.xml'
    }
}
```

**Storage**: Jenkins server disk (manual cleanup needed)

---

### GitHub Actions
```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30

- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: test-failures
    path: test-results/
    retention-days: 7
```

**Storage**: GitHub-hosted (auto-cleanup after retention period)

---

## 🌐 Environment & Runners

### Jenkins

**Agents**:
- Master/Agent architecture
- Static agents (always running)
- Dynamic agents (Docker, Kubernetes)
- Custom labels for routing

**Setup**:
```groovy
pipeline {
    agent {
        label 'linux && nodejs'
    }
    // OR
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:latest'
        }
    }
}
```

**Resources**: Self-managed (CPU, RAM, disk)

---

### GitHub Actions

**Runners**:
- GitHub-hosted (no setup)
- Self-hosted (optional)
- Fresh VM per job

**Setup**:
```yaml
jobs:
  test:
    runs-on: ubuntu-latest  # or windows-latest, macos-latest
    
    # OR matrix for multiple OS
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
```

**Resources**: Auto-scaled, fully managed

---

## 💰 Cost Comparison

### Jenkins
**Infrastructure Costs**:
- Server hosting (AWS/Azure/on-prem): $50-500+/month
- Storage for artifacts/logs
- Network bandwidth
- DevOps time for maintenance

**Free**: Open-source software

**Total**: $500-2000+/month (medium team)

---

### GitHub Actions

**Free Tier** (Public repos):
- ✅ Unlimited minutes

**Free Tier** (Private repos):
- ✅ 2,000 minutes/month
- ✅ 500 MB artifact storage

**Paid** (Private repos):
- $0.008/minute (Linux)
- $0.016/minute (Windows)
- $0.08/minute (macOS)

**Example**: 100 test runs/day × 5 mins × 30 days = 15,000 mins = ~$120/month

**Total**: $0-200/month (small-medium team)

---

## 🛠️ Plugin Ecosystem

### Jenkins
- **Plugins**: 1,800+ plugins
- **Management**: Manual updates, compatibility issues
- **Examples**:
  - HTML Publisher
  - Blue Ocean (modern UI)
  - Slack Notifications
  - GitHub Integration
  - Docker Pipeline

**Pros**: Extensive customization  
**Cons**: Dependency hell, security updates

---

### GitHub Actions
- **Actions Marketplace**: 20,000+ pre-built actions
- **Management**: Automatic updates via versions
- **Examples**:
  ```yaml
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
  - uses: microsoft/playwright-github-action@v1
  - uses: slack/notify@v2
  ```

**Pros**: Version-pinned, no maintenance  
**Cons**: Less customizable than Jenkins plugins

---

## 🔄 Matrix Builds (Multi-Browser/OS Testing)

### Jenkins
```groovy
pipeline {
    agent none
    stages {
        stage('Test') {
            matrix {
                axes {
                    axis {
                        name 'BROWSER'
                        values 'chromium', 'firefox', 'webkit'
                    }
                    axis {
                        name 'OS'
                        values 'linux', 'windows', 'mac'
                    }
                }
                agent {
                    label "${OS}"
                }
                stages {
                    stage('Run') {
                        steps {
                            sh "npx playwright test --project=${BROWSER}"
                        }
                    }
                }
            }
        }
    }
}
```

**Requires**: Multiple agents with different OS labels

---

### GitHub Actions
```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        browser: [chromium, firefox, webkit]
    
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --project=${{ matrix.browser }}
```

**Result**: Automatic 9 parallel jobs (3 OS × 3 browsers)

---

## 📈 Comparison Summary

| Category | Jenkins | GitHub Actions | Winner |
|----------|---------|----------------|--------|
| **Setup Time** | Hours/Days | Minutes | 🏆 GitHub Actions |
| **Cost (Small Team)** | $500+/month | $0-100/month | 🏆 GitHub Actions |
| **Maintenance** | High | None | 🏆 GitHub Actions |
| **Configuration Flexibility** | UI + Code | Code only | 🏆 Jenkins |
| **Learning Curve** | Steep | Moderate | 🏆 GitHub Actions |
| **Customization** | Extremely high | High | 🏆 Jenkins |
| **Integration** | Plugin-based | Native GitHub | 🏆 GitHub Actions |
| **Scalability** | Manual | Automatic | 🏆 GitHub Actions |
| **Security** | Self-managed | GitHub-managed | 🏆 GitHub Actions |
| **Offline Use** | ✅ Yes | ❌ No | 🏆 Jenkins |
| **Enterprise Features** | Extensive | Growing | 🏆 Jenkins |

---

## 🎯 When to Use What?

### Choose Jenkins When:
- ✅ You need full control over infrastructure
- ✅ Complex enterprise workflows
- ✅ Multi-system integration (not just GitHub)
- ✅ On-premise requirements (air-gapped networks)
- ✅ Existing Jenkins expertise in team
- ✅ Heavy customization needs
- ✅ Integration with legacy systems

### Choose GitHub Actions When:
- ✅ GitHub-hosted repositories
- ✅ Quick setup needed
- ✅ Small to medium teams
- ✅ Cloud-native workflows
- ✅ Want zero maintenance
- ✅ Standard CI/CD needs
- ✅ Cost-conscious (small scale)
- ✅ Modern web/mobile projects

---

## 🔄 Migration Path: Jenkins → GitHub Actions

### Step 1: Analyze Jenkins Job
```groovy
// Current Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npx playwright test'
            }
        }
    }
}
```

### Step 2: Convert to GitHub Actions
```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright test
```

### Step 3: Run in Parallel
- Keep Jenkins running
- Add GitHub Actions workflow
- Compare results
- Gradually migrate jobs

---

## 📝 Playwright-Specific Considerations

### Jenkins
```groovy
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.60.0-jammy'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npx playwright test'
            }
        }
    }
    post {
        always {
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}
```

---

### GitHub Actions
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

**Key Difference**: GitHub Actions handles browser installation automatically with `--with-deps` flag.

---

## 🏁 Conclusion

### For Playwright Test Automation:

**GitHub Actions** is recommended for most teams because:
- ✅ Zero setup/maintenance
- ✅ Native GitHub integration
- ✅ Cost-effective for typical usage
- ✅ Built-in artifact hosting
- ✅ Easy matrix testing across browsers/OS
- ✅ YAML is simpler than Groovy

**Jenkins** makes sense if:
- ⚠️ You already have Jenkins infrastructure
- ⚠️ Need on-premise CI/CD
- ⚠️ Complex enterprise requirements
- ⚠️ Integration beyond GitHub (GitLab, Bitbucket, etc.)

---

## 📚 Additional Resources

### Jenkins
- [Jenkins Official Docs](https://www.jenkins.io/doc/)
- [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Playwright + Jenkins Guide](https://playwright.dev/docs/ci#jenkins)

### GitHub Actions
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Playwright + GitHub Actions Guide](https://playwright.dev/docs/ci-intro)

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-28  
**Author**: Hashir - R&D Playwright Project
