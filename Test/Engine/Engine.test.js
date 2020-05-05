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

// updatePos (posX, posY, posMap)
test('updatePos', () => {
    let posMap = {x: 1, y: 1},
        posPlayer = {x: 16 + 1, y: 15},
        response = {idMap: 1, x: posPlayer.x, y: posPlayer.y};

    expect(engine.updatePos(posPlayer.x, posPlayer.y, posMap)).toStrictEqual(response);
});

test('posWorld',() => {
    let IDMap = 1,
        pos = {x: 16, y: 15},
        response = {X: 48, Y: 47};

    expect(engine.posWorld(IDMap, pos.x, pos.y)).toStrictEqual(response);
});

/* ------------------------------ *
    FUNCIONES - NPC
* ------------------------------ */
test('NPCNearby', () => {
    let idPlayer = '1',
        dataDBPlayer = {
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
        player = engine.addPlayer(idPlayer, dataDBPlayer),
        dataDBNpc = {
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
        npc = new Npc(dataDBNpc, {X: 48, Y: 47}, "imagen1\n");
        response = [npc, npc];

        engine.addNPC(dataDBNpc);

    expect(engine.NPCNearby(player)).toStrictEqual(response);
});

/* ------------------------------ *
    FUNCIONES - PLAYER
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

test('playerDisconnect', () => {
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

    expect(engine.playerDisconnect(idPlayer)).toStrictEqual(response);
});