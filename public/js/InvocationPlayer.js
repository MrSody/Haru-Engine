class Invocation extends Player {
    constructor (data) {
        super(data);
        this.width = data.width;
        this.heigth = data.heigth;
        this.absPos = {absX: 0, absY: 0};
    }

/* ------------------------------ *
    GETTERS
 * ------------------------------ */

    getAbsPos () {
		return this.absPos;
	}

    getDir () {
		return this.dir;
	}

    isMoving () {
		return this.moving;
	}

/* ------------------------------ *
    SETTERS
 * ------------------------------ */

    setPath (path) {
		this.path = path;
		this.moving = true;

        // Check if on the way to attack
		if ((this.goAttack || this.goToNpc) && this.stepCount==0) {
			// Face player towards enemy
			if (this.path[this.path.length-1][0] > this.path[this.path.length-2][0]) {
				this.finalDir=1;
			} else if (this.path[this.path.length-1][0] < this.path[this.path.length-2][0]) {
				this.finalDir=3;
			} else if (this.path[this.path.length-1][1] > this.path[this.path.length-2][1]) {
				this.finalDir=2;
			} else if (this.path[this.path.length-1][1] < this.path[this.path.length-2][1]) {
				this.finalDir=0;
			}

			// Remove last path element so player doesn't step on enemy
			this.path.pop();
		}
	}

    setAbsPos (absX, absY) {
		this.absPos.absX = absX;
		this.absPos.absY = absY;
	}

    setDir (dir) {
		this.dir = dir;
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

    posEnd (width, height, posWorld, posX, posY) {

        let widthMap = Math.round((width / 2) / 32),
            heightMap = Math.round((height / 2) / 32),
            posIntX = Math.floor(posWorld.x - widthMap),
            posIntY = Math.floor(posWorld.y - heightMap),
            posEndX = Math.floor(posWorld.x + widthMap),
            posEndY = Math.floor(posWorld.y + heightMap);

        if ((posIntX >= posX || posX <= posEndX) && (posIntY >= posY || posY <= posEndY)) {
            for(let y = 0, intY = posIntY; intY <= posEndY; intY++, y++) {
                for(let x = 0, intX = posIntX; intX <= posEndX; intX++, x++) {

                    if (posX == intX && posY == intY) {
                        return {x: x, y: y};
                    }
                }
            }
        }

        return false;
    }

    playerMove (dt) {
        /*
		if(this.stepSnd.paused) {
			this.stepSnd.currentTime = 0;
			this.stepSnd.play();
		}
        */

        let pathValue;

        // Check if on the way to attack
		if ((this.goAttack || this.goToNpc) && this.stepCount==0) {
			// Face player towards enemy
			if (this.path[this.path.length-1][0] > this.path[this.path.length-2][0]) {
				this.finalDir=1;
			} else if (this.path[this.path.length-1][0] < this.path[this.path.length-2][0]) {
				this.finalDir=3;
			} else if (this.path[this.path.length-1][1] > this.path[this.path.length-2][1]) {
				this.finalDir=2;
			} else if (this.path[this.path.length-1][1] < this.path[this.path.length-2][1]) {
				this.finalDir=0;
			}

			// Remove last path element so player doesn't step on enemy
			this.path.pop();
		}

        // Path length is 1 i.e. when clicked on player position
		if (this.path.length >= 1) {
            console.log(this.path.length);
            console.log("dentro"+ this.path[this.stepCount][0] +"-"+ this.path[this.stepCount][1] +"-"+ this.path[this.stepCount]);

            console.log("stepCount1:"+ this.stepCount);

            if (this.stepCount != 0) {

                var posX = this.path[this.stepCount][0],
                    posY = this.path[this.stepCount][1],
                    lastPosX = this.path[this.stepCount - 1][0],
                    lastPosY = this.path[this.stepCount - 1][1];

                if (posX < lastPosX) { // Left

                    console.log("3-1");
                    this.dir = 3;
                    this.absPos.absX = -1;
                    this.absPos.absY = 0;

                } else if(posX > lastPosX) { // Right

                    console.log("1-1");
                    this.dir = 1;
                    this.absPos.absX = 1;
                    this.absPos.absY = 0;

                } else if(posY < lastPosY) { // Up

                    console.log("0-1");
                    this.dir = 0;
                    this.absPos.absX = 0;
                    this.absPos.absY = -1;

                } else if(posY > lastPosY) { // Down

                    console.log("2-1");
                    this.dir = 2;
                    this.absPos.absX = 0;
                    this.absPos.absY = 1;

                }

            } else {
                this.absPos.absX = 0;
                this.absPos.absY = 0;
            }

            if (this.stepCount < this.path.length-1 && !this.moveInterrupt) {
                //this.path.shift();
                this.stepCount++;
                console.log("stepCount:"+ this.stepCount);
            } else { // End of path
                if(this.goFight != null) {
                    console.log("partepj2");
                    this.fighting = this.goFight;
                    this.mode = 1;
                } else if(this.goToNpc != null) {
                    console.log("partepj3");
                    this.talkingTo = this.goToNpc;
                }

                console.log("partepj4");
                this.moving = false;
                this.stepSnd.pause();
                this.stepCount=0;
                //this.dir = this.finalDir;
            }
        }
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

		ctx.fillStyle = "#FFF";
		ctx.font = "9pt Minecraftia";
        //nuevo
        ctx.fillText(this.name +' , '+ this.level, cXnull, cYnull - 32);
        ctx.fillStyle="#000000";
        ctx.fillRect(cXnull, cYnull - 30, 50, 2);
        ctx.fillStyle="#FF0000";
        ctx.fillRect(cXnull, cYnull - 30, 40, 2);
		if (this.mode == 0) {
            //nuevo
            ctx.drawImage(this.skinBase, this.frame * this.width, this.dir * this.heigth, this.width, this.heigth, (cXnull - 16), (cYnull - 16), this.width, this.heigth);
            //ctx.drawImage(this.playersprite, this.frame*50, this.dir*60, 50, 60, cXnull, cYnull, 32, 32);
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
