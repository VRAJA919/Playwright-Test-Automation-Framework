import { APIRequestContext } from '@playwright/test';
import { Helpers } from '../utils/helpers';
import { DataGenerator } from '../utils/dataGenerator';
import { envConfig } from '../config/environment';

/**
 * API client for Employee endpoints
 */
export class EmployeeAPI {
    /**
     * Create employee API client
     * @param {APIRequestContext} request - Playwright API request context
     * @param {string} environment - Environment to use (GQ1, STAGING, PROD)
     */
    constructor(request, environment = Helpers.getCurrentEnv()) {
        this.request = request;
        this.environment = environment;
        this.config = envConfig[environment];
        this.token = null;
        this.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
    }

    /**
     * Get authorization token
     * @returns {Promise<string>} Bearer token
     */
    async authenticate() {
        console.log(`[${this.environment}] Generating token...`);
        
        const tokenResponse = await this.request.post(this.config.tokenUrl, {
            data: {
                identity: {
                    username: this.config.credentials.username,
                    password: this.config.credentials.password
                }
            }
        });

        if (!tokenResponse.ok()) {
            const errorStatus = tokenResponse.status();
            let errorBody;
            try {
                errorBody = await tokenResponse.json();
            } catch {
                errorBody = await tokenResponse.text();
            }
            throw new Error(`[${this.environment}] Token generation failed with status ${errorStatus}: ${JSON.stringify(errorBody)}`);
        }

        const tokenData = await tokenResponse.json();
        console.log(`[${this.environment}] Token generated successfully`);
        
        this.token = tokenData.token.bearer;
        this.headers["Authorization"] = `Bearer ${this.token}`;
        
        return this.token;
    }

    /**
     * Create a new employee
     * @param {Object} employeeData - Employee data
     * @returns {Promise<Object>} Created employee response
     */
    async createEmployee(employeeData = null) {
        if (!this.token) {
            await this.authenticate();
        }
        
        // If no data provided, generate random employee data
        const data = employeeData || this.generateEmployeeData();
        
        console.log(`[${this.environment}] Creating employee...`);
        const response = await this.request.post(this.config.employeeUrl, {
            headers: this.headers,
            data: {
                employees: [data]
            }
        });
        
        const responseData = await response.json();
        
        if (!response.ok()) {
            throw new Error(`[${this.environment}] Failed to create employee: ${JSON.stringify(responseData)}`);
        }
        
        console.log(`[${this.environment}] Employee created successfully`);
        
        // Extract employee ID from response
        const employeeId = responseData.urls[0].url.split('/').pop();
        return { id: employeeId, data: responseData, employeeData: data };
    }
    
    /**
     * Get employee by ID
     * @param {string} employeeId - Employee ID
     * @returns {Promise<Object>} Employee data
     */
    async getEmployee(employeeId) {
        if (!this.token) {
            await this.authenticate();
        }
        
        console.log(`[${this.environment}] Getting employee: ${employeeId}`);
        const response = await this.request.get(`${this.config.employeeUrl}/${employeeId}`, {
            headers: this.headers
        });
        
        if (!response.ok()) {
            throw new Error(`[${this.environment}] Failed to get employee: ${response.status()}`);
        }
        
        return await response.json();
    }
    
    /**
     * Update employee (mark as inactive)
     * @param {string} employeeId - Employee ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<boolean>} Success status
     */
    async updateEmployee(employeeId, updateData) {
        if (!this.token) {
            await this.authenticate();
        }
        
        console.log(`[${this.environment}] Updating employee: ${employeeId}`);
        const response = await this.request.put(`${this.config.employeeUrl}/${employeeId}`, {
            headers: this.headers,
            data: updateData
        });
        
        return response.ok();
    }
    
    /**
     * Delete employee
     * @param {string} employeeId - Employee ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteEmployee(employeeId) {
        if (!this.token) {
            await this.authenticate();
        }
        
        console.log(`[${this.environment}] Deleting employee: ${employeeId}`);
        const response = await this.request.delete(`${this.config.employeeUrl}/${employeeId}`, {
            headers: this.headers
        });
        
        return response.ok();
    }
    
    /**
     * Check if employee exists
     * @param {string} employeeId - Employee ID
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async employeeExists(employeeId) {
        if (!this.token) {
            await this.authenticate();
        }
        
        const response = await this.request.get(`${this.config.employeeUrl}/${employeeId}`, {
            headers: this.headers
        });
        
        return response.status() === 200;
    }
    
    /**
     * Generate random employee data
     * @returns {Object} Random employee data
     */
    generateEmployeeData() {
        const person = DataGenerator.generateUser();
        const address = DataGenerator.generateAddress();
        const timestamp = Date.now();
        const uniqueId = Helpers.generateRandomString(8);
        
        return {
            uId: { emailAdrs: person.email },
            name: `${person.lastName.toUpperCase()}, ${person.firstName.toUpperCase()}`,
            surname: `EMPLOYEE${uniqueId}`,
            givenNames: person.firstName.toUpperCase(),
            empId: `EMP${timestamp}`,
            descr: "Delivery",
            inactive: false,
            contacts: {
                phones: [
                    { type: "business", value: "5105444852" },
                    { type: "home", value: "5108521479" },
                    { type: "mobile", value: "5106547893" }
                ],
                emails: [
                    { type: "personal", value: person.email }
                ],
                homeAdrs: {
                    adrsLine: address.street,
                    city: address.city,
                    state: address.state,
                    county: "County",
                    postalCode: address.zipCode,
                    countryCode: "US",
                    formattedAdrs: `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, United States`
                }
            }
        };
    }
}