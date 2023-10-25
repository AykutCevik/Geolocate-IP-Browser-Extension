var countriesSupported = ['AD', 'BA', 'BY', 'CV', 'ET', 'GN', 'IM', 'KR', 'MD', 'MW', 'PA', 'RU', 'ST', 'TT', 'WS', 'AE', 'BB', 'BZ', 'CW', 'EU', 'GQ', 'IN', 'KW', 'ME', 'MX', 'PE', 'RW', 'SV', 'TV', 'YE', 'AF', 'BD', 'CA', 'CX', 'FI', 'GR', 'IQ', 'KY', 'MF', 'MY', 'PF', 'SA', 'SX', 'TW', 'YT', 'AG', 'BE', 'CC', 'CY', 'FJ', 'GS', 'IR', 'KZ', 'MG', 'MZ', 'PG', 'SB', 'SY', 'TZ', 'ZA', 'AI', 'BF', 'CD', 'CZ', 'FK', 'GT', 'IS', 'LA', 'MH', 'NA', 'PH', 'SC', 'SZ', 'UA', 'ZM', 'AL', 'BG', 'CF', 'DE', 'FM', 'GU', 'IT', 'LB', 'MK', 'NC', 'PK', 'SD', 'TC', 'UG', 'ZW', 'AM', 'BH', 'CG', 'DJ', 'FO', 'GW', 'JE', 'LC', 'ML', 'NE', 'PL', 'SE', 'TD', 'US', 'AN', 'BI', 'CH', 'DK', 'FR', 'GY', 'JM', 'LI', 'MM', 'NF', 'PN', 'SG', 'TF', 'UY', 'AO', 'BJ', 'CI', 'DM', 'GA', 'HK', 'JO', 'LK', 'MN', 'NG', 'PR', 'SH', 'TG', 'UZ', 'AQ', 'BL', 'CK', 'DO', 'GB', 'HN', 'JP', 'LR', 'MO', 'NI', 'PS', 'SI', 'TH', 'VA', 'AR', 'BM', 'CL', 'DZ', 'GD', 'HR', 'KE', 'LS', 'MP', 'NL', 'PT', 'SK', 'TJ', 'VC', 'AS', 'BN', 'CM', 'EC', 'GE', 'HT', 'KG', 'LT', 'MQ', 'NO', 'PW', 'SL', 'TK', 'VE', 'AT', 'BO', 'CN', 'EE', 'GG', 'HU', 'KH', 'LU', 'MR', 'NP', 'PY', 'SM', 'TL', 'VG', 'AU', 'BR', 'CO', 'EG', 'GH', 'IC', 'KI', 'LV', 'MS', 'NR', 'QA', 'SN', 'TM', 'VI', 'AW', 'BS', 'CR', 'EH', 'GI', 'ID', 'KM', 'LY', 'MT', 'NU', 'RE', 'SO', 'TN', 'VN', 'AX', 'BT', 'CT', 'ER', 'GL', 'IE', 'KN', 'MA', 'MU', 'NZ', 'RO', 'SR', 'TO', 'VU', 'AZ', 'BW', 'CU', 'ES', 'GM', 'IL', 'KP', 'MC', 'MV', 'OM', 'RS', 'SS', 'TR', 'WF'];

/*
Generic error logger.
*/
function onError(e) {
  console.error(e);
}

function setBadgeText(text) {
  browser.action.setBadgeText({ text: text });
}

function setBadgeTextColor(color) {
  browser.action.setBadgeTextColor({ color: color });
}

function setBadgeColor(color) {
  browser.action.setBadgeBackgroundColor({ color: color });
}

function setIcon(country_code) {
  browser.storage.local.get().then(settings => {
    var showFlags = typeof settings[KEY_SETTINGS_SHOW_FLAGS] != 'undefined' ? settings[KEY_SETTINGS_SHOW_FLAGS] : true;
    if (country_code == 'ERR' || !showFlags || !countriesSupported.includes(country_code)) {
      browser.action.setIcon({ path: 'img/icon48.png' });
    } else {
      browser.action.setIcon({ path: 'img/flags/48/' + country_code + '.png' });
    }
  }, onError);
}

