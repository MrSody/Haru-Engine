const Engine = require('../../Engine/Engine').Engine;
const Player = require('../../Engine/Modules/Player').Player;
const Npc = require('../../Engine/Modules/Npc').Npc;

const engine = new Engine();

engine.init();

/* ------------------------------ *
    FUNCIONES DE AYUDA
* ------------------------------ */
test('playerById', () => {
    let idPlayer = '1',
        datadb = {
            id: 2,
            nombre: 'prueba',
            skinBase: 'testBase',
            skinPelo: 'H-1',
            salud: 154,
            nivel: 1,
            xp: 0,
            dinero: 0,
            Nmap: 1,
            X: 16,
            Y: 15
        },
        response = engine.addPlayer(idPlayer, datadb);

    expect(engine.playerById(idPlayer)).toStrictEqual(response);
});

test('npcById', () => {
    let dataDB = {
        ID: 1,
        Name: 'test',
        Health: 100,
        Skin: 'testSkin',
        Level: 1,
        IDMap: 1,
        PosX: 16,
        PosY: 15,
        Reaction: '',
        Events: '',
        VisionDistance: '',
        Phrases: ''
    },
    response = new Npc(dataDB, {X: 48, Y: 47}, "imagen1\n");
    engine.addNPC(dataDB);

    expect(engine.npcById(dataDB.ID)).toStrictEqual(response);
});

test('searchIDMap', () => {
    let idMap = 1,
        response = {x: 1, y: 1};

    expect(engine.searchIDMap(idMap)).toStrictEqual(response);
});

/* ------------------------------ *
    FUNCIONES - NPC
* ------------------------------ */

test('addPlayer', () => {
    let idPlayer = '1',
        dataDB = {
            id: 2,
            nombre: 'prueba',
            skinBase: 'testBase',
            skinPelo: 'H-1',
            salud: 154,
            nivel: 1,
            xp: 0,
            dinero: 0,
            Nmap: 1,
            X: 16,
            Y: 15
        },
        response = new Player(idPlayer, dataDB, {X: 48, Y: 47}, "imagen1\n", "");


    expect(engine.addPlayer(idPlayer, dataDB)).toStrictEqual(response);
});