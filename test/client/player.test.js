/**
 * @jest-environment jsdom
 */

const CONSTANT = require('./constants');
const { createCanvas, loadImage } = require('canvas');

import { response } from 'express';
import Player from '../../public/game/js/modules/entities/player';
import ActionStateEnums from "../../public/game/js/modules/enums/actionState";

test('setPosWorld', () => {
    const player = new Player(CONSTANT.DATA_PLAYER);

    player.setPosWorld(9, 12);

    expect(player.posWorld).toStrictEqual({x: 9, y: 12});
});

describe('nextFrame', () => {
    test('nextFrame - Steps - 0', () => {
        const player = new Player(CONSTANT.DATA_PLAYER);
    
        player.nextFrame();
    
        expect(player.frame).toStrictEqual(1);
    });

    test('nextFrame - Steps - 1', () => {
        const player = new Player(CONSTANT.DATA_PLAYER);
    
        player.nextFrame();
        player.nextFrame();
    
        expect(player.frame).toStrictEqual(2);
    });

    test('nextFrame - Steps - 2', () => {
        const player = new Player(CONSTANT.DATA_PLAYER);
    
        player.nextFrame();
        player.nextFrame();
        player.nextFrame();
    
        expect(player.frame).toStrictEqual(3);
    });

    test('nextFrame - Steps - 4', () => {
        const player = new Player(CONSTANT.DATA_PLAYER);
    
        player.nextFrame();
        player.nextFrame();
        player.nextFrame();
        player.nextFrame();
    
        expect(player.frame).toStrictEqual(0);
    });
});

describe('drawMode', () => {
    test('drawMode - Stand', async () => {
        const player = new Player(CONSTANT.DATA_PLAYER);
        const coordinateX = 160;
        const coordinateY = 160;
    
        const canvaCharacters = createCanvas(544, 352);
        const ctxCharacters = canvaCharacters.getContext('2d');
    
        const image = await loadImage(`${__dirname}\\spritePlayer.png`);
    
        player.skinBase = image;

        player.mode = ActionStateEnums.ActionState().Stand;
        
        player.drawMode(ctxCharacters, coordinateX, coordinateY);
    
        const dataURLCharacters = canvaCharacters.toDataURL();
        expect(dataURLCharacters).toMatchSnapshot();
    });

    test('drawMode - Walking', async () => {
        const player = new Player(CONSTANT.DATA_PLAYER);
        const coordinateX = 160;
        const coordinateY = 160;
    
        const canvaCharacters = createCanvas(544, 352);
        const ctxCharacters = canvaCharacters.getContext('2d');
    
        const image = await loadImage(`${__dirname}\\spritePlayer.png`);
    
        player.skinBase = image;

        player.mode = ActionStateEnums.ActionState().Walking;
        
        player.drawMode(ctxCharacters, coordinateX, coordinateY);
    
        const dataURLCharacters = canvaCharacters.toDataURL();
        expect(dataURLCharacters).toMatchSnapshot();
    });

    test('drawMode - Running', async () => {
        const player = new Player(CONSTANT.DATA_PLAYER);
        const coordinateX = 160;
        const coordinateY = 160;
    
        const canvaCharacters = createCanvas(544, 352);
        const ctxCharacters = canvaCharacters.getContext('2d');
    
        const image = await loadImage(`${__dirname}\\spritePlayer.png`);
    
        player.skinBase = image;

        player.mode = ActionStateEnums.ActionState().Running;
        
        player.drawMode(ctxCharacters, coordinateX, coordinateY);
    
        const dataURLCharacters = canvaCharacters.toDataURL();
        expect(dataURLCharacters).toMatchSnapshot();
    });

    test('drawMode - Fighting', async () => {
        const player = new Player(CONSTANT.DATA_PLAYER);
        const coordinateX = 160;
        const coordinateY = 160;
    
        const canvaCharacters = createCanvas(544, 352);
        const ctxCharacters = canvaCharacters.getContext('2d');
    
        const image = await loadImage(`${__dirname}\\spritePlayer.png`);
    
        player.skinBase = image;

        player.mode = ActionStateEnums.ActionState().Fighting;
        
        player.drawMode(ctxCharacters, coordinateX, coordinateY);
    
        const dataURLCharacters = canvaCharacters.toDataURL();
        expect(dataURLCharacters).toMatchSnapshot();
    });
});