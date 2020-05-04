class Querys {
	constructor () {}

    getSearchAccount () {
        return  `Select ID_PJ as id, Nombre, skinBase, skinPelo from Personaje where ID_Cuenta =?`;
	}
	
	getSearchCharacter () {
		return	"Select " +
				// Personaje
				"Personaje.ID_Pj as id, "+
				"Personaje.Nombre as nombre, "+
				"Personaje.SkinBase as skinBase, "+
				"Personaje.SkinPelo as skinPelo, "+
				"Personaje.Salud as salud, "+
				"Personaje.Nivel as nivel, "+
				"Personaje.Xp as xp, "+
				"Personaje.Dinero as dinero, "+
				"Personaje.N_map as Nmap, "+
				"Personaje.X as X, "+
				"Personaje.Y as Y "+
				"from Personaje where Personaje.ID_Pj =?";
	}

	getSearchNpc () {
		return `Select ID, Name, Health, Skin, Level, IDMap, PosX, PosY, Reaction, Events, VisionDistance, Phrases FROM Npc`;
	}
}

module.exports.Querys = Querys;