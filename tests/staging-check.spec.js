import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Staging Environment Authentication Tests', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto('https://eu-staging.road.com/application/signon/secured/login.html');
    });

    test('Staging - successful login with valid credentials', async ({ page }) => {
        await loginPage.login('testvijay', 'Trimble@123');
        await expect(page).toHaveURL(/eu_index\.html/);
        
        // Check for elements that confirm successful login
        await expect(page.getByText('Welcome testvijay')).toBeVisible({ timeout: 30000 });
        
        // Verify page title
        await expect(page).toHaveTitle('Trimble GeoManager');
        
        // Log out to clean up
        await page.getByText('Logout').click();
        await expect(page).toHaveURL(/login\.html/, { timeout: 30000 });
    });
});