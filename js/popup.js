let geoIpV4 = null;
let geoIpV6 = null;
let ipv4IsFetching = true;
let ipv6IsFetching = true;

function reloadPopup() {
    window.location.reload();
}

function handleError() {
    if (geoIpV4 == null && geoIpV6 == null && !ipv4IsFetching && !ipv6IsFetching) {
        setTimeout(function () { // https://github.com/google/material-design-lite/issues/1995
            // connection issue            
            let snackbarContainer = document.querySelector('.mdl-js-snackbar');
            let data = {
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
    let geoLocate = new GeoLocation();
    geoLocate.fetch({
        success: function () {
            geoIpV4 = geoLocate;
            //ipv4IsFetching = false;
            triggerView();
        },
        error: function () {
            //geoIpV4 = null;
            ipv4IsFetching = false;
            handleError();
        }
    });

    let geoLocate6 = new GeoLocation6();
    geoLocate6.fetch({
        success: function () {
            geoIpV6 = geoLocate6;
            //ipv6IsFetching = false;
            triggerView();
        },
        error: function () {
            //geoIpV6 = null;
            ipv6IsFetching = false;
            handleError();
        }
    });
}

function compileHtml(html, obj, clip) {
    for (let prop in obj) {
        html = html.replace(new RegExp(clip + prop + clip, 'g'), obj[prop] ? obj[prop] : '');
    }
    return html;
}

function triggerView() {
    let infosHtml = document.getElementById('ipGeoLocationView').innerHTML;
    let gIPv4 = (geoIpV4 ? geoIpV4.toJSON() : new GeoLocation().toJSON());
    let gIPv6 = (geoIpV6 ? geoIpV6.toJSON() : new GeoLocation6().toJSON());
    compiledInfosHtml = compileHtml(infosHtml, gIPv4.geoLocation, 'T');
    compiledInfosHtml = compileHtml(compiledInfosHtml, gIPv4.browser, 'T');
    compiledInfosHtml = compileHtml(compiledInfosHtml, gIPv6.geoLocation, 'T6');
    compiledInfosHtml = compileHtml(compiledInfosHtml, gIPv6.browser, 'T6');
    document.getElementById('ipLocationInfo').innerHTML = compiledInfosHtml;

    if (geoIpV4 && geoIpV4.toJSON().geoLocation && geoIpV4.toJSON().geoLocation.latitude != 0) {
        let mapHtml = document.getElementById('ipGeoMapView').innerHTML;
        compiledMapHtml = compileHtml(mapHtml, geoIpV4.toJSON().geoLocation, 'T');
        document.getElementById('mapIPV4').innerHTML = compiledMapHtml;
    }

    if (geoIpV6 && geoIpV6.toJSON().geoLocation && geoIpV6.toJSON().geoLocation.latitude != 0) {
        let mapHtml = document.getElementById('ipGeoMapView').innerHTML;
        compiledMapHtml = compileHtml(mapHtml, geoIpV6.toJSON().geoLocation, 'T');
        document.getElementById('mapIPV6').innerHTML = compiledMapHtml;
    }
}

window.addEventListener("load", fetchGeoLocation);