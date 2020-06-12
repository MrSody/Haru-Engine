export default class Map {
    constructor (data) {
        this.tileSize = parseInt(data.tileSize); // TAMAÑO DE LOS TILES
        this.spriteSheets = this.desingSheet(data.spritesheet); // Image() y src de las imagenes

        this.capaOne;
        this.capaTwo;
        this.capaThree;
        this.capaFour;
        this.capaFive;
        this.capaCollision;
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    getTileSize () {
        return this.tileSize;
    }

    getCollision () {
        return this.capaCollision;
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
        this.capaCollision = data.collisionMap;
    }

/* ------------------------------ *
    FUNCIONES
* ------------------------------ */
    // Diseña el array de los spriteSheet y retorna una array
    //[{name: nombre, spritesheet: <img>, tileStart: tile inicio, tileEnd: tile fin, tileCount: cantidad Tile, imageHeight: alto, imageWidth: ancho}]
    desingSheet (dataSpriteSheet) {
        let arraySheet = [];

        for (let spriteSheet of dataSpriteSheet) {
            let spritesheet = new Image();
            spritesheet.src = spriteSheet.file;
            arraySheet.push({
                name: spriteSheet.nameTilesets,
                spritesheet: spritesheet,
                tileStart: spriteSheet.tileStart,
                tileEnd: spriteSheet.tileEnd,
                tileCount: spriteSheet.tileCount,
                imageHeight: spriteSheet.imageHeight,
                imageWidth: spriteSheet.imageWidth
            });
        }

        return arraySheet;
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

            // Filtra la lista de sprite la cantidad de tiles sea menor al spriteNum            
            let spriteSheet = this.spriteSheets.filter(spriteSheet => parseInt(spriteSheet.tileStart) <= parseInt(spriteNum) <= parseInt(spriteSheet.tileEnd));
            // Trae el primer valor del array
            spriteSheet = spriteSheet[0];

            // Trae la posicion del sprite
            let posSprite = this.posSprite(spriteNum, spriteSheet.imageWidth, spriteSheet.imageHeight);

            // Mejora la posicion del mapa
            Y = Y - 0.5;

            // Dibuja el sprite en pantalla
            ctx.drawImage(
                spriteSheet.spritesheet,
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

    posSprite (spriteNum, imageWidth, imageHeight) {
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