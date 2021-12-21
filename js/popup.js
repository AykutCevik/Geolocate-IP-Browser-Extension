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

function compileHtml(html, obj, clip) {
    for (var prop in obj) {
        html = html.replace(new RegExp(clip + prop + clip, 'g'), obj[prop] ? obj[prop] : '');
    }
    return html;
}

function triggerView() {
    var infosHtml = $('#ipGeoLocationView').html();
    var gIPv4 = (geoIpV4 ? geoIpV4.toJSON() : new GeoLocation().toJSON());
    var gIPv6 = (geoIpV6 ? geoIpV6.toJSON() : new GeoLocation6().toJSON());
    compiledInfosHtml = compileHtml(infosHtml, gIPv4.geoLocation, 'T');
    compiledInfosHtml = compileHtml(compiledInfosHtml, gIPv4.browser, 'T');
    compiledInfosHtml = compileHtml(compiledInfosHtml, gIPv6.geoLocation, 'T6');
    compiledInfosHtml = compileHtml(compiledInfosHtml, gIPv6.browser, 'T6');
    $('#ipLocationInfo').html(compiledInfosHtml);

    if (geoIpV4 && geoIpV4.toJSON().geoLocation && geoIpV4.toJSON().geoLocation.latitude != 0) {
        var mapHtml = $('#ipGeoMapView').html();
        compiledMapHtml = compileHtml(mapHtml, geoIpV4.toJSON().geoLocation, 'T');
        $('#mapIPV4').html(compiledMapHtml);
    }

    if (geoIpV6 && geoIpV6.toJSON().geoLocation && geoIpV6.toJSON().geoLocation.latitude != 0) {
        var mapHtml = $('#ipGeoMapView').html();
        compiledMapHtml = compileHtml(mapHtml, geoIpV6.toJSON().geoLocation, 'T');
        $('#mapIPV6').html(compiledMapHtml);
    }
}

$(window).on("load", fetchGeoLocation);