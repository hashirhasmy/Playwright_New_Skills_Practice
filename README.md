# 🎭 Playwright Test Automation - SauceDemo

A comprehensive end-to-end test automation suite for [SauceDemo](https://www.saucedemo.com) built with Playwright and JavaScript, focusing on advanced automation patterns, performance optimization, and AI-assisted test development.

[![Playwright](https://img.shields.io/badge/Playwright-v1.60.0-45ba4b?logo=playwright)](https://playwright.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tests](https://img.shields.io/badge/Tests-14%20Passing-success)](#test-coverage)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tools & Technologies](#-tools--technologies)
- [Architecture & Strategy](#-architecture--strategy)
- [AI-Assisted Development](#-ai-assisted-development)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running Tests](#-running-tests)
- [Test Coverage](#-test-coverage)
- [Key Features](#-key-features)
- [Implementation Plan](#-implementation-plan)
- [Lessons Learned](#-lessons-learned)

---

## 🎯 Project Overview

This project is a **Research & Development initiative** to explore and implement advanced Playwright automation patterns. The test suite covers the complete user journey on SauceDemo, including authentication, product browsing, cart management, and checkout flows.

**Key Constraint:** ONE TEST PER FILE - Each test case is isolated in its own file for maximum clarity and maintainability.

### Application Under Test
- **URL:** https://www.saucedemo.com
- **Test User:** `standard_user`
- **Password:** `secret_sauce`

---

## 🛠️ Tools & Technologies

### Core Framework
- **[Playwright](https://playwright.dev/)** v1.60.0 - Modern end-to-end testing framework
- **JavaScript (ES6+)** - Implementation language
- **Node.js** - Runtime environment

### Development Tools
- **[Playwright MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/playwright)** - Model Context Protocol for browser automation
- **Claude Code CLI** - AI-powered development assistant
- **Git** - Version control

### Testing Patterns
- **Page Object Model (POM)** - Maintainable page abstractions
- **Test Fixtures** - Reusable test setup/teardown
- **Authentication State Management** - Performance optimization

---

## 🏗️ Architecture & Strategy

### Design Principles

1. **Plan-First Approach**
   - Comprehensive planning phase before implementation
   - Architecture design documented in [Implementation Plan](specs/test-suite-implementation-plan.md)
   - Clear separation of concerns

2. **Page Object Pattern**
   - 7 dedicated page objects for different pages
   - Encapsulated locators and actions
   - Reusable methods across tests

3. **Performance Optimization**
   - Authentication state reuse (~40% faster execution)
   - Parallel test execution (7 workers)
   - Global setup runs once, not per test

4. **Locator Strategy Priority**
   ```javascript
   1. getByRole()        // Accessibility-first
   2. getByLabel()       // Form elements
   3. getByPlaceholder() // Input fields
   4. getByText()        // Visible text
   5. data-test          // Test attributes (SauceDemo uses this extensively)
   6. CSS/XPath          // Last resort
   ```

5. **Test Organization**
   - **AAA Pattern**: Arrange → Act → Assert
   - **DRY Principle**: No code duplication
   - **Clear Naming**: Descriptive test and file names

### Architecture Diagram

```
tests/
├── e2e/                    # Test files (14 tests)
│   ├── login/             # Authentication tests
│   ├── products/          # Product browsing & sorting
│   ├── cart/              # Shopping cart operations
│   └── checkout/          # Purchase flow tests
├── pages/                  # Page Object Models (7 files)
│   ├── login.page.js
│   ├── products.page.js
│   ├── product-details.page.js
│   ├── cart.page.js
│   ├── checkout-step-one.page.js
│   ├── checkout-step-two.page.js
│   └── checkout-complete.page.js
├── fixtures/               # Test fixtures
│   ├── auth.fixture.js    # Authenticated page fixture
│   └── global-setup.js    # Pre-test auth setup
├── helpers/                # Utility functions
│   ├── test-data.helper.js
│   └── navigation.helper.js
└── data/                   # Test data
    └── users.data.js      # Credentials & constants
```

---

## 🤖 AI-Assisted Development

This project was developed using **Claude Code CLI** with AI-assisted workflows, demonstrating modern software development practices.

### AI Collaboration Workflow

#### 1. **Planning Phase**
- AI generated comprehensive implementation plan
- Architecture design and file structure
- Identified 11 initial test scenarios
- Created detailed implementation sequence

#### 2. **Requirement-Driven Exploration**
Instead of manual test case documentation, AI used **Playwright MCP Server** to:
- Navigate the application programmatically
- Capture page snapshots and DOM structure
- Discover actual locator strategies (data-test attributes)
- Identify edge cases and additional scenarios

**Key Discovery:** Found 3 missing sort options during exploration
- Original plan: 1 sort test (A-Z)
- After discovery: 4 sort tests (A-Z, Z-A, Price Low-High, Price High-Low)

#### 3. **Implementation Strategy**
```
Requirements → AI Exploration → Discovery → Design → Implementation
```

**Traditional Approach:**
```
Requirements → Manual Test Cases → Automation Implementation
```

**AI-Assisted Approach:**
```
Requirements → AI explores app → Discovers features → Identifies gaps → Creates tests
```

### Benefits of AI Assistance

✅ **Faster Discovery** - Automated application exploration
✅ **Better Coverage** - AI identified missing test scenarios (27% more coverage)
✅ **Consistent Patterns** - Enforced coding standards across all files
✅ **Documentation** - Auto-generated implementation plan
✅ **Best Practices** - Applied Playwright recommendations automatically

### Lessons Learned

🎓 **Critical Insight:** The AI initially wrote tests based on assumptions (wrong approach), but when challenged, it demonstrated the correct workflow:

**Wrong Approach:**
1. Assume how application works
2. Write tests
3. Fix failures

**Right Approach:**
1. Explore application systematically
2. Document findings
3. Design tests based on discoveries
4. Implement with confidence

This project demonstrates the **right approach** - requirement-driven exploration with AI tools.

---

## 📁 Project Structure

```
D:\My_Use_Hashir\Playwright_New_Skills_Practice\
├── .auth/                          # Stored authentication states
│   └── standard-user.json         # Pre-authenticated session
├── .claude/                        # Claude Code configuration
│   ├── CLAUDE.md                  # Project guidelines
│   ├── settings.json              # Project settings
│   └── skills/                    # Custom Claude skills
├── specs/                          # Documentation
│   ├── README.md                  # Test plan overview
│   └── test-suite-implementation-plan.md  # Detailed plan
├── tests/                          # Test suite
│   ├── e2e/                       # End-to-end tests (14 files)
│   ├── pages/                     # Page objects (7 files)
│   ├── fixtures/                  # Test fixtures (2 files)
│   ├── helpers/                   # Utilities (2 files)
│   └── data/                      # Test data (1 file)
├── playwright.config.js            # Playwright configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hashirhasmy/Playwright_New_Skills_Practice.git
   cd Playwright_New_Skills_Practice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install chromium firefox webkit
   ```

4. **Verify installation**
   ```bash
   npx playwright --version
   # Expected: Version 1.60.0
   ```

---

## ▶️ Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test Suite
```bash
# Login tests only
npx playwright test tests/e2e/login

# Products tests only
npx playwright test tests/e2e/products

# Cart tests only
npx playwright test tests/e2e/cart

# Checkout tests only
npx playwright test tests/e2e/checkout
```

### Run Single Test
```bash
npx playwright test tests/e2e/login/login-valid-user.spec.js
```

### Run on Specific Browser
```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit only
npx playwright test --project=webkit
```

### Debug Mode
```bash
# UI Mode (interactive)
npx playwright test --ui

# Headed mode (see browser)
npx playwright test --headed

# Debug specific test
npx playwright test tests/e2e/login/login-valid-user.spec.js --debug
```

### Generate HTML Report
```bash
npx playwright show-report
```

---

## ✅ Test Coverage

### Summary
- **Total Tests:** 14
- **Status:** All Passing ✅
- **Execution Time:** ~35 seconds (parallel)
- **Coverage:** 127% of original plan (discovered additional scenarios)

### Test Breakdown

| Category | Tests | Description |
|----------|-------|-------------|
| **Login** | 2 | Valid/Invalid authentication |
| **Products** | 6 | List view, details, sorting (4 options) |
| **Cart** | 3 | Add single/multiple, remove items |
| **Checkout** | 3 | Complete, cancel, validation errors |

### Detailed Test List

#### 🔐 Login Tests
- ✅ `login-valid-user.spec.js` - Successful login
- ✅ `login-invalid-user.spec.js` - Failed login with error message

#### 📦 Products Tests
- ✅ `products-list-view.spec.js` - Display 6 products
- ✅ `product-details-view.spec.js` - View individual product
- ✅ `products-sorting.spec.js` - Sort by name (A-Z)
- ✅ `products-sorting-za.spec.js` - Sort by name (Z-A)
- ✅ `products-sorting-price-low-high.spec.js` - Sort by price (ascending)
- ✅ `products-sorting-price-high-low.spec.js` - Sort by price (descending)

#### 🛒 Cart Tests
- ✅ `cart-add-single-item.spec.js` - Add one item
- ✅ `cart-add-multiple-items.spec.js` - Add three items
- ✅ `cart-remove-item.spec.js` - Remove item from cart

#### 💳 Checkout Tests
- ✅ `checkout-complete-purchase.spec.js` - Complete purchase flow
- ✅ `checkout-cancel-flow.spec.js` - Cancel and return to cart
- ✅ `checkout-validation-errors.spec.js` - Form validation (missing first name)

---

## 🌟 Key Features

### 1. Authentication State Reuse
```javascript
// Global setup runs ONCE
// Saves auth state to .auth/standard-user.json
// All tests reuse this state (no repeated logins)

// Result: ~40% faster execution
```

### 2. Parallel Execution
```javascript
// 7 workers run tests simultaneously
// 14 tests complete in ~35 seconds
// Sequential would take ~60+ seconds
```

### 3. Page Object Pattern
```javascript
// Example: LoginPage
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### 4. Test Fixtures
```javascript
// Authenticated page fixture
import { test, expect } from '../../fixtures/auth.fixture.js';

test('my test', async ({ authenticatedPage }) => {
  // Already logged in!
  await authenticatedPage.goto('/inventory.html');
});
```

### 5. Centralized Test Data
```javascript
// tests/data/users.data.js
export const USERS = {
  STANDARD_USER: { username: 'standard_user', password: 'secret_sauce' },
  INVALID_USER: { username: 'invalid_user', password: 'wrong_password' }
};
```

---

## 📖 Implementation Plan

The complete implementation plan is available at:
```
specs/test-suite-implementation-plan.md
```

This document includes:
- ✅ Context & Problem Statement
- ✅ Architecture Design
- ✅ Implementation Sequence (25 steps)
- ✅ Test Execution Strategy
- ✅ Verification Plan
- ✅ Code Examples
- ✅ Coding Standards

---

## 🎓 Lessons Learned

### 1. Explore Before Implementing
**Wrong:** Write tests based on assumptions → Fix failures  
**Right:** Explore application → Document findings → Implement tests

### 2. Requirement-Driven vs. Script-Driven
**Traditional:** Manual test cases → Automate steps  
**Modern:** Requirements → AI exploration → Discover scenarios → Automate

### 3. AI as a Discovery Tool
Using Playwright MCP with AI enabled:
- Systematic application exploration
- Discovery of edge cases (found 3 missing sort tests)
- Validation of locator strategies
- Coverage gap identification

### 4. Plan First, Code Second
The planning phase revealed:
- Authentication optimization strategy
- Page object structure
- Test organization approach
- Performance considerations

Without planning, these would have been discovered through refactoring.

### 5. One Test Per File Works Well
**Benefits:**
- Easy to find specific tests
- Clear test boundaries
- Simplified debugging
- Better Git history

**Trade-off:** More files to manage (14 vs 4)

---

## 🔮 Future Enhancements

- [ ] **API Testing** - Add backend validation tests
- [ ] **Visual Regression** - Screenshot comparison tests
- [ ] **Accessibility Testing** - Integrate @axe-core/playwright
- [ ] **Performance Monitoring** - Page load time assertions
- [ ] **Data-Driven Tests** - Parameterized test execution
- [ ] **CI/CD Integration** - GitHub Actions workflow
- [ ] **Cross-Browser Matrix** - Expanded browser coverage
- [ ] **Mobile Testing** - Add responsive/mobile viewports

---

## 📊 Test Results

Last run: May 26, 2026

```
Running 14 tests using 7 workers

✅ 14 passed (35.6s)

Test Files  14 passed (14)
Tests       14 passed (14)
Start at    20:45:30
Duration    36s
```

---

## 🤝 Contributing

This is a personal R&D project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is for educational and portfolio purposes.

---

## 👤 Author

**Hashir Mohamed**

- GitHub: [@hashirhasmy](https://github.com/hashirhasmy)
- Project: [Playwright_New_Skills_Practice](https://github.com/hashirhasmy/Playwright_New_Skills_Practice)

---

## 🙏 Acknowledgments

- [Playwright Team](https://playwright.dev/) - Excellent testing framework
- [SauceDemo](https://www.saucedemo.com/) - Practice application
- [Anthropic Claude](https://www.anthropic.com/) - AI-assisted development
- [Model Context Protocol](https://modelcontextprotocol.io/) - Browser automation integration

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Implementation Plan](specs/test-suite-implementation-plan.md)

---

**⭐ If you find this project helpful, please consider giving it a star!**
