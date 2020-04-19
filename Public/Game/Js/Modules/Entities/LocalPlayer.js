class LocalPlayer extends Player {
    constructor (datos) {
        super(datos);
        this.money = datos.money;

        this.absPos = {absX: 0, absY: 0};
        this.goRun = false;
        this.path = [[]];
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    getAbsPos () {
        return this.absPos;
    }

    isRunning () {
        return this.goRun;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */
    setAbsPos (absX, absY) {
        this.absPos.absX = absX;
        this.absPos.absY = absY;
    }

    setRun (running) {
        this.goRun = running;
    }

    setPath (path) {
		this.path = path;
        this.moving = true;
        
        if (this.goRun) {
            this.mode = 2;
        } else {
            this.mode = 1;
        }

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
    playerWalking () {
        // Path length is 1 i.e. when clicked on player position
        if (this.path.length >= 1) {
            if (this.stepCount != 0) {

                let posX = this.path[this.stepCount][0],
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
                    this.mode = 3;
                } else if(this.goToNpc != null) {
                    this.talkingTo = this.goToNpc;
                }
                this.moving = false;
                this.mode = 0;
                this.path.splice(0, this.stepCount);
                //this.stepSnd.pause();
                this.stepCount = 0;
                //this.dir = this.finalDir;
            }
        }
    }

    playerRunning () {
        // Path length is 1 i.e. when clicked on player position
        if (this.path.length >= 1) {
            if (this.stepCount != 0) {

                let lastCount;

                if (this.stepCount - 1 == 0) {
                    lastCount = this.stepCount - 1;
                } else {
                    lastCount = this.stepCount - 2;
                }

                let posX = this.path[this.stepCount][0],
                    posY = this.path[this.stepCount][1],
                    lastPosX = this.path[lastCount][0],
                    lastPosY = this.path[lastCount][1];

                if (posX < lastPosX) { // Left
                    if (posY < lastPosY) {
                        this.dir = 3;
                        this.absPos.absX = -1;
                        this.absPos.absY = -1;
                    } else if (posY > lastPosY) {
                        this.dir = 3;
                        this.absPos.absX = -1;
                        this.absPos.absY = 1;
                    } else {
                        this.dir = 3;
                        this.absPos.absX = -2;
                        this.absPos.absY = 0;
                    }

                } else if(posX > lastPosX) { // Right
                    if (posY < lastPosY) {
                        this.dir = 1;
                        this.absPos.absX = 1;
                        this.absPos.absY = -1;
                    } else if (posY > lastPosY) {
                        this.dir = 1;
                        this.absPos.absX = 1;
                        this.absPos.absY = 1;
                    } else {
                        this.dir = 1;
                        this.absPos.absX = 2;
                        this.absPos.absY = 0;
                    }

                } else if(posY < lastPosY) { // Up
                    if (posY < lastPosY) {
                        this.dir = 0;
                        this.absPos.absX = 1;
                        this.absPos.absY = -1;
                    } else if (posY > lastPosY) {
                        this.dir = 0;
                        this.absPos.absX = -1;
                        this.absPos.absY = -1;
                    } else {
                        this.dir = 0;
                        this.absPos.absX = 0;
                        this.absPos.absY = -2;
                    }

                } else if(posY > lastPosY) { // Down
                    if (posY < lastPosY) {
                        this.dir = 2;
                        this.absPos.absX = 1;
                        this.absPos.absY = 1;
                    } else if (posY > lastPosY) {
                        this.dir = 2;
                        this.absPos.absX = -1;
                        this.absPos.absY = 1;
                    } else {
                        this.dir = 2;
                        this.absPos.absX = 0;
                        this.absPos.absY = 2;
                    }
                }
            } else {
                this.absPos.absX = 0;
                this.absPos.absY = 0;
            }

            if (this.stepCount < this.path.length - 1 && !this.moveInterrupt) {
                this.stepCount += 2;
            }
        }
    }

    playerMove () {
        /*
        if(this.stepSnd.paused) {
            this.stepSnd.currentTime = 0;
            this.stepSnd.play();
        }
        */

        // Check if on the way to attack
        this.setPath(this.path);

        switch (this.mode) {
            case 1:
                this.playerWalking();
                break;
            case 2:
                if (((this.path.length - 1) - this.stepCount) > 0) {
                    this.playerRunning();
                } else {
                    if (this.stepCount == this.path.length) {
                        this.path.splice(0, this.stepCount - 2);
                        this.stepCount = 0;
                        this.setRun(false);
                        this.playerWalking();
                    } else {
                        this.setRun(true);
                    }
                }
                break;
        }  
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
        // Muestra el nombre del player
        HUB.fillText(this.name, cXnull, (cYnull - 20));

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