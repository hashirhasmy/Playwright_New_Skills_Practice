---
name: smoke
description: Run smoke test suite quickly - executes critical path tests to verify basic functionality
---

# Smoke Test Runner

This skill executes the smoke test suite - a subset of fast, critical tests that verify the application's core functionality is working.

## What It Does

1. Runs tests tagged with `@smoke`
2. Executes only on Chromium (fast single-browser run)
3. Uses 2 workers for quick execution
4. Shows live test execution output
5. Generates HTML report on completion

## Usage

```
/smoke
```

## Implementation

The skill will execute:

```bash
npx playwright test --grep @smoke --project=chromium --workers=2
```

## Test Tagging

To include tests in smoke suite, tag them:

```javascript
test.describe('Critical User Journey @smoke', () => {
  test('should login successfully', async ({ page }) => {
    // Test implementation
  });
});
```

## Expected Behavior

- **Fast execution**: Should complete in under 2 minutes
- **Critical paths only**: Login, navigation, key features
- **Fail fast**: Stop on first failure (can configure)
- **Quick feedback**: Immediate status updates

## Typical Use Cases

- Pre-commit validation
- Quick sanity check
- Post-deployment verification
- Build gate in CI/CD
- Developer feedback loop

## Output

After execution, you'll see:
- Test results summary
- Passed/failed count
- Execution time
- Link to HTML report
