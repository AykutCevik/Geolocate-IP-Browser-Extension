var GeoLocation = Backbone.Model.extend({
    url: REST_API_URL + '/geolocation',
    defaults: {
        countryCode: null,
        countryName: null,
        region: null,
        city: null,
        postalCode: null,
        latitude: null,
        longitude: null
    }
});