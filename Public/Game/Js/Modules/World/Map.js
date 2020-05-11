class Map {
    constructor () {
        this.capaOne;
        this.capaTwo;
        this.capaThree;
        this.capaFour;
        this.capaFive;
        this.collision;
        this.spriteSheetCapa; // Nombre de las imagenes de cada capa
        this.spriteSheet; // Image() y src de las imagenes
        /*
        // sprite map
        this.spritesheet = new Image();
        this.spritesheet.src = data.spritesheet;
        // datos del sprite map
        this.spriteCol = 8;
        //spriteCol = parseInt(data.col);
        // tamaño del map y sprite
        this.tileSize = parseInt(data.tileSize);
        this.capaOne;
        this.capaTwo;
        this.capaThree;
        this.capaFour;
        this.capaFive;
        */
    }

/* ------------------------------ *
    GETTERS
 * ------------------------------ */

    getSpritesheet () {
        return this.spritesheet;
    }

    getTileSize () {
        return this.tileSize;
    }

/* ------------------------------ *
    SETTERS
 * ------------------------------ */

    setCapas (data) {
        this.capaOne = data.capa1;
        this.capaTwo = data.capa2;
        this.capaThree = data.capa3;
        this.capaFour = data.capa4;
        this.capaFive = data.capa5;
    }
/*
capa1: dataCapa.layers[0].data,
capa2: dataCapa.layers[1].data,
capa3: dataCapa.layers[2].data,
capa4: dataCapa.layers[3].data,
capa5: dataCapa.layers[4].data,
collision: dataCapa.layers[5].data,
tilesets: tilesets
*/
    setMap (dataMap) {
        this.capa1 = this.desingCapa(1, dataMap);
        this.capa2 = this.desingCapa(2, dataMap);
        this.capa3 = this.desingCapa(3, dataMap);
        this.capa4 = this.desingCapa(4, dataMap);
        this.capa5 = this.desingCapa(5, dataMap);
        this.collision = this.desingCapa(6, dataMap);
        
    }

/* ------------------------------ *
    FUNCIONES
 * ------------------------------ */

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

    addLineCapa (numCapa, capa) {
        let lineCapa;

        switch (numCapa) {
            case 1:
                lineCapa.push(capa.capa1);
                break;

            case 2:
                lineCapa.push(capa.capa2);
                break;

            case 3:
                lineCapa.push(capa.capa3);
                break;

            case 4:
                lineCapa.push(capa.capa4);
                break;

            case 5:
                lineCapa.push(capa.capa5);
                break;

            case 6:
                lineCapa.push(capa.collision);
                break;
        }

        return lineCapa;
    }

    desingCapa (capa, dataMap) {
        let list = [],
            size = {
                width: dataMap[dataMap.length].length,
                height: dataMap.length
            };

        for (let mapY = 0; mapY < size.height; mapY++) {
            for (let mapX = 0; mapX < size.width; mapX++) {
                list.push(this.addLineCapa(capa, dataMap[mapY][mapX]));
            }
        }
	
        return this.listToMatrix(list);
    }

    // Dibuja Map - 100%
    drawMap (capa, ctx, w, h) {
        // Draw World - Dibujando Mundo
        let spriteNum = 0, x, y;

        spriteNum = capa[h][w];
        if (spriteNum != 0 && spriteNum != undefined) {

            // Trae la posicion del sprite
            if (spriteNum < this.spriteCol) {
                y = 0;
                x = parseInt((spriteNum - 1) * 32);
            } else {

                let ind = 0, fila = 0;

                while (!(ind > spriteNum)) {
                    fila++;
                    ind = (fila + 1) * 8
                }

                spriteNum = spriteNum - (fila * 8);
                y = parseInt(fila * 32);
                x = parseInt((spriteNum - 1) * 32);
            }
            
            // Mejora la posicion del mapa
            h = h - 0.5;

            ctx.drawImage(this.spritesheet, x, y, this.tileSize, this.tileSize, w * this.tileSize, h * this.tileSize, this.tileSize, this.tileSize);
            //ctx.drawImage(this.spritesheet, x, y, this.tileSize, this.tileSize, w * this.tileSize, h * this.tileSize, this.tileSize, this.tileSize);
        }
    }

    drawMapDown (ctx, w, h) {
        this.drawMap(this.capaOne, ctx, w, h);
        this.drawMap(this.capaTwo, ctx, w, h);
        this.drawMap(this.capaThree, ctx, w, h);
    }

    drawMapUp (ctx, w, h) {
        this.drawMap(this.capaFour, ctx, w, h);
        this.drawMap(this.capaFive, ctx, w, h);
    }
}