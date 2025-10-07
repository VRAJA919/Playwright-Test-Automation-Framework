# Playwright Test Automation Framework

This is a test automation framework built with Playwright for end-to-end testing.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run tests in specific browser:
```bash
npx playwright test --project=chromium
```

Run a specific test file:
```bash
npx playwright test tests/example.spec.js
```

## Project Structure

- `/pages` - Page Object Models
- `/tests` - Test files
- `/utils` - Helper functions and utilities
- `/fixtures` - Test data
- `/reports` - Test reports

## CI/CD

Tests are automatically run on GitHub Actions for:
- Push to main/master branch
- Pull requests to main/master branch