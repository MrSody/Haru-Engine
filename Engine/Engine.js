const Player = require('./Modules/Player.js').Player; // Player class
const World = require('./Modules/World.js').World;
const Npc = require('./Modules/Npc.js').Npc;

var fs = require('fs');

/* ------------------------------ *
    VARIABLES
* ------------------------------ */
let	towers,
    spriteMap,
	enemies,	// Array de los enemigos
	items,		// Array de los items
    jutsusList, // Array de los jutsus
	world,		// Array de el mapa
	collisionMap,
	worldSize,
    tileSize;
    
const clsWorld = new World();

class Engine {

    // Inizializa
    init () {
        // Carga el mundo
        this.loadWorld();
    }

    loadWorld () {
        // MUNDO
        world = clsWorld.getWorld();
    
        // TAMAÑO DEL MUNDO Y TILESIZE
        worldSize = clsWorld.getWorldSize();
        tileSize = clsWorld.getTileSize();
    
        // spriteMap
        spriteMap = fs.readFileSync('./Engine/Sprite/Mapa.txt', 'utf-8');

        // Cargado el mundo
        console.log("Completado: Se han cargado el mundo...");
    }

/* ------------------------------ *
    FUNCIONES DE AYUDA
* ------------------------------ */
    // SEARCH THE PLAYER FOR THE ID - 100%
    playerById (ID, players) {
        for (let player of players) {
            if (player.getID() == ID) {
                return player;
            }
        }
        return false;
    }

    npcById (ID, NPCs) {
        for (let npc of NPCs) {
            if (npc.getID() == ID) {
                return npc;
            }
        }
        return false;
    }

    // BUSCAR IDMAPA EN EL MUNDO - 100%
    buscarIDMap (IDmap) {
        var x, y;
        for(y = 0; y < worldSize; y++) {
            x = world[y].indexOf(IDmap);
            if(x != -1) {
                return {x: x, y: y};
            }
        }
        return false;
    }

    // Actualiza la posicion
    updatePos (posX, posY, posMap) {
        console.log("updatePos X:"+ posX +"-"+ posY +"posMap"+ posMap.x +"-"+ posMap.y);
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

/* ------------------------------ *
    FUNCIONES - NPC
* ------------------------------ */
    createNPC (dataNPC) {
        let posMap = this.buscarIDMap(dataNPC.IDMap);
        let posX = Math.floor((posMap.x * tileSize) + dataNPC.PosX);
        let posY = Math.floor((posMap.y * tileSize) + dataNPC.PosY);

        // Sprite Npc
        let skinNpc = fs.readFileSync(`./Engine/Sprite/Npc/${dataNPC.Skin}`, 'utf-8');

        let npc = new Npc(dataNPC, posX, posY, skinNpc);

        return npc;
    }

    NPCCercanos (player, NPCs) {
        let posWorld = player.getPosWorld();
        let NPCCercanos = [];

        console.log("3: "+ player.getPosWorld().x +" -- "+ player.getPosWorld().y);

        let initPosWorld = {x: posWorld.x - ((32 * 3) / 2), y: posWorld.y - ((32 * 3) / 2)};
        let endPosWorld = {x: posWorld.x + ((32 * 3) / 2), y: posWorld.y + ((32 * 3) / 2)};

        for (let y = initPosWorld.y; y < endPosWorld.y; y++) {
            for (let x = initPosWorld.x; x < endPosWorld.x; x++) {
                NPCs.forEach((npc) => {
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
    createPlayer (idClient, results) {
        // Search position the player in the map
        let posMap = this.buscarIDMap(results[0].Nmap);

        let posX = Math.floor((posMap.x * tileSize) + results[0].X);
        let posY = Math.floor((posMap.y * tileSize) + results[0].Y);

        // Sprite player
        let skinBase = fs.readFileSync(`./Engine/Sprite/Player/Base/${results[0].skinBase}.txt`, 'utf-8');

        let player = new Player(idClient, results[0], posX, posY, "", skinBase, "");

        return player;
    }

    movePlayer (player, data) {

        let pos = player.getPos(),
            posWorld = player.getPosWorld(),
            posMap = this.buscarIDMap(player.getIDmap()),
            newPos = this.updatePos((pos.x + data.x), (pos.y + data.y), posMap);

        console.log("1: "+ player.getPosWorld().x +" -- "+ player.getPosWorld().y);

        console.log("Player X: "+ Math.floor(pos.x + data.x) +" - "+ Math.floor(pos.y + data.y) +" idMap: "+ newPos.idMap +" dir: "+ data.dir);

        player.setPos(newPos.x, newPos.y);
        player.setDirection(data.dir);
        player.setIDMap(newPos.idMap);
        player.setPosWorld((posWorld.x + data.x), (posWorld.y + data.y));

        console.log("2: "+ player.getPosWorld().x +" -- "+ player.getPosWorld().y);
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

    getMap (player, width, height) {
        const   pos = player.getPos(),
                posMap = this.buscarIDMap(player.getIDmap());

        //Carga las capas del mapa y las colisiones
        return clsWorld.getMap(width, height, pos, posMap);
    }

}

exports.Engine = Engine;