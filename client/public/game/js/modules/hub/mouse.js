import TileTypesEnums from "../../modules/enums/tileTypes.js";
import CursorTypesEnums from "../../modules/enums/cursorTypes.js";
import InterfaceGame from "../../modules/hub/interface/interfaceGame.js";

export default class Mouse {
    
    /**
     * @constructor
     * @param {number} tileSize
     */
    constructor (tileSize) {
        this.tileSize = tileSize;
    }

    /**
     * @param {{pageX: number; pageY: number;}} e
     * @returns {{ x: number; y: number; }}
     */
    getClickedTile (e) {
        return {
            x: Math.floor(e.pageX / this.tileSize),
            y: Math.floor((e.pageY + (0.5 * this.tileSize)) / this.tileSize),
        };
    }

    
    /**
     * Description placeholder
     * @date 1/6/2024 - 4:33:54 PM
     *
     * @param {number} e
     * @param {*} collisionMap
     * @param {InterfaceGame} clsInterfaceGame
     */
    move (e, collisionMap, clsInterfaceGame) {
        let tile = this.getClickedTile(e);

        if (tile.x >= 0 && tile.y >= 0) {

            if ( typeof( collisionMap[tile.y][tile.x] ) == "number" ) {
                
                switch ( collisionMap[tile.y][tile.x] ) {
                    case TileTypesEnums.tileTypes().NOWalking:
                        clsInterfaceGame.styleCursor(CursorTypesEnums.cursorTypes().NOWalking);
                    break;

                    default:
                        clsInterfaceGame.styleCursor(CursorTypesEnums.cursorTypes().Walking);
                    break;
                }

            } else if ( typeof( collisionMap[tile.y][tile.x] ) == "object" ) {
                
                let npc = collisionMap[tile.y][tile.x];

                switch ( npc.getReaction() ) {
                    case TileTypesEnums.tileTypes().TalkToNPC:
                        clsInterfaceGame.styleCursor(CursorTypesEnums.cursorTypes().TalkToNPC);
                    break;

                    case TileTypesEnums.tileTypes().AttackEnemy:
                        clsInterfaceGame.styleCursor(CursorTypesEnums.cursorTypes().AttackEnemy);
                    break;
                }

            } else {
                clsInterfaceGame.styleCursor(CursorTypesEnums.cursorTypes().Walking);
            }
        }
    }

    click (e, collisionMap, canvasHUB, localPlayer) {
        let tile = this.getClickedTile(e);
        let playerPosX = Math.round((canvasHUB.width / 2) / this.tileSize);
        let playerPosY = Math.round((canvasHUB.height / 2) / this.tileSize);
        
        // To avoid a bug, where player wouldn't walk anymore, when clicked twice on the same tile
        if (!(tile.x === playerPosX && tile.y === playerPosY) && collisionMap[tile.y][tile.x] !== TileTypesEnums.tileTypes().NOWalking) {
    
            //$("#conversation, #confirmation").addClass("hidden");
    
            // Going NPC
            if ( typeof( collisionMap[tile.y][tile.x] ) == "object") {
                
                let npc = collisionMap[tile.y][tile.x];

                switch ( npc.getReaction() ) {
                    case TileTypesEnums.tileTypes().TalkToNPC: // Going to talk to NPC
                        console.log("Habla con npc");
                        /*
                        var npc = getNpcAt(tile.x * 32, tile.y * 32);
            
                        if (npc.questID != null) {
                            var quest = questlist[npc.questID];
                            localPlayer.addQuest(quest);
                        }
            
                        localPlayer.setGoToNpc(npc);
                        */
                    break;

                    case TileTypesEnums.tileTypes().AttackEnemy: // Going to attack enemy
                        console.log("ataca al enemigo "+ tile.x +" - "+ tile.y );
                        //localPlayer.setGoFight(i);
                    break;
                }
                
            } else {
    
                if (localPlayer.isFighting()) {
                    console.log("abando pelea");
                    tellCounter = 0;
                    //socket.emit("abort fight", {id: localPlayer.ID});
                }
    
                console.log("camina");
                //localPlayer.playerMove();
            }
    
            console.log("sigue a");
            localPlayer.stop = true;
    
            // Wait for the player to stop at next tile
            let timer = setInterval(() => {
                if (!localPlayer.isMoving()) {
                    clearTimeout(timer);
                    localPlayer.stop = false;

                    let pathStart = {x: playerPosX, y: playerPosY};
                    let pathfinder = new Pathfinder(collisionMap, pathStart, tile);
                    let path = pathfinder.calculatePath();
                    // Calculate path
                    if (path.length > 0) {
                        localPlayer.setPath(path);
                    }
                }
            }, 1);
        }
    }
}