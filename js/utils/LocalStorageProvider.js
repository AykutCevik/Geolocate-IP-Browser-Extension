function LocalStorageProvider() {
    this.set = function(key, object) {
        return new Promise((resolve, reject) => {
            let item = {};
            item[key] = JSON.stringify(object);
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.set(item, resolve);
            } else {
                chrome.runtime.sendMessage({method: "set", key: key, value: item[key]}, (response) => {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve();
                    }
                });
            }
        });
    };

    this.get = function(key) {
        return new Promise((resolve, reject) => {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.get(key, function(result) {
                    if (result[key] !== undefined) {
                        resolve(JSON.parse(result[key]));
                    } else {
                        resolve(null);
                    }
                });
            } else {
                chrome.runtime.sendMessage({method: "get", key: key}, (response) => {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        if (response.data !== undefined) {
                            resolve(JSON.parse(response.data));
                        } else {
                            resolve(null);
                        }
                    }
                });
            }
        });
    };

    this.isSet = function(key) {
        return new Promise((resolve, reject) => {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.get(key, function(result) {
                    resolve(key in result);
                });
            } else {
                chrome.runtime.sendMessage({method: "isSet", key: key}, (response) => {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response.data);
                    }
                });
            }
        });
    };

    this.remove = function(key) {
        return new Promise((resolve, reject) => {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.remove(key, resolve);
            } else {
                chrome.runtime.sendMessage({method: "remove", key: key}, (response) => {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve();
                    }
                });
            }
        });
    };
}