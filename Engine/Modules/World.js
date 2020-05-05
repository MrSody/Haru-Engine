class World {
    constructor (orderMaps) {
        this.mapCapaOne = [];
        this.mapCapaTwo = [];
        this.mapCapaThree = [];
        this.mapCapaFour = [];
        this.mapCapaFive = [];
        this.mapCapaCollision = [];
        this.worldSize = 3;  // El tamaño del mundo en tiles de sprite
        this.tileSize = 32;  // Tamaño de los tiles en pixeles

        // MUNDO TOTAL
        this.world = orderMaps;

        // Carga Capas
        this.CapaOne();
        this.CapaTwo();
        this.CapaThree();
        this.CapaFour();
        this.CapaFive();
        this.CapaCollision();
    }

    // TRAES LOS DATOS DE LA CAPA
    dataMapCapa (ruta) {
        // Defining the JSON File
        const files = require('fs'), conts = files.readFileSync(ruta);

        return JSON.parse(conts);
    }

    listToMatrix (vector) {
        let matrix = [], i, k;
        for (i = 0, k = -1; i < vector.length; i++) {
            if (i % 32 === 0) {
                k++;
                matrix[k] = [];
            }

            matrix[k].push(vector[i]);
        }
        return matrix;
    }

    vectorX (capa, x, y) {
        let dataCapa, jsonCapa, matrix;

        switch (capa) {
            case 1:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(y / this.tileSize)][x] +'.json');
                jsonCapa = dataCapa.layers[0].data;
                break;

            case 2:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(y / this.tileSize)][x] +'.json');
                jsonCapa = dataCapa.layers[1].data;
                break;

            case 3:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(y / this.tileSize)][x] +'.json');
                jsonCapa = dataCapa.layers[2].data;
                break;

            case 4:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(y / this.tileSize)][x] +'.json');
                jsonCapa = dataCapa.layers[3].data;
                break;

            case 5:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(y / this.tileSize)][x] +'.json');
                jsonCapa = dataCapa.layers[4].data;
                break;

            case 6:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(y / this.tileSize)][x] +'.json');
                jsonCapa = dataCapa.layers[5].data;
                break;
        }

        matrix = this.listToMatrix(jsonCapa);

        if (y < this.tileSize) {
            return matrix[y];
        } else {
            return matrix[Math.floor(y - (this.tileSize * Math.floor(y / this.tileSize)))];
        }
    }

    CapaOne () {
        for (let y = 0; y < (this.worldSize * this.tileSize); y++) {
            let Q = [];
            for (let x = 0; x <= this.worldSize; x++) {
                if(x === this.worldSize) {
                    this.mapCapaOne.push(Q);
                } else {
                    Q = Q.concat(this.vectorX(1, x, y));
                }
            }
        }
    }

    CapaTwo () {
        for (let y = 0; y < (this.worldSize * this.tileSize); y++) {
            let Q = [];
            for (let x = 0; x <= this.worldSize; x++) {
                if(x === this.worldSize) {
                    this.mapCapaTwo.push(Q);
                } else {
                    Q = Q.concat(this.vectorX(2, x, y));
                }
            }
        }
    }

    CapaThree () {
        for (let y = 0; y < (this.worldSize * this.tileSize); y++) {
            let Q = [];
            for (let x = 0; x <= this.worldSize; x++) {
                if(x === this.worldSize) {
                    this.mapCapaThree.push(Q);
                } else {
                    Q = Q.concat(this.vectorX(3, x, y));
                }
            }
        }
    }

    CapaFour () {
        for (let y = 0; y < (this.worldSize * this.tileSize); y++) {
            let Q = [];
            for (let x = 0; x <= this.worldSize; x++) {
                if(x === this.worldSize) {
                    this.mapCapaFour.push(Q);
                } else {
                    Q = Q.concat(this.vectorX(4, x, y));
                }
            }
        }
    }

    CapaFive () {
        for (let y = 0; y < (this.worldSize * this.tileSize); y++) {
            let Q = [];
            for (let x = 0; x <= this.worldSize; x++) {
                if(x === this.worldSize) {
                    this.mapCapaFive.push(Q);
                } else {
                    Q = Q.concat(this.vectorX(5, x, y));
                }
            }
        }
    }

    //  DISEÑA EL MAPA CAPAS - 100%
    desingMapCapa (width, height, capa, posPlayer, posMap) {
        let widthMap, heightMap, x, y, sizeWith, sizeHeight, map = [[]];

        sizeWith = Math.round(width / 32);
        sizeHeight = Math.round(height / 32) + 1;
        widthMap = Math.round((width / 2) / 32);
        heightMap = Math.round((height / 2) / 32) + 1;
        x = Math.floor(((posMap.x * this.tileSize) + posPlayer.x) - widthMap);
        y = Math.floor(((posMap.y * this.tileSize) + posPlayer.y) - heightMap);

        //console.log("x "+ x +" y "+ y +" sizeWith "+ sizeWith +" sizeHeight "+ sizeHeight +" widthMap "+ widthMap +" heightMap "+ heightMap);

        for (let mapY = 0; mapY < (sizeHeight + 1); mapY++) {
            map[mapY] = [];
            for (let mapX = 0; mapX < (sizeWith + 1); mapX++) {
                map[mapY][mapX] = capa[y + mapY][x + mapX];
            }
        }
	
        return map;
    }

    // COLISIONES
    CapaCollision () {
        for (let y = 0; y < (this.worldSize * this.tileSize); y++) {
            let Q = [];
            for (let x = 0; x <= this.worldSize; x++) {
                if(x === this.worldSize) {
                    this.mapCapaCollision.push(Q);
                } else {
                    Q = Q.concat(this.vectorX(6, x, y));
                }
            }
        }
    }

    // DISEÑA EL MAPA DE COLISIONES - 100%
    desingMapCollision (width, height, capa, posPlayer, posMap) {
        let widthMap, heightMap, x, y, sizeWith, sizeHeight, map = [[]];

        sizeWith = Math.round(width / 32);
        sizeHeight = Math.round(height / 32);
        widthMap = Math.round((width / 2) / 32);
        heightMap = Math.round((height / 2) / 32);
        x = Math.floor(((posMap.x * this.tileSize) + posPlayer.x) - widthMap);
        y = Math.floor(((posMap.y * this.tileSize) + posPlayer.y) - heightMap);

        for (let mapY = 0; mapY < (sizeHeight + 1); mapY++) {
            map[mapY] = [];
            for (let mapX = 0; mapX < (sizeWith + 1); mapX++){
                let num = capa[y + mapY][x + mapX];
                if(num != 0) {
                    map[mapY][mapX] = 1;
                } else {
                    map[mapY][mapX] = 0;
                }
            }
        }

        return map;
    }
    
    getMapCollision (start, end) {
        let capa = this.mapCapaCollision, map = [[]], initY = 0, initX = 0;
        
        console.log(start.x +"--"+ start.y +"----"+ end.x +"--"+ end.y);
        
        for (let y = start.y; y <= end.y; y++, initY++) {
            let x = start.x;
            initX = 0;
            map[initY] = [];
            for (x; x <= end.x; x++, initX++) {
                let num = capa[y][x];
                if(num != 0) {
                    map[initY][initX] = 1;
                } else {
                    map[initY][initX] = 0;
                }
            }
        }
        
        return map;
    }
    
	getWorld () {
		return this.world;
	}

    getMap (width, height, posPlayer, posMap) {
        return {
                    capa1: this.desingMapCapa(width, height, this.mapCapaOne, posPlayer, posMap),
                    capa2: this.desingMapCapa(width, height, this.mapCapaTwo, posPlayer, posMap),
                    capa3: this.desingMapCapa(width, height, this.mapCapaThree, posPlayer, posMap),
                    capa4: this.desingMapCapa(width, height, this.mapCapaFour, posPlayer, posMap),
                    capa5: this.desingMapCapa(width, height, this.mapCapaFive, posPlayer, posMap),
                    collision: this.desingMapCollision(width, height, this.mapCapaCollision, posPlayer, posMap)
                };
    }

	getWorldSize () {
		return this.worldSize;
	}

    getTileSize () {
		return this.tileSize;
	}
}

// Export the Player class so you can use it in other files by using require("Player").Player
exports.World = World;
