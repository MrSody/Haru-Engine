/**
 * @jest-environment jsdom
 */

const CONSTANT = require('./constants');
const { createCanvas, loadImage } = require('canvas');

import { response } from 'express';
import Mouse from '../../client/public/game/js/modules/hub/mouse';

test('getClickedTile', () => {
    let tileSize = 32;
    let clsMouse = new Mouse(tileSize);
    let page = { pageX: 10, pageY: 20 };

    expect(clsMouse.getClickedTile(page)).toStrictEqual({ x: 0, y: 1 });
});