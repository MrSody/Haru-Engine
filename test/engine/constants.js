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
        idMap: 'test',
        posX: 4,
        posY: 2,
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
        keySkills: 74,
    },
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
        posY: 15,
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
        keySkills: 74,
    },
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

let responseMap6x4 = {
    capa1: [[4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4]],

    capa2: [[0, 0, 0, 0, 0, 0],
            [0, 0, 7, 7, 7, 7],
            [0, 0, 7, 0, 0, 7],
            [0, 0, 7, 0, 0, 7]],

    capa3: [[0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]],

    capa4: [[0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]],

    capa5: [[0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]],

    capa6: [[0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]],

    collision: [[0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0]],
};

exports.DATA_DB_PLAYER = DATA_DB_PLAYER;

exports.DATA_DB_PLAYER2 = DATA_DB_PLAYER2;

exports.DATA_DB_NPC = DATA_DB_NPC;

exports.responseMap6x4 = responseMap6x4;