const PLAYER = require('../../engine/modules/player').Player;
const CONSTANT = require('./constants');

test('getDataSend', () => {
    let player = new PLAYER('1', CONSTANT.DATA_DB_PLAYER, "imagen1\r\n", "");
    let response = { 
                    IDPj: 1, 
                    name: 'prueba',
                    skinBase: 'imagen1\r\n',
                    skinHair: '',
                    health: { now: 154, max: 154, },
                    level: 1,
                    experience: { now: 0, max: 2400, },
                    money: 0,
                    posWorld: { X: 4, Y: 2, },
                    direction: 2, 
                };

    expect(player.getDataSend()).toStrictEqual(response);
});