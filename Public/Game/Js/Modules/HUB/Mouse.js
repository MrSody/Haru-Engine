class Mouse {
    constructor () {}

    getClickedTile (e) {
        var x = e.pageX;
        var y = e.pageY;
    
        return {x: Math.floor(x / 32), y: Math.floor(y / 32)};
    }

    move (e) {
        if (!$('#hubPrincial').hasClass('Invisible')) {
            let tile = this.getClickedTile(e);

            if (collisionMap[tile.y][tile.x] === 1) {
                document.documentElement.style.cursor = "url('../Game/Img/icons/mouse_noWalk.png') 16 16, auto";
            } else {
                document.documentElement.style.cursor = "url('../Game/Img/icons/mouse_walk.png') 16 16, auto";
            }
        }
    }

    click (e) {
        let tile = this.getClickedTile(e),
            playerPosX = Math.round((canvasHUB.width / 2) / 32),
            playerPosY = Math.round((canvasHUB.height / 2) / 32);

            console.log(tile);
        
        if (!(tile.x == playerPosX && tile.y == playerPosY) && !(collisionMap[tile.y][tile.x] === 1)) { // To avoid a bug, where player wouldn't walk anymore, when clicked twice on the same tile
    
            $("#conversation, #confirmation").addClass("hidden");
    
            if (collisionMap[tile.y][tile.x] == 2) { // Going to talk to NPC
    
                console.log("Habla con npc");
    
                var npc = getNpcAt(tile.x * 32, tile.y * 32);
    
                if (npc.questID != null) {
                    var quest = questlist[npc.questID];
                    localPlayer.addQuest(quest);
                }
    
                localPlayer.setGoToNpc(npc);
    
            } else if (collisionMap[tile.y][tile.x] == 3) { // Going to attack enemy
    
                console.log("ataca al enemigo");
    
                for (var i = 0; i < enemies.length; i++) {
                    if (enemies[i].alive && tile.x * 32 == enemies[i].x && tile.y * 32 == enemies[i].y) {
                        localPlayer.setGoFight(i);
                        break;
                    }
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
                    let pathStart = {x: playerPosX, y: playerPosY},
                        pathfinder = new Pathfinder(collisionMap, pathStart, tile),
                        path = pathfinder.calculatePath();
    
                    // Calculate path
                    if (path.length > 0) {
                        localPlayer.setPath(path);
                    }
                }
            }, 1);
        }
    }
}