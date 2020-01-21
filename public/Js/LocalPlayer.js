class LocalPlayer extends Player {
    constructor (datos) {
        super(datos);
        this.absPos = {absX: 0, absY: 0};
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */

    getAbsPos () {
        return this.absPos;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */

    setAbsPos (absX, absY) {
        this.absPos.absX = absX;
        this.absPos.absY = absY;
    }

    setPath (path) {
		this.path = path;
		this.moving = true;

        // Check if on the way to attack
		if ((this.goAttack || this.goToNpc) && this.stepCount == 0) {
			// Face player towards enemy
			if (this.path[this.path.length - 1][0] > this.path[this.path.length - 2][0]) {
				this.finalDir = 1;
			} else if (this.path[this.path.length - 1][0] < this.path[this.path.length - 2][0]) {
				this.finalDir = 3;
			} else if (this.path[this.path.length - 1][1] > this.path[this.path.length - 2][1]) {
				this.finalDir = 2;
			} else if (this.path[this.path.length - 1][1] < this.path[this.path.length - 2][1]) {
				this.finalDir = 0;
			}

			// Remove last path element so player doesn't step on enemy
			this.path.pop();
		}
    }
    
/* ------------------------------ *
    FUNCIONES
* ------------------------------ */

    playerMove () {
        /*
        if(this.stepSnd.paused) {
            this.stepSnd.currentTime = 0;
            this.stepSnd.play();
        }
        */

        // Check if on the way to attack
        this.setPath(this.path);

        // Path length is 1 i.e. when clicked on player position
        if (this.path.length >= 1) {
            if (this.stepCount != 0) {

                var posX = this.path[this.stepCount][0],
                    posY = this.path[this.stepCount][1],
                    lastPosX = this.path[this.stepCount - 1][0],
                    lastPosY = this.path[this.stepCount - 1][1];

                if (posX < lastPosX) { // Left
                    this.dir = 3;
                    this.absPos.absX = -1;
                    this.absPos.absY = 0;

                } else if(posX > lastPosX) { // Right
                    this.dir = 1;
                    this.absPos.absX = 1;
                    this.absPos.absY = 0;

                } else if(posY < lastPosY) { // Up
                    this.dir = 0;
                    this.absPos.absX = 0;
                    this.absPos.absY = -1;

                } else if(posY > lastPosY) { // Down
                    this.dir = 2;
                    this.absPos.absX = 0;
                    this.absPos.absY = 1;

                }
            } else {
                this.absPos.absX = 0;
                this.absPos.absY = 0;
            }

            if (this.stepCount < this.path.length - 1 && !this.moveInterrupt) {
                this.stepCount++;
            } else { // End of path
                if(this.goFight != null) {
                    this.fighting = this.goFight;
                    this.mode = 1;
                } else if(this.goToNpc != null) {
                    this.talkingTo = this.goToNpc;
                }
                this.moving = false;
                this.path.splice(0, this.stepCount);
                //this.stepSnd.pause();
                this.stepCount = 0;
                //this.dir = this.finalDir;
            }
        }
    }

/* ------------------------------ *
    DRAW
* ------------------------------ */

    draw (ctx, HUB, cXnull, cYnull) {
        const tileSize = 32;
        cXnull *= tileSize;
        cYnull *= tileSize;

        if (this.moving && (Date.now() - this.lastFrameUpdate > 150)) {
            this.lastFrameUpdate = Date.now();
            this.nextFrame();
        } else if (!this.moving) {
            this.frame = 0;
        }

        HUB.fillStyle = "#FFF";
        HUB.font = "9pt Minecraftia";
        // Muestra el nombre del player
        HUB.fillText(this.name, cXnull, (cYnull - 20));

        if (this.mode == 0) {
            // Nuevo
            ctx.drawImage(this.skinBase, this.frame * 64, this.dir * 55, 64, 55, (cXnull - 16), (cYnull - 16), 64, 55);
            
        } else if (this.mode == 1) {
            //ctx.drawImage(this.skinBase, this.fightFrame*44, this.mode*44, 44, 44, this.absPos["absX"] + cXnull-5, this.absPos["absY"] + cYnull-5, 32, 32);
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