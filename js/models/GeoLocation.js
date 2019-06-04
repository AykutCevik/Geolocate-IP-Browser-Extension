var GeoLocation = Backbone.Model.extend({
    url: API_URL + '/api/ip',
    defaults: {
        browser: {
            userAgent: ''
        },
        geoLocation: {
            ipAddress: '',
            countryCode: '',
            countryName: '',
            city: '',
            state: '',
            stateCode: '',
            continent: '',
            continentCode: '',
            timezone: '',
            latitude: 0,
            longitude: 0
        }
    }
});

var GeoLocation6 = Backbone.Model.extend({
    url: API_URL_IPv6 + '/api/ip',
    defaults: {
        browser: {
            userAgent: ''
        },
        geoLocation: {
            ipAddress: '',
            countryCode: '',
            countryName: '',
            city: '',
            state: '',
            stateCode: '',
            continent: '',
            continentCode: '',
            timezone: '',
            latitude: 0,
            longitude: 0
        }
    }
});