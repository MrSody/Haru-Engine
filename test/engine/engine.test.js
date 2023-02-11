const ENGINE = require('../../engine/engine').Engine;
const PLAYER = require('../../engine/modules/player').Player;
const NPC = require('../../engine/modules/npc').Npc;

const DATA_DB_PLAYER = {
    ID: 1,
    name: 'prueba',
    skinBase: 'testBase',
    skinHair: 'H-1',
    health: 154,
    level: 1,
    xp: 0,
    money: 0,
    IDMap: 1,
    X: 16,
    Y: 15
};

const DATA_DB_PLAYER2 = {
    ID: 2,
    name: 'test',
    skinBase: 'testBase',
    skinHair: 'H-1',
    health: 154,
    level: 1,
    xp: 0,
    money: 0,
    IDMap: 1,
    X: 16,
    Y: 15
};

const DATA_DB_NPC = {
    ID: 1,
    Name: 'test',
    Health: 100,
    Skin: 'testSkin',
    Level: 1,
    ID_Map: 1,
    X: 16,
    Y: 15,
    Vision_Distance: ''
};


const Engine = new ENGINE();

Engine.init();

/* ------------------------------ *
    FUNCIONES DE AYUDA
* ------------------------------ */
test('playerById', () => {
    let idPlayer = '1';
    let response = Engine.addPlayer(idPlayer, DATA_DB_PLAYER);

    expect(Engine.playerById(idPlayer)).toStrictEqual(response);
});

test('npcById', () => {
    let posWorld = Engine.posWorld(DATA_DB_NPC.ID_Map, DATA_DB_NPC.X, DATA_DB_NPC.Y);
    let response = new NPC(DATA_DB_NPC, posWorld.x, posWorld.y, "imagen1\r\n");

    Engine.addNPC(DATA_DB_NPC);

    expect(Engine.npcById(DATA_DB_NPC.ID)).toStrictEqual(response);
});

test('searchIDMap', () => {
    let idMap = 1;
    let response = {x: 1, y: 1};

    expect(Engine.searchIDMap(idMap)).toStrictEqual(response);
});

test('updatePos', () => {
    let IDMap = 1;
    let posPlayer = {x: 16, y: 15};
    let response = {IDMap: IDMap, x: posPlayer.x, y: posPlayer.y};

    expect(Engine.updatePos(IDMap, posPlayer.x, posPlayer.y)).toStrictEqual(response);
});

test('posWorld',() => {
    let IDMap = 1;
    let posPlayer = {x: 16, y: 15};
    let response = {x: 48, y: 47};

    expect(Engine.posWorld(IDMap, posPlayer.x, posPlayer.y)).toStrictEqual(response);
});

/* ------------------------------ *
    FUNCIONES - NPC
* ------------------------------ */
test('NPCNearby', () => {
    // PLAYER
    let idPlayer = '1';
    let posWorldPlayer = Engine.posWorld(DATA_DB_PLAYER.IDMap, DATA_DB_PLAYER.X, DATA_DB_PLAYER.Y);
    let player = Engine.addPlayer(idPlayer, DATA_DB_PLAYER, posWorldPlayer.x, posWorldPlayer.y);
    //NPC
    let posWorldNpc = Engine.posWorld(DATA_DB_NPC.ID_Map, DATA_DB_NPC.X, DATA_DB_NPC.Y);
    let npc = new NPC(DATA_DB_NPC, posWorldNpc.x, posWorldNpc.y, "imagen1\r\n");
    let response = [npc, npc];

    Engine.addNPC(DATA_DB_NPC);

    expect(Engine.NPCNearby(player)).toStrictEqual(response);
});

/* ------------------------------ *
    FUNCIONES - PLAYER
* ------------------------------ */
test('addPlayer', () => {
    let idPlayer = '1';
    let posWorldPlayer = Engine.posWorld(DATA_DB_PLAYER.IDMap, DATA_DB_PLAYER.X, DATA_DB_PLAYER.Y);
    let response = new PLAYER(idPlayer, DATA_DB_PLAYER, posWorldPlayer.x, posWorldPlayer.y, "imagen1\r\n", "");


    expect(Engine.addPlayer(idPlayer, DATA_DB_PLAYER)).toStrictEqual(response);
});

test('playersNearby', () => {
    // PLAYER 1
    let posWorldPlayer = Engine.posWorld(DATA_DB_PLAYER.IDMap, DATA_DB_PLAYER.X, DATA_DB_PLAYER.Y);
    let player = Engine.addPlayer('1', DATA_DB_PLAYER, posWorldPlayer.x, posWorldPlayer.y, "", "");
    // PLAYER 2
    let posWorldPlayer2 = Engine.posWorld(DATA_DB_PLAYER.IDMap, DATA_DB_PLAYER.X, DATA_DB_PLAYER.Y);
    let player2 = Engine.addPlayer('2', DATA_DB_PLAYER2, posWorldPlayer2.x, posWorldPlayer2.y, "", "");
    let response = [player2];

    expect(Engine.playersNearby(player)).toStrictEqual(response);
});

//movePlayer (player, X, Y, Dir)
/*
test('movePlayer', () => {
    let idPlayer = '1';
    let data = { x: 1, y: 0, dir: 2 };
    let posWorldPlayer = Engine.posWorld(DATA_DB_PLAYER.IDMap, DATA_DB_PLAYER.X, DATA_DB_PLAYER.Y);
    let player = Engine.addPlayer(idPlayer, DATA_DB_PLAYER, posWorldPlayer.x, posWorldPlayer.y, "", "");
    let response = true;

    expect(Engine.movePlayer(player, data)).toBe(response);
});
*/

test('playerDisconnect', () => {
    let idPlayer = '1';
    let posWorldPlayer = Engine.posWorld(DATA_DB_PLAYER.IDMap, DATA_DB_PLAYER.X, DATA_DB_PLAYER.Y);
    let response = new PLAYER(idPlayer, DATA_DB_PLAYER, posWorldPlayer.x, posWorldPlayer.y, "imagen1\r\n", "");

    expect(Engine.playerDisconnect(idPlayer)).toStrictEqual(response);
});
