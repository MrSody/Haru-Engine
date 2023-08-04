const fs = require('fs');

class World {
    /** @type {number} */
    #tileSize = 32

    constructor () {
        /** @type {Array.<number>} */
        this.listMaps = fs.readdirSync(__dirname +'/maps/')
                        .map(file => {
                            return file.slice(0, -5);
                        });

        /** @type {string} */
        this.dataSpriteSheets = fs.readFileSync("./engine/sprite/map/tilemap.txt", 'utf-8');
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */


/* ------------------------------ *
    GETTERS
* ------------------------------ */
    /**
     * @type {number}
     */
    get tileSize () {
        return this.#tileSize;
    }

    /**
     * @param {number} idMap
     * @param {number} width
     * @param {number} height
     * @param {{X: number; Y: number;}} posPlayer
     * @returns {(false | { capa1: [[]]; capa2: [[]]; capa3: [[]]; capa4: [[]]; capa5: [[]]; capa6: [[]]; collision: [[]]; })}
     */
    getMap (idMap, width, height, posPlayer) {
        let dataScreen = this.#desingScreen(width, height, posPlayer);
        
        if (!this.listMaps.includes(idMap.toString())) {
            return false;
        }

        let map = this.#dataMap(idMap);

        return {
            capa1: this.#desingMap(map.layers.find(data => data.name === "1").data, dataScreen.size, dataScreen.pos),
            capa2: this.#desingMap(map.layers.find(data => data.name === "2").data, dataScreen.size, dataScreen.pos),
            capa3: this.#desingMap(map.layers.find(data => data.name === "3").data, dataScreen.size, dataScreen.pos),
            capa4: this.#desingMap(map.layers.find(data => data.name === "4").data, dataScreen.size, dataScreen.pos),
            capa5: this.#desingMap(map.layers.find(data => data.name === "5").data, dataScreen.size, dataScreen.pos),
            capa6: this.#desingMap(map.layers.find(data => data.name === "6").data, dataScreen.size, dataScreen.pos),
            collision: this.#desingMap(map.layers.find(data => data.name === "collision").data, dataScreen.size, dataScreen.pos),
        };
    }

    /**
     * @param {number} width
     * @param {number} height
     * @param {{X: number; Y: number;}} posPlayer
     * @returns {{ X: {number}; Y: {number}; }}
     */
    getCoordinates (width, height, posPlayer) {
        let dataScreen = this.#desingScreen(width, height, posPlayer),
            mapReturnX = [],
            mapReturnY = [];

        for (let mapY = 0; mapY <= dataScreen.size.height; mapY++) {
            for (let mapX = 0; mapX <= dataScreen.size.width; mapX++){
                mapReturnY.push(dataScreen.pos.Y + mapY);
                mapReturnX.push(dataScreen.pos.X + mapX);
            }
        }

        return {X: mapReturnX, Y: mapReturnY};
    }

/* ------------------------------ *
    FUNCTIONS
* ------------------------------ */
    /**
     * @private
     * @param {number} idMap
     * @returns {JSON}
     */
    #dataMap (idMap) {
        let files = require('fs');

        return JSON.parse(files.readFileSync(`./engine/modules/maps/${idMap}.json`));
    }

    /**
     * @private
     * @param {Array} capa
     * @param {number} size
     * @param {{ X: number; Y: number; }} pos
     * @returns {{}}
     */
    #desingMap (capa, size, pos) {
        let map = [[]];

        for (let mapY = 0; mapY <= size.height; mapY++) {
            map[mapY] = [];
            for (let mapX = 0; mapX <= size.width; mapX++){
                map[mapY][mapX] = capa[pos.Y + mapY][pos.X + mapX];
            }
        }

        return map;
    }

    /**
     * @private
     * @param {number} width
     * @param {number} height
     * @param {{X: number; Y: number;}} posPlayer
     * @returns {{ size: { width: number; height: number; }; pos: { X: number; Y: number; }; }}
     */
    #desingScreen (width, height, posPlayer) {
        let size = {
                width: Math.ceil(width / this.tileSize),
                height: Math.ceil(height / this.tileSize),
            },
            mapSize = {
                width: Math.round((width / 2) / this.tileSize),
                height: Math.round((height / 2) / this.tileSize),
            },
            pos = {
                X: Math.floor(posPlayer.X - mapSize.width),
                Y: Math.floor(posPlayer.Y - mapSize.height),
            };

        return {size: size, pos: pos};
    }
}
    
exports.World = World;