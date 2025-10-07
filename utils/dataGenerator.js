import { faker } from '@faker-js/faker';

export class DataGenerator {
    /**
     * Generate random user data
     * @returns {Object} User data object
     */
    static generateUser() {
        return {
            username: faker.internet.userName,
            email: faker.internet.email(),
            password: faker.internet.password(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName()
        };
    }

    /**
     * Generate random address data
     * @returns {Object} Address data object
     */
    static generateAddress() {
        return {
            street: faker.location.street(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country()
        };
    }

    /**
     * Generate random product data
     * @returns {Object} Product data object
     */
    static generateProduct() {
        return {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department()
        };
    }
}