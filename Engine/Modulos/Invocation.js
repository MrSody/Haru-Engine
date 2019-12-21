const Player = require("./Player.js").Player;

class Invocation extends Player {
    constructor (id, datos, posX, posY, jutsus, skinBase, skinPelo, width, heigth) {
        super(id, datos, posX, posY, jutsus, skinBase, skinPelo);
        this.width = width;
        this.heigth = heigth;

        //Atacando
        this.playerAttacksEnemyID = null;
        this.fighting = false;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */

    setEnemyID (id) {
		this.playerAttacksEnemyID = id;
	}

    setGoAttackTrue () {
		this.goAttack = true;
	}

/* ------------------------------ *
    GETTERS
* ------------------------------ */

    getEnemyID () {
		return this.playerAttacksEnemyID;
	}

    isFighting () {
        console.log("FALSE");
        return this.fighting;
    }
}

// Export the Player class so you can use it in other files by using require("Player").Player
exports.Invocation = Invocation;
