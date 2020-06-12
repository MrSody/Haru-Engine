export default class Player {
    constructor (datos) {
        console.log("datos pj"+ datos.name);
        this.id = datos.id;
        this.name = datos.name;
        this.skinBase = new Image();
		this.skinBase.src = datos.skinBase;
		
		this.posWorld = {X: datos.posWorld.x, Y: datos.posWorld.y};
		
		this.dir = 2;
		this.frame = 0;
		this.moving = false;
		this.mode = 0, // 0 = parado, 1 = caminando, 2 = corriendo, 3 = fighting;

		////////////////////////

		this.speed = 480;

		//this.sound = new SoundManager();
		this.currhp = 0;
		this.alive = true;
		this.finalDir;
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
	
	setPosWorld (X, Y) {
		this.posWorld.X = X;
		this.posWorld.Y = Y;
	}

	setDir (dir) {
		this.dir = dir;
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
		if (this.mode == 0 && (Date.now() - this.lastFrameUpdate > 300)) {
			this.lastFrameUpdate = Date.now();
			this.nextFrame();
		} else if (this.mode > 0 && (Date.now() - this.lastFrameUpdate > 150)) {
			this.lastFrameUpdate = Date.now();
			this.nextFrame();
		}
	}

	drawMode (ctx, cXnull, cYnull) {
		const spriteWidth = 64, spriteHeight = 55;

		switch (this.mode) {
            case 0: //Parado
                ctx.drawImage(this.skinBase, this.frame * spriteWidth, ((this.dir * spriteHeight) + ((spriteHeight * 4) * this.mode)), spriteWidth, spriteHeight, (cXnull - 16), (cYnull - 16), spriteWidth, spriteHeight);
                break;
			case 1: //Caminado
                ctx.drawImage(this.skinBase, this.frame * spriteWidth, ((this.dir * spriteHeight) + ((spriteHeight * 4) * this.mode)), spriteWidth, spriteHeight, (cXnull - 16), (cYnull - 16), spriteWidth, spriteHeight);
                break;
            case 2: //Corriendo
                ctx.drawImage(this.skinBase, this.frame * spriteWidth, ((this.dir * spriteHeight) + ((spriteHeight * 4) * this.mode)), spriteWidth, spriteHeight, (cXnull - 16), (cYnull - 16), spriteWidth, spriteHeight);
                break;
            default:
                console.log("Error: No hay mode del personaje");
                break;
        }
	}
}