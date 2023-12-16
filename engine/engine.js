const PLAYER = require('./modules/player.js').Player;
const WORLD = require('./modules/world.js').World;
const NPC = require('./modules/npc.js').Npc;
let fs = require('fs');

// LOGs
const log4js = require('log4js');
log4js.configure('./config/log4js.json');
const logger = log4js.getLogger('app');
const loggerPlayers = log4js.getLogger('players');

class Engine {
    /** @type {{IDMap: number; x: number; y: number;}} */
    #posDefault = {IDMap: 1, x: 15, y: 16};

    /** @type {WORLD} */
    #World = null;

    /** @constructor */
    constructor () {
        /** @type {Array.<PLAYER>} */
        this.players = [];

        /** @type {Array.<NPC>} */
        this.npcs = [];
    }
    
    init () {
        this.#World = new WORLD();
        logger.info("Completed: The world has been loaded...");
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    /**
     * @returns {number}
     */
    getTileSize () {
        return this.#World.tileSize;
    }

    /**
     * @returns {string}
     */
    getSpriteWorld () {
        return this.#World.dataSpriteSheets;
    }

    /**
     * @param {PLAYER} player
     * @param {number} width
     * @param {number} height
     * @returns {(false | { capa1: [[]]; capa2: [[]]; capa3: [[]]; capa4: [[]]; capa5: [[]]; capa6: [[]]; collision: [[]]; })}
     */
    getMap (player, width, height) {
        let data = this.#World.getMap(player.IDMap, width, height, player.posWorld);

        if (!data) {
            logger.warn('Error:', {file: 'engine.js', method:'getMap', message: `Id Map: ${player.IDMap} not found`});
        }

        return data;
    }

    /**
     * @returns {Array.<PLAYER>}
     */
    getPlayers () {
        return this.players;
    }

/* ------------------------------ *
    HELPERS FUNCTIONS
* ------------------------------ */
    /**
     * @param {string} ID
     * @returns {PLAYER}
     */
    playerById (ID) {
        return this.players.find(player => player.IDClient === ID);
    }

    /**
     * @param {string} ID
     * @returns {NPC}
     */
    npcById (ID) {
        return this.npcs.find(npc => npc.getID() === ID);
    }

/* ------------------------------ *
    FUNCTIONS - NPC
* ------------------------------ */
    /**
     * @param {{id: string; name: string; health: number; skin: string; Level: number; idMap: number; posX: number; posY: number; visionDistance: number; reaction: number; }} dataNPC
     */
    addNPC (dataNPC) {
        let skinNpc = fs.readFileSync(`./engine/sprite/npc/${dataNPC.skin}.txt`, 'utf-8');

        this.npcs.push(new NPC(dataNPC, skinNpc));
    }

    NPCNearby (player) {
        // TODOs: redesign code - NPCNearby
        // let posMap = this.searchIDMap(player.getIDMap());
        // let maps = World.getMaps(posMap.x, posMap.y);
        // let NPCNearby = [];

        // for (let npc of this.npcs) {
        //     for (let map of maps) {
        //         if (npc.getIDMap()  == map) {
        //             NPCNearby.push(npc);
        //         }
        //     }
        // }

        //return NPCNearby;
    }

/* ------------------------------ *
    FUNCTIONS - PLAYER
* ------------------------------ */
    /**
     * @param {string} IDClient
     * @param {Any} dataPlayer
     * @returns {{ IDPj: number; name: string; skinBase: string; skinHair: string; health: { now: number; max: number; }; level: string; experience: { now: number; max: number; }; money: number; posWorld: { X: number; Y: number; }; direction: number; }}
     */
    addPlayer (IDClient, dataPlayer) {
        // Sprite player
        let skinBase = fs.readFileSync(`./engine/sprite/player/base/${dataPlayer.SKIN.base}.txt`, 'utf-8');

        let player = new PLAYER(IDClient, dataPlayer, skinBase, "");

        this.players.push(player);

        return player.getDataSend();
    }

    playersNearby (player) {
        // TODOs: redesign code - playersNearby
        // let posMap = this.searchIDMap(player.getIDMap());
        // let maps = World.getMaps(posMap.x, posMap.y);
        // let IDplayer = player.getID();
        // let playersNearby = [];

        // for (let player of this.players) {
        //     for (let map of maps) {
        //         if (player.getIDMap() == map && player.getID() != IDplayer) {
        //             playersNearby.push(player);
        //         }
        //     }
        // }

        // return playersNearby;
    }

    /**
     * @param {PLAYER} player
     * @param {{id: number; x: number; y: number; dir: number; mode: number;}} data
     */
    movePlayer (player, data) {
        player.setPosWorld((player.posWorld.X + data.x), (player.posWorld.Y + data.y));
        player.setDirection(data.dir);
        //player.setIDMap(newPos.IDMap);
    }

    /**
     * @param {number} id
     * @returns {PLAYER}
     */
    playerDisconnect (id) {
        let player = this.playerById(id);

        this.players.splice(this.players.indexOf(player), 1);
        
        return player;
    }
}

exports.Engine = Engine;