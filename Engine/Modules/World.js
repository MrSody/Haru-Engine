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
        this.addCapas(1);
        this.addCapas(2);
        this.addCapas(3);
        this.addCapas(4);
        this.addCapas(5);
        this.addCapas(6);
    }

    // TRAES LOS DATOS DE LA CAPA
    dataMapCapa (ruta) {
        // Defining the JSON File
        let files = require('fs'),
            conts = files.readFileSync(ruta);

        return JSON.parse(conts);
    }

    listToMatrix (vector) {
        let matrix = [], count, column;
        for (count = 0, column = -1; count < vector.length; count++) {
            if (count % this.tileSize === 0) {
                column++;
                matrix[column] = [];
            }

            matrix[column].push(vector[count]);
        }
        return matrix;
    }

    vectorX (capa, X, Y) {
        let dataCapa, jsonCapa, matrix;

        switch (capa) {
            case 1:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(Y / this.tileSize)][X] +'.json');
                jsonCapa = dataCapa.layers[0].data;
                break;

            case 2:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(Y / this.tileSize)][X] +'.json');
                jsonCapa = dataCapa.layers[1].data;
                break;

            case 3:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(Y / this.tileSize)][X] +'.json');
                jsonCapa = dataCapa.layers[2].data;
                break;

            case 4:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(Y / this.tileSize)][X] +'.json');
                jsonCapa = dataCapa.layers[3].data;
                break;

            case 5:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(Y / this.tileSize)][X] +'.json');
                jsonCapa = dataCapa.layers[4].data;
                break;

            case 6:
                dataCapa = this.dataMapCapa('./Engine/Modules/Maps/'+ this.world[Math.floor(Y / this.tileSize)][X] +'.json');
                jsonCapa = dataCapa.layers[5].data;
                break;
        }

        matrix = this.listToMatrix(jsonCapa);

        if (Y < this.tileSize) {
            return matrix[Y];
        } else {
            return matrix[Math.floor(Y - (this.tileSize * Math.floor(Y / this.tileSize)))];
        }
    }

    addLineCapa (numCapa, lineCapa) {
        switch (numCapa) {
            case 1:
                this.mapCapaOne.push(lineCapa);
                break;

            case 2:
                this.mapCapaTwo.push(lineCapa);
                break;

            case 3:
                this.mapCapaThree.push(lineCapa);
                break;

            case 4:
                this.mapCapaFour.push(lineCapa);
                break;

            case 5:
                this.mapCapaFive.push(lineCapa);
                break;

            case 6:
                this.mapCapaCollision.push(lineCapa);
                break;
        }
    }

    addCapas (numCapa) {
        for (let Y = 0; Y < (this.worldSize * this.tileSize); Y++) {
            let lineCapa = [];
            for (let X = 0; X <= this.worldSize; X++) {
                if(X === this.worldSize) {
                    this.addLineCapa(numCapa, lineCapa);
                } else {
                    lineCapa = lineCapa.concat(this.vectorX(numCapa, X, Y));
                }
            }
        }
    }

    //  DISEÑA EL MAPA CAPAS - 100%
    desingMapCapa (capa, size, pos) {
        let map = [[]];

        for (let mapY = 0; mapY < (size.height + 1); mapY++) {
            map[mapY] = [];
            for (let mapX = 0; mapX < (size.width + 1); mapX++) {
                map[mapY][mapX] = capa[pos.Y + mapY][pos.X + mapX];
            }
        }
	
        return map;
    }

    // DISEÑA EL MAPA DE COLISIONES - 100%
    desingMapCollision (capa, size, pos) {
        let map = [[]];

        for (let mapY = 0; mapY < (size.height + 1); mapY++) {
            map[mapY] = [];
            for (let mapX = 0; mapX < (size.width + 1); mapX++){
                if(capa[pos.Y + mapY][pos.X + mapX] != 0) {
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
        let size = {
            width: Math.round(width / 32),
            height: Math.round(height / 32) + 1
        },
        mapSize = {
            width: Math.round((width / 2) / 32),
            height: Math.round((height / 2) / 32) + 1
        },
        pos = {
            X: Math.floor(((posMap.x * this.tileSize) + posPlayer.x) - mapSize.width),
            Y: Math.floor(((posMap.y * this.tileSize) + posPlayer.y) - mapSize.height)
        };

        return {
            capa1: this.desingMapCapa(this.mapCapaOne, size, pos),
            capa2: this.desingMapCapa(this.mapCapaTwo, size, pos),
            capa3: this.desingMapCapa(this.mapCapaThree, size, pos),
            capa4: this.desingMapCapa(this.mapCapaFour, size, pos),
            capa5: this.desingMapCapa(this.mapCapaFive, size, pos),
            collision: this.desingMapCollision(this.mapCapaCollision, size, pos)
        };
    }

	getWorldSize () {
		return this.worldSize;
	}

    getTileSize () {
		return this.tileSize;
    }

    getTest (X, Y) {
        if ((63 <= X || 24 <= X) && (15 <= Y || 54 <= Y)){
            return 1;
        } else {
            return 0;
        }
    }
}

exports.World = World;