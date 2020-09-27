export default class Map {
    constructor (data) {
        this.tileSize = parseInt(data.tileSize); // TAMAÑO DE LOS TILES
        // sprite map
        this.spritesheet = new Image();
        this.spritesheet.src = data.spritesheet;

        this.capaOne;
        this.capaTwo;
        this.capaThree;
        this.capaFour;
        this.capaFive;
        this.capaCollision = {now: 0, old: 0};

        // SIZE SCREEN
        this.sizeScreen = {width: 0, height: 0};
        this.middleTile = {x: 0, y: 0};
        this.maxTiles = {x: 0, y: 0};
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    getTileSize () {
        return this.tileSize;
    }

    getCollision () {
        return this.capaCollision.now;
    }

    getSizeScreen () {
        return this.sizeScreen;
    }

    getMiddleTile () {
        return this.middleTile;
    }

    getMaxTiles () {
        return this.maxTiles;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */
    // Ingresa los datos del servidor
    setMap (data) {
        this.capaOne = data.capa1;
        this.capaTwo = data.capa2;
        this.capaThree = data.capa3;
        this.capaFour = data.capa4;
        this.capaFive = data.capa5;
        this.capaCollision = {now: data.collisionMap, old: data.collisionMapOld};
    }

    setCollision (x, y, data) {
        switch (data) {
            case 0:     // Clean Collision Map
                this.capaCollision.now[y][x] = this.capaCollision.old[y][x];
                break;
            case 2:     // Add Collision - NPC Aggressive
                if (this.capaCollision.now[y][x] == 0) {
                    this.capaCollision.now[y][x] = data;
                }
                break;
        }
    }

    setSizeScreen (width, height) {
        this.sizeScreen.width = width;
        this.sizeScreen.height = height;
        this.middleTile.x = Math.round((width / 2) / 32);
        this.middleTile.y = Math.round(((height / 2) / 32));
        this.maxTiles.x = Math.floor((width / 32) + 2);
        this.maxTiles.y = Math.floor((height / 32) + 2);
    }

/* ------------------------------ *
    DRAW
* ------------------------------ */
    drawMapDown (ctx, X, Y) {
        this.drawMap(this.capaOne, ctx, X, Y);
        this.drawMap(this.capaTwo, ctx, X, Y);
        this.drawMap(this.capaThree, ctx, X, Y);
    }

    drawMapUp (ctx, X, Y) {
        this.drawMap(this.capaFour, ctx, X, Y);
        this.drawMap(this.capaFive, ctx, X, Y);
    }

    // Dibuja Map - 100%
    drawMap (capa, ctx, X, Y) {
        let spriteNum = capa[Y][X];

        // Valida que el sprite no sea 0 o no este definido
        if (spriteNum != 0 && spriteNum != undefined) {
            // Trae la posicion del sprite
            let posSprite = this.posSprite(spriteNum, this.spritesheet.width);

            // Mejora la posicion del mapa
            Y = Y - 0.5;

            // Dibuja el sprite en pantalla
            ctx.drawImage(
                this.spritesheet,
                (posSprite.X * this.tileSize),
                (posSprite.Y * this.tileSize),
                this.tileSize,
                this.tileSize,
                X * this.tileSize,
                Y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
        }
    }

    posSprite (spriteNum, imageWidth) {
        if (spriteNum < (imageWidth / this.tileSize)) {
            return { X: parseInt(spriteNum - 1), Y: 0 };
        } else {

            let ind = 0, fila = 0;

            while (!(ind > spriteNum)) {
                fila++;
                ind = (fila + 1) * (imageWidth / this.tileSize);
            }

            spriteNum = spriteNum - (fila * (imageWidth / this.tileSize));
            
            return { X: parseInt(spriteNum - 1), Y: parseInt(fila) };
        }
    }
}