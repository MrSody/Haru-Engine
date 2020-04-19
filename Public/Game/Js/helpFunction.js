class helpFunction {
    constructor () {}

/*-------------------------------
    Funciones de Ayuda
*-------------------------------*/
    // Buscar el jugador remoto
    findRemotePlayer (id) {
        for (let remotePlayer of remotePlayers) {
            if (remotePlayer.getID() == id) {
                return remotePlayer;
            }
        }

        return false;
    }

    // Retornar player
    findPlayer (id) {
        let player;

        if (localPlayer.getID() === id){
            player = localPlayer;
        } else {
            player = this.findRemotePlayer(id);
        }

        return player;
    }

    findNpc (id) {
        for (let npc of npcs) {
            if (npc.getID() == id) {
                return npc;
            }
        }

        return false;
    }
}