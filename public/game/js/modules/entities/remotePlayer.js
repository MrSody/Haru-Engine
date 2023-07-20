import Player from './player.js';

export default class RemotePlayer extends Player {
    /**
     * @constructor
     * @param {{ 
	 * 			IDPj: number; 
     * 			name: string; 
     * 			skinBase: string; 
     *			skinHair: string; 
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

    setMode (mode) {
        this.mode = mode;
    }

/* ------------------------------ *
    FUNCIONES
* ------------------------------ */

    // Actualiza la posicion del jugador remoto
    posNow (widthMap, heightMap, posWorld) {
        return {
            x: Math.floor(this.posWorld.x - posWorld.x) + widthMap,
            y: Math.floor(this.posWorld.y - posWorld.y) + heightMap
        };
    }

/* ------------------------------ *
    DRAW
* ------------------------------ */

    draw (ctx, HUB, cXnull, cYnull) {
        const tileSize = 32;
        cXnull *= tileSize;
        cYnull *= tileSize;

        this.updateFrame();

        HUB.fillStyle = "#FFF";
        HUB.font = "9pt Minecraftia";
        // Muestra el nombre y el level
        HUB.fillText(this.name +', '+ this.level, cXnull, cYnull - 32);
        // Muestra la vida
        HUB.fillStyle="#000000";
        HUB.fillRect(cXnull, cYnull - 30, 50, 2);
        HUB.fillStyle="#FF0000";
        HUB.fillRect(cXnull, cYnull - 30, 40, 2);

        this.drawMode(ctx, cXnull, cYnull);

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
    }

}
