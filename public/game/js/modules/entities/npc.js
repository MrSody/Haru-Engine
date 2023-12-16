export default class Npc {
    constructor (data) {
        this.id = data.id;
        this.name = data.name;
        this.health = {now: data.health.now, max: data.health.max};
        this.skin = new Image();
        this.skin.src = data.skin;
        this.posWorld = {x: data.posWorld.x, y: data.posWorld.y};
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
        
		this.finalDirection;
		this.moving = false;
		this.movingDir;
		this.path = [[]];
        this.stepCount = 0;
        this.absPos = {absX: 0, absY: 0};
        
        this.posAttack = {x: 0, y: 0};

        this.goFight = false;
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

    getPosWorld () {
        return this.posWorld;
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
    setPosWorld (posX, posY) {
        this.posWorld.x = posX;
        this.posWorld.y = posY;
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
		if (this.goAttack && this.stepCount == (this.path.length - 1)) {
			// Face player towards enemy
			if (this.path[this.path.length-1][0] > this.path[this.path.length-2][0]) {
				this.finalDirection = 1;
			} else if (this.path[this.path.length-1][0] < this.path[this.path.length-2][0]) {
				this.finalDirection = 3;
			} else if (this.path[this.path.length-1][1] > this.path[this.path.length-2][1]) {
				this.finalDirection = 2;
			} else if (this.path[this.path.length-1][1] < this.path[this.path.length-2][1]) {
				this.finalDirection = 0;
			}

			// Remove last path element so player doesn't step on enemy
            this.path.pop();

            // Reset stepCount
            if (this.stepCount == this.path.length) {
                this.stepCount = 0;
            }
		}
	}

/* ------------------------------ *
    FUNCIONES
 * ------------------------------ */
    playerMove () {

        console.log(this.posWorld);
        // Check if on the way to attack
        this.setPath(this.path);

        // Path length is 1 i.e. when clicked on player position
		if (this.path.length >= 1) {

            if (this.stepCount != 0) {
            //if (this.stepCount != 0 && this.stepCount != (this.path.length - 1)) {

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

            if (this.stepCount < (this.path.length - 1) && !this.moveInterrupt) {
                //this.path.shift();
                this.stepCount++;
            } else { // End of path
                if (this.goFight != null) {
                    this.fighting = this.goFight;
                    this.mode = 1;
                }
                
                this.moving = false;
                this.stepCount=0;
                this.dir = this.finalDirection;
            }
        }
	}
    
    // Actualiza la posicion del Npc
    posNow (widthMap, heightMap, posWorld) {
        return {
            x: Math.floor(this.posWorld.x - posWorld.x) + widthMap,
            y: Math.floor(this.posWorld.y - posWorld.y) + heightMap
        };
    }

    draw (ctx, HUB, cXnull, cYnull) {

        const tileSize = 32;
        cXnull *= tileSize;
        cYnull *= tileSize;

        HUB.fillStyle = "#001dff";
        HUB.font = "9pt Minecraftia";
        // Muestra el nombre
        HUB.fillText(this.name, cXnull, (cYnull - 32));

        // Posicion nueva
        ctx.drawImage(this.skin, this.frame * 64, this.dir * 48, 64, 48, (cXnull - 16), (cYnull - 16), 64, 48);
    }

/* ------------------------------ *
    EVENTS
 * ------------------------------ */
    eventVision (posNow, middleTileX, middleTileY, collisionMap) {
        if (!this.isMoving()) {
            if (this.reaction != 1) {
                let visionDistance = this.getVisionDistance();
                let initVisionX = posNow.x - visionDistance;
                let initVisionY = posNow.y - visionDistance;
                let endVisionX = initVisionX + (visionDistance * 2);
                let endVisionY = initVisionY + (visionDistance * 2);

                for (let y = initVisionY; y <= endVisionY; y++) {
                    for (let x = initVisionX; x <= endVisionX; x++) {
                        if (x >= middleTileX && x <= middleTileX && y >= middleTileY && y <= middleTileY) {
                            if ((posNow.x > middleTileX || posNow.x < middleTileX) || (posNow.y > middleTileY || posNow.y < middleTileY)) {
                                let pathFinder = new Pathfinder(collisionMap, posNow, {x: middleTileX, y: middleTileY}),
                                    //Mover = pathFinder.move();
                                    Mover = pathFinder.calculatePath();
                                    
                                this.goAttack = true;
                                
                                if (Mover.length > 0) {
                                    this.setPath(Mover);
                                }
                            } else {
                                console.log("Esta Peleando el NPC");
                            }
                        }
                    }
                }
            }
        }
    }
}