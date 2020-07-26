export default class Npc {
    constructor (data) {
        console.log(data);
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
		if ((this.goAttack || this.goToNpc) && this.stepCount == 0) {
			// Face player towards enemy
			if (this.path[this.path.length-1][0] > this.path[this.path.length-2][0]) {
				this.finalDir = 1;
			} else if (this.path[this.path.length-1][0] < this.path[this.path.length-2][0]) {
				this.finalDir = 3;
			} else if (this.path[this.path.length-1][1] > this.path[this.path.length-2][1]) {
				this.finalDir = 2;
			} else if (this.path[this.path.length-1][1] < this.path[this.path.length-2][1]) {
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
        let pathValue;

        // Check if on the way to attack
        this.setPath(this.path);

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
}