import { expect } from '@playwright/test';

export class POIGeofencesPage {
    constructor(request, environment = 'GQ1') {
        this.request = request;
        this.environment = environment;

        // Environment-specific configurations
        const envConfigs = {
            GQ1: {
                baseUrl: 'https://gq1.road.com/wsapi/v4/poiGeofences/',
                tokenUrl: 'https://gq1.road.com/wsapi/v3/tokens',
                credentials: {
                    username: process.env.GQ1_USERNAME || 'testwsapi40693',
                    password: process.env.GQ1_PASSWORD || 'Trimble@123'
                }
            },
            STAGING: {
                baseUrl: 'https://eu-staging.road.com/wsapi/v4/poiGeofences/',
                tokenUrl: 'https://eu-staging.road.com/wsapi/v4/tokens',
                credentials: {
                    username: process.env.STAGING_USERNAME || 'testwsapi34608',
                    password: process.env.STAGING_PASSWORD || 'testwsapi34608'
                }
            },
            PROD: {
                baseUrl: 'https://eugm.road.com/wsapi/v4/poiGeofences/',
                tokenUrl: 'https://eugm.road.com/wsapi/v4/tokens',
                credentials: {
                    username: process.env.PROD_USERNAME || 'testvijay',
                    password: process.env.PROD_PASSWORD || 'Trimble@123'
                }
            }
        };

        this.config = envConfigs[environment];
        this.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };

        if (!this.config) {
            throw new Error(`Invalid environment: ${environment}. Must be one of: GQ1, STAGING, PROD`);
        }
    }

    /**
     * Generate token for authentication
     */
    async generateToken() {
        console.log(`[${this.environment}] Generating token...`);
        const response = await this.request.post(this.config.tokenUrl, {
            data: {
                identity: {
                    username: this.config.credentials.username,
                    password: this.config.credentials.password
                }
            }
        });

        const data = await response.json();
        console.log(`[${this.environment}] Token generated successfully`);
        
        this.headers["Authorization"] = `Bearer ${data.token.bearer}`;
        return data.token.bearer;
    }

    /**
     * Create a new POI Geofence
     */
    async createPOIGeofence(poiData) {
        console.log('Creating POI Geofence...');
        const response = await this.request.post(this.config.baseUrl, {
            headers: this.headers,
            data: poiData
        });

        const responseData = await response.json();
        console.log('Create Response:', JSON.stringify(responseData, null, 2));
        
        // Extract POI ID from response URL
        const poiId = responseData.urls[0].url.split('/').pop();
        console.log('POI Geofence created with ID:', poiId);
        
        return poiId;
    }

    /**
     * Get POI Geofence by ID
     */
    async getPOIGeofence(poiId) {
        console.log(`Getting POI Geofence: ${poiId}`);
        const response = await this.request.get(`${this.config.baseUrl}${poiId}`, {
            headers: this.headers
        });

        if (!response.ok()) {
            throw new Error(`Failed to get POI Geofence: ${response.status()}`);
        }

        const data = await response.json();
        console.log('Get Response:', JSON.stringify(data, null, 2));
        return data;
    }

    /**
     * Delete POI Geofence by ID
     */
    async deletePOIGeofence(poiId) {
        console.log(`Deleting POI Geofence: ${poiId}`);
        const response = await this.request.delete(`${this.config.baseUrl}${poiId}`, {
            headers: this.headers
        });

        if (!response.ok()) {
            throw new Error(`Failed to delete POI Geofence: ${response.status()}`);
        }

        console.log('POI Geofence deleted successfully');
        return true;
    }
}