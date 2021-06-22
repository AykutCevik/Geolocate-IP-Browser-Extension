$(window).on("load", function () {
    loadSettings();
    $('#btnSaveSettings').click(saveSettings);
});

function saveSettings() {
    var notificationSetting = $('#enableNotifications').prop('checked');
    var notificationIPv6Setting = $('#enableNotificationsIPv6').prop('checked');
    var badgeIndicator = $("input:radio[name ='indicator']:checked").val();
    var showFlags = $('#enableCountryFlags').prop('checked');

    var lp = new LocalStorageProvider();
    lp.set(KEY_SETTINGS_NOTIFICATION, notificationSetting);
    lp.set(KEY_SETTINGS_NOTIFICATION_IPv6, notificationIPv6Setting);
    lp.set(KEY_SETTINGS_COUNTRY_BADGE, badgeIndicator);
    lp.set(KEY_SETTINGS_SHOW_FLAGS, showFlags);
}

function loadSettings() {
    var lp = new LocalStorageProvider();
    if (!lp.isSet(KEY_SETTINGS_NOTIFICATION)) {
        lp.set(KEY_SETTINGS_NOTIFICATION, true);
    }

    if (!lp.isSet(KEY_SETTINGS_NOTIFICATION_IPv6)) {
        lp.set(KEY_SETTINGS_NOTIFICATION_IPv6, true);
    }

    if (!lp.isSet(KEY_SETTINGS_COUNTRY_BADGE)) {
        lp.set(KEY_SETTINGS_COUNTRY_BADGE, 'auto');
    }

    if (!lp.isSet(KEY_SETTINGS_SHOW_FLAGS)) {
        lp.set(KEY_SETTINGS_SHOW_FLAGS, true);
    }

    $('#enableNotifications').prop('checked', lp.get(KEY_SETTINGS_NOTIFICATION));
    $('#enableNotificationsIPv6').prop('checked', lp.get(KEY_SETTINGS_NOTIFICATION_IPv6));

    var badgeIndicator = lp.get(KEY_SETTINGS_COUNTRY_BADGE);
    $("input:radio[name ='indicator'][value='" + badgeIndicator + "']").prop('checked', true);

    $('#enableCountryFlags').prop('checked', lp.get(KEY_SETTINGS_SHOW_FLAGS));
}