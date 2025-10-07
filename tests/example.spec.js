import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Authentication Tests', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto('https://gq1.road.com/application/signon/secured/login.html');
    });

    test('successful login with valid credentials', async ({ page }) => {
        await loginPage.login('testdsprofile', 'Trimble@123');
        await expect(page).toHaveURL(/eu_index\.html/);
    });

    test('failed login with invalid credentials', async ({ page }) => {
        await loginPage.login('invaliduser', 'wrongpass');
        // The URL should still be on the login page
        await expect(page).toHaveURL(/login\.html/);
    });
});