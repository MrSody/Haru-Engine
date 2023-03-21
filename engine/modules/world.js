class World {
    constructor () {
        this.listMaps = [];
        this.tileSize = 32;
        this.dataSpriteSheets;
    }

    initWorld () {
        let fs = require('fs');

        fs.readdirSync(__dirname +'/maps/')
        .filter(file => {
            this.listMaps.push(file.slice(0, -5));
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
        let size = {
                width: Math.ceil(width / this.tileSize),
                height: Math.ceil(height / this.tileSize)
            };
        let mapSize = {
                width: Math.round((width / 2) / this.tileSize),
                height: Math.round((height / 2) / this.tileSize)
            };
        let pos = {
                X: Math.floor(posPlayer.x - mapSize.width),
                Y: Math.floor(posPlayer.y - mapSize.height)
            };
        
        if (this.listMaps.includes(idMap.toString())) {

            let map = this.dataMap(idMap);

            return {
                capa1: this.desingMap(map.layers.find(data => data.name == "1").data, size, pos),
                capa2: this.desingMap(map.layers.find(data => data.name == "2").data, size, pos),
                capa3: this.desingMap(map.layers.find(data => data.name == "3").data, size, pos),
                capa4: this.desingMap(map.layers.find(data => data.name == "4").data, size, pos),
                capa5: this.desingMap(map.layers.find(data => data.name == "5").data, size, pos),
                capa6: this.desingMap(map.layers.find(data => data.name == "6").data, size, pos),
                collision: this.desingMap(map.layers.find(data => data.name == "collision").data, size, pos)
            };
        } else {
            console.log(`Error: world.js - getMap: Id Map: ${idMap} not found `);
            return false;
        }
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

    getMaps (posMapX, posMapY) {
        let sizeMap = 3;
        let posWorld = {
                X: posMapX - 1,
                Y: posMapY - 1
            };
        let map = [];

        for (let Y = 0; Y < sizeMap; Y++) {
            for (let X = 0; X < sizeMap; X++) {
                map.push(this.world[posWorld.Y + Y][posWorld.X + X]);
            }
        }

        return map;
    }
}
    
exports.World = World;