import { Npc } from "../../../../../engine/modules/npc";
import Helper from "../helper";

export default class Map {
    /**
     * @constructor
     * @param {{spritesheet: string; tileSize: number; }} data
    */
    constructor (data) {
        /** @type {number} Size tiles */
        this.tileSize = parseInt(data.tileSize);

        // sprite map
        /** @type {string} */
        this.spritesheet = Helper.setLoadImage(data.spritesheet);
        
        /** @type {string} */
        this.capaOne = [[]];

        /** @type {string} */
        this.capaTwo = [[]];

        /** @type {string} */
        this.capaThree = [[]];

        /** @type {string} */
        this.capaFour = [[]];

        /** @type {string} */
        this.capaFive = [[]];

        /** @type {string} */
        this.capaSix = [[]];

        /** @type {{ now: number; old: number; }} */
        this.capaCollision = {now: 0, old: 0};

        // SIZE SCREEN
        /** @type {{ width: number; height: number; }} */
        this.sizeScreen = {width: 0, height: 0};
        
        /** @type {{ x: number; y: number; }} */
        this.middleTile = {x: 0, y: 0};
        
        /** @type {{ x: number; y: number; }} */
        this.maxTiles = {x: 0, y: 0};
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    getCollision () {
        return this.capaCollision.now;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */
    /**
     * set new data map
     *
     * @param {{ capa1: [[]]; capa2: [[]]; capa3: [[]]; capa4: [[]]; capa5: [[]]; capa6: [[]]; collision: [[]]; }} data
     */
    setMap (data) {
        this.capaOne = data.capa1;
        this.capaTwo = data.capa2;
        this.capaThree = data.capa3;
        this.capaFour = data.capa4;
        this.capaFive = data.capa5;
        this.capaSix = data.capa6;
        this.capaCollision = {now: data.collision, old: data.collision};
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {(number|Npc)} data
     */
    setCollision (x, y, data) {
        if ( typeof(data)  == "object" ) {
            this.capaCollision.now[y][x] = data;
        } else {
            this.capaCollision.now[y][x] = this.capaCollision.old[y][x];
        }
    }

    /**
     * @param {number} width
     * @param {number} height
     */
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
    /**
     * @param {any} ctx
     * @param {number} X
     * @param {number} Y
     */
    drawMapDown (ctx, X, Y) {
        this.drawMapLayers(this.capaOne, this.capaTwo, this.capaThree, ctx, X, Y);
    }
    
    /**
     * @param {any} ctx
     * @param {number} X
     * @param {number} Y
     */
    drawMapUp (ctx, X, Y) {
        this.drawMapLayers(this.capaFour, this.capaFive, this.capaSix, ctx, X, Y);
    }
  
    drawMapLayers (capaOne, capaTwo, capaThree, ctx, X, Y) {
        let mapLayers = [capaOne, capaTwo, capaThree];
        for (let capa of mapLayers) {
            this.drawMap(capa, ctx, X, Y);
        }
    }

    drawMap (capa, ctx, X, Y) {
        let spriteNum = capa[Y][X];
  
        // Valida que el sprite no sea 0 o no este definido
        if (spriteNum !== 0 && spriteNum !== undefined) {
            let posSprite = this.posSprite(spriteNum, this.spritesheet.width);
            
            // Mejora la posicion del mapa
            Y = Y - 0.5;
  
            ctx.drawImage(
                this.spritesheet,
                (posSprite.X * this.tileSize),
                (posSprite.Y * this.tileSize),
                this.tileSize,
                this.tileSize,
                X * this.tileSize,
                Y * this.tileSize,
                this.tileSize,
                this.tileSize,
            );
        }
    }
    
    /**
     * @param {number} spriteNum
     * @param {number} imageWidth
     * @returns {{ X: number; Y: number; }}
     */
    posSprite (spriteNum, imageWidth) {
        if (spriteNum < (imageWidth / this.tileSize)) {
            return { X: parseInt(spriteNum - 1), Y: 0 };
        } else {

            let ind = 0, fila = 0;

            while (ind <= spriteNum) {
                fila++;
                ind = (fila + 1) * (imageWidth / this.tileSize);
            }

            spriteNum = spriteNum - (fila * (imageWidth / this.tileSize));
            
            return { X: parseInt(spriteNum - 1), Y: parseInt(fila) };
        }
    }
}