export default class Mouse {
    constructor (tileSize) {
        this.tileSize = tileSize;

        this.tileWalking = 0;
        this.tileNOWalking = 1;
        // Reation NPC
        this.tileTalkToNPC = 1;
        this.tileAttackEnemy = 2;

        this.cursorWalking = "url('../game/img/icons/mouse_walk.png') 16 16, auto";
        this.cursorNOWalking = "url('../game/img/icons/mouse_noWalk.png') 16 16, auto";
        this.cursorTalkToNPC = "url('../game/img/icons/mouse_talk.png') 16 16, auto";
        this.cursorAttackEnemy = "url('../game/img/icons/mouse_attack.png') 16 16, auto";
    }

    getClickedTile (e) {
        return {
            x: Math.floor(e.pageX / this.tileSize),
            y: Math.floor((e.pageY + (0.5 * this.tileSize)) / this.tileSize)
        };
    }

    move (e, collisionMap) {
        let tile = this.getClickedTile(e);

        if (tile.x >= 0 && tile.y >= 0) {

            if ( typeof( collisionMap[tile.y][tile.x] ) == "number" ) {
                
                switch ( collisionMap[tile.y][tile.x] ) {
                    case this.tileNOWalking:
                        document.documentElement.style.cursor = this.cursorNOWalking;
                    break;

                    default:
                        document.documentElement.style.cursor = this.cursorWalking;
                    break;
                }

            } else if ( typeof( collisionMap[tile.y][tile.x] ) == "object" ) {
                
                let npc = collisionMap[tile.y][tile.x];

                switch ( npc.getReaction() ) {
                    case this.tileTalkToNPC: 
                        document.documentElement.style.cursor = this.cursorTalkToNPC;
                    break;

                    case this.tileAttackEnemy:
                        document.documentElement.style.cursor = this.cursorAttackEnemy;
                    break;
                }

            } else {
                document.documentElement.style.cursor = this.cursorWalking;
            }
        }
    }

    click (e, collisionMap, canvasHUB, localPlayer) {
        let tile = this.getClickedTile(e);
        let playerPosX = Math.round((canvasHUB.width / 2) / this.tileSize);
        let playerPosY = Math.round((canvasHUB.height / 2) / this.tileSize);
        
        if (!(tile.x == playerPosX && tile.y == playerPosY) && !(collisionMap[tile.y][tile.x] === this.tileNOWalking)) { // To avoid a bug, where player wouldn't walk anymore, when clicked twice on the same tile
    
            //$("#conversation, #confirmation").addClass("hidden");
    
            if ( typeof( collisionMap[tile.y][tile.x] ) == "object") { // Going NPC
                
                let npc = collisionMap[tile.y][tile.x];

                switch ( npc.getReaction() ) {
                    case this.tileTalkToNPC: // Going to talk to NPC
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

                    case this.tileAttackEnemy: // Going to attack enemy
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
                localPlayer.playerMove();
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