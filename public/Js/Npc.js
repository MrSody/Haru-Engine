class Npc {
    constructor (data) {
        this.id = data.id;
        this.name = data.name;
        this.health = {now: data.health.now, max: data.health.max};
        this.skin = new Image();
        this.skin.src = data.skin;
        this.pos = {x: data.pos.x, y: data.pos.y};
        this.reaction = data.reaction;
        this.events = data.events;
        
        this.visionDistance = data.visionDistance;
        
        /*
        this.move = false;
        this.phrases = data.phrases;
        this.missionsStart = data.missionsStart;
        this.missionsFinish = data.missionsFinish;
        this.drop = data.drop;
        */
        this.frame = 0;
        this.dir = 2;
        
		this.finalDir;
		this.moving = false;
		this.movingDir;
		this.path = [[]];
        this.stepCount = 0;
        this.absPos = {absX: 0, absY: 0};
        
        this.posAttack = {x: 0, y: 0};
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    
    getID () {
        return this.id;
    }
    
    getName () {
        return this.name;
    }

    getPos () {
        return this.pos;
    }

    getReaction () {
        return this.reaction;
    }
    
    isAggressive () {
        return (this.reaction == "2" || this.reaction == "3") ? true : false;
    }
    
    getVisionDistance () {
        return this.visionDistance;
    }
    
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
    
    setPos (posX, posY) {
        this.pos = {x: posX, y: posY};
    }
    
    setDir (dir) {
        this.dir = dir;
    }
    
    setAbsPos (absX, absY) {
		this.absPos.absX = absX;
		this.absPos.absY = absY;
	}
    
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

/* ------------------------------ *
    FUNCIONES
 * ------------------------------ */
    
    playerMove () {
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
                this.stepCount=0;
                //this.dir = this.finalDir;
            }
        }
	}
    
    // Actualiza la posicion del Npc
    posNow (widthMap, heightMap, posWorld) {

        let posIntX = Math.floor(posWorld.x - widthMap),
            posIntY = Math.floor(posWorld.y - heightMap),
            posEndX = Math.floor(posWorld.x + widthMap),
            posEndY = Math.floor(posWorld.y + heightMap),
            posNpc = this.pos;

        if ((posIntX >= posNpc.x || posNpc.x <= posEndX) && (posIntY >= posNpc.y || posNpc.y <= posEndY)) {
            for(var y = 0, intY = posIntY; intY <= posEndY; intY++, y++) {
                for(var x = 0, intX = posIntX; intX <= posEndX; intX++, x++) {

                    if (posNpc.x == intX && posNpc.y == intY) {
                        return {x: x, y: y};
                    }
                }
            }
        }

        return false;
    }

    draw (ctx, posX, posY) {

        const tileSize = 32;
        posX *= tileSize;
        posY *= tileSize;
        //ctx.fillStyle = "#001dff";

        // Posicion nueva
        //ctx.fillRect((posX * 32), (posY * 32), 32, 32);

        ctx.drawImage(this.skin, this.frame * 64, this.dir * 48, 64, 48, (posX - 16), (posY - 16), 64, 48);

        //ctx.drawImage(this.skin, );
		//ctx.drawImage(skin, 44, 0, 44, 44, x+cXnull, y+cYnull, 32, 32);
	}
}
