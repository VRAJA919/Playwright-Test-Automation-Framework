export const envConfig = {
    GQ1: {
        tokenUrl: process.env.GQ1_TOKEN_URL || "https://gq1.road.com/wsapi/v3/tokens",
        poiUrl: "https://gq1.road.com/wsapi/v4/poiGeofences/",
        credentials: {
            username: process.env.GQ1_USERNAME || "testwsapi40693",
            password: process.env.GQ1_PASSWORD || "Trimble@123"
        }
    },
    STAGING: {
        tokenUrl: process.env.STAGING_TOKEN_URL || "https://eu-staging.road.com/wsapi/v4/tokens",
        poiUrl: "https://eu-staging.road.com/wsapi/v4/poiGeofences/",
        credentials: {
            username: process.env.STAGING_USERNAME || "testwsapi34608",
            password: process.env.STAGING_PASSWORD || "testwsapi34608"
        }
    },
    PROD: {
        tokenUrl: process.env.PROD_TOKEN_URL || "https://eugm.road.com/wsapi/v4/tokens",
        poiUrl: "https://eugm.road.com/wsapi/v4/poiGeofences/",
        credentials: {
            username: process.env.PROD_USERNAME || "testvijay",
            password: process.env.PROD_PASSWORD || "Trimble@123"
        }
    }
};