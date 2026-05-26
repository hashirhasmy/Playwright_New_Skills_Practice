---
name: playwright-debugger
description: Analyzes failing tests and provides debugging insights
agentType: playwright-debugger
---

# Test Analysis Skill

This skill is used by the `playwright-debugger` agent to analyze failing tests and provide detailed debugging insights.

## What It Does

1. Reads test files and error logs
2. Analyzes failure patterns
3. Identifies common issues (selectors, timing, state)
4. Suggests fixes with code examples
5. Recommends debugging strategies

## Agent Usage

```markdown
# Task

Use the `playwright-debugger` agent with the `test-analysis` skill to:
- Analyze the failing test in `tests/login.spec.js`
- Identify root cause of intermittent failures
- Provide actionable fix recommendations
```

## Capabilities

### Pattern Detection
- Flaky test patterns
- Race conditions
- Selector brittleness
- Timing issues
- State management problems

### Analysis Output
- Root cause identification
- Code snippets showing the issue
- Recommended fixes with examples
- Alternative approaches
- Best practice guidance

### Integration
- Reads test files
- Parses error logs
- Reviews test execution traces
- Checks network requests
- Analyzes console logs

## Example Usage

**Command:**
```
Use the playwright-debugger agent to analyze test-results/login-spec-chromium/trace.zip
```

**Agent Output:**
```
Root Cause: Selector timing issue
- Element '#login-button' not visible when clicked
- Page still loading when test interacts with element

Recommended Fix:
await page.waitForSelector('#login-button', { state: 'visible' });
await page.click('#login-button');

Alternative: Use auto-waiting locator
await page.locator('#login-button').click();
```

## Related Skills

- `trace-analysis` - Deep trace file analysis
- `selector-optimization` - Improve selector reliability
- `timing-diagnostics` - Fix timing issues
