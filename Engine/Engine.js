const Player = require('./Modules/Player.js').Player; // Player class
const World = require('./Modules/World.js').World;
const Npc = require('./Modules/Npc.js').Npc;
const orderMaps = require('./Modules/orderMap.js').getOrderMap;

let fs = require('fs');

/* ------------------------------ *
    VARIABLES
* ------------------------------ */
const clsWorld = new World(orderMaps);

let	world,		// Array de el mapa
	worldSize,
    tileSize,
    players = [],	// Array de los jugadores conectados
	npcs = [];  // Array de los NPC

class Engine {
    // Inizializa
    init () {
        this.loadWorld();
    }

    loadWorld () {
        // MUNDO
        world = clsWorld.getWorld();
    
        // TAMAÑO DEL MUNDO Y TILESIZE
        worldSize = clsWorld.getWorldSize();
        tileSize = clsWorld.getTileSize();

        console.log("Completado: Se han cargado el mundo...");
    }

/* ------------------------------ *
    FUNCIONES DE AYUDA
* ------------------------------ */
    playerById (ID) {
        for (let player of players) {
            if (player.getID() == ID) {
                return player;
            }
        }
        return false;
    }

    npcById (ID) {
        for (let npc of npcs) {
            if (npc.getID() == ID) {
                return npc;
            }
        }
        return false;
    }

    // BUSCAR IDMAPA EN EL MUNDO
    searchIDMap (IDmap) {
        let X, Y;
        for(Y = 0; Y < worldSize; Y++) {
            X = world[Y].indexOf(IDmap);
            if(X != -1) {
                return {x: X, y: Y};
            }
        }
        return false;
    }

    // Actualiza la posicion
    updatePos (posX, posY, posMap) {
        let idMap;

        if(posX < 0) {
            posX = 31;
            idMap = world[posMap.y][posMap.x - 1];
        } else if(posX > 32) {
            posX = 0;
            idMap = world[posMap.y][posMap.x + 1];
        } else if(posY < 0) {
            posY = 31;
            idMap = world[posMap.y - 1][posMap.x];
        } else if(posY > 32) {
            posY = 0;
            idMap = world[posMap.y + 1][posMap.x];
        } else {
            idMap = world[posMap.y][posMap.x];
        }

        return {idMap: idMap, x: posX, y: posY};
    }

    posWorld (IDMap, posX, posY) {
        let posMap = this.searchIDMap(IDMap);

        return {
            X: Math.floor((posMap.x * tileSize) + posX),
            Y: Math.floor((posMap.y * tileSize) + posY)
        };
    }

/* ------------------------------ *
    FUNCIONES - NPC
* ------------------------------ */
    addNPC (dataNPC) {
        let posWorld = this.posWorld(dataNPC.IDMap, dataNPC.PosX, dataNPC.PosY);

        let skinNpc = fs.readFileSync(`./Engine/Sprite/Npc/${dataNPC.Skin}.txt`, 'utf-8');

        npcs.push(new Npc(dataNPC, posWorld, skinNpc));
    }

    NPCNearby (player) {
        let posWorld = player.getPosWorld();
        let NPCCercanos = [];

        let initPosWorld = {x: posWorld.x - ((32 * 3) / 2), y: posWorld.y - ((32 * 3) / 2)};
        let endPosWorld = {x: posWorld.x + ((32 * 3) / 2), y: posWorld.y + ((32 * 3) / 2)};

        for (let y = initPosWorld.y; y < endPosWorld.y; y++) {
            for (let x = initPosWorld.x; x < endPosWorld.x; x++) {
                npcs.forEach((npc) => {
                    let NPCPos = npc.getPos();
                    
                    if (NPCPos.x == x && NPCPos.y == y) {
                        NPCCercanos.push(npc);
                    }
                });
            }
        }

        return NPCCercanos;
    }

/* ------------------------------ *
    FUNCIONES - PLAYER
* ------------------------------ */
    addPlayer (idClient, dataPlayer) {
        let posWorld = this.posWorld(dataPlayer.Nmap, dataPlayer.X, dataPlayer.Y);

        // Sprite player
        let skinBase = fs.readFileSync(`./Engine/Sprite/Player/Base/${dataPlayer.skinBase}.txt`, 'utf-8');

        let player =  new Player(idClient, dataPlayer, posWorld, skinBase, "");

        players.push(player);

        return player;
    }

    movePlayer (player, X, Y, Dir) {
        let pos = player.getPos(),
            posMap = this.searchIDMap(player.getIDmap()),
            newPos = this.updatePos((pos.x + X), (pos.y + Y), posMap);

        player.setPos(newPos.x, newPos.y);
        player.setDirection(Dir);
        player.setIDMap(newPos.idMap);

        console.log("ahora: "+ player.getPos().x +" -- "+ player.getPos().y);

        return ((posMap == newPos.idMap) ? false : true);
    }

    playerDisconnect (id) {
        let player = this.playerById(id);

        console.log("se desconecto "+ player.getName());

        players.splice(players.indexOf(player), 1);
        
        return player;
    }

/* ------------------------------ *
    GETTERS
* ------------------------------ */
    getTileSize () {
        return tileSize;
    }

    getSpriteMap () {
        return spriteMap;
    }
    
    getMap (IDMap) {
        let posMap = this.searchIDMap(IDMap);

        return clsWorld.getMap(posMap);
    }

    /*
    getMap (player, width, height) {
        const   pos = player.getPos(),
                posMap = this.searchIDMap(player.getIDmap());

        //Carga las capas del mapa y las colisiones
        return clsWorld.getMap(width, height, pos, posMap);
    }
    */

    getPlayers () {
        return players;
    }

}

exports.Engine = Engine;