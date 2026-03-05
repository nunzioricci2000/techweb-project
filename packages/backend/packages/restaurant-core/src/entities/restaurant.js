import { User } from "@techweb-project/auth-core";

import Geolocation from "./data_objects/geolocation.js";
import Image from "./data_objects/image.js";

export default class Restaurant {
    /** @type {number} */
    id;

    /** @type {string} */
    name;

    /** @type {string} */
    description;

    /** @type {Geolocation} */
    geolocation;

    /** @type {Image} */
    image;

    /** @type {User} */
    owner;

    /**
     * @param {number} id
     * @param {string} name
     * @param {string} description
     * @param {Geolocation} geolocation
     * @param {Image} image
     * @param {User} owner
     */
    constructor(id, name, description, geolocation, image, owner) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.geolocation = geolocation;
        this.image = image;
        this.owner = owner;
    }
}