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
    }

    getSpritesheet () {
        return this.spritesheet;
    }

    drawMiniMap (capa, mapCtx, width, height) {
        // Draw World - Dibujando Mundo
        let posX = Math.floor((width / 32) + 1),
            posY = Math.floor((height / 32) + 1),
            spriteNum = 0, x, y;

        for (let h = 0; h < posY; h++) {
            for (let w = 0; w < posX; w++) {

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

                    mapCtx.drawImage(this.spritesheet, x, y, this.tileSize, this.tileSize, w * 16, h * 16, 16, 16);
                }
            }
        }
    }

    // Dibuja Map - 100%
    drawMap (capa, ctx, width, height) {
        // Draw World - Dibujando Mundo
        let posX = Math.floor((width / 32) + 1),
            posY = Math.floor((height / 32) + 1),
            spriteNum = 0, x, y;

        for (let h = 0; h < posY; h++) {
            for (let w = 0; w < posX; w++) {

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

                    ctx.drawImage(this.spritesheet, x, y, this.tileSize, this.tileSize, w * this.tileSize, h * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }
}
