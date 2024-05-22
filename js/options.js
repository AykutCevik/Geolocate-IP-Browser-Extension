window.addEventListener("load", function () {
    loadSettings();
    document.getElementById('btnSaveSettings').addEventListener('click', saveSettings);
});

async function saveSettings() {
    const lp = new LocalStorageProvider();

    let notificationSetting = document.getElementById('enableNotifications').checked;
    let notificationIPv6Setting = document.getElementById('enableNotificationsIPv6').checked;
    let badgeIndicator = document.querySelector("input[name='indicator']:checked").value;
    let showFlags = document.getElementById('enableCountryFlags').checked;

    await lp.set(KEY_SETTINGS_NOTIFICATION, notificationSetting);
    await lp.set(KEY_SETTINGS_NOTIFICATION_IPv6, notificationIPv6Setting);
    await lp.set(KEY_SETTINGS_COUNTRY_BADGE, badgeIndicator);
    await lp.set(KEY_SETTINGS_SHOW_FLAGS, showFlags);
}

async function loadSettings() {
    const lp = new LocalStorageProvider();
    if (!(await lp.isSet(KEY_SETTINGS_NOTIFICATION))) {
        await lp.set(KEY_SETTINGS_NOTIFICATION, true);
    }

    if (!(await lp.isSet(KEY_SETTINGS_NOTIFICATION_IPv6))) {
        await lp.set(KEY_SETTINGS_NOTIFICATION_IPv6, true);
    }

    if (!(await lp.isSet(KEY_SETTINGS_COUNTRY_BADGE))) {
        await lp.set(KEY_SETTINGS_COUNTRY_BADGE, 'auto');
    }

    if (!(await lp.isSet(KEY_SETTINGS_SHOW_FLAGS))) {
        await lp.set(KEY_SETTINGS_SHOW_FLAGS, true);
    }

    let notificationSetting = await lp.get(KEY_SETTINGS_NOTIFICATION);
    document.getElementById('enableNotifications').checked = notificationSetting;

    let notificationIPv6Setting = await lp.get(KEY_SETTINGS_NOTIFICATION_IPv6);
    document.getElementById('enableNotificationsIPv6').checked = notificationIPv6Setting;

    let badgeIndicator = await lp.get(KEY_SETTINGS_COUNTRY_BADGE);
    document.querySelector(`input[name='indicator'][value='${badgeIndicator}']`).checked = true;

    let showFlags = await lp.get(KEY_SETTINGS_SHOW_FLAGS);
    document.getElementById('enableCountryFlags').checked = showFlags;
}