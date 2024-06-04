let latestGeoLocation = null;
let latestGeoLocation6 = null;
const lp = new LocalStorageProvider();
let ipv4Error = false;
const countriesSupported = ['AD', 'BA', 'BY', 'CV', 'ET', 'GN', 'IM', 'KR', 'MD', 'MW', 'PA', 'RU', 'ST', 'TT', 'WS', 'AE', 'BB', 'BZ', 'CW', 'EU', 'GQ', 'IN', 'KW', 'ME', 'MX', 'PE', 'RW', 'SV', 'TV', 'YE', 'AF', 'BD', 'CA', 'CX', 'FI', 'GR', 'IQ', 'KY', 'MF', 'MY', 'PF', 'SA', 'SX', 'TW', 'YT', 'AG', 'BE', 'CC', 'CY', 'FJ', 'GS', 'IR', 'KZ', 'MG', 'MZ', 'PG', 'SB', 'SY', 'TZ', 'ZA', 'AI', 'BF', 'CD', 'CZ', 'FK', 'GT', 'IS', 'LA', 'MH', 'NA', 'PH', 'SC', 'SZ', 'UA', 'ZM', 'AL', 'BG', 'CF', 'DE', 'FM', 'GU', 'IT', 'LB', 'MK', 'NC', 'PK', 'SD', 'TC', 'UG', 'ZW', 'AM', 'BH', 'CG', 'DJ', 'FO', 'GW', 'JE', 'LC', 'ML', 'NE', 'PL', 'SE', 'TD', 'US', 'AN', 'BI', 'CH', 'DK', 'FR', 'GY', 'JM', 'LI', 'MM', 'NF', 'PN', 'SG', 'TF', 'UY', 'AO', 'BJ', 'CI', 'DM', 'GA', 'HK', 'JO', 'LK', 'MN', 'NG', 'PR', 'SH', 'TG', 'UZ', 'AQ', 'BL', 'CK', 'DO', 'GB', 'HN', 'JP', 'LR', 'MO', 'NI', 'PS', 'SI', 'TH', 'VA', 'AR', 'BM', 'CL', 'DZ', 'GD', 'HR', 'KE', 'LS', 'MP', 'NL', 'PT', 'SK', 'TJ', 'VC', 'AS', 'BN', 'CM', 'EC', 'GE', 'HT', 'KG', 'LT', 'MQ', 'NO', 'PW', 'SL', 'TK', 'VE', 'AT', 'BO', 'CN', 'EE', 'GG', 'HU', 'KH', 'LU', 'MR', 'NP', 'PY', 'SM', 'TL', 'VG', 'AU', 'BR', 'CO', 'EG', 'GH', 'IC', 'KI', 'LV', 'MS', 'NR', 'QA', 'SN', 'TM', 'VI', 'AW', 'BS', 'CR', 'EH', 'GI', 'ID', 'KM', 'LY', 'MT', 'NU', 'RE', 'SO', 'TN', 'VN', 'AX', 'BT', 'CT', 'ER', 'GL', 'IE', 'KN', 'MA', 'MU', 'NZ', 'RO', 'SR', 'TO', 'VU', 'AZ', 'BW', 'CU', 'ES', 'GM', 'IL', 'KP', 'MC', 'MV', 'OM', 'RS', 'SS', 'TR', 'WF'];
const checkInterval = 3550;

