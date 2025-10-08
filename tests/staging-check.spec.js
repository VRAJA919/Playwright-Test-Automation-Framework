import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Staging Environment Authentication Tests', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto('https://eu-staging.road.com/application/signon/secured/login.html');
    });

    test('Staging - successful login with valid credentials', async ({ page }) => {
        console.log('Starting Staging environment login test...');

        // Take screenshot before login
        await page.screenshot({
          path: `./screenshots/staging-before-login-${Date.now()}.png`,
          fullPage: true
        });

        await loginPage.login('testvijay', 'Trimble@123');
        console.log('Login credentials submitted');

        // Wait for URL change and log it
        await expect(page).toHaveURL(/eu_index\.html/);
        console.log('Current URL after login:', await page.url());

        // Wait for page load
        await page.waitForLoadState('networkidle');
        console.log('Page load completed');

        // Take screenshot after login
        await page.screenshot({
          path: `./screenshots/staging-after-login-${Date.now()}.png`,
          fullPage: true
        });

        // Log HTML structure around welcome message
        const content = await page.content();
        console.log('Page content length:', content.length);
        
        // Try to find username on page
        console.log('Searching for username on page...');
        const usernameElements = await page.locator('text=testvijay').count();
        console.log(`Found ${usernameElements} elements containing username`);

        // Try multiple approaches to verify login
        try {
            // First try: check URL
            if (page.url().includes('eu_index.html')) {
                console.log('URL verification successful');
            }

            // Second try: check title
            const title = await page.title();
            console.log('Page title:', title);

            // Third try: look for any welcome text
            const welcomeElements = await page.locator('div:has-text("Welcome")').count();
            console.log(`Found ${welcomeElements} elements containing "Welcome"`);

            // Fourth try: check for logout button
            const logoutButton = await page.locator('text=Logout').count();
            console.log(`Found ${logoutButton} logout buttons`);

            // Finally, try to verify with a more specific selector
            await expect(
                page.locator('div', { hasText: /Welcome.*testvijay/i }).first()
            ).toBeVisible({ timeout: 30000 });

        } catch (error) {
            console.log('Error during verification:', error.message);
            throw error;
        }

        // Take final screenshot
        await page.screenshot({
          path: `./screenshots/staging-verification-complete-${Date.now()}.png`,
          fullPage: true
        });

        // Log out
        console.log('Attempting to log out...');
        await page.getByText('Logout').click();
        await expect(page).toHaveURL(/login\.html/, { timeout: 30000 });
        console.log('Logout successful');
    });
});