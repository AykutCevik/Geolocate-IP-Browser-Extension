function fetchGeoLocation() {
    var geoLocate = new GeoLocation();
    geoLocate.fetch({
        success: function () {
            var infosHtml = _.template($('#ipGeoLocationView').html(), {geolocation: geoLocate.toJSON()});
            $('#ipLocationInfo').html(infosHtml);
        },
        error: function () {

        }
    });
}

$(document).ready(
    function () {
        // empty
        var infosHtml = _.template($('#ipGeoLocationView').html(), {geolocation: new GeoLocation()});
        $('#ipLocationInfo').html(infosHtml);
        fetchGeoLocation();
    }
);