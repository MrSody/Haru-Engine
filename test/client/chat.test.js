/**
 * @jest-environment jsdom
 */

const CONSTANT = require('./constants');
const { createCanvas, loadImage } = require('canvas');

import { response } from 'express';
import LocalPlayer from '../../client/public/game/js/modules/entities/player/localPlayer';
import Chat from '../../client/public/game/js/modules/hub/chat';

describe('message', () => {
    test('message', () => {
        let player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let chat = new Chat();
        let text = "hola";

        expect(chat.message(player, text)).toStrictEqual({sendServer: true, mode: "", text: "hola", chatTo: null});
    });

    test('message - Say', () => {
        let player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let chat = new Chat();
        let text = "/s hola";

        expect(chat.message(player, text)).toStrictEqual({sendServer: true, mode: "s", text: "hola", chatTo: null});
    });

    test('message - Whisper', () => {
        let player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let chat = new Chat();
        let text = "/w test hola";

        expect(chat.message(player, text)).toStrictEqual({sendServer: true, mode: "w", text: "hola", chatTo: "test"});
    });

    test('message - Help', () => {
        let player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let chat = new Chat();
        let text = "/help";

        expect(chat.message(player, text)).toStrictEqual({sendServer: false, mode: "help", text: "Bienvenido al menu de ayuda. <br>- Usa /pos para saber tu ubicacion actual.", chatTo: null});
    });

    test('message - Pos', () => {
        let player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let chat = new Chat();
        let text = "/pos";

        expect(chat.message(player, text)).toStrictEqual({sendServer: false, mode: "pos", text: `Posicion actual: X: ${player.getPosWorld().x} - Y: ${player.getPosWorld().y}`, chatTo: null});
    });

    test('message - Dev', () => {
        let player = new LocalPlayer(CONSTANT.DATA_PLAYER);
        let chat = new Chat();
        let text = "/dev";

        expect(chat.message(player, text)).toStrictEqual({sendServer: false, mode: "dev", text: 'modo developer', chatTo: null});
    });

});