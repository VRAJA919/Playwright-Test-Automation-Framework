# Playwright Test Automation Framework

This is a test automation framework built with Playwright for end-to-end testing and API testing.

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
npx playwright test tests/employee.pom.test.js
```

## Project Structure

- `/pages` - Page Object Models
  - `basePage.js` - Base class for UI page objects
  - `employeeAPI.js` - API client for Employee endpoints
- `/tests` - Test files
  - `employee.pom.test.js` - Employee API tests using Page Object Model
- `/utils` - Helper functions and utilities
  - `helpers.js` - Common utility functions
  - `dataGenerator.js` - Data generation utilities using Faker
- `/fixtures` - Test data
  - `employeeData.json` - Sample employee data for testing
- `/config` - Configuration files
  - `environment.js` - Environment-specific configuration
- `/reports` - Test results and reports

## API Testing with Page Object Model

This framework implements the Page Object Model pattern for API testing:

1. **API Client Classes**: API endpoints are encapsulated in dedicated classes (`employeeAPI.js`)
2. **Data Generation**: Test data is generated using the Faker library and utility functions
3. **Environment Management**: Environment configuration is managed through environment variables
4. **Reusable Methods**: Common operations are implemented as reusable methods

## CI/CD

Tests are automatically run on GitHub Actions for:
- Push to master branch
- Pull requests to master branch
- Daily scheduled runs

See `CI-CD-SETUP.md` for detailed information on setting up GitHub Actions.

## Running Tests in Different Environments

To run tests in specific environments:

```bash
# Set environment variable
ENV=GQ1 npx playwright test tests/employee.pom.test.js

# Or use grep to filter tests by environment
npx playwright test tests/employee.pom.test.js --grep "GQ1"
```