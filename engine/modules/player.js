class Player {
    /**
     * Checks whether or not the constraint is applicable for the notice subtype indicated by the current Context.
     * 
     * @constructor
     * @param {number} id 
     * @param {{ 
     *           IDClient: string; 
     *           name: string; 
     *           health: number; 
     *           level: number; 
     *           experience: number; 
     *           money: number; 
     *           LOCATION: {
     *                       idMap: number; 
     *                       posX: number; 
     *                       posY: number;
     *                   } 
     *   }}  datos
     * @param {string} skinBase
     * @param {string} skinHair
     */
    constructor (IDClient, datos, skinBase, skinHair) {
        /** @type {string} */
        this._IDClient = IDClient;

		// Datos Basicos
        /** @type {number} */
        this.IDPj = datos.id;

        /** @type {string} */
        this.name = datos.name;

        /** @type {string} */
        this.skinBase = skinBase;
        
        /** @type {string} */
        this.skinHair = skinHair;

        /** @type {{ now: number; max: number; }} */
        this.health = {now: datos.health, max: datos.health};

        /** @type {string} */
        this.level = datos.level;

        /** @type {{ now: number; max: number; }} */
        this.experience = {now: datos.experience, max: 800 * (this.level + 2)};

        /** @type {number} */
        this.money = datos.money;

        /** @type {string} Id map*/
        this.IDMap = datos.LOCATION.idMap;

        /** @type {{ X: number; Y: number; }} */
        this.posWorld = {X: datos.LOCATION.posX, Y: datos.LOCATION.posY};

        /** @type {number} direction player in the map */
		this.direction = 2;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */

    /**
     * @param {string} IDMap
     */
    setIDMap (IDMap) {
        this.IDMap = IDMap;
    }

    /**
     * @param {number} X
     * @param {number} Y
     */
    setPosWorld (X, Y) {
        this.posWorld.X = X;
        this.posWorld.Y = Y;
    }

    /**
     * @param {number} direction
     */
    setDirection (direction) {
        this.direction = direction;
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    get IDClient () {
		return this._IDClient;
	}

    /**
     * @returns {{ IDPj: number; name: string; skinBase: string; skinHair: string; health: { now: number; max: number; }; level: string; experience: { now: number; max: number; }; money: number; posWorld: { X: number; Y: number; }; direction: number; }}
     */
    getDataSend () {
        return {
                IDPj : this.IDPj,
                name: this.name,
                skinBase: this.skinBase,
                skinHair: this.skinHair,
                health: this.health,
                level: this.level,
                experience: this.experience,
                money: this.money,
                posWorld: this.posWorld,
		        direction: this.direction,
        }
    }

/* ------------------------------ *
    FUNCTIONS
* ------------------------------ */
}

exports.Player = Player;