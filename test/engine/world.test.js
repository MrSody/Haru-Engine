const { response } = require('express');
const WORLD = require('../../engine/modules/world').World;
const CONSTANT = require('./constants');

const World = new WORLD();

test('getTileSize', () => {
    expect(World.tileSize).toStrictEqual(32);
});

test('getMap', () => {
    let idMap = 'test',
        width = 160,
        height = 96,
        posPlayer = {X: 4, Y: 2};

    expect(World.getMap(idMap, width, height, posPlayer)).toStrictEqual(CONSTANT.responseMap6x4);
});

test('getCoordinates', () => {
    let width = 160,
        height = 96,
        posPlayer = {X: 4, Y: 2},
        response = {
            X: [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6],
            Y: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3],
        };

    expect(World.getCoordinates(width, height, posPlayer)).toStrictEqual(response);
});