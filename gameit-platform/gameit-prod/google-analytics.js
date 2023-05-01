/**
 * TODO(developer): Uncomment this variable and replace with your
 *   Google Analytics 4 property ID before running the sample.
 */
propertyId = '306976163';

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: __dirname + '/gameit-platform-ksa-key.json',
});

// Runs a simple report.
async function runReport() {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{
            startDate: '28daysAgo',
            endDate: 'today',
        }, ],
        metrics: [{
            name: 'active1DayUsers',
        }, ],
        metricAggregations: ['TOTAL'],
        dimensions: [{
            name: 'country',
        }, ],
    });

    console.log('Report result:');
    response.rows.forEach((row) => {
        console.log(row.dimensionValues[0], row.metricValues[0]);
    });
}

async function runRealTimeReport() {
    const [response] = await analyticsDataClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ "name": "activeUsers" }],
        minuteRanges: [{

            startMinutesAgo: 29
        }]
    });

    console.log(response);
    response.rows.forEach((row) => {
        console.log(row.dimensionValues[0], row.metricValues[0]);
    });
}

runRealTimeReport();