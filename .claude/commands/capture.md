---
name: capture
description: Capture screenshots or visual regression baselines for specified URLs or tests
args:
  - name: target
    description: URL to capture or test file pattern
    required: false
---

# Capture Screenshots Skill

This skill captures screenshots for visual testing, documentation, or baseline creation.

## What It Does

1. Navigates to specified URL or runs tests
2. Captures screenshots at various viewport sizes
3. Saves in organized directory structure
4. Generates visual regression baselines
5. Creates comparison reports

## Usage

### Capture Single URL
```
/capture https://example.com
```

### Capture Multiple Viewports
```
/capture https://example.com --viewports desktop,tablet,mobile
```

### Update Visual Baselines
```
/capture --update-baselines
```

### Capture from Test
```
/capture login.spec.js
```

## Implementation

### For URL Capture
```javascript
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url);
await page.screenshot({ path: 'screenshots/capture.png', fullPage: true });
await browser.close();
```

### For Visual Testing
```bash
npx playwright test --update-snapshots
```

## Viewport Sizes

### Desktop
- 1920x1080 (Full HD)
- 1366x768 (Common laptop)
- 1280x720 (HD)

### Tablet
- 768x1024 (iPad Portrait)
- 1024x768 (iPad Landscape)

### Mobile
- 375x667 (iPhone SE)
- 390x844 (iPhone 12/13)
- 412x915 (Pixel 5)

## Output Structure

```
screenshots/
├── desktop/
│   ├── homepage-1920x1080.png
│   └── login-1920x1080.png
├── tablet/
│   ├── homepage-768x1024.png
│   └── login-768x1024.png
└── mobile/
    ├── homepage-375x667.png
    └── login-375x667.png
```

## Visual Regression Testing

### Create Baseline
```javascript
test('visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### Update Baseline
```
/capture --update-baselines
```

### Compare Changes
```bash
npx playwright test --update-snapshots
```

## Screenshot Options

### Full Page
```javascript
await page.screenshot({ fullPage: true });
```

### Specific Element
```javascript
await page.locator('#header').screenshot({ path: 'header.png' });
```

### Without Animations
```javascript
await page.screenshot({ animations: 'disabled' });
```

### Clip Area
```javascript
await page.screenshot({
  clip: { x: 0, y: 0, width: 800, height: 600 }
});
```

## Use Cases

### Documentation
- Capture UI states for docs
- Create user guides
- Generate design system examples

### Visual Regression
- Baseline creation
- Detect unintended changes
- Validate responsive design

### Bug Reports
- Capture failure states
- Document UI issues
- Compare expected vs actual

### Design Review
- Screenshot various states
- Compare across browsers
- Verify responsive layouts

## Advanced Options

### Mask Dynamic Content
```javascript
await page.screenshot({
  mask: [page.locator('.dynamic-content')],
  path: 'masked-screenshot.png'
});
```

### Wait for Stability
```javascript
await page.waitForLoadState('networkidle');
await page.screenshot({ path: 'stable-page.png' });
```

### Multiple Screenshots
```javascript
// Capture different states
await page.screenshot({ path: 'before-interaction.png' });
await page.click('button');
await page.screenshot({ path: 'after-interaction.png' });
```

## Tips

- Use `fullPage: true` for complete page captures
- Mask timestamps and dynamic content
- Wait for animations to complete
- Disable animations for consistent captures
- Use high threshold for visual comparison
- Store baselines in version control

## Related Commands

- `/debug-test` - Debug with screenshots
- `/smoke` - Run smoke tests with captures
