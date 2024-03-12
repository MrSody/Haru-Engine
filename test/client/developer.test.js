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
    const canvas = createCanvas(576, 352);
    const ctx = canvas.getContext('2d');

    for (let countY = 0; countY < CONSTANT.responseMap.collision.length; countY++) {
        for (let countX = 0; countX < CONSTANT.responseMap.collision[countY].length; countX++) {
            clsDeveloper.drawGrid(ctx, countX, countY);
        }
    }

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
});

test('drawCollision', async () =>{
    const clsDeveloper = new Developer(World.tileSize);
    const canvas = createCanvas(576, 352);
    const ctx = canvas.getContext('2d');

    for (let countY = 0; countY < CONSTANT.responseMap.collision.length; countY++) {
        for (let countX = 0; countX < CONSTANT.responseMap.collision[countY].length; countX++) {
            clsDeveloper.drawGrid(ctx, countX, countY);
            clsDeveloper.drawCollision(ctx, countX, countY, CONSTANT.responseMap.collision);
        }
    }

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
});

test('drawVisionNpc', async () =>{
    const clsDeveloper = new Developer(World.tileSize);
    const canvas = createCanvas(576, 352);
    const ctx = canvas.getContext('2d');

    let visionDistance = 2;
    let pos = {x: 12, y: 8};

    clsDeveloper.drawVisionNpc(ctx, visionDistance, pos);

    for (let countY = 0; countY < CONSTANT.responseMap.collision.length; countY++) {
        for (let countX = 0; countX < CONSTANT.responseMap.collision[countY].length; countX++) {
            clsDeveloper.drawGrid(ctx, countX, countY);
        }
    }

    const dataURL = canvas.toDataURL();
    expect(dataURL).toMatchSnapshot();
});
