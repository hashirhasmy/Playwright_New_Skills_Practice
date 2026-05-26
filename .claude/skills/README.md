# Skills Directory

This directory contains **agent-specific skills** only.

## Structure

Each skill should be organized by agent name:

```
skills/
├── <agent-name>/
│   └── SKILL.md
├── test-analyzer/
│   └── SKILL.md
├── visual-tester/
│   └── SKILL.md
```

## Example Structure

```
skills/
├── xray-test-estimator/
│   └── SKILL.md          # automation-estimation skill
├── playwright-debugger/
│   └── SKILL.md          # test debugging skill
```

## Skill File Format

```markdown
---
name: skill-name
description: Brief description of what this skill does
agentType: agent-name
---

# Skill Name

Description and usage instructions for the agent.
```

## Usage in Commands

Commands can reference agents and their skills:

```markdown
# Task

Use the `xray-test-estimator` agent with the `automation-estimation` skill to:
- Analyze test complexity
- Provide time estimates
```

---

**Note:** User-invocable slash commands go in `/commands/` directory, not here.
