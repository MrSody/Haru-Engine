/**
 * @jest-environment jsdom
 */

const CONSTANT = require('./constants');
const { createCanvas, loadImage } = require('canvas');

import { response } from 'express';
import RemotePlayer from '../../client/public/game/js/modules/entities/player/remotePlayer';

test('posNow', () => {
    let player = new RemotePlayer(CONSTANT.DATA_PLAYER);
    let widthMap = 100;
    let heightMap = 100;
    let posWorld = {x: 10, y: 5};

    expect(player.posNow(widthMap, heightMap, posWorld)).toStrictEqual({x: 99, y: 106});
});

test('draw', async () => {
    const player = new RemotePlayer(CONSTANT.DATA_PLAYER);
    const coordinateX = 5;
    const coordinateY = 5;
    const tileSize = 32;

    const canvaCharacters = createCanvas(544, 352);
    const ctxCharacters = canvaCharacters.getContext('2d');
    const canvaHUB = createCanvas(544, 352);
    const ctxHUB = canvaHUB.getContext('2d');

    const image = await loadImage(`${__dirname}\\spritePlayer.png`);

    player.skinBase = image;

    player.draw(ctxCharacters, ctxHUB, coordinateX, coordinateY, tileSize);

    const dataURLCharacters = canvaCharacters.toDataURL();
    expect(dataURLCharacters).toMatchSnapshot();

    const dataURLHUB = canvaHUB.toDataURL();
    expect(dataURLHUB).toMatchSnapshot();
});