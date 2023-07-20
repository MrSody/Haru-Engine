const ENGINE = require('../../engine/engine').Engine;
const PLAYER = require('../../engine/modules/player').Player;
const NPC = require('../../engine/modules/npc').Npc;
const CONSTANT = require('./constants');

const Engine = new ENGINE();

Engine.init();

/* ------------------------------ *
    GETTERS
* ------------------------------ */
test('getTileSize', () => {
    expect(Engine.getTileSize()).toStrictEqual(32);
});

test('getSpriteWorld', () => {
    expect(Engine.getSpriteWorld()).not.toBeNaN();
});

test('getMap', () => {
    let IDClient = '1';
    let player = new PLAYER(IDClient, CONSTANT.DATA_DB_PLAYER, "imagen1\r\n", "");
    let width = 160;
    let height = 96;

    expect(Engine.getMap(player, width, height)).toStrictEqual(CONSTANT.responseMap6x4);
});

test('getPlayers', () => {
    //TODO: Falta implementacion - getPlayers
});

/* ------------------------------ *
    HELPER FUNCTIONS
* ------------------------------ */
test('playerById', () => {
    let IDClient = '1';
    let response = new PLAYER(IDClient, CONSTANT.DATA_DB_PLAYER, "imagen1\r\n", "");
    
    Engine.addPlayer(IDClient, CONSTANT.DATA_DB_PLAYER);
    Engine.addPlayer('2', CONSTANT.DATA_DB_PLAYER2);

    expect(Engine.playerById(IDClient)).toStrictEqual(response);
});

test('npcById', () => {
    let response = new NPC(CONSTANT.DATA_DB_NPC, "imagen1");

    Engine.addNPC(CONSTANT.DATA_DB_NPC);

    expect(Engine.npcById(CONSTANT.DATA_DB_NPC.id)).toStrictEqual(response);
});

/* ------------------------------ *
    FUNCTIONS - NPC
* ------------------------------ */
test('addNPC', () => {
    //TODO: Falta implementacion - addNPC
});

// TODO: Falta implentacion en el engine - NPCNearby
test('NPCNearby', () => {
    // PLAYER
    let idPlayer = '1';
    let player = Engine.addPlayer(idPlayer, CONSTANT.DATA_DB_PLAYER);
    //NPC
    let npc = new NPC(CONSTANT.DATA_DB_NPC, "imagen1");
    let response = [npc, npc];

    Engine.addNPC(CONSTANT.DATA_DB_NPC);

    //expect(Engine.NPCNearby(player)).toStrictEqual(response);
});

/* ------------------------------ *
    FUNCIONES - PLAYER
* ------------------------------ */
test('addPlayer', () => {
    let idPlayer = '1';
    let response = new PLAYER(idPlayer, CONSTANT.DATA_DB_PLAYER, "imagen1\r\n", "");

    expect(Engine.addPlayer(idPlayer, CONSTANT.DATA_DB_PLAYER)).toStrictEqual(response.getDataSend());
});

//TODO: Falta implementacion en el engine - playersNearby
test('playersNearby', () => {
    // PLAYER 1
    let player = Engine.addPlayer('1', CONSTANT.DATA_DB_PLAYER);
    // PLAYER 2
    let player2 = Engine.addPlayer('2', CONSTANT.DATA_DB_PLAYER2);
    let response = [player2];

    //expect(Engine.playersNearby(player)).toStrictEqual(response);
});

//movePlayer (player, X, Y, Dir)
//TODO: REVISAR - movePlayer
test('movePlayer', () => {
    let idPlayer = '1';
    let data = { x: 1, y: 0, dir: 2 };
    //let posWorldPlayer = Engine.posWorld(DATA_DB_PLAYER.IDMap, DATA_DB_PLAYER.X, DATA_DB_PLAYER.Y);
    let player = Engine.addPlayer(idPlayer, CONSTANT.DATA_DB_PLAYER);
    let response = true;

    //expect(Engine.movePlayer(player, data)).toBe(response);
});

test('playerDisconnect', () => {
    let idPlayer = '1';
    let response = new PLAYER(idPlayer, CONSTANT.DATA_DB_PLAYER, "imagen1\r\n", "");

    expect(Engine.playerDisconnect(idPlayer)).toStrictEqual(response);
});
