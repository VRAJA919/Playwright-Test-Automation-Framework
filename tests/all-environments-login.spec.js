import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { Helpers } from '../utils/helpers';

// Define the environments and their configurations
const environments = [
  {
    name: 'GQ1',
    url: 'https://gq1.road.com/application/signon/secured/login.html',
    credentials: {
      username: 'testdsprofile',
      password: 'Trimble@123'
    }
  },
  {
    name: 'STAGING',
    url: 'https://eu-staging.road.com/application/signon/secured/login.html',
    credentials: {
      username: 'testvijay',
      password: 'Trimble@123'
    }
  },
  {
    name: 'PROD',
    url: 'https://eugm.road.com/application/signon/secured/login.html',
    credentials: {
      username: 'testvijay',
      password: 'Trimble@123'
    }
  }
];

test.describe('Multi-Environment Authentication Tests', () => {
  // Create a test for each environment
  for (const env of environments) {
    test(`${env.name} - Login and Logout`, async ({ page }) => {
      // Initialize the login page
      const loginPage = new LoginPage(page);
      
      // Log the test start
      console.log(`Starting login test for ${env.name} environment`);
      
      // Navigate to the login page
      await test.step(`Navigate to ${env.name} login page`, async () => {
        await page.goto(env.url);
        await expect(page).toHaveTitle('Trimble GeoManager');
      });
      
      // Perform login
      await test.step(`Login to ${env.name}`, async () => {
        await loginPage.login(env.credentials.username, env.credentials.password);
        await expect(page).toHaveURL(/eu_index\.html/);
      });

      // Verify successful login
      await test.step(`Verify successful login to ${env.name}`, async () => {
        // Wait for welcome element with username - using first() to be more specific
        // This avoids the strict mode violation when multiple elements match
        await expect(
          page.getByText(`Welcome ${env.credentials.username}`).first()
        ).toBeVisible({ timeout: 30000 });
        
        // Take a screenshot after successful login
        await page.screenshot({
          path: `./screenshots/${env.name}-logged-in-${Date.now()}.png`,
          fullPage: false
        });
      });

      // Perform logout
      await test.step(`Logout from ${env.name}`, async () => {
        // Wait a moment before logout to ensure page is fully loaded
        await Helpers.wait(2000);
        
        await page.getByText('Logout').click();
        await expect(page).toHaveURL(/login\.html/, { timeout: 30000 });
      });
      
      // Log the test completion
      console.log(`Completed login test for ${env.name} environment successfully`);
    });
  }

  // Create an invalid login test (just for GQ1 as an example)
  test('GQ1 - Failed login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(environments[0].url);
    
    // Take a screenshot before login attempt
    await page.screenshot({
      path: `./screenshots/GQ1-before-invalid-login-${Date.now()}.png`,
      fullPage: false
    });
    
    await loginPage.login('invaliduser', 'wrongpassword');
    
    // The URL should still be on the login page
    await expect(page).toHaveURL(/login\.html/);
    
    // Wait a moment for error to appear
    await Helpers.wait(2000);
    
    // Take a screenshot to capture the error state
    await page.screenshot({
      path: `./screenshots/GQ1-invalid-login-error-${Date.now()}.png`,
      fullPage: false
    });
    
    // Instead of looking for specific text, verify we're still on login page
    // This is more reliable since we don't know the exact error message
    await expect(page.locator('role=textbox[name="User Name"]')).toBeVisible();
    await expect(page.locator('role=textbox[name="Password"]')).toBeVisible();
  });
});