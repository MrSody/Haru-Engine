/**
 * @jest-environment jsdom
 */

const WORLD = require('../../engine/modules/world').World;

import Map from '../../public/game/js/modules/world/map.js';

const World = new WORLD();
const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});

test('desingSheet', () =>{
    let response = [{
            name: "tileset_konoha_naruto_by_zewiskaaz-d55puro",
            spritesheet: '<img src="tileset_konoha_naruto_by_zewiskaaz-d55puro"/>',
            tileStart: 1,
            tileEnd: 816,
            tileCount: 816,
            imageHeight: 3264,
            imageWidth: 256,
        }];

    //expect(clsMap.desingSheet(World.getDataSpriteSheets())).toStrictEqual(response);
});

// TODO: Revisar - posSprite - 
test('posSprite', () => {
    let spriteNum = 9;
    let imageWidth = 256;
    let imageHeight = 3264;
    let response = {X: 0, Y: 1};

    //expect(clsMap.posSprite(spriteNum, imageWidth, imageHeight)).toStrictEqual(response);
});
