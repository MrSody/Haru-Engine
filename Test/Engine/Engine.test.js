const Engine = require('../../Engine/Engine').Engine;
const Player = require('../../Engine/Modules/Player').Player;
const DataDB = require('./dataDB').dataDB;

const engine = new Engine();
const dataDB = new DataDB();

engine.init();

test('searchIDMap', () => {
    let idMap = 1,
        response = {x: 1, y: 1};

    expect(engine.searchIDMap(idMap)).toStrictEqual(response);
});

test('addPlayer', () => {
    let idPlayer = '1',
        datadb = [{
            id: 2,
            nombre: 'prueba',
            skinBase: 'H-1',
            skinPelo: 'H-1',
            salud: 154,
            nivel: 1,
            xp: 0,
            dinero: 0,
            Nmap: 1,
            X: 16,
            Y: 15
        }],
        response = new Player(idPlayer, datadb, 48, 47, dataDB.playerData().skinBase, '');


    expect(engine.addPlayer(idPlayer, datadb)).toBe(response);
});

/*
test(' CAPAS - COLLISION ', () => {
    
    expect(world.getTestCapa(1366, 638, {x: 16, y: 15}, {x: 1, y: 1})).toBe(capa3);
    //expect(world.getTestCapaCollision(1366, 638, {X: 16, Y: 15}, {X: 1, Y: 1})).toBe(capaCollision);
});
*/