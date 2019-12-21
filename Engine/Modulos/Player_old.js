var cls = require("./Class").Class;

var Player = cls.extend({
	init: function (id, datos, posX, posY, jutsus, skinBase, skinPelo){
		this.id = id;
		// Datos Basicos
        this.IDpj = datos.id;
        this.playerName = datos.nombre;
        this.skinBase = skinBase;
        this.skinPelo = skinPelo;
        this.health = {now: datos.salud, max: datos.salud};
        //this.grade = datos.grade;
        this.level = datos.nivel;
        this.experience = {now: datos.xp, max: 800 * (this.level + 2)};
        this.money = datos.dinero;
        this.jutsus = jutsus;
        // Atributos
        this.attribute = {
            force: datos.statFuerza,
            agility: datos.statAgilidad,
            intelligence: datos.statInteligencia,
            seals: datos.statSellos,
            resistance: datos.statResistencia,
            vitality: datos.statVitalidad,
            skill: datos.statSkill,
            perception: datos.statPercepcion
        };
        this.maxConcentration = Math.round((this.attribute.skill * 12) + (this.attribute.seals * 30));
        // Datos Mapa
        this.IDmap = datos.Nmap;
        this.pos = {x: datos.X, y: datos.Y};
        this.posWorld = {x: posX, y: posY};
        this.sizeScreen = {width: 0, height: 0};
		this.dir = 2;
        // Datos Teclado
        this.keyBoard = {
            accion1: 81, // Q
            accion2: 87, // W
            accion3: 69, // E
            accion4: 82, // R
            accion5: 84, // T
            accion6: 65, // A
            accion7: 83, // S
            accion8: 68, // D
            accion9: 70, // F
            accion0: 71, // G
            textJutsus: 0
        };
        // Datos Actuales
        //BUFF
        this.buffActive = [];
        this.deBuffActive = [];

        //grupo
        this.group = [];


		this.alive = true;
		this.currhp = 0;
		this.goAttack = false;
		this.fighting = false;
		this.strength = 50;
		this.lastStrike = 0;
		this.hitSpeed = 500;
		this.playerAttacksEnemyID = null;
	},

/* ------------------------------ *
    FUNCIONES DE AYUDA
* ------------------------------ */

/* ------------------------------ *
    GETTERS
 * ------------------------------ */

    getID: function() {
		return this.id;
	},

    getIDpj: function() {
        return this.IDpj;
    },

    getIDmap: function() {
        return this.IDmap;
    },

    getPos: function() {
        return this.pos;
    },

    getPosWorld: function() {
        return this.posWorld;
    },

	getName: function() {
		return this.playerName;
	},

	getDir: function() {
		return this.dir;
	},

    getJutsus: function() {
        return this.jutsus;
    },

    getSizeScreen: function() {
        return this.sizeScreen;
    },

    getAttribute: function() {
        return this.attribute;
    },

    getBuffActive: function() {
        return this.buffActive;
    },

    getDeBuffActive: function() {
        return this.deBuffActive;
    },

    getGroup: function() {
        return this.group;
    },



	getStrength: function() {
		return this.strength;
	},

	getEnemyID: function() {
		return this.playerAttacksEnemyID;
	},

	getLastStrike: function() {
		return this.lastStrike;
	},

	getHitSpeed: function() {
		return this.hitSpeed;
	},

	getCurrHP: function() {
		return this.currhp;
	},

	getHurt: function(amount) {
		this.currhp -= amount;
		if(this.currhp < 0) {
			this.currhp = 0;
			this.alive = false;
		}
	},

/* ------------------------------ *
    SETTERS
 * ------------------------------ */

	setID: function(id) {
		this.id = id;
	},

	setEnemyID: function(id) {
		this.playerAttacksEnemyID = id;
	},

	setX: function(newX) {
		this.pos.x = newX;
	},

	setY: function(newY) {
		this.pos.y = newY;
	},

    setPosWorldX: function(posX) {
        this.posWorld.x = posX;
    },

    setPosWorldY: function(posY) {
        this.posWorld.y = posY;
    },

    setIDMap: function(IDMap) {
        this.IDmap = IDMap;
    },

    setDirection: function(direction) {
		this.dir = direction;
	},

    setSizeScreen: function(width, height) {
        this.sizeScreen.width = width;
        this.sizeScreen.height = height;
    },

    setBuffActive: function(mode, buff) {
        var pos = this.buffActive.indexOf(buff);

        if(mode) {
            if(pos != -1) {
                this.buffActive.push(buff);
            }
        } else {
            this.buffActive.splice(1, pos);
        }
    },

    setDeBuffActive: function(mode, deBuff) {
        if(mode) {
            this.deBuffActive.push(deBuff);
        } else {
            var pos = this.deBuffActive.indexOf(deBuff);
            this.deBuffActive.splice(1, pos);
        }
    },



    setLastStrike: function(time) {
		this.lastStrike = time;
	},

	setRestart: function(bool) {
		this.restart = bool;
	},

	setGoAttackTrue: function() {
		this.goAttack = true;
	},

	setGoAttackFalse: function() {
		this.goAttack = false;
		this.fighting = false;
	},

/* ------------------------------ *
    FUNCIONES
* ------------------------------ */

    isAlive: function() {
		return this.alive;
	},

    isGoingToFight: function() {
		return (this.goAttack || this.fighting);
	},

    isFighting: function() {
		return this.fighting;
	},

    inFight: function() {
		this.fighting = true;
	},

	readyToHit: function() {
		return (this.fighting && (Date.now() - this.lastStrike > this.hitSpeed));
	},

	takeItem: function(type, change) {
		if(type == 0) {
			this.currhp += change;
		}
		else if(type == 1) {
			this.money += change;
		}
	}

});

// Export the Player class so you can use it in other files by using require("Player").Player
exports.Player = Player;
