class Player {
    constructor (id, datos, pos, skinBase, skinPelo) {
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
        // Datos Mapa
        this.IDmap = datos.Nmap;
        this.pos = {x: datos.X, y: datos.Y};
        this.posWorld = {x: pos.X, y: pos.Y};
        this.sizeScreen = {width: 0, height: 0};
		this.dir = 2;

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

    getSizeScreen () {
        return this.sizeScreen;
    }

    getGroup () {
        return this.group;
    }
}

exports.Player = Player;