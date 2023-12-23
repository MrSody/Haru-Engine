export default class Enums {
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