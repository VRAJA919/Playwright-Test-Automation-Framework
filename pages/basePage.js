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
     * Click an element
     * @param {string} selector - The element selector
     */
    async click(selector) {
        await this.waitForElement(selector);
        await this.page.click(selector);
    }

    /**
     * Fill a form field
     * @param {string} selector - The form field selector
     * @param {string} value - The value to fill
     */
    async fill(selector, value) {
        await this.waitForElement(selector);
        await this.page.fill(selector, value);
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