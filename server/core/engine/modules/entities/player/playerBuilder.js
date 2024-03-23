const { Player } = require("./player");

class PlayerBuilder {
  
    async createCharacter (IDClient, data) {
        let player =  new Player(IDClient, data);
        await player.updateSkinCharacter();
        return player;
    }
}

exports.PlayerBuilder = PlayerBuilder;