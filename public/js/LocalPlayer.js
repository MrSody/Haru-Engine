class LocalPlayer extends Player {
    constructor (datos) {
        super(datos);
        this.maxConcentration = datos.maxConcentration;
        this.experience = {now: datos.experience.now, max: 800 * (this.level + 2)};
        this.money = datos.money;
        this.jutsus = datos.jutsus;
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

        this.invocation = [];
        
        this.attackDistance = false;
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

    getInventoryMax () {
		return this.inventoryMax;
	}

    //////////////////////////////////////

    getThrowJutsu () {
        return this.throwJutsu;
    }

    getInvocation () {
        return this.invocation;
    }

    getAbsPos () {
		return this.absPos;
	}

    getDir () {
		return this.dir;
	}
    
    getAttackDistance () {
        return this.attackDistance;
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

    setSeals (seal) {
        console.log(`sellos ${seal}`);
        let seals = this.keyCodeToCodeJutsu(seal);
        if (Number.isInteger(seals)) {
            this.seals.push(seals);
        } else {
            this.seals.splice(0, this.seals.length);
        }
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

///////////////////////////////////////////

    setThrowJutsu (list) {
        this.throwJutsu = this.convertToVector(list);
    }

    setInvocation (invocation) {
        //fruits.unshift
        this.invocation = invocation;
    }

    setAbsPos (absX, absY) {
		this.absPos.absX = absX;
		this.absPos.absY = absY;
	}

    setDir (dir) {
		this.dir = dir;
	}
    
    setAttackDistance (value) {
        this.attackDistance = value;
    }

/* ------------------------------ *
    FUNCIONES
 * ------------------------------ */

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
            if (this.stepCount != 0) {

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

            if (this.stepCount < this.path.length-1 && !this.moveInterrupt) {
                //this.path.shift();
                this.stepCount++;
            } else { // End of path
                if(this.goFight != null) {
                    this.fighting = this.goFight;
                    this.mode = 1;
                } else if(this.goToNpc != null) {
                    this.talkingTo = this.goToNpc;
                }
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

/* ------------------------------ *
    DRAW
* ------------------------------ */

	draw (ctx, cXnull, cYnull) {
        const tileSize = 32;
        cXnull *= tileSize;
        cYnull *= tileSize;

		if (this.moving && (Date.now() - this.lastFrameUpdate > 150)) {
			this.lastFrameUpdate = Date.now();
			this.nextFrame();
		} else if (!this.moving) {
			this.frame = 0;
		}

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

}