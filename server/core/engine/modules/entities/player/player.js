let sharp = require('sharp');

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
     *              idMap: number; 
     *              posX: number; 
     *              posY: number;
     *           }
     *           SKIN: {
     *              base: string;
     *              hair: string;       
     *           }
     *   }}  data
     */
    constructor (IDClient, data) {
        /** @type {string} */
        this._IDClient = IDClient;

		// Datos Basicos
        /** @type {number} */
        this.IDPj = data.id;

        /** @type {string} */
        this.name = data.name;

        /** @type {string} */
        this.skinBase = data.SKIN.base;
        
        /** @type {string} */
        this.skinHair = data.SKIN.hair;

        /** @type {string} */
        this.skinCharacter = "";

        /** @type {{ now: number; max: number; }} */
        this.health = {now: data.health, max: data.health};

        /** @type {string} */
        this.level = data.level;

        /** @type {{ now: number; max: number; }} */
        this.experience = {now: data.experience, max: 800 * (this.level + 2)};

        /** @type {number} */
        this.money = data.money;

        /** @type {string} Id map*/
        this.IDMap = data.LOCATION.idMap;

        /** @type {{ X: number; Y: number; }} */
        this.posWorld = {X: data.LOCATION.posX, Y: data.LOCATION.posY};

        /** @type {number} direction player in the map */
		this.direction = 2;

        /**
        * @type {{
        *      keyAction1: number,
        *      keyAction2: number,
        *      keyAction3: number,
        *      keyAction4: number,
        *      keyAction5: number,
        *      keyAction6: number,
        *      keyCharacter: number,
        *      keyBook: number,
        *      keyMenu: number,
        *      keyMap: number,
        *      keySkills: number,
        *      keyRunning: number,
        *      keyEnter: number,
        *      }}
        */
        this.keyBoard = data.KEYBOARD;
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
    
    
    /**
     * @readonly
     * @type {string}
     */
    get IDClient () {
		return this._IDClient;
	}

    /**
     * @returns {{ IDClient: string; name: string; skinCharacter: string; health: { now: number; max: number; }; level: string; experience: { now: number; max: number; }; money: number; posWorld: { X: number; Y: number; }; direction: number; keyBoard: {string: string} }}
     */
    getDataSend () {
        return {
                IDClient : this._IDClient,
                name: this.name,
                skinCharacter: this.skinCharacter,
                health: this.health,
                level: this.level,
                experience: this.experience,
                money: this.money,
                posWorld: this.posWorld,
		        direction: this.direction,
                keyBoard: this.keyBoard,
        }
    }

/* ------------------------------ *
    FUNCTIONS
* ------------------------------ */

    async updateSkinCharacter () {

        const images = await Promise.all([
            sharp(`./server/core/engine/sprite/character/base/${this.skinBase}.png`).toBuffer(),
            sharp(`./server/core/engine/sprite/character/hair/${this.skinHair}.png`).toBuffer(),
        ]);

        const combinedImage = await sharp(Buffer.concat(images))
        .composite([
            { input: images[0], top: 0, left: 0 },
            { input: images[1], top: 0, left: 0 },
        ])
        .toBuffer();
        
        this.skinCharacter = `data:image/png;base64,${combinedImage.toString('base64')}`;
    }
}

exports.Player = Player;