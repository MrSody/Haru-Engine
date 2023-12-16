/**
 * @jest-environment jsdom
 */

const { createCanvas, loadImage } = require('canvas')

const WORLD = require('../../engine/modules/world').World;
const CONSTANT = require('./constants');

import { response } from 'express';
import Map from '../../public/game/js/modules/world/map.js';

const World = new WORLD();

test('setMap', () =>{
    const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});
    let response = CONSTANT.responseMap;

    clsMap.setMap(CONSTANT.responseMap);

    expect(clsMap.capaOne).toStrictEqual(response.capa1);
    expect(clsMap.capaTwo).toStrictEqual(response.capa2);
    expect(clsMap.capaThree).toStrictEqual(response.capa3);
    expect(clsMap.capaFour).toStrictEqual(response.capa4);
    expect(clsMap.capaFive).toStrictEqual(response.capa5);
    expect(clsMap.capaSix).toStrictEqual(response.capa6);
    expect(clsMap.capaCollision.now).toStrictEqual(response.collision);
});

// TODO: Revisar - no funciona el test - toca es enviarle un objecto
test('setCollision', () =>{
    const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});
    let response = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]];

    clsMap.setMap(CONSTANT.responseMap);

    clsMap.setCollision(0, 0, 2);

    expect(clsMap.getCollision()).toStrictEqual(response);
});

test('setSizeScreen', () =>{
    const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});
    let responseSizeScreen = {width: 250, height: 250};
    let responseMaxTiles = {x: 9, y: 9 };
    let responseMiddleTile = {x: 4, y: 4 };

    clsMap.setSizeScreen(250, 250);

    expect(clsMap.sizeScreen).toStrictEqual(responseSizeScreen);
    expect(clsMap.maxTiles).toStrictEqual(responseMaxTiles);
    expect(clsMap.middleTile).toStrictEqual(responseMiddleTile);
});


test('getCollision', () =>{
    const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});
    let response = CONSTANT.responseMap.collision;

    clsMap.setMap(CONSTANT.responseMap);

    expect(clsMap.getCollision()).toStrictEqual(response);
});

test('drawMapDown', async () =>{
    const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});
    const canvas = createCanvas(544, 352);
    const ctx = canvas.getContext('2d');
    const image = await loadImage(World.dataSpriteSheets);

    clsMap.spritesheet = image;

    let posX = 3;
    let posY = 6;

    clsMap.setMap(CONSTANT.responseMap);

    clsMap.drawMapDown(ctx, posX, posY);

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
});

test('drawMapUp', async () =>{
    const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});
    const canvas = createCanvas(544, 352);
    const ctx = canvas.getContext('2d');
    const image = await loadImage(World.dataSpriteSheets);

    clsMap.spritesheet = image;

    let posX = 7;
    let posY = 4;

    clsMap.setMap(CONSTANT.responseMap);

    clsMap.drawMapUp(ctx, posX, posY);

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
});

test('drawMapLayers', async () =>{
    const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});
    const canvas = createCanvas(544, 352);
    const ctx = canvas.getContext('2d');
    const image = await loadImage(World.dataSpriteSheets);

    clsMap.spritesheet = image;

    let posX = 3;
    let posY = 6;

    clsMap.drawMapLayers(CONSTANT.responseMap.capa1, CONSTANT.responseMap.capa2, CONSTANT.responseMap.capa3, ctx, posX, posY);

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
});

test('drawMap', async () =>{
    const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});
    const canvas = createCanvas(544, 352);
    const ctx = canvas.getContext('2d');
    const image = await loadImage(World.dataSpriteSheets);

    clsMap.spritesheet = image;

    clsMap.drawMap(CONSTANT.responseMap.capa1, ctx, 0, 0);

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
});

describe('posSprite', () => {

    test('posSprite - First row', () => {
        const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});
        let spriteNum = 4;
        let imageWidth = 256;
        let imageHeight = 3264;
        let response = {X: 3, Y: 0};

        expect(clsMap.posSprite(spriteNum, imageWidth, imageHeight)).toStrictEqual(response);
    });

    test('posSprite - Second row', () => {
        const clsMap = new Map({spritesheet: World.dataSpriteSheets, tileSize: World.tileSize});
        let spriteNum = 9;
        let imageWidth = 256;
        let imageHeight = 3264;
        let response = {X: 0, Y: 1};

        expect(clsMap.posSprite(spriteNum, imageWidth, imageHeight)).toStrictEqual(response);
    });

});
