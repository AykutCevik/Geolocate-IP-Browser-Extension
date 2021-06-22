var geoIpV4 = null;
var geoIpV6 = null;
var ipv4IsFetching = true;
var ipv6IsFetching = true;

function reloadPopup() {
    window.location.reload();
}

function handleError() {
    if (geoIpV4 == null && geoIpV6 == null && !ipv4IsFetching && !ipv6IsFetching) {
        setTimeout(function () { // https://github.com/google/material-design-lite/issues/1995
            // connection issue            
            var snackbarContainer = document.querySelector('.mdl-js-snackbar');
            var data = {
                message: 'Network error occured.',
                timeout: 20000,
                actionHandler: reloadPopup,
                actionText: 'Retry'
            };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }, 1);
    }
}

function fetchGeoLocation() {
    var geoLocate = new GeoLocation();
    geoLocate.fetch({
        success: function () {
            geoIpV4 = geoLocate;
            triggerView();
        },
        error: function () {
            geoIpV4 = null;
            ipv4IsFetching = false;
            handleError();
        }
    });

    var geoLocate6 = new GeoLocation6();
    geoLocate6.fetch({
        success: function () {
            geoIpV6 = geoLocate6;
            triggerView();
        },
        error: function () {
            geoIpV6 = null;
            ipv6IsFetching = false;
            handleError();
        }
    });
}

function triggerView() {
    var infosHtml = _.template($('#ipGeoLocationView').html());
    compiledInfosHtml = infosHtml({
        gl: geoIpV4 ? geoIpV4.toJSON() : new GeoLocation(),
        gl6: geoIpV6 ? geoIpV6.toJSON() : new GeoLocation6()
    });
    $('#ipLocationInfo').html(compiledInfosHtml);

    if (geoIpV4 && geoIpV4.toJSON().geoLocation && geoIpV4.toJSON().geoLocation.latitude != 0) {
        var mapHtml = _.template($('#ipGeoMapView').html());
        compiledMapHtml = mapHtml({
            gl:  geoIpV4.toJSON()
        });
        $('#mapIPV4').html(compiledMapHtml);
    }

    if(geoIpV6 && geoIpV6.toJSON().geoLocation && geoIpV6.toJSON().geoLocation.latitude != 0) {
        var mapHtml = _.template($('#ipGeoMapView').html());
        compiledMapHtml = mapHtml({
            gl:  geoIpV6.toJSON()
        });
        $('#mapIPV6').html(compiledMapHtml);
    }
}

$(window).on("load", fetchGeoLocation);