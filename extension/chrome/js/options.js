$(document).ready(function () {
    loadSettings();
    $('#btnSaveSettings').click(saveSettings);
});

function saveSettings() {
    var notificationSetting = $('#enableNotifications').prop('checked');

    var lp = new LocalStorageProvider();
    var notificationsEnabled = lp.set(KEY_SETTINGS_NOTIFICATION, notificationSetting);
}

function loadSettings() {
    var lp = new LocalStorageProvider();
    if (!lp.isSet(KEY_SETTINGS_NOTIFICATION)) {
        lp.set(KEY_SETTINGS_NOTIFICATION, true);
    }

    var notificationsEnabled = lp.get(KEY_SETTINGS_NOTIFICATION);
    $('#enableNotifications').prop('checked', notificationsEnabled);
}