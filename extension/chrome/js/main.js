var latestGeoLocation = null;
var lp = new LocalStorageProvider();

function setBadgeText(text) {
    chrome.browserAction.setBadgeText({text: text});
}

function setBadgeColor(color) {
    chrome.browserAction.setBadgeBackgroundColor({color: color});
}

function checkForLocationChange(geoLocation) {
    if (latestGeoLocation == null) {
        latestGeoLocation = geoLocation;
        return;
    }

    var checkForNotifications = lp.isSet(KEY_SETTINGS_NOTIFICATION) ? lp.get(KEY_SETTINGS_NOTIFICATION) : true;

    if (checkForNotifications && (latestGeoLocation.get('ip') != geoLocation.get('ip'))) {
        message = 'Your IP changed from ' + latestGeoLocation.get('ip') + ' to ' + geoLocation.get('ip') + '.';
        showChromeNotification('geoLocationAlert' + Math.random(), 'IP Geolocator - IP changed', message, 'Disable notifications in settings page.', function (string) {
        });
    }
    latestGeoLocation = geoLocation;
}

function fetchGeoLocation() {
    var geoLocate = new GeoLocation();
    geoLocate.fetch({
        success: function () {
            checkForLocationChange(geoLocate);
            setBadgeText(geoLocate.get('country_code') ? geoLocate.get('country_code') : 'ERR');
        },
        error: function () {
            setBadgeText('ERR');
        },
        timeout: 2800
    });
}

function showChromeNotification(id, title, message, contextMessage, callback) {
    chrome.notifications.create(id, {type: 'basic', iconUrl: 'img/icon128.png', title: title, message: message, contextMessage: contextMessage}, callback);
}

$(document).ready(
    function () {
        setBadgeColor('#3498db');
        setBadgeText('...');
        fetchGeoLocation();
        var intval = setInterval(fetchGeoLocation, 3000);
    }
);