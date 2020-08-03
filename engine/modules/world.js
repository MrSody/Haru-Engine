class World {
    constructor (orderMaps) {
        this.worldCapaOne = [];
        this.worldCapaTwo = [];
        this.worldCapaThree = [];
        this.worldCapaFour = [];
        this.worldCapaFive = [];
        this.worldCapaCollision = [];

        // MUNDO TOTAL
        this.world = orderMaps;

        this.worldSize = { x: this.world[0].length, y: this.world.length }; // El tamaño del mundo en tiles de sprite
        this.tileSize = 32;  // Tamaño de los tiles en pixeles
    }

    // INIZIALIZA EL WORLD
    initWorld () {
        this.worldCapaOne = this.desingWorld(0);
        this.worldCapaTwo = this.desingWorld(1);
        this.worldCapaThree = this.desingWorld(2);
        this.worldCapaFour = this.desingWorld(3);
        this.worldCapaFive = this.desingWorld(4);
        this.worldCapaCollision = this.desingWorld(5);
    }

    getDataSpriteSheets () {
        return this.getFile('./engine/sprite/map/tileset_konoha_naruto_by_zewiskaaz-d55puro.txt');
    }

    // TRAES LOS DATOS DE LA CAPA
    getFileJSON (ruta) {
        // Defining the JSON File
        let files = require('fs');

        return JSON.parse(files.readFileSync(ruta));
    }

    getFile (ruta) {
        // Defining the JSON File
        let files = require('fs');

        return files.readFileSync(ruta, 'utf-8');
    }

    // Diseña el mapa completo y retorna una matriz
    desingWorld (numCapa) {
        let capa = [[]];

        for (let Y = 0; Y < (this.worldSize.y * this.tileSize); Y++) {
            let lineCapa = [];
            capa[Y] = [];
            for (let X = 0; X <= this.worldSize.x; X++) {
                if(X === this.worldSize.x) {
                    capa[Y] = lineCapa;
                } else {
                    lineCapa = lineCapa.concat(this.dataCapa(numCapa, X, Y));
                }
            }
        }

        return capa;
    }
    
    // Convierte el array ingresado en una matriz y lo retorna
    listToMatrix (vector) {
        let matrix = [];
        let count;
        let column;

        for (count = 0, column = -1; count < vector.length; count++) {
            if (count % this.tileSize === 0) {
                column++;
                matrix[column] = [];
            }

            matrix[column].push(vector[count]);
        }
        return matrix;
    }

    // Busca la capa y la envia para convertirla en matriz y retorna un array de la linea del mapa
    dataCapa (numCapa, X, Y) {
        let dataCapa = this.getFileJSON(`./engine/modules/maps/${this.world[Math.floor(Y / this.tileSize)][X]}.json`);
        let jsonCapa = dataCapa.layers[numCapa].data;
        let matrix = this.listToMatrix(jsonCapa);
    
        if (Y < this.tileSize) {
            return matrix[Y];
        } else {
            return matrix[Math.floor(Y - (this.tileSize * Math.floor(Y / this.tileSize)))];
        }
    }
    
    //  DISEÑA EL MAPA CAPAS - 100%
    desingMap (capa, size, pos) {
        let map = [[]];

        for (let mapY = 0; mapY < (size.height + 1); mapY++) {
            map[mapY] = [];
            for (let mapX = 0; mapX < (size.width + 1); mapX++){
                map[mapY][mapX] = capa[pos.Y + mapY][pos.X + mapX];
            }
        }

        return map;
    }
    
    getMap (width, height, posPlayerX, posPlayerY, posMapX, posMapY) {
        let size = {
                width: Math.round(width / 32),
                height: Math.round(height / 32) + 1
            };
        let mapSize = {
                width: Math.round((width / 2) / 32),
                height: Math.round((height / 2) / 32) + 1
            };
        let pos = {
                X: Math.floor(((posMapX * this.tileSize) + posPlayerX) - mapSize.width),
                Y: Math.floor(((posMapY * this.tileSize) + posPlayerY) - mapSize.height)
            };

        return {
                capa1: this.desingMap(this.worldCapaOne, size, pos),
                capa2: this.desingMap(this.worldCapaTwo, size, pos),
                capa3: this.desingMap(this.worldCapaThree, size, pos),
                capa4: this.desingMap(this.worldCapaFour, size, pos),
                capa5: this.desingMap(this.worldCapaFive, size, pos),
                collision: this.desingMap(this.worldCapaCollision, size, pos)
        };
    }

    getWorld () {
        return this.world;
    }
    
    getWorldSize () {
        return this.worldSize;
    }
    
    getTileSize () {
        return this.tileSize;
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