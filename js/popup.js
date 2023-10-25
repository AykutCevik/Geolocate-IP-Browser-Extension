/*
Generic error logger.
*/
function onError(e) {
    console.error(e);
}

function reloadPopup() {
    window.location.reload();
}

function handleError() {
    browser.storage.local.get().then(settings => {
        if ((typeof settings.geoIpV4 == "undefined" || settings.geoIpV4 == null) && (typeof settings.geoIpV6 == "undefined" || settings.geoIpV6 == null) && (typeof settings.ipv4IsFetching == "undefined" || !settings.ipv4IsFetching) && (typeof settings.ipv6IsFetching == "undefined" || !settings.ipv6IsFetching)) {
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
    }, onError)
    
}

function fetchGeoLocation() {
    browser.storage.local.get().then(settings => {
        var geoLocate = new GeoLocation();
        geoLocate.fetch({
            success: function () {
                settings.geoIpV4 = geoLocate.toJSON();
                browser.storage.local.set(settings).then(() => {}, onError);
                triggerView();
            },
            error: function () {
                settings.geoIpV4 = null;
                settings.ipv4IsFetching = false;
                browser.storage.local.set(settings).then(() => {}, onError);
                handleError();
            }
        });

        var geoLocate6 = new GeoLocation6();
        geoLocate6.fetch({
            success: function () {
                settings.geoIpV6 = geoLocate6.toJSON()
                browser.storage.local.set(settings).then(() => {}, onError);
                triggerView();
            },
            error: function () {
                settings.geoIpV6 = null;
                settings.ipv6IsFetching = false;
                browser.storage.local.set(settings).then(() => {}, onError);
                handleError();
            }
        });
    }, onError)
}

function compileHtml(html, obj, clip) {
    for (var prop in obj) {
        html = html.replace(new RegExp(clip + prop + clip, 'g'), obj[prop] ? obj[prop] : '');
    }
    return html;
}

function triggerView() {
    var infosHtml = $('#ipGeoLocationView').html();
    chrome.runtime.sendMessage({contentScriptQuery: "queryIpv4"}, gIPv4 => {
        chrome.runtime.sendMessage({contentScriptQuery: "queryIpv6"}, gIPv6 => {
            browser.storage.local.get().then(settings => {
                compiledInfosHtml = compileHtml(infosHtml, gIPv4.geoLocation, 'T');
                compiledInfosHtml = compileHtml(compiledInfosHtml, gIPv4.browser, 'T');
                compiledInfosHtml = compileHtml(compiledInfosHtml, gIPv6.geoLocation, 'T6');
                compiledInfosHtml = compileHtml(compiledInfosHtml, gIPv6.browser, 'T6');
                $('#ipLocationInfo').html(compiledInfosHtml);

                if (typeof settings.geoIpV4 != "undefined" && settings.geoIpV4 != null && typeof settings.geoIpV4.geoLocation != "undefined" && settings.geoIpV4.geoLocation && settings.geoIpV4.geoLocation.latitude != 0) {
                    var mapHtml = $('#ipGeoMapView').html();
                    compiledMapHtml = compileHtml(mapHtml, settings.geoIpV4.geoLocation, 'T');
                    $('#mapIPV4').html(compiledMapHtml);
                }

                if (typeof settings.geoIpV6 != "undefined" && settings.geoIpV6 != null && typeof settings.geoIpV6.geoLocation != "undefined" && settings.geoIpV6.geoLocation && settings.geoIpV6.geoLocation.latitude != 0) {
                    var mapHtml = $('#ipGeoMapView').html();
                    compiledMapHtml = compileHtml(mapHtml, settings.geoIpV6.geoLocation, 'T');
                    $('#mapIPV6').html(compiledMapHtml);
                }
            }, onError)
            
        });
    });
}

$(window).on("load", fetchGeoLocation);