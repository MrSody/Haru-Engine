class Player {
    constructor (id, datos, posWorldX, posWorldY, skinBase, skinHair) {
        this.id = id;
		// Datos Basicos
        this.IDPj = datos.ID;
        this.name = datos.name;
        this.skinBase = skinBase;
        this.skinHair = skinHair;
        this.health = {now: datos.health, max: datos.health};
        this.level = datos.level;
        this.experience = {now: datos.xp, max: 800 * (this.level + 2)};
        this.money = datos.money;
        // Datos Mapa
        this.IDMap = datos.IDMap;
        this.pos = {x: datos.X, y: datos.Y};
        this.posWorld = {x: posWorldX, y: posWorldY};
		this.direction = 2;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */
    setIDMap (IDMap) {
        this.IDMap = IDMap;
    }

	setPos (X, Y) {
		this.pos.x = X;
        this.pos.y = Y;
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

    getPos () {
        return this.pos;
    }

    getPosWorld () {
        return this.posWorld;
    }

	getDir () {
		return this.direction;
	}
}

exports.Player = Player;