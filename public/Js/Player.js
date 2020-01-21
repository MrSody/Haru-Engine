class Player {
    constructor (datos) {
        console.log("datos pj"+ datos.name);
        this.id = datos.id;
        this.name = datos.name;
        this.skinBase = new Image();
        this.skinBase.src = datos.skinBase;
        
		this.pos = {x: datos.posWorld.x, y: datos.posWorld.y};
		
		this.lastFrame = 0;

		////////////////////////

		this.dir = 2;
		this.frame = 0;
		this.path = [[]];
		this.speed = 480;

		//this.sound = new SoundManager();
		this.currhp = 0;
		this.alive = true;
		this.finalDir;
		this.fightFrame = 0;
		this.convPos = 0;
		this.moving = false;
		this.movingDir;
		this.mode = 0, // 0 = normal, 1 = fighting;
		this.hitSpeed = 960;
		this.lastStrike = 0;
		this.moveInterrupt = false;
		this.stepCount = 0;
		this.goAttack = false;
		this.goToNpc = false;
		this.fighting = false;
		this.playerAttacksEnemyID = null;
		this.bgPos = {x: 0, y: 0};
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

    getPos () {
        return this.pos;
    }

    getName () {
		return this.name;
    }

    getDir () {
		return this.dir;
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

    setPos (x, y) {
        this.pos.x = x;
        this.pos.y = y;
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

}