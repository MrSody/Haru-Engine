class RemotePlayer extends Player {
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

draw (ctx, cXnull, cYnull) {
    const tileSize = 32;
    cXnull *= tileSize;
    cYnull *= tileSize;

    if (this.moving && (Date.now() - this.lastFrameUpdate > 150)) {
        console.log(`Moviendo ${Date.now()} - ${this.lastFrameUpdate}`);
        this.lastFrameUpdate = Date.now();
        this.nextFrame();
    } else if (!this.moving) {
        this.frame = 0;
    }

    //console.log("Draw player"+ this.dir);
    ctx.fillStyle = "#FFF";
    ctx.font = "9pt Minecraftia";
    //ctx.fillText(this.playerName, this.absPos["absX"] + cXnull, this.absPos["absY"] + cYnull-10);
    //nuevo
    ctx.fillText(this.name +', '+ this.level, cXnull, cYnull - 32);
    ctx.fillStyle="#000000";
    ctx.fillRect(cXnull, cYnull - 30, 50, 2);
    ctx.fillStyle="#FF0000";
    ctx.fillRect(cXnull, cYnull - 30, 40, 2);
    if (this.mode == 0) {
        //nuevo
        ctx.drawImage(this.skinBase, this.frame * 64, this.dir * 48, 64, 48, (cXnull - 16), cYnull, 64, 48);

    } else if (this.mode == 1) {
        ctx.drawImage(this.skinBase, this.fightFrame*44, this.mode*44, 44, 44, this.absPos["absX"] + cXnull-5, this.absPos["absY"] + cYnull-5, 32, 32);
    }
    //ctx.drawImage(this.playersprite, this.frame*42, this.dir*43, 42, 43, this.absPos["absX"] + cXnull, this.absPos["absY"] + cYnull, 32, 32);

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