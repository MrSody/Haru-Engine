import Player from './Player.js';

export default class RemotePlayer extends Player {
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

        let posIntX = Math.floor(posWorld.x - widthMap),
            posIntY = Math.floor(posWorld.y - heightMap),
            posEndX = Math.floor(posWorld.x + widthMap),
            posEndY = Math.floor(posWorld.y + heightMap);

        if ((posIntX >= this.pos.x || this.pos.x <= posEndX) && (posIntY >= this.pos.y || this.pos.y <= posEndY)) {
            for(let y = 0, intY = posIntY; intY <= posEndY; intY++, y++) {
                for(let x = 0, intX = posIntX; intX <= posEndX; intX++, x++) {

                    if (this.pos.x == intX && this.pos.y == intY) {
                        return {x: x, y: y};
                    }
                }
            }
        }

        return false;
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