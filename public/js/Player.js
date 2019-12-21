class Player {
    constructor (datos, remocal) {
        console.log("datos pj"+ datos.playerName);
        this.id = datos.id;
        this.name = datos.playerName;
        this.skinBase = new Image();
        this.skinBase.src = datos.skinBase;
        this.skinPelo = new Image();
        //this.skinPelo.src = datos.skinPelo;
        this.skinPelo.src = 'sprites/player_complete.png';
        this.health = {now: datos.health.now, max: datos.health.max};
        this.maxConcentration = datos.maxConcentration;
        ///this.grade = datos.grade;
        this.level = datos.level;
        this.experience = {now: datos.experience.now, max: 800 * (this.level + 2)};
        this.money = datos.money;
        this.jutsus = datos.jutsus;
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

        this.pos = {x: 0, y: 0};
        this.posWorld = {x: datos.posWorld.x, y: datos.posWorld.y};
		this.absPos = {absX: 0, absY: 0};

        // Teclado
        this.keyBoard = {
            accion1: datos.keyBoard.accion1, // Q
            accion2: datos.keyBoard.accion2, // W
            accion3: datos.keyBoard.accion3, // E
            accion4: datos.keyBoard.accion4, // R
            accion5: datos.keyBoard.accion5, // T
            accion6: datos.keyBoard.accion6, // A
            accion7: datos.keyBoard.accion7, // S
            accion8: datos.keyBoard.accion8, // D
            accion9: datos.keyBoard.accion9, // F
            accion0: datos.keyBoard.accion0, // G
            textJutsus: datos.keyBoard.textJutsus
        };
        // Client
        this.seals = [];
        this.throwJutsu = [];
        this.countConcentration = 0;


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
    FUNCIONES DE AYUDA
 * ------------------------------ */

    keyCodeToCodeJutsu (key) {
        switch(key) {
            case this.keyBoard.accion1:
                return 1;
            case this.keyBoard.accion2:
                return 2;
            case this.keyBoard.accion3:
                return 3;
            case this.keyBoard.accion4:
                return 4;
            case this.keyBoard.accion5:
                return 5;
            case this.keyBoard.accion6:
                return 6;
            case this.keyBoard.accion7:
                return 7;
            case this.keyBoard.accion8:
                return 8;
            case this.keyBoard.accion9:
                return 9;
            case this.keyBoard.accion0:
                return 0;
            case 32:
                return 32;
            default:
                return false;
        }
    }

    codeJutsuTokeyCode (key) {
        switch(key) {
            case '1':
                return this.keyBoard.accion1;
            case '2':
                return this.keyBoard.accion2;
            case '3':
                return this.keyBoard.accion3;
            case '4':
                return this.keyBoard.accion4;
            case '5':
                return this.keyBoard.accion5;
            case '6':
                return this.keyBoard.accion6;
            case '7':
                return this.keyBoard.accion7;
            case '8':
                return this.keyBoard.accion8;
            case '9':
                return this.keyBoard.accion9;
            case '0':
                return this.keyBoard.accion0;
            default:
                return "";
        }
    }

    convertToVector (list) {
        var vector = [];

        list.forEach((element) => {
            vector.push(element);
        });

        return vector;
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

    getPosWorld () {
        return this.posWorld;
    }

	getAbsPos () {
		return this.absPos;
	}

    getName () {
		return this.name;
	}

	getDir () {
		return this.dir;
	}

    getHealth () {
        return this.health;
    }

    getJutsus () {
        return this.jutsus;
    }

    getSeals () {
        return this.seals;
    }

    getConcentration () {
        let min = 2, seg = 0, maxConcentration = this.maxConcentration;

        while (maxConcentration > 0) {
            if ((maxConcentration - 60) >= 60) {
                maxConcentration -= 60;
                min += 1;
            } else {
                seg += maxConcentration;
                maxConcentration -= maxConcentration;
            }
        }

        return {min: min, seg: seg};
    }

    isMoving () {
		return this.moving;
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

	getInventoryMax () {
		return this.inventoryMax;
	}

    //////////////////////////////////////
    getThrowJutsu () {
        return this.throwJutsu;
    }

/* ------------------------------ *
    SETTERS
 * ------------------------------ */

    setPosWorld (x, y) {
        this.posWorld.x = x;
        this.posWorld.y = y;
    }

    setAbsPos (absX, absY) {
		this.absPos.absX = absX;
		this.absPos.absY = absY;
	}

    setDir (dir) {
		this.dir = dir;
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

    setSeals (seal) {
        console.log(`sellos ${seal}`);
        let seals = this.keyCodeToCodeJutsu(seal);
        if (Number.isInteger(seals)) {
            this.seals.push(seals);
        } else {
            this.seals.splice(0, this.seals.length);
        }
    }

    ///

	setWorldData (tileSize, worldRight, worldBottom) {
		this.tileSize = tileSize;
		this.worldSize = worldRight;
		this.worldBottom = worldBottom * tileSize;
        this.worldRight = worldRight * tileSize;
	}

	setLastStrike (time) {
		this.lastStrike = time;
	}

	setGoToNpc (value) {
		this.goToNpc = value;
		this.stopTalking();
	}

	setGoAttack (value) {
		this.goAttack = value;
		if(value == false) {
			this.fighting = false;
			this.mode = 0;
		}
	}

	setMoveInterrupt (value) {
		this.moveInterrupt = value;
	}

	setEnemyID (id) {
		this.playerAttacksEnemyID = id;
	}

	setCurrHP (value) {
		this.currhp = value;
	}

    ///////////////////////////////////////////

    setThrowJutsu (list) {
        this.throwJutsu = this.convertToVector(list);
    }

/* ------------------------------ *
    FUNCIONES
 * ------------------------------ */

    // Actualiza la posicion del jugador remoto
    posNow (width, height, posWorld) {

        let widthMap = Math.round((width / 2) / 32),
            heightMap = Math.round((height / 2) / 32),
            posIntX = Math.floor(posWorld.x - widthMap),
            posIntY = Math.floor(posWorld.y - heightMap),
            posEndX = Math.floor(posWorld.x + widthMap),
            posEndY = Math.floor(posWorld.y + heightMap);

        if ((posIntX >= this.posWorld.x || this.posWorld.x <= posEndX) && (posIntY >= this.posWorld.y || this.posWorld.y <= posEndY)) {
            for(var y = 0, intY = posIntY; intY <= posEndY; intY++, y++) {
                for(var x = 0, intX = posIntX; intX <= posEndX; intX++, x++) {

                    if (this.posWorld.x == intX && this.posWorld.y == intY) {
                        this.pos.x = x;
                        this.pos.y = y;
                        return true;
                    }
                }
            }
        }

        return false;
    }

    showJutsus (jutsus) {
        let html = "";

        for (var s = 0; s < jutsus.length; s++) {
            html +=
            '<div id="jutsu">'+
            '<strong id="nomJutsu">'+ jutsus[s][2][this.keyBoard.textJutsus] +'</strong>'+
            '<div class="row">'+
            '<div class="col">'+ String.fromCharCode(this.codeJutsuTokeyCode(jutsus[s][1].Sello_1)) +'</div>'+
            '<div class="col">'+ String.fromCharCode(this.codeJutsuTokeyCode(jutsus[s][1].Sello_2)) +'</div>'+
            '<div class="col">'+ String.fromCharCode(this.codeJutsuTokeyCode(jutsus[s][1].Sello_3)) +'</div>'+
            '<div class="col">'+ String.fromCharCode(this.codeJutsuTokeyCode(jutsus[s][1].Sello_4)) +'</div>'+
            '<div class="col">'+ String.fromCharCode(this.codeJutsuTokeyCode(jutsus[s][1].Sello_5)) +'</div>'+
            '</div>'+
            '</div>';
        }
        $('#CAyudajutsus').empty();
        $('#CAyudajutsus').append( html );
    }

    displayHub () {
        this.displayStats();

        this.displayCharacter();
    }

    displayStats () {
        let health = this.health,
            name = this.name;

        $('#nombre').text(name);
        $('#salud').text(health.now +' / '+ health.max);
	}

    displayCharacter () {

        let containerCharacter = this.displayContainerCharacter(),
            containerAttribute = this.displayContainerAttribute(),
            containerJutsus = this.displayContainerJutsus();


        $('#containerCharacter_Character').append( containerCharacter );
        $('#CAttribute').append( containerAttribute );
        $('#containerCharacter_Jutsu').append( containerJutsus );

        let characterCanvas = document.getElementById("containerCharacterCanvas");
        let ctx = characterCanvas.getContext("2d");
        ctx.globalAlpha = 1;

        ctx.drawImage(this.skinBase, 2 * 64, 2 * 48, 64, 48, 0, 0, characterCanvas.width, characterCanvas.height);
    }

    displayContainerCharacter () {
        return `<div>
                    <div>Nombre: ${this.name}</div>
                    <div>Rango:
                        <select>
                            <option>Estudiante</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        <div class="cuadroLeft">1</div>
                        <div class="cuadroLeft">2</div>
                        <div class="cuadroLeft">3</div>
                        <div class="cuadroLeft">4</div>
                    </div>
                    <div class="col-6" style="padding: 0px;">
                        <canvas id="containerCharacterCanvas" style="width: 100%; height: 100%;"></canvas>
                    </div>
                    <div class="col-3">
                        <div class="cuadroRight">1</div>
                        <div class="cuadroRight">2</div>
                        <div class="cuadroRight">3</div>
                        <div class="cuadroRight">4</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6">
                        <div class="cuadro mx-auto">1</div>
                    </div>
                    <div class="col-3"></div>
                </div>`;
    }

    displayContainerAttribute () {
        return `<div class="row">
                    <div class="col-6">
                        <div>Fuerza</div>
                        <div>Agilidad</div>
                        <div>Inteligencia</div>
                        <div>Sellos</div>
                        <div>Resistencia</div>
                        <div>Vitalidad</div>
                        <div>Destreza</div>
                        <div>Percepcion</div>
                    </div>
                    <div class="col-3">
                        <div>${this.attribute.force} / 5</div>
                        <div>${this.attribute.agility} / 5</div>
                        <div>${this.attribute.intelligence} / 5</div>
                        <div>${this.attribute.seals} / 5</div>
                        <div>${this.attribute.resistance} / 5</div>
                        <div>${this.attribute.vitality} / 5</div>
                        <div>${this.attribute.skill} / 5</div>
                        <div>${this.attribute.perception} / 5</div>
                    </div>
                    <div class="col-3">
                        <div>X / X</div>
                        <div>X / X</div>
                        <div>X / X</div>
                        <div>X / X</div>
                        <div>X / X</div>
                        <div>X / X</div>
                        <div>X / X</div>
                        <div>X / X</div>
                    </div>
                </div>`;
    }

    displayContainerJutsus () {

        let html = "",
            jutsus = this.jutsus;

        jutsus.forEach((jutsu) => {
            html += `<div id="jutsu">
                        <strong id="nomJutsu">${jutsu[2][this.keyBoard.textJutsus]}</strong>
                        <div class="row">
                            <div class="col">${String.fromCharCode(this.codeJutsuTokeyCode(jutsu[1].Sello_1))}</div>
                            <div class="col">${String.fromCharCode(this.codeJutsuTokeyCode(jutsu[1].Sello_2))}</div>
                            <div class="col">${String.fromCharCode(this.codeJutsuTokeyCode(jutsu[1].Sello_3))}</div>
                            <div class="col">${String.fromCharCode(this.codeJutsuTokeyCode(jutsu[1].Sello_4))}</div>
                            <div class="col">${String.fromCharCode(this.codeJutsuTokeyCode(jutsu[1].Sello_5))}</div>
                        </div>
                    </div>`;
        });

        return html;
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

    displayConcentration (min, seg) {

        if (min || seg) {
            let maxConcentration = this.getConcentration(),
                porcentaje = Math.round(((min * 100) + seg) * 100 / ((maxConcentration.min * 100) + maxConcentration.seg)),
                html =
                '<div id="concentracion" class="progress-bar" role="progressbar" aria-valuenow="'+ porcentaje +'" aria-valuemin="0" aria-valuemax="100" style="width: '+ porcentaje +'%;"></div>';

            $('#Cconcentracion').removeClass('Invisible');
            $('#Cconcentracion').empty();
            $('#Cconcentracion').append( html );
        } else {
            $('#Cconcentracion').addClass('Invisible');
            $('#Cconcentracion').empty();
        }
    }

    displayBuff (IDBuff, imgBuff, min, seg) {

        if (min || seg) {

            if (seg < 10) {
                seg = '0'+ seg;
            }

            let html =
            '<div class="Buff'+ IDBuff +'">'+
            '<div id="imgBuff"><img src="'+ imgBuff +'"></div>'+
            '<div id="timeBuff">'+ min +':'+ seg +'</div>'+
            '</div>';

            $('.Buff'+ IDBuff).remove();
            $('#CBuff').append( html );
        } else {
            $('.Buff'+ IDBuff).remove();
        }
    }

    ////////////

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

/* ------------------------------ *
    DRAW
* ------------------------------ */

    drawJutsu (ctx, cXnull, cYnull) {

        ctx.fillStyle = "#FFF";
        ctx.font = "9pt Minecraftia";
        ctx.fillText(this.name, cXnull, cYnull - 10);

        switch (parseInt(this.throwJutsu[1])) {
            case 2:
                //(data.ID, data.efecto, data.posLast, data.posNow);
                let posLast = this.throwJutsu[2];
                this.posWorld.x = this.throwJutsu[3].x;
                this.posWorld.y = this.throwJutsu[3].y;
                console.log("Bien2"+ (cXnull - (posLast.x * 32)) +"-"+ (cYnull - (posLast.y * 32)));

                // Posicion nueva
                ctx.drawImage(this.playersprite, this.frame*42, this.dir*43, 42, 43, cXnull, cYnull, 32, 32);

                // Posicion Antigua
                ctx.drawImage(this.playersprite, this.frame*42, this.dir*43, 42, 43, (cXnull - (posLast.x * 32)), (cYnull - (posLast.y * 32)), 32, 32);
                break;
        }
    }

	draw (ctx, cXnull, cYnull) {
		if (this.moving && (Date.now() - this.lastFrameUpdate > 150)) {
            console.log(`Moviendo ${Date.now()} - ${this.lastFrameUpdate}`);
			this.lastFrameUpdate = Date.now();
			this.nextFrame();
		} else if (!this.moving) {
			this.frame = 0;
		}

		//console.log("Draw player"+ this.dir);
		ctx.fillStyle = "#FFF";
		ctx.font = "9pt Minecraftia";
		//ctx.fillText(this.playerName, this.absPos["absX"] + cXnull, this.absPos["absY"] + cYnull-10);
        //nuevo
        ctx.fillText(this.name, cXnull, cYnull - 32);
		if (this.mode == 0) {
            //nuevo
            ctx.drawImage(this.skinBase, this.frame * 64, this.dir * 48, 64, 48, (cXnull - 16), (cYnull - 16), 64, 48);
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

    drawRemote (ctx, cXnull, cYnull) {
		if (this.moving && (Date.now() - this.lastFrameUpdate > 150)) {
            console.log(`Moviendo ${Date.now()} - ${this.lastFrameUpdate}`);
			this.lastFrameUpdate = Date.now();
			this.nextFrame();
		} else if (!this.moving) {
			this.frame = 0;
		}

		//console.log("Draw player"+ this.dir);
		ctx.fillStyle = "#FFF";
		ctx.font = "9pt Minecraftia";
		//ctx.fillText(this.playerName, this.absPos["absX"] + cXnull, this.absPos["absY"] + cYnull-10);
        //nuevo
        ctx.fillText(this.name +' , '+ this.level, cXnull, cYnull - 32);
        ctx.fillStyle="#000000";
        ctx.fillRect(cXnull, cYnull - 30, 50, 2);
        ctx.fillStyle="#FF0000";
        ctx.fillRect(cXnull, cYnull - 30, 40, 2);
		if (this.mode == 0) {
            //nuevo
            ctx.drawImage(this.skinBase, this.frame * 64, this.dir * 48, 64, 48, (cXnull - 16), (cYnull - 16), 64, 48);
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
