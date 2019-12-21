class Map {
    constructor (data) {
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

/* ------------------------------ *
    FUNCIONES
 * ------------------------------ */

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