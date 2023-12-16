/**
 * @jest-environment jsdom
 */

const CONSTANT = require('./constants');

import { response } from 'express';
import LocalPlayer from '../../public/game/js/modules/entities/localPlayer';
import Helper from "../../public/game/js/modules/helper";

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
        expect(player.finalDirection).toStrictEqual(Helper.directions().Down);
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
        expect(player.finalDirection).toStrictEqual(Helper.directions().Down);
    });
});

describe('updateAbsPos', () => {
    test('updateAbsPos - Steps - 1', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

        player.setPath(CONSTANT.Path);
        player.stepCount = 1;

        player.updateAbsPos();

        expect(player.dir).toStrictEqual(Helper.directions().Down);
        expect(player.absPos).toStrictEqual({x: 0, y: 1});
    });

    test('updateAbsPos - Steps - 2', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

        player.setPath(CONSTANT.Path);
        player.stepCount = 2;

        player.updateAbsPos();

        expect(player.dir).toStrictEqual(Helper.directions().Down);
        expect(player.absPos).toStrictEqual({x: 0, y: 1});
    });

    test('updateAbsPos - Steps - 3', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

        player.setPath(CONSTANT.Path);
        player.stepCount = 3;

        player.updateAbsPos();

        expect(player.dir).toStrictEqual(Helper.directions().Right);
        expect(player.absPos).toStrictEqual({x: 1, y: 0});
    });

    test('updateAbsPos - Steps - 4', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

        player.setPath(CONSTANT.Path);
        player.stepCount = 4;

        player.updateAbsPos();

        expect(player.dir).toStrictEqual(Helper.directions().Right);
        expect(player.absPos).toStrictEqual({x: 1, y: 0});
    });

    test('updateAbsPos - Steps - 5', () => {
        const player = new LocalPlayer(CONSTANT.DATA_PLAYER);

        player.setPath(CONSTANT.Path);
        player.stepCount = 5;

        player.updateAbsPos();

        expect(player.dir).toStrictEqual(Helper.directions().Down);
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