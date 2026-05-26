# MCP & Settings Configuration Guide

Complete reference guide for understanding Claude Code configuration files, MCP servers, and their relationships.

---

## Table of Contents
1. [Configuration Files Overview](#configuration-files-overview)
2. [MCP Server Configuration](#mcp-server-configuration)
3. [Settings Files](#settings-files)
4. [File Precedence & Override Order](#file-precedence--override-order)
5. [Common Patterns](#common-patterns)
6. [Best Practices](#best-practices)

---

## Configuration Files Overview

### Quick Reference Table

| File | Purpose | Scope | Commit to Git? | Can Define MCP? | Can Control Permissions? |
|------|---------|-------|----------------|-----------------|-------------------------|
| `.mcp.json` | Define MCP servers | Project | ✅ Yes | ✅ Yes | ❌ No |
| `.claude/settings.json` | Team settings & rules | Project | ✅ Yes | ❌ No | ✅ Yes |
| `.claude/settings.local.json` | Personal overrides | Local | ❌ No (gitignore) | ❌ No | ✅ Yes |
| `~/.claude.json` | User/global config | User | N/A | ✅ Yes | ❌ No |
| `playwright.config.js` | Playwright test config | Project | ✅ Yes | ❌ No | ❌ No |

---

## MCP Server Configuration

### What is MCP?
**Model Context Protocol (MCP)** allows Claude to connect to external tools and services (like Playwright browser automation, databases, APIs, etc.)

### Where to Define MCP Servers

#### Option 1: Project Scope (Team Sharing)
**File:** `.mcp.json` (at project root)

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "env": {}
    }
  }
}
```

**Use when:**
- Working in a team
- Want everyone to have the same MCP servers
- Project-specific tools

**Benefits:**
- ✅ Committed to git
- ✅ Team members auto-get servers
- ✅ Self-documenting

#### Option 2: User Scope (Personal, Global)
**File:** `~/.claude.json` (in home directory: `C:\Users\YourName\.claude.json`)

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

**Use when:**
- Personal tools across all projects
- Don't want to share with team
- Cross-project utilities

**Benefits:**
- ✅ Works in all your projects
- ✅ Personal customization
- ✅ No need to configure per-project

### CLI Commands for MCP

```bash
# Add MCP server (project scope)
claude mcp add --scope project --transport stdio playwright -- npx -y @playwright/mcp@latest

# Add MCP server (user scope - global)
claude mcp add --scope user --transport stdio playwright -- npx -y @playwright/mcp@latest

# List all MCP servers
claude mcp list

# Get details about a specific server
claude mcp get playwright

# Remove MCP server
claude mcp remove playwright --scope project
```

### MCP Server Types

#### stdio (Local Process)
```json
{
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest"]
}
```
Runs locally on your machine.

#### http (Remote Server)
```json
{
  "type": "http",
  "url": "https://mcp.example.com/playwright"
}
```
Connects to remote MCP server.

---

## Settings Files

### `.claude/settings.json` (Team Settings)

**Purpose:** Project-level settings shared with the team

**What it controls:**
- Permissions (allow/deny commands and MCP access)
- Hooks (automated workflows)
- Environment variables (shared)
- Project preferences

**Example:**
```json
{
  "description": "Project settings",
  "permissions": {
    "allow": ["MCP:playwright", "Bash(npm *)"],
    "deny": ["Bash(rm -rf *)"]
  },
  "env": {
    "NODE_ENV": "development",
    "AWS_PROFILE": "company-dev"
  },
  "hooks": {
    "beforeCommit": {
      "command": "npm run lint",
      "enabled": true
    }
  }
}
```

**Commit to git:** ✅ Yes

### `.claude/settings.local.json` (Personal Settings)

**Purpose:** Personal overrides and local-only configuration

**What it controls:**
- Personal environment variables
- Local file paths
- Personal preferences
- Overrides for team settings

**Example:**
```json
{
  "description": "Personal settings for Hashir",
  "env": {
    "AWS_PROFILE": "hashir-personal",
    "MY_API_KEY": "secret-key-here"
  },
  "playwright": {
    "headless": false,
    "slowMo": 100
  },
  "preferences": {
    "explainCode": true
  }
}
```

**Commit to git:** ❌ No (add to .gitignore)

**Add to `.gitignore`:**
```
.claude/settings.local.json
```

---

## File Precedence & Override Order

### Settings Precedence (Highest to Lowest)

1. **Command-line arguments** (if applicable)
2. **Local settings** (`.claude/settings.local.json`)
3. **Project settings** (`.claude/settings.json`)
4. **User settings** (`~/.claude.json`)
5. **Managed settings** (enterprise/IT-enforced)

**Example:**
```json
// .claude/settings.json (project)
{
  "env": {
    "AWS_PROFILE": "team-default"
  }
}

// .claude/settings.local.json (local)
{
  "env": {
    "AWS_PROFILE": "hashir-personal"  // ← This wins!
  }
}
```

Result: `AWS_PROFILE = "hashir-personal"`

### MCP Server Precedence (Highest to Lowest)

When the same MCP server is defined in multiple places:

1. **Local scope** (`~/.claude.json` with project path)
2. **Project scope** (`.mcp.json`)
3. **User scope** (`~/.claude.json` global)
4. **Plugin-provided**
5. **Claude.ai connectors**

---

## Common Patterns

### Pattern 1: Team Project Setup

**Goal:** Share MCP servers and settings with team

```
project/
├── .mcp.json                    # ✅ Commit - team MCP servers
├── .claude/
│   ├── settings.json           # ✅ Commit - team rules
│   ├── settings.local.json     # ❌ Gitignore - personal
│   └── settings.local.json.example  # ✅ Commit - template
└── .gitignore                  # Add: .claude/settings.local.json
```

### Pattern 2: Personal R&D Project

**Goal:** Quick personal setup, might share later

**Option A:** Keep both (recommended)
```
- Global config (~/.claude.json) - for you
- .mcp.json - for when you share
```

**Option B:** Only global
```
- Only ~/.claude.json
- Delete .mcp.json
- Works for you, but others need to configure manually
```

### Pattern 3: Enterprise/Locked Down

**Goal:** Enforce policies, restrict access

```json
// .claude/settings.json
{
  "permissions": {
    "allow": ["MCP:approved-tool"],
    "deny": ["Bash(rm *)"]
  },
  "sandbox": {
    "enabled": true
  }
}
```

---

## Best Practices

### ✅ DO

1. **Commit `.mcp.json`** to share MCP servers with team
2. **Gitignore `.claude/settings.local.json`** for personal overrides
3. **Use project settings** for team policies
4. **Use local settings** for credentials and personal preferences
5. **Create `.example` files** as templates for team members
6. **Document MCP servers** in project README

### ❌ DON'T

1. **Don't commit secrets** in settings.json (use settings.local.json)
2. **Don't define MCP in settings files** (only in .mcp.json or ~/.claude.json)
3. **Don't mix concerns** (use playwright.config.js for Playwright, not Claude settings)
4. **Don't duplicate config** unnecessarily (choose global OR project)

---

## Troubleshooting

### MCP Server Not Showing Up

**Problem:** `/mcp` shows "No MCP servers configured"

**Solutions:**
1. Check if `.mcp.json` exists at project root
2. Restart Claude Code session after adding MCP
3. Verify with `claude mcp list` from terminal
4. Check for JSON syntax errors in `.mcp.json`

### Settings Not Taking Effect

**Problem:** Changes to settings.json not working

**Solutions:**
1. Restart Claude Code session
2. Check for syntax errors (valid JSON)
3. Verify precedence (local overrides project)
4. Use `claude mcp get <server>` to check config

### Permission Denied

**Problem:** MCP tools not accessible

**Solutions:**
1. Check permissions in settings.json:
   ```json
   {
     "permissions": {
       "allow": ["MCP:playwright"]
     }
   }
   ```
2. Verify MCP server is defined (not just permissions)
3. Check if denied in higher-precedence settings file

---

## Important Distinctions

### MCP Configuration vs Playwright Configuration

```
❌ WRONG ASSUMPTION:
".claude/settings.json overrides playwright.config.js"

✅ CORRECT:
They are completely separate systems!
```

| Aspect | `.claude/settings.json` | `playwright.config.js` |
|--------|------------------------|----------------------|
| **Controls** | Claude Code behavior | Playwright test execution |
| **Read by** | Claude Code | Playwright Test framework |
| **Purpose** | Guide Claude's suggestions | Configure actual test runs |
| **Override** | No relationship | No relationship |

**Example:**
```json
// .claude/settings.json - Hints for Claude
{
  "playwright": {
    "headless": true  // ← Claude's default suggestion
  }
}
```

```javascript
// playwright.config.js - Actual test behavior
export default defineConfig({
  use: {
    headless: false  // ← What actually runs
  }
});
```

Result: Tests run with `headless: false` (playwright.config.js wins, because Claude settings don't control Playwright)

### MCP Definition vs MCP Permissions

```
❌ WRONG ASSUMPTION:
"Adding permissions is enough to enable MCP"

✅ CORRECT:
You need BOTH definition AND (optionally) permissions
```

**MCP Definition (Required):**
```json
// .mcp.json or ~/.claude.json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```
Says: "Connect to Playwright MCP using this command"

**MCP Permissions (Optional):**
```json
// .claude/settings.json
{
  "permissions": {
    "allow": ["MCP:playwright"]
  }
}
```
Says: "Allow access to the already-defined Playwright MCP"

**Analogy:**
- MCP Definition = Phone number (how to connect)
- MCP Permissions = Contact permissions (who can call)
- Without the phone number, granting permission doesn't help!

---

## Quick Decision Tree

### "Where should I configure my MCP server?"

```
Start: Need MCP server
│
├─ Working in a team?
│  ├─ Yes → Use .mcp.json (project scope)
│  │        ✅ Commit to git
│  │        ✅ Team auto-gets it
│  │
│  └─ No → Is it just for you?
│           ├─ Yes, personal tool → Use ~/.claude.json (user scope)
│           │                       ✅ Works in all projects
│           │
│           └─ Might share later → Use BOTH
│                                   ✅ .mcp.json for sharing
│                                   ✅ ~/.claude.json for convenience
```

### "Should I commit this file?"

```
File: .mcp.json
├─ Contains secrets? 
│  ├─ Yes → Use env vars, commit structure
│  └─ No → ✅ Commit (team needs it)

File: .claude/settings.json
└─ ✅ Commit (team settings)

File: .claude/settings.local.json
└─ ❌ Never commit (personal/secrets)

File: playwright.config.js
└─ ✅ Commit (test configuration)
```

---

## Real-World Examples

### Example 1: Playwright R&D Project

```
project/
├── .mcp.json                 # Playwright MCP for team
├── .claude/
│   ├── CLAUDE.md            # Project guidelines
│   ├── settings.json        # Team settings + MCP permissions
│   ├── settings.local.json  # Your personal overrides
│   └── docs/                # This documentation
├── playwright.config.js     # Test configuration
└── .gitignore              # Excludes settings.local.json
```

**What's committed:**
- ✅ `.mcp.json` - So team gets Playwright MCP
- ✅ `.claude/settings.json` - Team rules
- ✅ `playwright.config.js` - Test config
- ❌ `.claude/settings.local.json` - Personal only

### Example 2: Multiple MCP Servers

```json
// .mcp.json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "github": {
      "type": "http",
      "url": "https://mcp-github.example.com"
    },
    "database": {
      "type": "stdio",
      "command": "node",
      "args": ["./scripts/db-mcp-server.js"],
      "env": {
        "DB_HOST": "localhost"
      }
    }
  }
}
```

```json
// .claude/settings.json - Control access
{
  "permissions": {
    "allow": ["MCP:playwright", "MCP:github"],
    "deny": ["MCP:database"]  // Restrict database access
  }
}
```

---

## Summary Cheat Sheet

### Files Purpose
```
.mcp.json              → Define MCP servers (HOW to connect)
.claude/settings.json  → Control permissions (WHO can access)
.claude/settings.local.json → Personal overrides
playwright.config.js   → Playwright test configuration (separate system)
```

### Can I...?
```
Define MCP in settings.json?           ❌ No (only in .mcp.json or ~/.claude.json)
Control MCP access in settings.json?   ✅ Yes (permissions)
Override team settings locally?        ✅ Yes (settings.local.json)
Make settings.json override playwright.config.js?  ❌ No (separate systems)
Share .mcp.json with team?            ✅ Yes (commit to git)
Commit settings.local.json?           ❌ No (gitignore it)
```

### Common Commands
```bash
# MCP Management
claude mcp add --scope project playwright -- npx -y @playwright/mcp@latest
claude mcp list
claude mcp get playwright
claude mcp remove playwright -s project

# Check MCP in session
/mcp

# File locations
~/.claude.json                                    # User config
<project>/.mcp.json                              # Project MCP
<project>/.claude/settings.json                  # Project settings
<project>/.claude/settings.local.json           # Personal settings
```

---

## Additional Resources

- **Claude Code MCP Docs:** https://code.claude.com/docs/en/mcp.md
- **Model Context Protocol:** https://modelcontextprotocol.io/introduction
- **Claude Code Settings:** https://code.claude.com/docs/en/settings.md
- **Playwright Docs:** https://playwright.dev/docs/intro

---

**Last Updated:** 2026-05-24  
**Project:** Playwright R&D - Skills Practice  
**Author:** Hashir Mohamed
