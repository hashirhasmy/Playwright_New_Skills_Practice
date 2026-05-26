# Quick Reference - Claude Code Configuration

Fast lookup guide for common configuration questions.

---

## File Locations

```
Project Root/
├── .mcp.json                           # MCP server definitions
├── .gitignore                          # Add: .claude/settings.local.json
├── playwright.config.js                # Playwright test config
└── .claude/
    ├── CLAUDE.md                      # Project guidelines
    ├── settings.json                  # Team settings
    ├── settings.local.json            # Personal settings (gitignored)
    ├── settings.local.json.example    # Template for team
    ├── agents/                        # Custom agents
    ├── skills/                        # Custom slash commands
    ├── memory/                        # Project memory
    └── docs/                          # Documentation

User Home/
└── ~/.claude.json                     # Global user config
    or C:\Users\YourName\.claude.json
```

---

## File Purposes at a Glance

| File | What it Does | Share with Team? |
|------|-------------|------------------|
| `.mcp.json` | Defines MCP servers (HOW to connect) | ✅ Yes |
| `.claude/settings.json` | Team rules & permissions | ✅ Yes |
| `.claude/settings.local.json` | Your personal overrides | ❌ No |
| `~/.claude.json` | Global user config | N/A |
| `playwright.config.js` | Playwright test behavior | ✅ Yes |

---

## Common Questions

### Q: Can I define MCP servers in settings.json?
**A:** ❌ No. Only in `.mcp.json` or `~/.claude.json`

### Q: Does settings.json override playwright.config.js?
**A:** ❌ No. They're completely separate systems.

### Q: Is permissions enough to enable MCP?
**A:** ❌ No. You need MCP definition first, permissions are optional.

### Q: Do I need .mcp.json if I have global config?
**A:** For you: No. For team sharing: Yes.

### Q: Which settings file wins?
**A:** settings.local.json > settings.json > user global

---

## MCP Configuration

### Add MCP Server
```bash
# Project scope (team)
claude mcp add --scope project --transport stdio playwright -- npx -y @playwright/mcp@latest

# User scope (global)
claude mcp add --scope user --transport stdio playwright -- npx -y @playwright/mcp@latest
```

### Check MCP Status
```bash
# From terminal
claude mcp list
claude mcp get playwright

# In Claude session
/mcp
```

### MCP Definition (Required)
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

### MCP Permissions (Optional)
```json
// .claude/settings.json
{
  "permissions": {
    "allow": ["MCP:playwright"]
  }
}
```

---

## Settings Precedence

**Override order (highest to lowest):**
1. Command-line args
2. `.claude/settings.local.json` ← Your overrides
3. `.claude/settings.json` ← Team settings
4. `~/.claude.json` ← User global
5. Managed settings

---

## Common Patterns

### Team Project
```bash
# Commit to git
.mcp.json
.claude/settings.json
.claude/settings.local.json.example

# Add to .gitignore
.claude/settings.local.json
```

### Personal R&D
```bash
# Option A: Keep both
- .mcp.json (for sharing)
- ~/.claude.json (for convenience)

# Option B: Only global
- ~/.claude.json
- Delete .mcp.json
```

---

## Troubleshooting

### MCP not showing up?
1. Restart Claude Code session
2. Check `claude mcp list`
3. Verify `.mcp.json` syntax
4. Check if file is at project root

### Settings not working?
1. Check JSON syntax
2. Verify file location
3. Check precedence order
4. Restart session

### Permission denied?
1. Check permissions in settings.json
2. Verify MCP is defined (not just permissions)
3. Check if denied elsewhere

---

## Must Remember

```
✅ MCP Definition = Required (in .mcp.json or ~/.claude.json)
⚠️  MCP Permissions = Optional (in settings.json)

✅ settings.local.json = Personal (gitignore)
✅ settings.json = Team (commit)

❌ Cannot define MCP in settings files
❌ settings.json doesn't affect playwright.config.js
```

---

## gitignore Template

```gitignore
# Playwright
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
/playwright/.auth/

# Claude Code - Personal settings
.claude/settings.local.json
```

---

## Quick Commands

```bash
# MCP
claude mcp add --scope project <name> -- <command>
claude mcp list
claude mcp get <name>
claude mcp remove <name> -s project

# Custom Skills (in Claude session)
/smoke          # Run smoke tests
/debug-test     # Debug failing test
/capture        # Take screenshots

# Check Config
cat .mcp.json
cat .claude/settings.json
cat ~/.claude.json
```

---

**For detailed explanations, see:** [mcp-and-settings-guide.md](./mcp-and-settings-guide.md)
