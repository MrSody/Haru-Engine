const Player = require('./Modules/Player.js').Player; // Player class
const World = require('./Modules/World.js').World;

var fs = require('fs');

/* ------------------------------ *
    VARIABLES
* ------------------------------ */
var	towers,
    spriteMap,
	enemies,	// Array de los enemigos
	items,		// Array de los items
	npcList,
    jutsusList, // Array de los jutsus
	world,		// Array de el mapa
	collisionMap,
	worldSize,
    tileSize; // Clase Jutsus
    
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
    FUNCIONES
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

        console.log("Player X: "+ Math.floor(pos.x + data.x) +" - "+ Math.floor(pos.y + data.y) +" idMap: "+ newPos.idMap +" dir: "+ data.dir);

        player.setPos(newPos.x, newPos.y);
        player.setDirection(data.dir);
        player.setIDMap(newPos.idMap);
        player.setPosWorld((posWorld.x + data.x), (posWorld.y + data.y));

        //console.log(player.getPosWorld());
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

    getMap (width, height) {
        const   pos = player.getPos(),
                posMap = this.buscarIDMap(player.getIDmap());

        //Carga las capas del mapa y las colisiones
        return clsWorld.getMap(width, height, pos, posMap);
    }

}

exports.Engine = Engine;