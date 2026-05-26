---
name: debug-test
description: Debug a failing test with headed browser, traces, and detailed output
args:
  - name: test_name
    description: Name or pattern of the test to debug
    required: true
---

# Debug Test Skill

This skill runs a specific test in debug mode with maximum visibility and diagnostic information.

## What It Does

1. Runs test in **headed mode** (visible browser)
2. Enables **slow motion** (500ms delays between actions)
3. Captures **full trace** for Trace Viewer
4. Takes **screenshots** on each action
5. Shows **detailed console output**
6. Pauses on failure for inspection

## Usage

```
/debug-test <test-name-or-pattern>

Examples:
/debug-test "should login successfully"
/debug-test login.spec.js
/debug-test @flaky
```

## Implementation

The skill will execute:

```bash
npx playwright test --grep "<test-name>" --headed --debug --trace on --screenshot on --workers=1
```

## Features Enabled

### Headed Mode
- See browser actions in real-time
- Observe UI state changes
- Spot timing issues
- Verify element interactions

### Debug Mode
- Playwright Inspector opens automatically
- Step through test actions
- Inspect selectors
- Try commands interactively

### Trace Recording
- Full trace captured
- View in Trace Viewer after test
- Network requests logged
- Console messages captured
- Screenshots at each step

### Slow Motion
- 500ms delay between actions
- Easier to follow test execution
- Spot race conditions
- Verify UI updates

## After Execution

### Open Trace Viewer
```bash
npx playwright show-trace trace.zip
```

### View in Trace Viewer
- Timeline of actions
- Network activity
- Console logs
- Screenshots
- Source code
- Before/after snapshots

## Debugging Workflow

1. **Run in debug mode**
   ```
   /debug-test "failing test name"
   ```

2. **Observe behavior**
   - Watch browser interactions
   - Check element visibility
   - Verify timing

3. **Inspect with Playwright Inspector**
   - Test selectors
   - Step through actions
   - Try different locators

4. **Review trace**
   - Check network requests
   - Look for console errors
   - Examine timing issues

5. **Fix and verify**
   - Apply fix
   - Run test normally
   - Confirm resolution

## Common Issues Debugged

- **Flaky tests**: Timing and race conditions
- **Selector issues**: Element not found
- **State problems**: Unexpected page state
- **Network issues**: Failed requests
- **Authentication**: Login failures
- **Visibility**: Elements not visible

## Tips

- Use `page.pause()` to stop execution at specific points
- Check browser console for JavaScript errors
- Verify network requests complete successfully
- Look for unexpected redirects
- Check element state (visible, enabled, etc.)

## Related Commands

- `/smoke` - Run smoke tests
- `/capture` - Take screenshots
