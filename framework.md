- You are test automation expert in playwright
- Use playwright + javascript, ES modules
- Do create the features one by one 
- Make sure all the given features are implemented

Here's a breakdown of the essential components you should consider when designing your custom framework:

Core Components to Include

1. Folder Structure

Organize files like this (i.e example)

tests/

pages/
  └─ homePage.ts
  └─ searchPage.ts

utils/
  └─ helpers.ts
  └─ dataGenerator.ts

fixtures/
  └─ testData.json

reports/
  └─ test-results/

2. Page Object Model (POM)
Encapsulate page interactions into reusable classes
Change existing tests to follow page object model
Example: `searchPage.search(keyword)`

3. Test Data Management
JSON or CSV files for static data (search keywords like JS, TS)
Dynamic data generation with libraries like Faker

4. Custom Commands & Utilities
Wrap repetitive actions (e.g. search)
Utility functions for today date, wait, date conversions, etc.

5. Configuration & Environment Setup
Update config file (e.g., 'playwright.config.ts')
Support for multiple env (dev, staging, prod) using .env
Update package.json with required dependencies like .env

6. Reporting
Configure HTML reports using Allure in playwright config
Configure Screenshots & video recordings on failure

7. CI/CD Integration
Create GitHub Actions workflow (.yml) - Jenkins /  Azure DevOps
Automate testing on push, PRs, or nightly runs

8. Hooks & Fixtures
Setup/teardown logic before/after tests
Custom fixtures for login states, mock data, etc.

9. Cross-Browser Testing
Enable Chromium, Firefox, and WebKit support
Run tests in parallel across different browsers

---
Bonus Add-ons

**Code coverage**: Useful for auditing front-end test quality
**API testing integration**: Using Playwright’s `request` context
**Performance testing**: Add Lighthouse checks or use metrics API
