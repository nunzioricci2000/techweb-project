
export default class Geolocation {
    /** @type {number} */
    latitude;
    
    /** @type {number} */
    longitude;

    /**
     * @param {number} latitude
     * @param {number} longitude
     */
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
