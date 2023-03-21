const ENGINE = require('../../engine/engine').Engine;
const PLAYER = require('../../engine/modules/player').Player;
const NPC = require('../../engine/modules/npc').Npc;

const DATA_DB_PLAYER = {
    id: 1,
    name: 'prueba',
    gender: null,
    health: 154,
    level: 1,
    experience: 0,
    money: 0,
    SKIN: {
        base: 'testBase',
        hair: 'H-1',
    },
    LOCATION: {
        idMap: 1,
        posX: 16,
        posY: 15
    },
    ATTRIBUTES: {
        strength: 1,
    },
    KEYBOARD: {
        keyAction1: 81,
        keyAction2: 87,
        keyAction3: 69,
        keyAction4: 82,
        keyAction5: 84,
        keyAction6: 65,
        keyCharacter: 80,
        keyBook: 76,
        keyMenu: 27,
        keyMap: 77,
        keySkills: 74
    }
};

const DATA_DB_PLAYER2 = {
    id: 2,
    name: 'test',
    gender: null,
    health: 154,
    level: 1,
    experience: 0,
    money: 0,
    SKIN: {
        base: 'testBase',
        hair: 'H-1',
    },
    LOCATION: {
        idMap: 1,
        posX: 16,
        posY: 15
    },
    ATTRIBUTES: {
        strength: 1,
    },
    KEYBOARD: {
        keyAction1: 81,
        keyAction2: 87,
        keyAction3: 69,
        keyAction4: 82,
        keyAction5: 84,
        keyAction6: 65,
        keyCharacter: 80,
        keyBook: 76,
        keyMenu: 27,
        keyMap: 77,
        keySkills: 74
    }
};

const DATA_DB_NPC = {
    id: 1,
    name: 'test',
    health: 100,
    skin: 'testSkin',
    level: 1,
    idMap: 1,
    posX: 16,
    posY: 15,
    visionDistance: '',
    reaction: 1,
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
    let response = new NPC(DATA_DB_NPC, "imagen1");

    Engine.addNPC(DATA_DB_NPC);

    expect(Engine.npcById(DATA_DB_NPC.id)).toStrictEqual(response);
});

/* ------------------------------ *
    FUNCIONES - NPC
* ------------------------------ */
test('NPCNearby', () => {
    // PLAYER
    let idPlayer = '1';
    let player = Engine.addPlayer(idPlayer, DATA_DB_PLAYER);
    //NPC
    let npc = new NPC(DATA_DB_NPC, "imagen1");
    let response = [npc, npc];

    Engine.addNPC(DATA_DB_NPC);

    expect(Engine.NPCNearby(player)).toStrictEqual(response);
});

/* ------------------------------ *
    FUNCIONES - PLAYER
* ------------------------------ */
test('addPlayer', () => {
    let idPlayer = '1';
    let response = new PLAYER(idPlayer, DATA_DB_PLAYER, "imagen1\r\n", "");


    expect(Engine.addPlayer(idPlayer, DATA_DB_PLAYER)).toStrictEqual(response);
});

test('playersNearby', () => {
    // PLAYER 1
    let player = Engine.addPlayer('1', DATA_DB_PLAYER);
    // PLAYER 2
    let player2 = Engine.addPlayer('2', DATA_DB_PLAYER2);
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
    let response = new PLAYER(idPlayer, DATA_DB_PLAYER, "imagen1\r\n", "");

    expect(Engine.playerDisconnect(idPlayer)).toStrictEqual(response);
});
