export default class Helpers {

    static setLoadImage (dataImage) {
        let imagen = new Image();
        imagen.src = dataImage;

        return imagen;
    }

    /**
     * 
     * @return @enum {number}
     */
    static directions () {
        return Object.freeze({
                    Up: 0,
                    Right: 1,
                    Down: 2,
                    Left: 3,
                });
    }
}