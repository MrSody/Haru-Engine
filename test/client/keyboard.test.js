/**
 * @jest-environment jsdom
 */

const CONSTANT = require('./constants');
const { createCanvas, loadImage } = require('canvas');

import { response } from 'express';
import LocalPlayer from '../../client/public/game/js/modules/entities/player/localPlayer';
import Keyboard from '../../client/public/game/js/modules/hub/keyboard';
import InterfaceGame from '../../client/public/game/js/modules/hub/interface/interfaceGame';

describe('keyDown', () => {
    test('keyDown - Running', () => {
        let player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let keyBoard = new Keyboard(CONSTANT.DATA_PLAYER.keyBoard);
        let key = CONSTANT.DATA_PLAYER.keyBoard.keyRunning;
        
        keyBoard.keyDown(key, player);

        expect(player.goRun).toStrictEqual(true);
    });
});

describe('keyUp', () => {
    test('keyUp - Running', () => {
        let player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let clsInterfaceGame = new InterfaceGame();
        let keyBoard = new Keyboard(CONSTANT.DATA_PLAYER.keyBoard);
        let key = CONSTANT.DATA_PLAYER.keyBoard.keyRunning;
        
        keyBoard.keyUp(key, player, clsInterfaceGame);

        expect(player.goRun).toStrictEqual(false);
    });
});