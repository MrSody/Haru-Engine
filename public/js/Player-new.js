class Player {
    constructor (datos) {
        this.id = datos.id;
        this.name = datos.name;
        this.skinBase = new Image();
        this.skinBase.src = datos.skinBase;
        this.skinPelo = new Image();
        //this.skinPelo.src = datos.skinPelo;
        this.skinPelo.src = 'sprites/player_complete.png';
        this.health = {now: datos.health.now, max: datos.health.max};
        ///this.grade = datos.grade;
        this.level = datos.level;
        // Atributos
        this.attribute = {
            force: datos.attribute.force,
            agility: datos.attribute.agility,
            intelligence: datos.attribute.intelligence,
            seals: datos.attribute.seals,
            resistance: datos.attribute.resistance,
            vitality: datos.attribute.vitality,
            skill: datos.attribute.skill,
            perception: datos.attribute.perception
        };

        this.pos = {x: datos.posWorld.x, y: datos.posWorld.y};

		//this.sound = new SoundManager();
		this.currhp = 0;
		this.dir = 2;
		this.frame = 0;
		this.alive = true;
		this.finalDir;
		this.fightFrame = 0;
		this.convPos = 0;
		this.moving = false;
		this.movingDir;
		this.path = [[]];
		this.speed = 100;
		this.mode = 0, // 0 = normal, 1 = fighting;
		this.hitSpeed = 500;
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
		this.tileSize;
		this.worldSize;
		this.worldRight;
		this.worldBottom;
		this.conversation = [];
		this.lastHitPointUpdate = Date.now();
		this.lastHitUpdate = Date.now();
		this.lastFrameUpdate = Date.now();
		this.conversation = [];
		this.openQuests = [];
		this.closedQuests = [];
		this.pendingQuest = [];
		this.rewardCompleted;
		this.waitForQuestConfirmation = false;

		// Sounds
		this.stepSnd = new Audio("sounds/walk.ogg");
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

    //////////////////////////////////////

	getHurt (amount) {
		this.currhp -= amount;
		this.sound.playSound("hurt");

		if (this.currhp <= 0) {
			this.currhp = 0;
			this.alive = false;
		}
		this.gotHit = true;
		this.hitArray.push([amount, 1.0]);
	}

/* ------------------------------ *
    SETTERS
 * ------------------------------ */

    setPos (x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

	setLastStrike (time) {
		this.lastStrike = time;
	}

	setEnemyID (id) {
		this.playerAttacksEnemyID = id;
	}

	setCurrHP (value) {
		this.currhp = value;
	}

/* ------------------------------ *
    FUNCIONES
 * ------------------------------ */

    playerQuests () {
		return this.openQuests;
	}

	enemyID () {
		return this.playerAttacksEnemyID;
	}

	strength () {
		return this.strength;
	}

	lastStrike () {
		return this.lastStrike;
	}

	currhp () {
		return this.currhp;
	}

	itemSlotsTaken () {
		return this.itemSlotsTaken;
	}

	level () {
		return this.playerLevel;
	}

	questConfirmationPending (questID, status, type, id, target, amount, itemReward, coinReward, shortDesc) {
		console.log("questConfirmationPending");
		this.pendingQuest = [questID, status, type, id, target, amount, itemReward, coinReward, false, shortDesc];
		this.waitForQuestConfirmation = true;
	}

	updateQuest (id, amount) {
		this.openQuests[id][5] += amount;
		console.log("Quest updated, amount: "+this.openQuests[id][5]+", target: "+this.openQuests[id][4]);
	}

	questCompleted (id) {
		console.log("Quest completed")
		this.openQuests[id][1] = 2;
	}

	rewardQuest (id) {
		this.rewardCompleted = id;
	}

	addXP (amount) {
		this.xp += amount;
		if (this.xp >= this.xpForLevel(this.playerLevel)) {
			this.playerLevel += 1;
		}
		this.displayStats();
	}

	xp () {
		return this.xp;
	}

	isGoingToFight () {
		return (this.goAttack || this.fighting);
	}

	isFighting () {
		return this.fighting;
	}

	initInventory () {
		for (let i = 0; i < this.inventoryMax; i += 1) {
			this.inventory[i] = null;
		}
	}

	talkToNPC (conv) {
		this.conversation = conv;
	}

	playSwordSound () {
		this.sound.playSound("sword");

		this.fightFrame = 0;
		let hit = setInterval(() => {
			let strikeDelta = Date.now() - this.lastHitUpdate;
			if (strikeDelta > 100 && this.fightFrame < 2) {
				this.lastUpdateTime = Date.now();
				this.nextFrame();
			} else if (strikeDelta > 500 && this.fightFrame == 2) {
				clearTimeout(hit);
			}
		}, 50);
	}

	nextFrame () {
		if (this.fightFrame == 2) {
			this.fightFrame = 2;
		} else {
			this.fightFrame++;
		}
	}

	useItem (box) {
		let inventory = this.inventory,
            boxID = ($(box).attr("id").substring(3));

        if (this.inventory[boxID] != null) {
			if (this.inventory[boxID][0] == 0 && this.currhp < this.maxhp) {
				this.sound.playSound("potion");
				this.currhp+=20;
				if (this.currhp > this.maxhp) {
					this.currhp = this.maxhp;
				}
			}

			// Decrease amount of that item
			this.inventory[boxID][1]--;

			// More than 2 of that items left, decrease index
			if (this.inventory[boxID][1] > 1) {
				$('#box'+boxID+'index').html(inventory[boxID][1]);
			}
			// Exactly 2 of that item left, remove index
			else if(this.inventory[boxID][1] == 1) {
				$('#box'+boxID+'index').html("");
			}
			// Just one left, remove item from inventory
			else {
				this.inventory[boxID] = null;
				$(box).css({
					backgroundImage: ''
				});
				$(box).off('mouseenter mouseleave');
				$("#details").addClass("hideClass");
			}
		}
		this.displayStats();
	}

	takeItem (type, change) {
		let itemPath,
            foundItem = false,
            self = this;

		if (type == 0) {
			itemPath = "healthPotion.png";
		} else if(type == 1) {
			this.money += change;
			this.sound.playSound("coins");
			this.displayStats();
			return;
		}

		// Search inventory for that item
		for (let i = 0, max = this.inventory.length; i < max; i += 1) {
			if (this.inventory[i] != null && this.inventory[i][0] == type) {
				this.inventory[i][1]++;
				$('#box'+i+'index').html(self.inventory[i][1]);
				foundItem = true;
				break;
			}
		}

		// Add new item to inventory
		if (!foundItem) {
			let self = this;
			for (let i = 0, max = this.inventory.length; i < max; i += 1) {
				if (this.inventory[i] == null) {
					$('#box'+i).css({
						backgroundImage: 'url(sprites/'+itemPath+')'
					});
					$('#box'+i).hover(function() {self.showItemDetails(type, $(this).offset().left, $(this).offset().top);}, function() {self.hideItemDetails();});
					this.inventoryBox++;
					var newItem = [type, 1];
					this.inventory[i] = newItem;
					break;
				}
			}
		}
		// Play loot.ogg
		this.sound.playSound("loot");
	}

	showItemDetails (type, left, top) {
		$("#details").removeClass("hideClass");
		$("#details").css({
			left: left+50,
			top: top+50
		});
		console.log("Show details, type: "+type+", left: "+left+", top: "+top);
		switch(type) {
			case 0:
			$("#details").html("Potion</br>Regenerates 20 HP");
		}
	}

	hideItemDetails () {
		$("#details").addClass("hideClass");
	}

	talk () {
		let self = this;
		$("#convText").html(this.conversation[this.convPos]);
		if (this.rewardCompleted != null) {
			if (this.openQuests[this.rewardCompleted][6] != null) {
				this.takeItem(0, null);
			}
			if (this.openQuests[this.rewardCompleted][7] != null) {
				this.takeItem(1, 500);
			}
			this.openQuests[this.rewardCompleted][8] = true;
			this.rewardCompleted = null;
		}
		if (this.convPos < this.conversation.length - 1) {
			$("#convButton1").html("Next");
			this.convPos++;
			$("#convButton1").unbind('click');
			let talk = this.talk();
			$("#convButton1").click(function (){talk;});
		} else {
			this.convPos = 0;
			$("#convButton1").html("Good Bye!");
			$("#convButton1").unbind('click');
			$("#convButton1").click(function (){$("#conversation").addClass("hideClass"); if(self.waitForQuestConfirmation) {self.showQuestConfDialog();}});
		}
	}

	showQuestConfDialog () {
		let self = this;
		//$("#questConfirmation").removeClass("hideClass");
		console.log("showQuestConfDialog");
		$("#confirmation").removeClass("hideClass");
		$("#yes").click(function() {self.confirmQuest(); $("#confirmation").addClass("hideClass");});
		$("#no").click(function() {self.declineQuest(); $("#confirmation").addClass("hideClass");});
	}

	confirmQuest () {
		this.openQuests.push(this.pendingQuest);
		console.log("Player got a new Quest with id"+this.pendingQuest[0]+", openQuests.length: "+this.openQuests.length);
		this.pendingQuest = [];
		this.waitForQuestConfirmation = false;
		$("#yesButton").unbind('click');
		$("#noButton").unbind('click');
	}

	declineQuest () {
		this.pendingQuest = [];
		this.waitForQuestConfirmation = false;
	}

	stopTalking () {
		this.convPos = 0;
		$("#conversation").addClass("hideClass");
		console.log("Hide conversation");
	}

	nextFrame () {
		if (this.frame < 3) {
			this.frame++;
		} else {
			this.frame = 0;
		}
	}

}
