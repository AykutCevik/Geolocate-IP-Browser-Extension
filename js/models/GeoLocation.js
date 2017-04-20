var GeoLocation = Backbone.Model.extend({
    url: API_URL + '/geoLocate.php',
    defaults: {
        continent_code: "",
        country_code: "",
        country_code3: "",
        country_name: "",
        region: "",
        city: "",
        postal_code: "",
        latitude: 0,
        longitude: 0,
        dma_code: 0,
        area_code: 0,
        ip: "",
        ip_forwarded_for: false
    }
});