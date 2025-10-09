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
        console.log(`[${env.name}] Attempting to verify successful login...`);

        // Log the page URL
        console.log(`[${env.name}] Current URL: ${page.url()}`);
        
        // Wait for page load
        await page.waitForLoadState('networkidle');
        
        // First verify URL pattern
        expect(page.url()).toMatch(/eu_index\.html/);
        console.log(`[${env.name}] URL verification successful`);
        
        // Then verify page title
        await expect(page).toHaveTitle('Trimble GeoManager');
        console.log(`[${env.name}] Title verification successful`);
        
        // Finally verify logout button is visible (this confirms we're logged in)
        await expect(page.getByText('Logout')).toBeVisible({ timeout: 30000 });
        console.log(`[${env.name}] Logout button verification successful`);
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

});