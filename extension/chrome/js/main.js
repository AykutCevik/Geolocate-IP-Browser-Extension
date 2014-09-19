function setBadgeText(text) {
    chrome.browserAction.setBadgeText({text: text});
}

function setBadgeColor(color) {
    chrome.browserAction.setBadgeBackgroundColor({color: color});
}

function fetchGeoLocation() {
    var geoLocate = new GeoLocation();
    geoLocate.fetch({
        success: function () {
            setBadgeText(geoLocate.get('country_code'));
        },
        error: function () {
            setBadgeText('ERR');
        }
    });
}

$(document).ready(
    function () {
        setBadgeColor('#3498db');
        setBadgeText('...');
        fetchGeoLocation();
        var intval = setInterval(fetchGeoLocation, 3000);
    }
);