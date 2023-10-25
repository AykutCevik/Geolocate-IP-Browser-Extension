/*
Default settings. If there is nothing in storage, use these values.
*/
let defaultSettings = {
  geoIpV4: null,
  geoIpV6: null,
  ipv4IsFetching: false,
  ipv6IsFetching: false,
  latestGeoLocation: null,
  latestGeoLocation6: null,
  ipv4Error: null,
};

/*
Generic error logger.
*/
function onError(e) {
  console.error(e);
}

/*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/
function checkStoredSettings(storedSettings) {
  if (!storedSettings.ipv6IsFetching) {
    browser.storage.local.set(defaultSettings);
  }
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.contentScriptQuery == 'queryIpv4') {
    browser.storage.local.get().then(settings => {
      var gIPv4 = settings.geoIpV4 ? settings.geoIpV4 : new GeoLocation().toJSON();
      sendResponse(gIPv4);
    }, onError);
    return true;
  } else if (request.contentScriptQuery == 'queryIpv6') {
    browser.storage.local.get().then(settings => {
      var gIPv6 = settings.geoIpV6 ? settings.geoIpV6 : new GeoLocation6().toJSON();
      sendResponse(gIPv6);
    }, onError);
    return true;
  }
  return false;
});
