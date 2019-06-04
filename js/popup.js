var geoIpV4 = null;
var geoIpV6 = null;

function fetchGeoLocation() {
    var geoLocate = new GeoLocation();
    geoLocate.fetch({
        success: function () {
            geoIpV4 = geoLocate;
            triggerView();
        },
        error: function () {
            geoIpV4 = geoLocate;
            triggerView();
        }
    });

    var geoLocate6 = new GeoLocation6();
    geoLocate6.fetch({
        success: function () {
            geoIpV6 = geoLocate6;
            triggerView();
        },
        error: function () {
            geoIpV6 = geoLocate6;
            triggerView();
        }
    });
}

function triggerView() {
    var infosHtml = _.template($('#ipGeoLocationView').html(), {
        gl: geoIpV4 ? geoIpV4.toJSON() : new GeoLocation(),
        gl6: geoIpV6 ? geoIpV6.toJSON() : new GeoLocation6()
    });
    $('#ipLocationInfo').html(infosHtml);
}

$(document).ready(
    function () {
        fetchGeoLocation();
    }
);