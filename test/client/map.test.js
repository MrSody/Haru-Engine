//TODO: Revisar imports no estan funcionando
//import Map from '../../public/game/js/modules/world/map.js';
//const Map2 = require('../../public/game/js/modules/world/map.js').Map;
//import { response } from 'express';
const WORLD = require('../../engine/modules/world').World;


const World = new WORLD();
//const clsMap = new Map({tileSize: World.getTileSize(), spritesheet: World.getDataSpriteSheets()});
/*
test('desingSheet', () =>{
    let response = [{
            name: "tileset_konoha_naruto_by_zewiskaaz-d55puro",
            spritesheet: '<img src="tileset_konoha_naruto_by_zewiskaaz-d55puro"/>',
            tileStart: 1,
            tileEnd: 816,
            tileCount: 816,
            imageHeight: 3264,
            imageWidth: 256
        }];

    expect(clsMap.desingSheet(World.getDataSpriteSheets())).toStrictEqual(response);
});
*/

// TODO: Revisar - posSprite - 
test('posSprite', () => {
    let spriteNum = 9;
    let imageWidth = 256;
    let imageHeight = 3264;
    let response = {X: 0, Y: 1};

    expect(clsMap.posSprite(spriteNum, imageWidth, imageHeight)).toStrictEqual(response);
});
