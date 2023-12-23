export default class Helpers {

    static setLoadImage (dataImage) {
        let imagen = new Image();
        imagen.src = dataImage;

        return imagen;
    }
}