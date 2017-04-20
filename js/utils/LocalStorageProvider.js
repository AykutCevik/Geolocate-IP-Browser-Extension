/**
 * localStorage abstraction class
 * @returns {LocalStorageProvider}
 */
function LocalStorageProvider() {
    /**
     * Saves an object
     * @param {String} key
     * @param {Object} object
     * @returns {void}
     */
    this.set = function(key, object) {
        localStorage[key] = JSON.stringify(object);
    };
    /**
     * 
     * @param {String} key
     * @returns {Object} According to you input
     */
    this.get = function(key) {
        return JSON.parse(localStorage[key]);
    };
    /**
     * Checks whether an key is set or not
     * @param {String} key
     * @returns {Boolean} true, if the key exists
     */
    this.isSet = function(key) {
        return key in localStorage;
    };
    /**
     * 
     * @param {String} key
     * @returns {void}
     */
    this.remove = function(key) {
        localStorage.removeItem(key);
    };
    /**
     * 
     * @returns {void}
     */
    this.removeAll = function() {
        localStorage.clear();
    };
}