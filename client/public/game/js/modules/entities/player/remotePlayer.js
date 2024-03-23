import Player from './player.js';

export default class RemotePlayer extends Player {
    /**
     * @constructor
     * @param {{ 
	 * 			IDClient: string; 
     * 			name: string; 
     * 			skinCharacter: string;
     *			health: { now: number; max: number; }; 
     *			level: string; 
     *			experience: { now: number; max: number; }; 
     *			money: number; 
     *			posWorld: { X: number; Y: number; }; 
     *			direction: number; }} datos
     */
    constructor (datos) {
        super(datos);
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */

/* ------------------------------ *
    SETTERS
* ------------------------------ */

/* ------------------------------ *
    FUNCTIONS
* ------------------------------ */
    /**
     * Update position the remote player
     *
     * @param {number} widthMap
     * @param {number} heightMap
     * @param {{ x: number; y: number; }} posWorld
     * @returns {{ x: number; y: number; }}
     */
    posNow (widthMap, heightMap, posWorld) {
        return {
            x: Math.floor(this.posWorld.x - posWorld.x) + widthMap,
            y: Math.floor(this.posWorld.y - posWorld.y) + heightMap,
        };
    }

/* ------------------------------ *
    DRAW
* ------------------------------ */
    /**
     * 
     * @param {any} ctx 
     * @param {any} HUB 
     * @param {number} cX 
     * @param {number} cY 
     * @param {number} tileSize 
     */
    draw (ctx, HUB, cX, cY, tileSize) {
        cX *= tileSize;
        cY *= tileSize;

        this.updateFrame();

        HUB.fillStyle = "#FFF";
        HUB.font = "9pt Minecraftia";
        // Show name and level
        HUB.fillText(this.name +', '+ this.level, cX, cY - 32);
        // Show health
        HUB.fillStyle="#000000";
        HUB.fillRect(cX, cY - 30, 50, 2);
        HUB.fillStyle="#FF0000";
        HUB.fillRect(cX, cY - 30, 40, 2);

        this.drawMode(ctx, cX, cY);

        /*
        let hitDelta = Date.now() - this.lastHitPointUpdate;

        if (this.hitArray.length > 0 && hitDelta > 50) {
            for (var i = 0, j = this.hitArray.length; i < j; i+=1) {
                if (this.hitArray[i] != null) {
                    this.lastHitPointUpdate = Date.now();
                    this.hitArray[i][1] = Math.round((this.hitArray[i][1]-0.1)*10)/10;

                    if (this.hitArray[i][1] <= 0) {
                        this.hitArray.splice(i,1);
                    }
                }
            }
        } else if (this.hitArray.length == 0) {
            this.gotHit = false;
        }

        if (this.hitArray.length > 0) {
            for (var i = 0, max = this.hitArray.length; i < max; i += 1) {
                ctx.fillStyle = 'rgba(255,0,0,'+this.hitArray[i][1]+')';
                ctx.font = "14pt Minecraftia";
                ctx.fillText(this.hitArray[i][0], this.pos["x"]+12, this.pos["y"]-20);
            }
        }
        */
    }

}
