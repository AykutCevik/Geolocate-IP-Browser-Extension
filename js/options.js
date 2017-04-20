$(document).ready(function () {
    loadSettings();
    $('#btnSaveSettings').click(saveSettings);
});

function saveSettings() {
    var notificationSetting = $('#enableNotifications').prop('checked');
    var gmapsSetting = $('#showGoogleMaps').prop('checked');

    var lp = new LocalStorageProvider();
    lp.set(KEY_SETTINGS_NOTIFICATION, notificationSetting);
    lp.set(KEY_SETTINGS_GMAPS, gmapsSetting);
}

function loadSettings() {
    var lp = new LocalStorageProvider();
    if (!lp.isSet(KEY_SETTINGS_NOTIFICATION)) {
        lp.set(KEY_SETTINGS_NOTIFICATION, true);
    }
    if (!lp.isSet(KEY_SETTINGS_GMAPS)) {
        lp.set(KEY_SETTINGS_GMAPS, true);
    }

    $('#enableNotifications').prop('checked', lp.get(KEY_SETTINGS_NOTIFICATION));
    $('#showGoogleMaps').prop('checked', lp.get(KEY_SETTINGS_GMAPS));
}