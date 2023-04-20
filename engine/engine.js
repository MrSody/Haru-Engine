const PLAYER = require('./modules/player.js').Player;
const WORLD = require('./modules/world.js').World;
const NPC = require('./modules/npc.js').Npc;
let fs = require('fs');

const World = new WORLD();

// LOGs
const log4js = require('log4js');
log4js.configure('./config/log4js.json');
const logger = log4js.getLogger('app');
const loggerPlayers = log4js.getLogger('players');

class Engine {
    constructor () {
        this.players = [];
        this.npcs = [];    
        this.posDefault = {IDMap: 1, x: 15, y: 16}
    }
    
    init () {
        this.loadWorld();
    }

    loadWorld () {
        World.initWorld();

        logger.info("Completed: The world has been loaded...");        
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    getTileSize () {
        return World.getTileSize();
    }

    getSpriteWorld () {
        return World.getDataSpriteSheets();
    }

    getMap (player, width, height) {
        let posPlayer = player.getPosWorld();
        let data = World.getMap(player.getIDMap(), width, height, posPlayer);

        if (!data) {
            logger.warn('Error:', {file: 'engine.js', method:'getMap', message: `Id Map: ${player.getIDMap()} not found`});
        }

        return data;
    }

    getPlayers () {
        return this.players;
    }

/* ------------------------------ *
    FUNCTIONS HELP
* ------------------------------ */
    playerById (ID) {
        return this.players.find(player => player.getID() === ID);
    }

    npcById (ID) {
        return this.npcs.find(npc => npc.getID() === ID);
    }

/* ------------------------------ *
    FUNCTIONS - NPC
* ------------------------------ */
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
    addPlayer (IDClient, dataPlayer) {
        // Sprite player
        let skinBase = fs.readFileSync(`./engine/sprite/player/base/${dataPlayer.SKIN.base}.txt`, 'utf-8');

        let player = new PLAYER(IDClient, dataPlayer, skinBase, "");

        this.players.push(player);

        return player;
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

    movePlayer (player, data) {
        let posWorld = player.getPosWorld();

        player.setPosWorld((posWorld.x + data.x), (posWorld.y + data.y));
        player.setDirection(data.dir);
        //player.setIDMap(newPos.IDMap);
    }

    playerDisconnect (id) {
        let player = this.playerById(id);

        this.players.splice(this.players.indexOf(player), 1);
        
        return player;
    }
}

exports.Engine = Engine;