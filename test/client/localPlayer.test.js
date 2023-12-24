/**
 * @jest-environment jsdom
 */

const CONSTANT = require('./constants');
const { createCanvas, loadImage } = require('canvas');

import { response } from 'express';
import LocalPlayer from '../../client/public/game/js/modules/entities/player/localPlayer';
import DirectionsEnums from "../../client/public/game/js/modules/enums/directions";

test('setAbsPos', () => {
    let player = new LocalPlayer(CONSTANT.DATA_PLAYER);

    player.setAbsPos(9, 12);

    expect(player.absPos).toStrictEqual({x: 9, y: 12});
});


describe('setPath', () => {

    test('setPath', () => {
        let player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let responsePath = [[9, 11],
                            [9, 12],
                            [9, 13],
                            [10, 13],
                            [11, 13],
                            [11, 14]];

        player.setPath(CONSTANT.Path);

        expect(player.path).toStrictEqual(responsePath);
    });

    test('setPath - goAttack', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let responsePath = [[9, 11],
                            [9, 12],
                            [9, 13],
                            [10, 13],
                            [11, 13]];

        player.goAttack = true;

        player.setPath(CONSTANT.Path);

        expect(player.path).toStrictEqual(responsePath);
        expect(player.finalDirection).toStrictEqual(DirectionsEnums.directions().Down);
    });

    test('setPath - goToNpc', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let responsePath = [[9, 11],
                            [9, 12],
                            [9, 13],
                            [10, 13],
                            [11, 13]];

        player.goToNpc = true;

        player.setPath(CONSTANT.Path);

        expect(player.path).toStrictEqual(responsePath);
        expect(player.finalDirection).toStrictEqual(DirectionsEnums.directions().Down);
    });
});

describe('updateAbsPos', () => {
    test('updateAbsPos - Steps - 1', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

        player.setPath(CONSTANT.Path);
        player.stepCount = 1;

        player.updateAbsPos();

        expect(player.dir).toStrictEqual(DirectionsEnums.directions().Down);
        expect(player.absPos).toStrictEqual({x: 0, y: 1});
    });

    test('updateAbsPos - Steps - 2', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

        player.setPath(CONSTANT.Path);
        player.stepCount = 2;

        player.updateAbsPos();

        expect(player.dir).toStrictEqual(DirectionsEnums.directions().Down);
        expect(player.absPos).toStrictEqual({x: 0, y: 1});
    });

    test('updateAbsPos - Steps - 3', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

        player.setPath(CONSTANT.Path);
        player.stepCount = 3;

        player.updateAbsPos();

        expect(player.dir).toStrictEqual(DirectionsEnums.directions().Right);
        expect(player.absPos).toStrictEqual({x: 1, y: 0});
    });

    test('updateAbsPos - Steps - 4', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

        player.setPath(CONSTANT.Path);
        player.stepCount = 4;

        player.updateAbsPos();

        expect(player.dir).toStrictEqual(DirectionsEnums.directions().Right);
        expect(player.absPos).toStrictEqual({x: 1, y: 0});
    });

    test('updateAbsPos - Steps - 5', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

        player.setPath(CONSTANT.Path);
        player.stepCount = 5;

        player.updateAbsPos();

        expect(player.dir).toStrictEqual(DirectionsEnums.directions().Down);
        expect(player.absPos).toStrictEqual({x: 0, y: 1});
    });
});

test('playerWalking', () => {
    const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

    player.setPath(CONSTANT.Path);
    player.stepCount = 1;
    player.tellCount = 1;

    player.playerWalking();

    expect(player.stepCount).toStrictEqual(2);
});

test('playerMove', () => {
    const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

    player.path = CONSTANT.Path;

    player.playerMove(1);
    player.posWorld.x += player.absPos.x;
    player.posWorld.y += player.absPos.y; 
    
    player.playerMove(1);
    player.posWorld.x += player.absPos.x;
    player.posWorld.y += player.absPos.y;
    
    player.playerMove(1);
    player.posWorld.x += player.absPos.x;
    player.posWorld.y += player.absPos.y;
    
    player.playerMove(1);
    player.posWorld.x += player.absPos.x;
    player.posWorld.y += player.absPos.y;

    player.playerMove(1);
    player.posWorld.x += player.absPos.x;
    player.posWorld.y += player.absPos.y;

    player.playerMove(1);
    player.posWorld.x += player.absPos.x;
    player.posWorld.y += player.absPos.y;

    expect(player.posWorld).toStrictEqual({x: 11, y: 14 });
});

test('draw', async () => {
    const player = new LocalPlayer(CONSTANT.DATA_PLAYER);
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