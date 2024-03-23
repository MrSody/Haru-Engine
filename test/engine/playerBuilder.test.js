const PLAYERBUILDER = require('../../server/core/engine/modules/entities/player/playerBuilder').PlayerBuilder;
const CONSTANT = require('./constants');

test('createCharacter', async () => {
    let IDClient = '1';
    let player = await new PLAYERBUILDER().createCharacter(IDClient, CONSTANT.DATA_DB_PLAYER);

    expect(player.getDataSend()).toStrictEqual(CONSTANT.RESPONSE_DATASEND);
});