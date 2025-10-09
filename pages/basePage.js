// Base page class that all page objects will inherit from
export class BasePage {
    constructor(page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     * @param {string} path - The URL path to navigate to
     */
    async goto(path) {
        await this.page.goto(path);
    }

    /**
     * Wait for an element to be visible
     * @param {string} selector - The element selector
     */
    async waitForElement(selector) {
        await this.page.waitForSelector(selector, { state: 'visible' });
    }

    /**
     * Click an element with retry logic
     * @param {string} selector - The element selector
     * @param {Object} options - Optional parameters
     * @param {number} options.timeout - Custom timeout in milliseconds
     * @param {number} options.retries - Number of retry attempts
     */
    async click(selector, options = {}) {
        const timeout = options.timeout || 5000;
        const retries = options.retries || 2;
        
        for (let i = 0; i <= retries; i++) {
            try {
                await this.waitForElement(selector);
                await this.page.click(selector, { timeout });
                return;
            } catch (error) {
                if (i === retries) throw error;
                await this.page.waitForTimeout(1000); // Wait before retry
            }
        }
    }

    /**
     * Fill a form field with validation
     * @param {string} selector - The form field selector
     * @param {string} value - The value to fill
     * @param {Object} options - Optional parameters
     * @param {number} options.timeout - Custom timeout in milliseconds
     */
    async fill(selector, value, options = {}) {
        const timeout = options.timeout || 5000;
        await this.waitForElement(selector);
        await this.page.fill(selector, value, { timeout });
        
        // Verify the value was set correctly
        const actualValue = await this.page.$eval(selector, el => el.value);
        if (actualValue !== value) {
            await this.page.fill(selector, ''); // Clear and retry
            await this.page.fill(selector, value, { timeout });
        }
    }

    /**
     * Get text content of an element
     * @param {string} selector - The element selector
     * @returns {Promise<string>} The text content
     */
    async getText(selector) {
        await this.waitForElement(selector);
        return this.page.textContent(selector);
    }
}