async function setBadgeText(text) {
    let showText = await lp.isSet(KEY_SETTINGS_SHOW_TEXT) ? await lp.get(KEY_SETTINGS_SHOW_TEXT) : true;
    if (showText) {
        chrome.action.setBadgeText({ text: text });
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

function setBadgeTextColor(color) {
    if (typeof chrome.action.setBadgeTextColor === "function") // only firefox
        chrome.action.setBadgeTextColor({ color: color });
}

function setBadgeColor(color) {
    chrome.action.setBadgeBackgroundColor({ color: color });
}

async function setIcon(country_code) {
    let showFlags = await lp.isSet(KEY_SETTINGS_SHOW_FLAGS) ? await lp.get(KEY_SETTINGS_SHOW_FLAGS) : true;
    if (country_code == "ERR" || !showFlags || !(countriesSupported.includes(country_code))) {
        chrome.action.setIcon({ path: "img/icon48.png" });
    } else {
        chrome.action.setIcon({ path: "img/flags/48/" + country_code + ".png" });
    }
}

async function checkForLocationChange(geoLocation, ipv6) {
    if (latestGeoLocation == null && !ipv6) {
        latestGeoLocation = geoLocation;
        return;
    }

    if (latestGeoLocation6 == null && ipv6) {
        latestGeoLocation6 = geoLocation;
        return;
    }

    let checkForNotifications = await lp.isSet(KEY_SETTINGS_NOTIFICATION) ? await lp.get(KEY_SETTINGS_NOTIFICATION) : true;
    let checkForNotificationsIPv6 = await lp.isSet(KEY_SETTINGS_NOTIFICATION_IPv6) ? await lp.get(KEY_SETTINGS_NOTIFICATION_IPv6) : false;

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

async function fetchGeoLocation() {
    var badgeIndicator = await lp.isSet(KEY_SETTINGS_COUNTRY_BADGE) ? await lp.get(KEY_SETTINGS_COUNTRY_BADGE) : 'auto';


    var geoLocate = new GeoLocation();
    geoLocate.fetch({
        success: function () {
            ipv4Error = false;
            checkForLocationChange(geoLocate, false);
            if (badgeIndicator === 'ipv4' || badgeIndicator === 'auto') {
                var country_code = geoLocate.get('geoLocation').countryCode ? geoLocate.get('geoLocation').countryCode : 'ERR';
                setBadgeText(country_code);
                setIcon(country_code);
            }
        },
        error: function () {
            ipv4Error = true;
            if (badgeIndicator === 'ipv4') {
                setBadgeText('ERR');
                setIcon('ERR');
            }
        },
        timeout: checkInterval - 50
    });

    var geoLocate6 = new GeoLocation6();
    geoLocate6.fetch({
        success: function () {
            checkForLocationChange(geoLocate6, true);
            if (badgeIndicator === 'ipv6' || (badgeIndicator === 'auto' && ipv4Error)) {
                var country_code = geoLocate6.get('geoLocation').countryCode ? geoLocate6.get('geoLocation').countryCode : 'ERR';
                setBadgeText(country_code);
                setIcon(country_code);
            }
        },
        error: function () {
            if (badgeIndicator === 'ipv6' || ipv4Error) {
                setBadgeText('ERR');
                setIcon('ERR');
            }
        },
        timeout: checkInterval - 50
    });

}

function showChromeNotification(id, title, message, contextMessage, callback) {
    chrome.notifications.create(id, { type: 'basic', iconUrl: 'img/icon128.png', title: title, message: message, contextMessage: contextMessage }, callback);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "refresh") {
        fetchGeoLocation().then(() => { sendResponse({ data: 'refreshed' }); });
    }
    return true; // indicates we will send a response asynchronously
});

setBadgeColor('#000000');
setBadgeTextColor('#ffffff');
setBadgeText('...');
fetchGeoLocation();

let intval;

function startInterval() {
    if (!intval) {
        intval = setInterval(fetchGeoLocation, checkInterval);
    }
}

function stopInterval() {
    if (intval) {
        clearInterval(intval);
        intval = null;
    }
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkIntervalAlarm') {
        stopInterval();
        startInterval();
    }
});

chrome.runtime.onSuspend.addListener(function () {
    stopInterval();
});


chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkIntervalAlarm') {
        stopInterval();
        startInterval();
    }
});

chrome.runtime.onInstalled.addListener(() => {
    startInterval();
    chrome.alarms.create('checkIntervalAlarm', { periodInMinutes: 1 });
});

chrome.runtime.onStartup.addListener(() => {
    startInterval();
    chrome.alarms.create('checkIntervalAlarm', { periodInMinutes: 1 });
});