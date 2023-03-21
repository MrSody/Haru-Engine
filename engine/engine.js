const PLAYER = require('./modules/player.js').Player; // Player class
const WORLD = require('./modules/world.js').World;
const NPC = require('./modules/npc.js').Npc;

/* ------------------------------ *
VARIABLES
* ------------------------------ */
let fs = require('fs');

const World = new WORLD();

class Engine {
    constructor () {
        this.players = []; // Array de los jugadores conectados
        this.npcs = []; // Array de los NPC        
        this.posDefault = {IDMap: 1, x: 15, y: 16} // position for default
    }
    
    // Inizializa
    init () {
        this.loadWorld();
    }

    loadWorld () {
        // INIIALIZAR EL WORLD
        World.initWorld();

        console.log("Completado: Se han cargado el mundo...");        
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

        // Retorna las capas del mapa y las colisiones, ademas de el spriteSheets
        return World.getMap(player.getIDMap(), width, height, posPlayer);
    }

    getPlayers () {
        return this.players;
    }

/* ------------------------------ *
    FUNCIONES DE AYUDA
* ------------------------------ */
    playerById (ID) {
        return this.players.find(player => player.getID() == ID);
    }

    npcById (ID) {
        return this.npcs.find(npc => npc.getID() == ID);
    }

/* ------------------------------ *
    FUNCIONES - NPC
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

        return NPCNearby;
    }

/* ------------------------------ *
    FUNCIONES - PLAYER
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

        console.log("se desconecto "+ player.getName());

        this.players.splice(this.players.indexOf(player), 1);
        
        return player;
    }
}

exports.Engine = Engine;