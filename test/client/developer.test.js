/**
 * @jest-environment jsdom
 */

const { createCanvas, loadImage } = require('canvas')

const WORLD = require('../../server/core/engine/modules/entities/world/world.js').World;
const CONSTANT = require('./constants');

import { response } from 'express';
import Developer from '../../client/public/game/js/developer/developer';

const World = new WORLD();


test('drawGrid', async () =>{
    const clsDeveloper = new Developer(World.tileSize);
    const canvas = createCanvas(544, 352);
    const ctx = canvas.getContext('2d');

    let X = 3;
    let Y = 6;

    clsDeveloper.drawGrid(ctx, X, Y)

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
});

test('drawCollision', async () =>{
    const clsDeveloper = new Developer(World.tileSize);
    const canvas = createCanvas(544, 352);
    const ctx = canvas.getContext('2d');

    let X = 7;
    let Y = 4;

    clsDeveloper.drawCollision(ctx, X, Y, CONSTANT.responseMap.collision);

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
});

test('drawVisionNpc', async () =>{
    const clsDeveloper = new Developer(World.tileSize);
    const canvas = createCanvas(544, 352);
    const ctx = canvas.getContext('2d');

    let visionDistance = 5;
    let pos = {x: 10, y: 15};

    clsDeveloper.drawVisionNpc(ctx, visionDistance, pos);

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
});
