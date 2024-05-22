const API_URL = 'https://ipv4.aykutcevik.com:9443';
const API_URL_IPv6 = 'https://ipv6.aykutcevik.com:8443';
class GeoLocation {
    constructor() {
        this.url = API_URL + '/api/ip';
        this.data = {
            browser: {
                userAgent: ''
            },
            geoLocation: {
                ipAddress: '',
                countryCode: '',
                countryName: '',
                city: '',
                state: '',
                stateCode: '',
                continent: '',
                continentCode: '',
                timezone: '',
                latitude: 0,
                longitude: 0
            }
        };
    }

    get(key) {
        return this.data[key];
    }

    fetch(options = {}) {
        fetch(this.url)
            .then(response => response.json())
            .then(data => {
                this.data = data;
                if (options.success) options.success();
            })
            .catch(error => {
                if (options.error) options.error();
            });
    }

    toJSON() {
        return JSON.parse(JSON.stringify(this.data));
    }
}

class GeoLocation6 {
    constructor() {
        this.url = API_URL_IPv6 + '/api/ip';
        this.data = {
            browser: {
                userAgent: ''
            },
            geoLocation: {
                ipAddress: '',
                countryCode: '',
                countryName: '',
                city: '',
                state: '',
                stateCode: '',
                continent: '',
                continentCode: '',
                timezone: '',
                latitude: 0,
                longitude: 0
            }
        };
    }

    get(key) {
        return this.data[key];
    }

    fetch(options = {}) {
        fetch(this.url)
            .then(response => response.json())
            .then(data => {
                this.data = data;
                if (options.success) options.success();
            })
            .catch(error => {
                if (options.error) options.error();
            });
    }

    toJSON() {
        return JSON.parse(JSON.stringify(this.data));
    }
}