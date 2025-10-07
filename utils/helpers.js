import dotenv from 'dotenv';

dotenv.config();

/**
 * Helper functions for common operations
 */
export class Helpers {
    /**
     * Get environment variable
     * @param {string} key - Environment variable key
     * @returns {string} Environment variable value
     */
    static getEnvVariable(key) {
        return process.env[key];
    }

    /**
     * Get current environment (dev, staging, prod)
     * @returns {string} Current environment
     */
    static getCurrentEnv() {
        return process.env.ENV || 'dev';
    }

    /**
     * Get formatted date string
     * @param {Date} date - Date object
     * @returns {string} Formatted date string
     */
    static formatDate(date = new Date()) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Generate random string
     * @param {number} length - Length of string
     * @returns {string} Random string
     */
    static generateRandomString(length = 8) {
        return Math.random().toString(36).substring(2, length + 2);
    }

    /**
     * Sleep/wait for specified milliseconds
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after specified milliseconds
     */
    static async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Parse JSON safely
     * @param {string} str - JSON string
     * @returns {Object|null} Parsed object or null
     */
    static safeJSONParse(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return null;
        }
    }
}