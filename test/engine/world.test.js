const { response } = require('express');
const WORLD = require('../../server/core/engine/modules/entities/world/world').World;
const CONSTANT = require('./constants');

const World = new WORLD();

test('getTileSize', () => {
    expect(World.tileSize).toStrictEqual(32);
});

test('getMap', () => {
    let idMap = 'test1',
        width = 544,
        height = 352,
        posPlayer = {X: 9, Y: 11};

    let capas = World.getMap(idMap, width, height, posPlayer);

    expect(capas.capa1).toStrictEqual(CONSTANT.responseMap.capa1);
    expect(capas.capa2).toStrictEqual(CONSTANT.responseMap.capa2);
    expect(capas.capa3).toStrictEqual(CONSTANT.responseMap.capa3);
    expect(capas.capa4).toStrictEqual(CONSTANT.responseMap.capa4);
    expect(capas.capa5).toStrictEqual(CONSTANT.responseMap.capa5);
    expect(capas.capa6).toStrictEqual(CONSTANT.responseMap.capa6);
    expect(capas.collision).toStrictEqual(CONSTANT.responseMap.collision);
    expect(World.getMap(idMap, width, height, posPlayer)).toStrictEqual(CONSTANT.responseMap);
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