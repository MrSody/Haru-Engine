const PLAYER = require('../../server/core/engine/modules/entities/player/player').Player;
const CONSTANT = require('./constants');

test('setPosWorld', () => {
    let player = new PLAYER('1', CONSTANT.DATA_DB_PLAYER, "imagen1\r\n", "");
    let response = { X: 5, Y: 4 };

    player.setPosWorld(5, 4)            
    expect(player.posWorld).toStrictEqual(response);
});

test('getDataSend', () => {
    let player = new PLAYER('1', CONSTANT.DATA_DB_PLAYER, "imagen1\r\n", "");
    let response = { 
                    IDClient: '1', 
                    name: 'prueba',
                    skinBase: 'imagen1\r\n',
                    skinHair: '',
                    health: { now: 154, max: 154 },
                    level: 1,
                    experience: { now: 0, max: 2400 },
                    money: 0,
                    posWorld: { X: 9, Y: 11 },
                    direction: 2, 
                };

    expect(player.getDataSend()).toStrictEqual(response);
});