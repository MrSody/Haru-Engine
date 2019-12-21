class Player {
    constructor (id, datos, posX, posY, jutsus, skinBase, skinPelo) {
        this.id = id;
		// Datos Basicos
        this.IDpj = datos.id;
        this.name = datos.nombre;
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

        // Invocaciones - IDPlayers
        this.invocation = [];

        //grupo
        this.group = [];

		this.alive = true;
		this.currhp = 0;
		this.goAttack = false;
		this.strength = 50;
		this.lastStrike = 0;
		this.hitSpeed = 500;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */

    setID (id) {
		this.id = id;
	}

	setEnemyID (id) {
		this.playerAttacksEnemyID = id;
	}

    setIDMap (IDMap) {
        this.IDmap = IDMap;
    }

	setPos (newX, newY) {
		this.pos.x = newX;
        this.pos.y = newY;
	}

    setPosWorld (posX, posY) {
        this.posWorld.x = posX;
        this.posWorld.y = posY;
    }

    setDirection (direction) {
		this.dir = direction;
	}

    setSizeScreen (width, height) {
        this.sizeScreen.width = width;
        this.sizeScreen.height = height;
    }

    setBuffActive (mode, buff) {
        var pos = this.buffActive.indexOf(buff);

        if(mode) {
            if(pos != -1) {
                this.buffActive.push(buff);
            }
        } else {
            this.buffActive.splice(1, pos);
        }
    }

    setDeBuffActive (mode, deBuff) {
        if(mode) {
            this.deBuffActive.push(deBuff);
        } else {
            var pos = this.deBuffActive.indexOf(deBuff);
            this.deBuffActive.splice(1, pos);
        }
    }

    setInvocation (mode, invocation) {
        if (mode) {
            this.invocation.push(invocation);
        } else {
            let pos = this.invocation.indexOf(invocation);
            this.invocation.splice(1, pos);
        }
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */

    getID () {
		return this.id;
	}

    getIDPJ () {
        return this.IDpj;
    }

    getIDmap () {
        return this.IDmap;
    }

    getPos () {
        return this.pos;
    }

    getPosWorld () {
        return this.posWorld;
    }

	getName () {
		return this.name;
	}

	getDir () {
		return this.dir;
	}

    getJutsus () {
        return this.jutsus;
    }

    getSizeScreen () {
        return this.sizeScreen;
    }

    getAttribute () {
        return this.attribute;
    }

    getBuffActive () {
        return this.buffActive;
    }

    getDeBuffActive () {
        return this.deBuffActive;
    }

    getInvocation () {
        return this.invocation;
    }

    getGroup () {
        return this.group;
    }

    getHealth () {
        return this.health;
    }

    maxConcentration () {
        return Math.round((this.attribute.skill * 12) + (this.attribute.seals * 30));
    }

/* ------------------------------ *
    GETTERS - CLON
* ------------------------------ */

    getDataPlayer (health, IDmap, posX, posY) {
        return {
            id: this.IDpj,
            nombre: this.name,
            skinBase: this.skinBase,
            skinPelo: this.skinPelo,
            salud: health,
            //grade: this.grade,
            nivel: this.level,
            xp: 0,
            dinero: this.money,
            // Atributos
            statFuerza: this.attribute.force,
            statAgilidad: this.attribute.agility,
            statInteligencia: this.attribute.intelligence,
            statSellos: this.attribute.seals,
            statResistencia: this.attribute.resistance,
            statVitalidad: this.attribute.vitality,
            statSkill: this.attribute.skill,
            statPercepcion: this.attribute.perception,
            // Datos Mapa
            Nmap: IDmap,
            X: posX,
            Y: posY,
        };
    }
}

// Export the Player class so you can use it in other files by using require("Player").Player
exports.Player = Player;