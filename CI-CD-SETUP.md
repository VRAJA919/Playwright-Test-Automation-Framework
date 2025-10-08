# README: Setting up CI/CD for Employee API Tests

This document explains how to set up CI/CD for the Employee API tests using GitHub Actions.

## GitHub Actions Setup

1. The workflow file is already created at `.github/workflows/employee-api-tests.yml`

2. You need to add the following secrets to your GitHub repository:

### Environment Variables for GQ1
- `API_GQ1_TOKEN` - The token URL for GQ1 (e.g., "https://gq1.road.com/wsapi/v3/tokens")
- `API_GQ1_EMPLOYEE` - The employee API URL for GQ1 (e.g., "https://gq1.road.com/wsapi/v5/employees")
- `API_GQ1_USER` - The username for GQ1 (e.g., "testwsapi40693")
- `API_GQ1_PASS` - The password for GQ1

### Environment Variables for STAGING
- `API_STAGING_TOKEN` - The token URL for STAGING
- `API_STAGING_EMPLOYEE` - The employee API URL for STAGING
- `API_STAGING_USER` - The username for STAGING
- `API_STAGING_PASS` - The password for STAGING

### Environment Variables for PROD
- `API_PROD_TOKEN` - The token URL for PROD
- `API_PROD_EMPLOYEE` - The employee API URL for PROD
- `API_PROD_USER` - The username for PROD
- `API_PROD_PASS` - The password for PROD

## Adding GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings"
3. Click on "Secrets and variables" in the left sidebar
4. Click on "Actions"
5. Click on "New repository secret"
6. Add each of the secrets listed above

## What the CI/CD Pipeline Does

The CI/CD pipeline will:

1. Run automatically on:
   - Every push to the `master` branch
   - Every pull request targeting the `master` branch
   - Daily at midnight (UTC) via scheduled run

2. For each run, it will:
   - Set up Node.js environment
   - Install dependencies
   - Install Playwright browsers
   - Create a .env file with the secrets
   - Run the employee API tests against all environments
   - Upload test results as artifacts

## Viewing Test Results

After each workflow run, you can view the test results by:

1. Going to the "Actions" tab in your GitHub repository
2. Clicking on the workflow run
3. Scrolling down to the "Artifacts" section
4. Downloading the "playwright-report" artifact

## Configuring Test Runs

If you need to modify which tests run or how they run, you can edit the `.github/workflows/employee-api-tests.yml` file.

For example, to run only against specific environments or to modify the browser used for testing.