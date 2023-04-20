class World {
    constructor () {
        this.listMaps = [];
        this.tileSize = 32;
        this.dataSpriteSheets = "";
    }

    initWorld () {
        let fs = require('fs');

        this.listMaps = fs.readdirSync(__dirname +'/maps/')
                        .map(file => {
                            return file.slice(0, -5);
                        });

        this.dataSpriteSheets = fs.readFileSync("./engine/sprite/map/tilemap.txt", 'utf-8');
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */


/* ------------------------------ *
    GETTERS
* ------------------------------ */
    getDataSpriteSheets () {
        return this.dataSpriteSheets;
    }
    
    getTileSize () {
        return this.tileSize;
    }

    getMap (idMap, width, height, posPlayer) {
        let dataScreen = this.desingScreen(width, height, posPlayer);
        
        if (!this.listMaps.includes(idMap.toString())) {
            return false;
        }

        let map = this.dataMap(idMap);

        return {
            capa1: this.desingMap(map.layers.find(data => data.name === "1").data, dataScreen.size, dataScreen.pos),
            capa2: this.desingMap(map.layers.find(data => data.name === "2").data, dataScreen.size, dataScreen.pos),
            capa3: this.desingMap(map.layers.find(data => data.name === "3").data, dataScreen.size, dataScreen.pos),
            capa4: this.desingMap(map.layers.find(data => data.name === "4").data, dataScreen.size, dataScreen.pos),
            capa5: this.desingMap(map.layers.find(data => data.name === "5").data, dataScreen.size, dataScreen.pos),
            capa6: this.desingMap(map.layers.find(data => data.name === "6").data, dataScreen.size, dataScreen.pos),
            collision: this.desingMap(map.layers.find(data => data.name === "collision").data, dataScreen.size, dataScreen.pos),
        };
    }

    getCoordinates (width, height, posPlayer) {
        let dataScreen = this.desingScreen(width, height, posPlayer),
            mapReturnX = [],
            mapReturnY = [];

        for (let mapY = 0; mapY <= dataScreen.size.height; mapY++) {
            for (let mapX = 0; mapX <= dataScreen.size.width; mapX++){
                mapReturnY.push(dataScreen.pos.Y + mapY);
                mapReturnX.push(dataScreen.pos.X + mapX);
            }
        }

        return {x: mapReturnX, y: mapReturnY};
    }

/* ------------------------------ *
    FUNCTIONS
* ------------------------------ */
    dataFileJSON (ruta) {
        let files = require('fs');

        return JSON.parse(files.readFileSync(ruta));
    }

    dataMap (idMap) {
        return this.dataFileJSON(`./engine/modules/maps/${idMap}.json`);
    }

    desingMap (capa, size, pos) {
        let map = [[]];

        for (let mapY = 0; mapY <= size.height; mapY++) {
            map[mapY] = [];
            for (let mapX = 0; mapX <= size.width; mapX++){
                map[mapY][mapX] = capa[pos.Y + mapY][pos.X + mapX];
            }
        }

        return map;
    }

    desingScreen (width, height, posPlayer) {
        let size = {
                width: Math.ceil(width / this.tileSize),
                height: Math.ceil(height / this.tileSize)
            },
            mapSize = {
                width: Math.round((width / 2) / this.tileSize),
                height: Math.round((height / 2) / this.tileSize)
            },
            pos = {
                X: Math.floor(posPlayer.x - mapSize.width),
                Y: Math.floor(posPlayer.y - mapSize.height)
            };

        return {size: size, pos: pos};
    }
}
    
exports.World = World;