const SQLSearchAccount =
    "Select "+
    "Ninja.ID_PJ as id, "+
    "Ninja.Nombre as nombre, "+
    "Ninja.A_Base as skinBase, "+
    "Ninja.A_Pelo as skinPelo, "+
    "from Ninja where ID_Cuenta=?";

const SQLSearchNinja =
        "Select " +
        // Ninja
        "Ninja.ID_Pj as id, "+
        "Ninja.Nombre as nombre, "+
        "Ninja.A_Base as skinBase, "+
        "Ninja.A_Pelo as skinPelo, "+
        "Ninja.Salud as salud, "+
        "Ninja.Nivel as nivel, "+
        "Ninja.Xp as xp, "+
        "Ninja.Dinero as dinero, "+
        "Ninja.N_map as Nmap, "+
        "Ninja.X as X, "+
        "Ninja.Y as Y, "+
        "from Ninja where Ninja.ID_Pj =?";

const SQLSearchNpc =
        "Select ID, Name, Health, Skin, Level, IDMap, PosX, PosY, Reaction, Events, VisionDistance, Phrases FROM Npc";

const getSearchAccount = () => SQLSearchAccount;

const getSearchNinja = () => SQLSearchNinja;

const getSearchNpc = () => SQLSearchNpc;

module.exports.getSearchAccount = getSearchAccount;
module.exports.getSearchNinja = getSearchNinja;
module.exports.getSearchNpc = getSearchNpc;