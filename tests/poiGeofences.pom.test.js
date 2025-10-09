import { test } from '@playwright/test';
import { POIGeofencesPage } from '../pages/poiGeofencesPage';
import dotenv from 'dotenv';
dotenv.config();

test.describe('POI Geofences API Tests', () => {
    const environments = ['GQ1', 'STAGING', 'PROD'];

    for (const env of environments) {
        test(`${env} - Create, Read and Delete POI Geofence`, async ({ request }) => {
            const poiPage = new POIGeofencesPage(request, env);
            
            // Generate token
            await poiPage.generateToken();

            // Test data
            const poiData = {
                poiGeofences: [{
                    name: "TEST_SWISS_TEST5",
                    descr: "TEST_SWISS_TEST5",
                    loc: {
                        lon: 7.5844,
                        lat: 46.9629
                    },
                    adrs: {
                        adrsLine: "LITTEWIL 247A",
                        city: "VECHIGEN",
                        postalCode: "3068",
                        countryCode: "CH",
                        formattedAdrs: "LITTEWIL 247A,VECHIGEN,3068,CH"
                    },
                    category: "Building (Blue)",
                    fence: {
                        circle: { radius: 300 }
                    },
                    fromDt: "2025-08-12T00:00:00+01:00",
                    toDt: null
                }]
            };

            // Create POI Geofence
            const poiId = await poiPage.createPOIGeofence(poiData);

            // Get and verify POI Geofence
            const poiDetails = await poiPage.getPOIGeofence(poiId);
            
            // Verify the retrieved data matches what we created
            const expectedPoi = poiData.poiGeofences[0];
            test.expect(poiDetails.name).toBe(expectedPoi.name);
            test.expect(poiDetails.loc.lon).toBe(expectedPoi.loc.lon);
            test.expect(poiDetails.loc.lat).toBe(expectedPoi.loc.lat);
            test.expect(poiDetails.adrs.adrsLine).toBe(expectedPoi.adrs.adrsLine);
            test.expect(poiDetails.category).toBe(expectedPoi.category);
            test.expect(poiDetails.fence.circle.radius).toBe(expectedPoi.fence.circle.radius);

            // Delete POI Geofence
            await poiPage.deletePOIGeofence(poiId);

            // Verify deletion - this should throw an error since the POI should not exist
            try {
                await poiPage.getPOIGeofence(poiId);
                throw new Error('POI Geofence still exists after deletion');
            } catch (error) {
                // Expected error - POI should not be found
                test.expect(error.message).toContain('Failed to get POI Geofence: 404');
            }
        });
    }
});