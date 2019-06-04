var latestGeoLocation = null;
var latestGeoLocation6 = null;
var lp = new LocalStorageProvider();
var ipv4Error = false;

function setBadgeText(text) {
    chrome.browserAction.setBadgeText({text: text});
}

function setBadgeColor(color) {
    chrome.browserAction.setBadgeBackgroundColor({color: color});
}

function checkForLocationChange(geoLocation, ipv6) {
    if (latestGeoLocation == null && !ipv6) {
        latestGeoLocation = geoLocation;
        return;
    }

    if (latestGeoLocation6 == null && ipv6) {
        latestGeoLocation6 = geoLocation;
        return;
    }

    var checkForNotifications = lp.isSet(KEY_SETTINGS_NOTIFICATION) ? lp.get(KEY_SETTINGS_NOTIFICATION) : true;
    var checkForNotificationsIPv6 = lp.isSet(KEY_SETTINGS_NOTIFICATION_IPv6) ? lp.get(KEY_SETTINGS_NOTIFICATION_IPv6) : false;

    if (!ipv6 && checkForNotifications && (latestGeoLocation.get('geoLocation').ipAddress !== geoLocation.get('geoLocation').ipAddress)) {
        message = 'From ' + latestGeoLocation.get('geoLocation').ipAddress + ' to ' + geoLocation.get('geoLocation').ipAddress + '.';
        showChromeNotification('geoLocationAlert' + Math.random(), 'IP Address & Geolocation', message, 'IPv4 changed', function (string) {
        });
    }

    if (ipv6 && checkForNotificationsIPv6 && (latestGeoLocation6.get('geoLocation').ipAddress !== geoLocation.get('geoLocation').ipAddress)) {
        message = 'From ' + latestGeoLocation6.get('geoLocation').ipAddress + ' to ' + geoLocation.get('geoLocation').ipAddress + '.';
        showChromeNotification('geoLocationAlert' + Math.random(), 'IP Address & Geolocation', message, 'IPv6 changed', function (string) {
        });
    }

    if (!ipv6)
        latestGeoLocation = geoLocation;
    else
        latestGeoLocation6 = geoLocation;
}

function fetchGeoLocation() {
    var badgeIndicator = lp.isSet(KEY_SETTINGS_COUNTRY_BADGE) ? lp.get(KEY_SETTINGS_COUNTRY_BADGE) : 'auto';


    var geoLocate = new GeoLocation();
    geoLocate.fetch({
        success: function () {
            ipv4Error = false;
            checkForLocationChange(geoLocate, false);
            if (badgeIndicator === 'ipv4' || badgeIndicator === 'auto')
                setBadgeText(geoLocate.get('geoLocation').countryCode ? geoLocate.get('geoLocation').countryCode : 'ERR');
        },
        error: function () {
            ipv4Error = true;
            if (badgeIndicator === 'ipv4')
                setBadgeText('ERR');
        },
        timeout: 2800
    });

    var geoLocate6 = new GeoLocation6();
    geoLocate6.fetch({
        success: function () {
            checkForLocationChange(geoLocate6, true);
            if (badgeIndicator === 'ipv6' || (badgeIndicator === 'auto' && ipv4Error))
                setBadgeText(geoLocate6.get('geoLocation').countryCode ? geoLocate6.get('geoLocation').countryCode : 'ERR');
        },
        error: function () {
            if (badgeIndicator === 'ipv6')
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