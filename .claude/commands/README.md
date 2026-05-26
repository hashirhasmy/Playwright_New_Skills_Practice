# Commands Directory

This directory contains **user-invocable slash commands** for Claude Code.

## Available Commands

### `/capture` - Screenshot & Visual Regression
Captures screenshots for visual testing, baselines, and documentation.

```bash
/capture https://example.com
/capture --update-baselines
/capture login.spec.js
```

### `/debug-test` - Debug Failing Tests
Runs test in headed mode with full debugging enabled.

```bash
/debug-test "should login successfully"
/debug-test login.spec.js
```

### `/smoke` - Quick Smoke Tests
Runs critical path tests tagged with `@smoke`.

```bash
/smoke
```

## Command File Format

```markdown
---
name: command-name
description: Brief description
args:
  - name: arg_name
    description: Argument description
    required: true/false
---

# Command Documentation

Implementation details and usage examples.
```

## Usage

Type `/command-name` in Claude Code chat to execute.

---

**Note:** Agent-specific skills go in `.claude/skills/<agent-name>/SKILL.md`
