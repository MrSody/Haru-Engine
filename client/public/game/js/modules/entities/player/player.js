import ActionStateEnums from "../../enums/actionState.js";
import DirectionsEnums from "../../enums/directions.js";

export default class Player {
	/**
     * @constructor
     * @param {{ 
	 * 			IDClient: string; 
	 * 			name: string; 
	 * 			skinCharacter: string;
	 *			health: { now: number; max: number; }; 
	 *			level: string; 
	 *			experience: { now: number; max: number; }; 
	 *			money: number; 
	 *			posWorld: { X: number; Y: number; }; 
	 *			direction: number; }} datos
	 */
    constructor (datos) {
		/** @type {string} */
        this.id = datos.IDClient;
        
		/** @type {string} */
		this.name = datos.name;
		
        this.skinCharacter = new Image();

		/** @type {string} */
		this.skinCharacter.src = datos.skinCharacter;

		/** @type {{ x: number; y: number; }} */
		this.posWorld = {x: datos.posWorld.X, y: datos.posWorld.Y};
		
		/** @type {DirectionsEnums.directions()} */
		this.dir = DirectionsEnums.directions().Down;

		/** @type {number} */
		this.frame = 0;

		/** @type {boolean} */
		this.moving = false;

		/** @type {ActionStateEnums.ActionState()}  */
		this.mode = ActionStateEnums.ActionState().Stand;
		////////////////////////

		//this.sound = new SoundManager();
		this.currhp = 0;
		this.alive = true;
		this.finalDirection;
		this.fightFrame = 0;
		this.convPos = 0;
		this.movingDir;
		this.hitSpeed = 960;
		this.lastStrike = 0;
		this.moveInterrupt = false;
		this.stepCount = 0;
		this.goAttack = false;
		this.goToNpc = false;
		this.fighting = false;
		this.playerAttacksEnemyID = null;
		this.moveAmount = 2;
		this.strength = 50;
		this.gotHit = false;
		this.hitArray = [];
		this.inventory = [];
		this.inventoryMax = 18;
		this.inventoryCol = 0;
		this.inventoryRow = 0;
		this.inventoryBox = 0;
		this.itemSlotsTaken = 0;
		this.lastHitPointUpdate = Date.now();
		this.lastHitUpdate = Date.now();
		this.lastFrameUpdate = Date.now();
		this.conversation = [];
		this.openQuests = [];
		this.closedQuests = [];
		this.pendingQuest = [];
		this.rewardCompleted;
		this.waitForQuestConfirmation = false;
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

    getDir () {
		return this.dir;
	}

	getMode () {
		return this.mode;
	}

    isMoving () {
		return this.moving;
	}

	isFighting () {
		return this.fighting;
	}

/* ------------------------------ *
    SETTERS
* ------------------------------ */
	
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	setPosWorld (x, y) {
		this.posWorld.x = x;
		this.posWorld.y = y;
	}

/* ------------------------------ *
    FUNCIONES
* ------------------------------ */
	nextFrame () {
		if(this.frame < 3) {
			this.frame++;
		} else {
			this.frame = 0;
		}
	}

	updateFrame () {
		if (
			(this.mode === ActionStateEnums.ActionState().Stand && (Date.now() - this.lastFrameUpdate > 300)) ||
			(this.mode !== ActionStateEnums.ActionState().Stand && (Date.now() - this.lastFrameUpdate > 150))
		) {
			this.lastFrameUpdate = Date.now();
			this.nextFrame();
		}
	}

/* ------------------------------ *
    DRAW
* ------------------------------ */
	drawMode (ctx, cX, cY) {
		const spriteWidth = 64, spriteHeight = 55;
		
		ctx.drawImage(this.skinCharacter, this.frame * spriteWidth, ((this.dir * spriteHeight) + ((spriteHeight * 4) * this.mode)), spriteWidth, spriteHeight, (cX - 16), (cY - 32), spriteWidth, spriteHeight);
	}
}