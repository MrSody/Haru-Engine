const PLAYER = require('../../server/core/engine/modules/entities/player/player').Player;
const CONSTANT = require('./constants');

test('setPosWorld', () => {
    let IDClient = '1';
    let player = new PLAYER(IDClient, CONSTANT.DATA_DB_PLAYER);
    let response = { X: 5, Y: 4 };

    player.setPosWorld(5, 4)            
    expect(player.posWorld).toStrictEqual(response);
});

test('getDataSend', async () => {
    let IDClient = '1';
    let player = new PLAYER(IDClient, CONSTANT.DATA_DB_PLAYER);

    await player.updateSkinCharacter();

    expect(player.getDataSend()).toStrictEqual(CONSTANT.RESPONSE_DATASEND);
});

test('updateSkinCharacter', async () => {
    let IDClient = '1';
    let player = new PLAYER(IDClient, CONSTANT.DATA_DB_PLAYER);

    await player.updateSkinCharacter();
    
    expect(player.skinCharacter).toStrictEqual(CONSTANT.CONSTANTSKIN.CHARACTER_SKIN);
});