function checkForLocationChange(geoLocation, ipv6) {
  geoLocation = geoLocation.toJSON();
  browser.storage.local.get().then(settings => {
    if (settings.latestGeoLocation == null && !ipv6) {
      settings.latestGeoLocation = geoLocation;
      browser.storage.local.set(settings).then(() => {}, onError);
      return;
    }

    if (settings.latestGeoLocation6 == null && ipv6) {
      settings.latestGeoLocation6 = geoLocation;
      browser.storage.local.set(settings).then(() => {}, onError);
      return;
    }

    var checkForNotifications =
      typeof settings[KEY_SETTINGS_NOTIFICATION] !== 'undefined' ? settings[KEY_SETTINGS_NOTIFICATION] : true;
    var checkForNotificationsIPv6 =
      typeof settings[KEY_SETTINGS_NOTIFICATION_IPv6] !== 'undefined'
        ? settings[KEY_SETTINGS_NOTIFICATION_IPv6]
        : false;

    if (
      !ipv6 &&
      checkForNotifications &&
      typeof settings.latestGeoLocation != "undefined" &&
      settings.latestGeoLocation['geoLocation'].ipAddress !== geoLocation['geoLocation'].ipAddress
    ) {
      message =
        'From ' +
        settings.latestGeoLocation['geoLocation'].ipAddress +
        ' to ' +
        geoLocation['geoLocation'].ipAddress +
        '.';
      showChromeNotification(
        'geoLocationAlert' + Math.random(),
        'IP Address & Geolocation',
        message,
        'IPv4 changed',
        function (string) {}
      );
    }

    if (
      ipv6 &&
      checkForNotificationsIPv6 &&
      typeof settings.latestGeoLocation6 != "undefined" &&
      settings.latestGeoLocation6['geoLocation'].ipAddress !== geoLocation['geoLocation'].ipAddress
    ) {
      message =
        'From ' +
        settings.latestGeoLocation6['geoLocation'].ipAddress +
        ' to ' +
        geoLocation['geoLocation'].ipAddress +
        '.';
      showChromeNotification(
        'geoLocationAlert' + Math.random(),
        'IP Address & Geolocation',
        message,
        'IPv6 changed',
        function (string) {}
      );
    }

    if (!ipv6) settings.latestGeoLocation = geoLocation;
    else settings.latestGeoLocation6 = geoLocation;

    browser.storage.local.set(settings).then(() => {}, onError);
  }, onError);
}

function fetchGeoLocation() {
  browser.storage.local.get().then(settings => {
    var badgeIndicator =
      typeof settings[KEY_SETTINGS_COUNTRY_BADGE] != 'undefined' ? settings[KEY_SETTINGS_COUNTRY_BADGE] : 'auto';

    var geoLocate = new GeoLocation();
    geoLocate.fetch({
      success: function () {
        settings.ipv4Error = false;
        browser.storage.local.set(settings);
        checkForLocationChange(geoLocate, false);
        if (badgeIndicator === 'ipv4' || badgeIndicator === 'auto') {
          var country_code = geoLocate.get('geoLocation').countryCode
            ? geoLocate.get('geoLocation').countryCode
            : 'ERR';
          setBadgeText(country_code);
          setIcon(country_code);
        }
      },
      error: function () {
        settings.ipv4Error = true;
        browser.storage.local.set(settings);
        if (badgeIndicator === 'ipv4') {
          setBadgeText('ERR');
          setIcon('ERR');
        }
      },
      timeout: 2800,
    });

    var geoLocate6 = new GeoLocation6();
    geoLocate6.fetch({
      success: function () {
        checkForLocationChange(geoLocate6, true);
        if (badgeIndicator === 'ipv6' || (badgeIndicator === 'auto' && settings.ipv4Error)) {
          var country_code = geoLocate6.get('geoLocation').countryCode
            ? geoLocate6.get('geoLocation').countryCode
            : 'ERR';
          setBadgeText(country_code);
          setIcon(country_code);
        }
      },
      error: function () {
        if (badgeIndicator === 'ipv6' || settings.ipv4Error) {
          setBadgeText('ERR');
          setIcon('ERR');
        }
      },
      timeout: 2800,
    });
  }, onError);
}

function showChromeNotification(id, title, message, contextMessage, callback) {
  chrome.notifications.create(
    id,
    { type: 'basic', iconUrl: 'img/icon128.png', title: title, message: message, contextMessage: contextMessage },
    callback
  );
}

$(document).ready(function () {
  setBadgeColor('#000000');
  setBadgeTextColor('#ffffff');
  setBadgeText('...');
  fetchGeoLocation();
  var intval = setInterval(fetchGeoLocation, 3000);
});
