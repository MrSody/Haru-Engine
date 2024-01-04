import Player from './player.js';
import DirectionsEnums from "../../enums/directions.js";
import ActionStateEnums from "../../enums/actionState.js";

export default class LocalPlayer extends Player {
    /**
     * @constructor
     * @param {{ 
	 * 			IDClient: string; 
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
        /** @type {number} */
        this.money = datos.money;

        /** @type {{ x: number; y: number; }} */
        this.absPos = {x: 0, y: 0};
        
        /** @type {boolean} */
        this.goRun = false;

        /** @type {[[number]]} */
        this.path = [[]];

        /** @type {number} */
        this.speed = 5;
        
        /** @type {number} */
        this.tellCount = 0;
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    isRunning () {
        return this.goRun;
    }

    getTellCount () {
        return (this.tellCount >= 1);
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */
    /**
     * @param {number} x 
     * @param {number} y 
     */
    setAbsPos (x, y) {
        this.absPos.x = x;
        this.absPos.y = y;
    }
    
    /**
     * @param {[[number, number]]} path
     */
    setPath (path) {
		this.path = path;
        this.moving = true;
        
        if (this.goRun) {
            this.mode = ActionStateEnums.ActionState().Running;
        } else {
            this.mode = ActionStateEnums.ActionState().Walking;
        }

        // Check if on the way to attack
		if ((this.goAttack || this.goToNpc) && this.stepCount === 0) {
			// Face player towards enemy
			if (this.path[this.path.length - 1][0] > this.path[this.path.length - 2][0]) {
				this.finalDirection = DirectionsEnums.directions().Right;
			} else if (this.path[this.path.length - 1][0] < this.path[this.path.length - 2][0]) {
				this.finalDirection = DirectionsEnums.directions().Left;
			} else if (this.path[this.path.length - 1][1] > this.path[this.path.length - 2][1]) {
				this.finalDirection = DirectionsEnums.directions().Down;
			} else if (this.path[this.path.length - 1][1] < this.path[this.path.length - 2][1]) {
				this.finalDirection = DirectionsEnums.directions().Up;
			}

			// Remove last path element so player doesn't step on enemy
			this.path.pop();
		}
    }

/* ------------------------------ *
    FUNCTIONS
* ------------------------------ */
    updateAbsPos () {
        let posX = this.path[this.stepCount][0];
        let posY = this.path[this.stepCount][1];
        let lastPosX = this.path[this.stepCount - 1][0];
        let lastPosY = this.path[this.stepCount - 1][1];

        let deltaX = posX - lastPosX;
        let deltaY = posY - lastPosY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) { // Left or Right
            this.dir = (deltaX < 0) ? DirectionsEnums.directions().Left : DirectionsEnums.directions().Right;
            this.setAbsPos((deltaX < 0) ? -1 : 1, 0);
        } else { // Up or Down
            this.dir = (deltaY < 0) ? DirectionsEnums.directions().Up : DirectionsEnums.directions().Down;
            this.setAbsPos(0, (deltaY < 0) ? -1 : 1);
        }
    }

    playerWalking () {
        // Path length is 1, when clicked on player position
        if (this.path.length >= 1) {

            if (this.stepCount !== 0 && this.getTellCount()) {                
                this.updateAbsPos();
            } else {
                this.setAbsPos(0, 0);
            }

            if (this.stepCount <= this.path.length - 1 && !this.moveInterrupt) {
                if (this.getTellCount()) {
                    this.stepCount++;
                }
            } else { // End of path
                if(this.goFight != null) {
                    this.fighting = this.goFight;
                    this.mode = ActionStateEnums.ActionState().Fighting;
                } else if(this.goToNpc != null) {
                    this.talkingTo = this.goToNpc;
                }
                this.moving = false;
                this.mode = ActionStateEnums.ActionState().Stand;
                this.path.splice(0, this.stepCount);
                //this.stepSnd.pause();
                this.stepCount = 0;
                //this.dir = this.finalDirection;
            }
        }
    }

    /**
     * @param {number} delta 
     */
    playerMove (delta) {
        /*
        sound walking
        if(this.stepSnd.paused) {
            this.stepSnd.currentTime = 0;
            this.stepSnd.play();
        }
        */

        // Check if on the way to attack
        this.setPath(this.path);

        switch (this.mode) {
            case ActionStateEnums.ActionState().Walking:
                this.tellCount += this.speed * delta;
                this.playerWalking();
                break;
            case ActionStateEnums.ActionState().Running:
                if (((this.path.length - 1) - this.stepCount) > 0) {
                    this.playerRunning();
                } else if (this.stepCount === this.path.length) {
                    this.path.splice(0, this.stepCount - 2);
                    this.stepCount = 0;
                    this.goRun = false;
                    this.playerWalking();
                } else {
                    this.goRun = true;
                }
                break;
        }  
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

        //cY = (cY - 0.5);
        cY *= tileSize;

        this.updateFrame();

        // Show player name
        HUB.fillStyle = "#FFF";
        HUB.font = "9pt Minecraftia";
        HUB.fillText(this.name, cX, (cY - 35));

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
