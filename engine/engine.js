const PLAYER = require('./modules/player.js').Player; // Player class
const WORLD = require('./modules/world.js').World;
const NPC = require('./modules/npc.js').Npc;
const ORDER_MAPS = require('./modules/orderMap.js').getOrderMap;

/* ------------------------------ *
VARIABLES
* ------------------------------ */
let fs = require('fs');

const World = new WORLD(ORDER_MAPS);

class Engine {
    constructor () {
        this.world; // Array del world
        this.worldSize;
        this.tileSize;
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

        // WORLD
        this.world = World.getWorld();
    
        // SIZE OF WORLD AND TILESIZE
        this.worldSize = World.getWorldSize();
        this.tileSize = World.getTileSize();

        console.log("Completado: Se han cargado el mundo...");        
    }

/* ------------------------------ *
    FUNCIONES DE AYUDA
* ------------------------------ */
    playerById (ID) {
        for (let player of this.players) {
            if (player.getID() === ID) {
                return player;
            }
        }
        return false;
    }

    npcById (ID) {
        for (let npc of this.npcs) {
            if (npc.getID() === ID) {
                return npc;
            }
        }
        return false;
    }

    // BUSCAR IDMAPA EN EL MUNDO
    searchIDMap (IDMap) {
        let X;
        let Y;

        for(Y = 0; Y < this.worldSize.y; Y++) {
            X = this.world[Y].indexOf(IDMap);
            if(X != -1) {
                return {x: X, y: Y};
            }
        }
        return false;
    }

    // Actualiza la posicion
    updatePos (IDMap, posX, posY) {
        let idMap;
        let posMap = this.searchIDMap(IDMap);

        try {
            if(posX < 0) {
                posX = 31;
                idMap = this.world[posMap.y][posMap.x - 1];
            } else if(posX > 32) {
                posX = 0;
                idMap = this.world[posMap.y][posMap.x + 1];
            } else if(posY < 0) {
                posY = 31;
                idMap = this.world[posMap.y - 1][posMap.x];
            } else if(posY > 32) {
                posY = 0;
                idMap = this.world[posMap.y + 1][posMap.x];
            } else {
                idMap = this.world[posMap.y][posMap.x];
            }
        

        } catch (error) {
            console.log(`Error - updatePos : No se pudo encontrar el mapa ${IDMap} - ${err}`);
            // POS DEFAULT
            idMap = this.posDefault.IDMap;
            posX = this.posDefault.x;
            posY = this.posDefault.y;
            
        }

        return {IDMap: idMap, x: posX, y: posY};
    }

    posWorld (IDMap, posX, posY) {
        let posMap = this.searchIDMap(IDMap);

        return {
            x: Math.floor((posMap.x * this.tileSize) + posX),
            y: Math.floor((posMap.y * this.tileSize) + posY)
        };
    }

/* ------------------------------ *
    FUNCIONES - NPC
* ------------------------------ */
    addNPC (dataNPC) {
        let posWorld = this.posWorld(dataNPC.ID_Map, dataNPC.X, dataNPC.Y);
        let skinNpc = fs.readFileSync(`./engine/sprite/npc/${dataNPC.Skin}.txt`, 'utf-8');

        this.npcs.push(new NPC(dataNPC, posWorld.x, posWorld.y, skinNpc));
    }

    NPCNearby (player) {
        let posMap = this.searchIDMap(player.getIDMap());
        let maps = World.getMaps(posMap.x, posMap.y);
        let NPCNearby = [];

        for (let npc of this.npcs) {
            for (let map of maps) {
                if (npc.getIDMap()  == map) {
                    NPCNearby.push(npc);
                }
            }
        }

        return NPCNearby;
    }

/* ------------------------------ *
    FUNCIONES - PLAYER
* ------------------------------ */
    addPlayer (IDClient, dataPlayer) {
        let posWorld = this.posWorld(dataPlayer.IDMap, dataPlayer.X, dataPlayer.Y);

        // Sprite player
        let skinBase = fs.readFileSync(`./engine/sprite/player/base/${dataPlayer.skinBase}.txt`, 'utf-8');

        let player = new PLAYER(IDClient, dataPlayer, posWorld.x, posWorld.y, skinBase, "");

        this.players.push(player);

        return player;
    }

    playersNearby (player) {
        let posMap = this.searchIDMap(player.getIDMap());
        let maps = World.getMaps(posMap.x, posMap.y);
        let IDplayer = player.getID();
        let playersNearby = [];

        for (let player of this.players) {
            for (let map of maps) {
                if (player.getIDMap() == map && player.getID() != IDplayer) {
                    playersNearby.push(player);
                }
            }
        }

        return playersNearby;
    }

    movePlayer (player, data) {
        let posPlayer = player.getPos();
        let posWorld = player.getPosWorld();
        let newPos = this.updatePos(player.getIDMap(), (posPlayer.x + data.x), (posPlayer.y + data.y));

        console.log("posPlayer: "+ posPlayer.x +" -- "+ posPlayer.y);
        console.log("posWorld - antes: "+ posWorld.x +" -- "+ posWorld.y);
        console.log("NEWPOS: "+ newPos.x +" -- "+ newPos.y);

        console.log("Player X: "+ Math.floor(player.getPos().x + data.x) +" - "+ Math.floor(player.getPos().y + data.y) +" idMap: "+ newPos.IDMap +" dir: "+ data.dir);

        player.setPos(newPos.x, newPos.y);
        player.setDirection(data.dir);
        player.setIDMap(newPos.IDMap);
        player.setPosWorld((posWorld.x + data.x), (posWorld.y + data.y));

        console.log("ahora: "+ player.getPosWorld().x +" -- "+ player.getPosWorld().y);
    }

    playerDisconnect (id) {
        let player = this.playerById(id);

        console.log("se desconecto "+ player.getName());

        this.players.splice(this.players.indexOf(player), 1);
        
        return player;
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    getTileSize () {
        return this.tileSize;
    }

    getSpriteWorld () {
        return World.getDataSpriteSheets();
    }

    getMap (player, width, height) {
        let posMap = this.searchIDMap(player.getIDMap());
        let posPlayer = player.getPos();

        // Retorna las capas del mapa y las colisiones, ademas de el spriteSheets
        return World.getMap(width, height, posPlayer.x, posPlayer.y, posMap.x, posMap.y);
    }

    getPlayers () {
        return this.players;
    }
}

exports.Engine = Engine;