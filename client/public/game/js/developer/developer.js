export default class Developer {
    /**
     * @constructor
     * @param {number} tileSize
    */
    constructor (tileSize) {

        /** @type {number} */  
        this.tileSize = tileSize;

        /** @type {number} */
        this.lineSize = 0.4;

        /** @type {string} */
        this.lineColor = "#44414B";
    }

    /**
     * @param {any} ctx
     * @param {number} X
     * @param {number} Y
     */
    drawGrid (ctx, X, Y) {
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineSize;

        // VERTICAL
        ctx.beginPath();
        ctx.moveTo((X * this.tileSize), 0);
        ctx.lineTo((X * this.tileSize), ctx.canvas.height);
        ctx.stroke();

        // HORIZONTAL
        ctx.beginPath();
        ctx.moveTo(0, ((Y - 0.5) * this.tileSize));
        ctx.lineTo(ctx.canvas.width, ((Y - 0.5) * this.tileSize));
        ctx.stroke();
    }

    /**
     * @param {any} ctx
     * @param {number} X
     * @param {number} Y
     * @param {Array<Array>} mapCollision
     */
    drawCollision (ctx, X, Y, mapCollision) {
        
        if ( typeof(mapCollision[Y][X]) == "number" ) {
            if ( mapCollision[Y][X] == 1 ) { // COLLISION
                ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                ctx.fillRect((X * this.tileSize), ((Y - 0.5) * this.tileSize), 32, 32);
            }
        } else if ( typeof(mapCollision[Y][X]) == "object" ) {

            let npc = mapCollision[Y][X];

            switch ( npc.getReaction() ) {
                case 2: // NPC - Aggressive
                ctx.fillStyle = "rgba(0, 0, 255, 1)";
                ctx.fillRect((X * this.tileSize), ((Y - 0.5) * this.tileSize), 32, 32);
                break;
            }
        }
    }

    /**
     * @param {any} ctx
     * @param {number} visionDistance
     * @param {{x: number; y: number}} posNow
     */
    drawVisionNpc (ctx, visionDistance, posNow) {
        let initVisionX = posNow.x - visionDistance;
        let initVisionY = posNow.y - visionDistance;
        let endVisionX = initVisionX + (visionDistance * 2);
        let endVisionY = initVisionY + (visionDistance * 2);

        for (; initVisionY <= endVisionY; initVisionY++) {
            for (let x = initVisionX; x <= endVisionX; x++) {
                ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
                ctx.fillRect((x * this.tileSize), ((initVisionY - 0.5) * this.tileSize), 32, 32);
            }
        }
    }
}