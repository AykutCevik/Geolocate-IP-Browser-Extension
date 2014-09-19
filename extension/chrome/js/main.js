function setBadgeText(text) {
    chrome.browserAction.setBadgeText({text: text});
}

function setBadgeColor(color) {
    chrome.browserAction.setBadgeBackgroundColor({color: color});
}

function fetchGeolocation() {
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
        setBadgeColor('#000');
        setBadgeText('...');
        fetchGeolocation();
        var intval = setInterval(fetchGeolocation, 3000);
    }
);