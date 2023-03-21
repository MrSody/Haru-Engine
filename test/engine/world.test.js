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
    let posPlayer = {x: 4, y: 2};

    expect(World.getMap('test', 160, 96, posPlayer)).toStrictEqual(responseMap);
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

// test('getMaps', () => {
//     let posMapX = 1;
//     let posMapY = 1;
//     let response = [0, 0, 0, 0, 1, 0, 0, 0, 0];

//     expect(World.getMaps(posMapX, posMapY)).toStrictEqual(response);
// });