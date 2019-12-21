/* ------------------------------ *
    MUNDO
 * ------------------------------ */
var Level = function() {
    var mapCapaOne = [],
        mapCapaTwo = [],
        mapCapaThree = [],
        mapCapaFour = [],
        mapCapaFive = [],
        mapCapaCollision = [],
        worldSize = 3,  // El tamaño del mundo en tiles de sprite
        tileSize = 32,  // Tamaño de los tiles en pixeles

        // MUNDO TOTAL
        world = [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]
                ];

    // TRAES LOS DATOS DE LA CAPA
    function dataMapCapa(ruta) {
        // Defining the JSON File
        var files = require("fs");

        // Getting the content from the file
        var conts = files.readFileSync(ruta);
        // Definition to the JSON type and return
        return JSON.parse(conts);
    };

    function listToMatrix(vector) {
        var matrix = [], i, k;
        for (i = 0, k = -1; i < vector.length; i++) {
            if (i % 32 === 0) {
                k++;
                matrix[k] = [];
            }

            matrix[k].push(vector[i]);
        }
        return matrix;
    };

    function vectorX(capa, x, y) {
        var dataCapa, jsonCapa;

        switch(capa) {
            case 1:
                dataCapa = dataMapCapa("./Motor/Modulos/Maps/"+ world[Math.floor(y / tileSize)][x] +".json");
                jsonCapa = dataCapa.layers[0].data;
                break;

            case 2:
                dataCapa = dataMapCapa("./Motor/Modulos/Maps/"+ world[Math.floor(y / tileSize)][x] +".json");
                jsonCapa = dataCapa.layers[1].data;
                break;

            case 3:
                dataCapa = dataMapCapa("./Motor/Modulos/Maps/"+ world[Math.floor(y / tileSize)][x] +".json");
                jsonCapa = dataCapa.layers[2].data;
                break;

            case 4:
                dataCapa = dataMapCapa("./Motor/Modulos/Maps/"+ world[Math.floor(y / tileSize)][x] +".json");
                jsonCapa = dataCapa.layers[3].data;
                break;

            case 5:
                dataCapa = dataMapCapa("./Motor/Modulos/Maps/"+ world[Math.floor(y / tileSize)][x] +".json");
                jsonCapa = dataCapa.layers[4].data;
                break;

            case 6:
                dataCapa = dataMapCapa("./Motor/Modulos/Maps/"+ world[Math.floor(y / tileSize)][x] +".json");
                jsonCapa = dataCapa.layers[5].data;
                break;
        }

        var matrix = listToMatrix(jsonCapa);


        if(y < tileSize) {
            return matrix[y];
        } else {
            return matrix[Math.floor(y - (tileSize * Math.floor(y / tileSize)))];
        }
    };

    function CapaOne() {
        for(var y = 0; y < (worldSize * tileSize); y++) {
            var Q = [];
            for(var x = 0; x <= worldSize; x++) {
                if(x === worldSize) {
                    mapCapaOne.push(Q);
                } else {
                    Q = Q.concat(vectorX(1, x, y));
                }
            }
        }
    };

    function CapaTwo() {
        for(var y = 0; y < (worldSize * tileSize); y++) {
            var Q = [];
            for(var x = 0; x <= worldSize; x++) {
                if(x === worldSize) {
                    mapCapaTwo.push(Q);
                } else {
                    Q = Q.concat(vectorX(2, x, y));
                }
            }
        }
    };

    function CapaThree() {
        for(var y = 0; y < (worldSize * tileSize); y++) {
            var Q = [];
            for(var x = 0; x <= worldSize; x++) {
                if(x === worldSize) {
                    mapCapaThree.push(Q);
                } else {
                    Q = Q.concat(vectorX(3, x, y));
                }
            }
        }
    };

    function CapaFour() {
        for(var y = 0; y < (worldSize * tileSize); y++) {
            var Q = [];
            for(var x = 0; x <= worldSize; x++) {
                if(x === worldSize) {
                    mapCapaFour.push(Q);
                } else {
                    Q = Q.concat(vectorX(4, x, y));
                }
            }
        }
    };

    function CapaFive() {
        for(var y = 0; y < (worldSize * tileSize); y++) {
            var Q = [];
            for(var x = 0; x <= worldSize; x++) {
                if(x === worldSize) {
                    mapCapaFive.push(Q);
                } else {
                    Q = Q.concat(vectorX(5, x, y));
                }
            }
        }
    };

    //  DISEÑA EL MAPA CAPAS - 100%
    function desingMapCapa(width, height, capa, posPlayer, posMap) {
        var widthMap, heightMap, x, y, sizeWith, sizeHeight;
        var map = [[]];

        sizeWith = Math.round(width / 32);
        sizeHeight = Math.round(height / 32);
        widthMap = Math.round((width / 2) / 32);
        heightMap = Math.round((height / 2) / 32);
        x = Math.floor(((posMap.x * tileSize) + posPlayer.x) - widthMap);
        y = Math.floor(((posMap.y * tileSize) + posPlayer.y) - heightMap);

        for (var mapY = 0; mapY < (sizeHeight + 1); mapY++) {
            map[mapY] = [];
            for (var mapX = 0; mapX < (sizeWith + 1); mapX++) {
                map[mapY][mapX] = capa[y + mapY][x + mapX];
            }
        }

        return map;
    }

    // COLISIONES
    function CapaCollision() {
        for(var y = 0; y < (worldSize * tileSize); y++) {
            var Q = [];
            for(var x = 0; x <= worldSize; x++) {
                if(x === worldSize) {
                    mapCapaCollision.push(Q);
                } else {
                    Q = Q.concat(vectorX(6, x, y));
                }
            }
        }
    };

    // DISEÑA EL MAPA DE COLISIONES - 100%
    function desingMapCollision(width, height, capa, posPlayer, posMap) {
        var widthMap, heightMap, x, y, sizeWith, sizeHeight;
        var map = [[]];

        sizeWith = Math.round(width / 32);
        sizeHeight = Math.round(height / 32);
        widthMap = Math.round((width / 2) / 32);
        heightMap = Math.round((height / 2) / 32);
        x = Math.floor(((posMap.x * tileSize) + posPlayer.x) - widthMap);
        y = Math.floor(((posMap.y * tileSize) + posPlayer.y) - heightMap);

        for (var mapY = 0; mapY < (sizeHeight + 1); mapY++) {
            map[mapY] = [];
            for (var mapX = 0; mapX < (sizeWith + 1); mapX++){
                num = capa[y + mapY][x + mapX];
                if(num != 0) {
                    map[mapY][mapX] = 1;
                } else {
                    map[mapY][mapX] = 0;
                }
            }
        }

        return map;
    }

    var init = function() {
        // Link level
        level = this;

        // Carga Capas
        CapaOne();
        CapaTwo();
        CapaThree();
        CapaFour();
        CapaFive();
        CapaCollision();
    };

	var getWorld = function() {
		return world;
	};

    var getMap = function(width, height, posPlayer, posMap) {
        var capa1 = desingMapCapa(width, height, mapCapaOne, posPlayer, posMap),
            capa2 = desingMapCapa(width, height, mapCapaTwo, posPlayer, posMap),
            capa3 = desingMapCapa(width, height, mapCapaThree, posPlayer, posMap),
            capa4 = desingMapCapa(width, height, mapCapaFour, posPlayer, posMap),
            capa5 = desingMapCapa(width, height, mapCapaFive, posPlayer, posMap),
            capaCollision = desingMapCollision(width, height, mapCapaCollision, posPlayer, posMap);

        return {capa1: capa1, capa2: capa2, capa3: capa3, capa4: capa4, capa5: capa5, collision: capaCollision};
    }

	var getWorldSize = function() {
		return worldSize;
	};

	var getTileSize = function() {
		return tileSize;
	};

	// Which variables and methods can be accessed
	return {
		init: init,
        getWorld: getWorld,
        // RETORNA LAS CAPAS Y COLISIONES DEL MUNDO
        getMap: getMap,
		getWorldSize: getWorldSize,
		getTileSize: getTileSize,
	}
};

exports.Level = Level;
