class Querys {
	constructor () {}

/* ------------------------------ *
    WEB
* ------------------------------ */

	getLogin () {
		return `select * from Account where Email =? and Password =?`;
	}

	getReguister () {
		return `INSERT INTO Account (Email, Password, Creation_Date) VALUES (?, ?, Now())`;
	}

/* ------------------------------ *
    GAME
* ------------------------------ */

    getSearchAccount () {
        return  `Select ID, Name, Skin_Base, Skin_Hair from Character_Account where ID_Account =?`;
	}
	
	getSearchCharacter () {
		return	"Select " +
				// Personaje
				"Character_Account.ID as ID, "+
				"Character_Account.Name as name, "+
				"Character_Account.Skin_Base as skinBase, "+
				"Character_Account.Skin_Hair as skinHair, "+
				"Character_Account.Health as health, "+
				"Character_Account.Level as level, "+
				"Character_Account.XP as xp, "+
				"Character_Account.Money as money, "+
				"Character_Account.ID_Map as IDMap, "+
				"Character_Account.X as X, "+
				"Character_Account.Y as Y "+
				"from Character_Account where Character_Account.ID =?";
	}

	getSearchNpc () {
		return `Select ID, Name, Health, Skin, Level, ID_Map, X, Y, Vision_Distance, Reaction FROM Npc`;
	}
}

module.exports.Querys = Querys;