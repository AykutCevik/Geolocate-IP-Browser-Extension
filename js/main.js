var latest_geo_location_country_code = "ERR";

function setIcon(country_code) {
    county_code_uppercase = country_code.toUpperCase()
    if (county_code_uppercase == "ERR") {
        chrome.browserAction.setIcon({path: "img/flags/48/_united-nations.png" });
    } else {
        chrome.browserAction.setIcon({path: "img/flags/48/" + county_code_uppercase + ".png"});
    }
}

function checkForLocationChange(geo_location_country_code) {
    if (latest_geo_location_country_code == "ERR") {
        latest_geo_location_country_code = geo_location_country_code;
        return;
    } else if (latest_geo_location_country_code != geo_location_country_code) {
        //message = "External ip changed";
        //showChromeNotification('geoLocationAlert' + Math.random(), 'IP Address & Geolocation', message, 'IPv4 changed', function (string) {
        //});

        latest_geo_location_country_code = geo_location_country_code;
    }
}

/*function showChromeNotification(id, title, message, contextMessage, callback) {
    chrome.notifications.create(id, {type: 'basic', iconUrl: 'img/icon128.png', title: title, message: message, contextMessage: contextMessage}, callback);
}*/

function fetchGeoLocation() {
    fetch("https://airvpn.org/api/whatismyip/")
    .then( data => {
        //return data.json()
        return data.json()
      }
    )
    .then( res  => {
        /*console.log(res)
        console.log(res.ip)
        console.log(res.geo.code)
        console.log(res.geo.name)*/
        checkForLocationChange(res.geo.code)
        setIcon(res.geo.code)
      }
    )
    .catch( err => {
        //console.error("ERROR: while fetching ->>", err);
        //console.error("ERROR:", err);
        setIcon("ERR");
      }
    )
}

function loading_ready() {
    fetchGeoLocation();
    var intval = setInterval(fetchGeoLocation, 3000);
};

loading_ready();
