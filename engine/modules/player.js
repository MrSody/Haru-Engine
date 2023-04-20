class Player {
    constructor (id, datos, skinBase, skinHair) {
        this.id = id;
		// Datos Basicos
        this.IDPj = datos.id;
        this.name = datos.name;
        this.skinBase = skinBase;
        this.skinHair = skinHair;
        this.health = {now: datos.health, max: datos.health};
        this.level = datos.level;
        this.experience = {now: datos.experience, max: 800 * (this.level + 2)};
        this.money = datos.money;
        // Datos Mapa
        this.IDMap = datos.LOCATION.idMap;
        this.posWorld = {x: datos.LOCATION.posX, y: datos.LOCATION.posY};
		this.direction = 2;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */
    setIDMap (IDMap) {
        this.IDMap = IDMap;
    }

    setPosWorld (X, Y) {
        this.posWorld.x = X;
        this.posWorld.y = Y;
    }

    setDirection (direction) {
		this.direction = direction;
	}

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    getID () {
		return this.id;
	}

    getIDPJ () {
        return this.IDPj;
    }

    getName () {
		return this.name;
	}

    getIDMap () {
        return this.IDMap;
    }

    getPosWorld () {
        return this.posWorld;
    }

	getDir () {
		return this.direction;
	}

/* ------------------------------ *
    FUNCTIONS
* ------------------------------ */
}

exports.Player = Player;