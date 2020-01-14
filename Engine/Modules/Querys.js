const SQLSearchAccount =
    "Select "+
    "Ninja.ID_PJ as id, "+
    "Ninja.Nombre as nombre, "+
    "Ninja.A_Base as skinBase, "+
    "Ninja.A_Pelo as skinPelo, "+
    "Ninja_Stats.Fuerza as statFuerza, "+
    "Ninja_Stats.Agilidad as statAgilidad, "+
    "Ninja_Stats.Inteligencia as statInteligencia, "+
    "Ninja_Stats.Sellos as statSellos, "+
    "Ninja_Stats.Resistencia as statResistencia, "+
    "Ninja_Stats.Vitalidad as statVitalidad, "+
    "Ninja_Stats.Destreza as statDestreza, "+
    "Ninja_Stats.Percepcion as statPercepcion "+
    "from Ninja JOIN Ninja_Stats ON Ninja.ID_Pj = Ninja_Stats.ID_Pj where ID_Cuenta=?";

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
        // Atributos
        "Ninja_Stats.Fuerza as statFuerza, "+
        "Ninja_Stats.Agilidad as statAgilidad, "+
        "Ninja_Stats.Inteligencia as statInteligencia, "+
        "Ninja_Stats.Sellos as statSellos, "+
        "Ninja_Stats.Resistencia as statResistencia, "+
        "Ninja_Stats.Vitalidad as statVitalidad, "+
        "Ninja_Stats.Destreza as statSkill, "+
        "Ninja_Stats.Percepcion as statPercepcion, "+
        // Jutsus
        "Ninja_Jutsu.ID_Jutsu as ID_Jutsu "+

        "from Ninja JOIN Ninja_Stats ON Ninja.ID_Pj = Ninja_Stats.ID_PJ JOIN Ninja_Jutsu ON Ninja.ID_Pj = Ninja_Jutsu.ID_Pj where Ninja.ID_Pj =?";

const SQLSearchNpc =
        "Select ID, Name, Health, Skin, Level, IDMap, PosX, PosY, Reaction, Events FROM Npc";

const getSearchAccount = () => SQLSearchAccount;

const getSearchNinja = () => SQLSearchNinja;

const getSearchNpc = () => SQLSearchNpc;

module.exports.getSearchAccount = getSearchAccount;
module.exports.getSearchNinja = getSearchNinja;
module.exports.getSearchNpc = getSearchNpc;