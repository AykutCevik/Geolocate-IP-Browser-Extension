/*
Generic error logger.
*/
function onError(e) {
    console.error(e);
}

$(window).on("load", function () {
    loadSettings();
    $('#btnSaveSettings').click(saveSettings);
});

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function saveSettings() {
    var notificationSetting = $('#enableNotifications').prop('checked');
    var notificationIPv6Setting = $('#enableNotificationsIPv6').prop('checked');
    var badgeIndicator = $("input:radio[name ='indicator']:checked").val();
    var showFlags = $('#enableCountryFlags').prop('checked');

    browser.storage.local.get().then(settings => {
        settings[KEY_SETTINGS_NOTIFICATION] = notificationSetting;
        settings[KEY_SETTINGS_NOTIFICATION_IPv6] = notificationIPv6Setting;
        settings[KEY_SETTINGS_COUNTRY_BADGE] = badgeIndicator;
        settings[KEY_SETTINGS_SHOW_FLAGS] = showFlags;
        browser.storage.local.set(settings).then(() => {}, onError);
    }, onError);
}

function loadSettings() {
    browser.storage.local.get().then(settings => {
        settings[KEY_SETTINGS_NOTIFICATION] = typeof settings[KEY_SETTINGS_NOTIFICATION] !== "undefined" ? settings[KEY_SETTINGS_NOTIFICATION] : true;
    
        settings[KEY_SETTINGS_NOTIFICATION_IPv6] = typeof settings[KEY_SETTINGS_NOTIFICATION_IPv6] !== "undefined" ? settings[KEY_SETTINGS_NOTIFICATION_IPv6] : true;
    
        settings[KEY_SETTINGS_COUNTRY_BADGE] = typeof settings[KEY_SETTINGS_COUNTRY_BADGE] !== "undefined" ? settings[KEY_SETTINGS_COUNTRY_BADGE] : "auto";
    
        settings[KEY_SETTINGS_SHOW_FLAGS] = typeof settings[KEY_SETTINGS_SHOW_FLAGS] !== "undefined" ? settings[KEY_SETTINGS_SHOW_FLAGS] : true;
    
        if (settings[KEY_SETTINGS_NOTIFICATION] == true) {
            document.getElementById("enableNotifications").parentElement.classList.add("is-checked");
        } else {
            document.getElementById("enableNotifications").parentElement.classList.remove("is-checked");
        }
        $('#enableNotifications').prop('checked', settings[KEY_SETTINGS_NOTIFICATION]);

        if (settings[KEY_SETTINGS_NOTIFICATION_IPv6] == true) {
            document.getElementById("enableNotificationsIPv6").parentElement.classList.add("is-checked");
        } else {
            document.getElementById("enableNotificationsIPv6").parentElement.classList.remove("is-checked");
        }
        $('#enableNotificationsIPv6').prop('checked', settings[KEY_SETTINGS_NOTIFICATION_IPv6]);
    
        var badgeIndicator = settings[KEY_SETTINGS_COUNTRY_BADGE];
        $("input:radio[name ='indicator'][value='" + badgeIndicator + "']").prop('checked', true);
        if (badgeIndicator == "ipv4") {
            getElementByXpath("//span[text() = 'Auto']").parentElement.classList.remove("is-checked");
            getElementByXpath("//span[text() = 'IPv6']").parentElement.classList.remove("is-checked");
            getElementByXpath("//span[text() = 'IPv4']").parentElement.classList.add("is-checked");
        }
        if (badgeIndicator == "ipv6") {
            getElementByXpath("//span[text() = 'Auto']").parentElement.classList.remove("is-checked");
            getElementByXpath("//span[text() = 'IPv4']").parentElement.classList.remove("is-checked");
            getElementByXpath("//span[text() = 'IPv6']").parentElement.classList.add("is-checked");
        }
        if (badgeIndicator == "auto") {
            getElementByXpath("//span[text() = 'IPv4']").parentElement.classList.remove("is-checked");
            getElementByXpath("//span[text() = 'IPv6']").parentElement.classList.remove("is-checked");
            getElementByXpath("//span[text() = 'Auto']").parentElement.classList.add("is-checked");
        }
    
        if (settings[KEY_SETTINGS_SHOW_FLAGS] == true) {
            document.getElementById("enableCountryFlags").parentElement.classList.add("is-checked");
        } else {
            document.getElementById("enableCountryFlags").parentElement.classList.remove("is-checked");
        }
        $('#enableCountryFlags').prop('checked', settings[KEY_SETTINGS_SHOW_FLAGS]);
    
    }, onError);
}