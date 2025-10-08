import { BasePage } from './basePage';

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.usernameInput = 'role=textbox[name="User Name"]';
        this.passwordInput = 'role=textbox[name="Password"]';
        this.loginButton = 'role=button[name="SIGN IN >"]';
        this.logoutLink = 'text=Logout';
        this.errorMessage = '.error-message, .alert, [role=alert]'; // Common error message selectors
    }

    /**
     * Login with the given credentials
     * @param {string} username - Username
     * @param {string} password - Password
     */
    async login(username, password) {
        await this.fill(this.usernameInput, username);
        await this.fill(this.passwordInput, password);
        await this.click(this.loginButton);
    }

    /**
     * Get login error message if present
     * @returns {Promise<string>} The error message text
     */
    async getErrorMessage() {
        return this.getText(this.errorMessage);
    }
}