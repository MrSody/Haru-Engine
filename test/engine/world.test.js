const { response } = require('express');

const WORLD = require('../../engine/modules/world').World;

const World = new WORLD();

World.initWorld();

let responseMap = {
    capa1: [[4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4]],

    capa2: [[0, 0, 0, 0, 0, 0],
            [0, 0, 7, 7, 7, 7],
            [0, 0, 7, 0, 0, 7],
            [0, 0, 7, 0, 0, 7]],

    capa3: [[0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]],

    capa4: [[0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]],

    capa5: [[0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]],

    capa6: [[0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]],

    collision: [[0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0]],
};

test('getTileSize', () => {
    let response = 32;

    expect(World.getTileSize()).toStrictEqual(response);
});

test('getMap', () => {
    let idMap = 'test',
        width = 160,
        height = 96,
        posPlayer = {x: 4, y: 2};

    expect(World.getMap(idMap, width, height, posPlayer)).toStrictEqual(responseMap);
});

test('desingMap', () => {
    let width = 160,
        height = 96,
        posPlayer = {x: 4, y: 2},
        tileSize = 32,
        map = World.dataMap('test'),
        dataCapa = map.layers.find(data => data.name == "2").data,
        size = {
            width: Math.ceil(width / tileSize),
            height: Math.ceil(height / tileSize)
        },
        mapSize = {
            width: Math.round((width / 2) / tileSize),
            height: Math.round((height / 2) / tileSize)
        },
        pos = {
            X: Math.floor(posPlayer.x - mapSize.width),
            Y: Math.floor(posPlayer.y - mapSize.height)
        }; 

    expect(World.desingMap(dataCapa, size, pos)).toStrictEqual(responseMap.capa2);
});

test('getCoordinates', () => {
    let width = 160,
        height = 96,
        posPlayer = {x: 4, y: 2},
        response = {
            x: [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,],
            y: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3]
        };

    expect(World.getCoordinates(width, height, posPlayer)).toStrictEqual(response);
});

test('desingScreen', () => {
    let width = 160,
        height = 96,
        posPlayer = {x: 4, y: 2},
        response = {
            size: {width: 5, height: 3},
            pos: {X: 1, Y: 0}
        };

    var t = World.desingScreen(width, height, posPlayer);

    expect(World.desingScreen(width, height, posPlayer)).toStrictEqual(response);
});