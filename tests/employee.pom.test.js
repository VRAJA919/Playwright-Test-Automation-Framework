import { test, expect } from '@playwright/test';
import { EmployeeAPI } from '../pages/employeeAPI';
import { Helpers } from '../utils/helpers';

// Test fixtures for employee tests
const environments = ['GQ1', 'STAGING', 'PROD'];

test.describe('Employee API Tests', () => {
    
    // Test for each environment
    for (const env of environments) {
        test(`${env} Environment - Create, Read and Delete operations`, async ({ request }) => {
            const employeeAPI = new EmployeeAPI(request, env);
            
            // Step 1: Authenticate
            await employeeAPI.authenticate();
            
            // Step 2: Create an employee
            const { id: employeeId, employeeData } = await employeeAPI.createEmployee();
            console.log(`[${env}] Created employee with ID: ${employeeId}`);
            expect(employeeId).toBeTruthy();
            
            // Step 3: Get and verify the employee
            const employeeDetails = await employeeAPI.getEmployee(employeeId);
            console.log(`[${env}] Retrieved employee details`);
            
            expect(employeeDetails.tId).toBe(employeeId);
            expect(employeeDetails.uId.emailAdrs).toBe(employeeData.uId.emailAdrs);
            expect(employeeDetails.surname).toBe(employeeData.surname);
            expect(employeeDetails.empId).toBe(employeeData.empId);
            expect(employeeDetails.inactive).toBe(false);
            
            // Step 4: Handle cleanup based on environment (delete or mark inactive)
            if (env === "STAGING" || env === "PROD") {
                // For Staging and PROD, mark as inactive
                const updateData = {
                    "inactive": true,
                    "tId": employeeId,
                    "uId": { "emailAdrs": employeeData.uId.emailAdrs },
                    "empId": employeeData.empId,
                    "surname": employeeData.surname
                };
                
                const updateSuccess = await employeeAPI.updateEmployee(employeeId, updateData);
                expect(updateSuccess).toBeTruthy();
                console.log(`[${env}] Employee marked as inactive`);
                
                // Verify inactive status
                const updatedEmployee = await employeeAPI.getEmployee(employeeId);
                expect(updatedEmployee.inactive).toBe(true);
                console.log(`[${env}] Verified employee is inactive`);
            } else {
                // For other environments (e.g. GQ1), delete the employee
                const deleteSuccess = await employeeAPI.deleteEmployee(employeeId);
                expect(deleteSuccess).toBeTruthy();
                console.log(`[${env}] Employee deleted successfully`);
                
                // Verify employee no longer exists
                const exists = await employeeAPI.employeeExists(employeeId);
                expect(exists).toBe(false);
                console.log(`[${env}] Verified employee was deleted`);
            }
        });
    }
    
    test(`Create employee with custom data`, async ({ request }) => {
        // Test with a specific environment, e.g. GQ1
        const employeeAPI = new EmployeeAPI(request, 'GQ1');
        await employeeAPI.authenticate();
        
        // Custom employee data
        const customData = {
            uId: { emailAdrs: `test.${Helpers.generateRandomString()}@example.com` },
            name: "DOE, JOHN",
            surname: `TEST${Helpers.generateRandomString(5).toUpperCase()}`,
            givenNames: "JOHN",
            empId: `EMP${Date.now()}`,
            descr: "Manager",
            inactive: false
        };
        
        // Create employee with custom data
        const { id: employeeId } = await employeeAPI.createEmployee(customData);
        expect(employeeId).toBeTruthy();
        
        // Get and verify employee
        const employee = await employeeAPI.getEmployee(employeeId);
        expect(employee.name).toBe(customData.name);
        expect(employee.descr).toBe(customData.descr);
        
        // Clean up
        await employeeAPI.deleteEmployee(employeeId);
    });
});