/*-------------------------------
        HARU-ENGINE
    VERSION:    Alpha
*-------------------------------*/
"use strict";
// HUB
import Interface from './modules/hub/interface/interface.js';
import InterfaceCharacter from './modules/hub/interface/interfaceCharacter.js';
import Mouse from './modules/hub/mouse.js';
import Keyboard from './modules/hub/keyboard.js';
import Chat from './modules/hub/chat.js';
// MAP
import Map from './modules/world/map.js';
// ENTITIES
import LocalPlayer from './modules/entities/player/localPlayer.js';
import RemotePlayer from './modules/entities/player/remotePlayer.js';
import Npc from './modules/entities/npc/npc.js';
// DEVELOPER
import Developer from './developer/developer.js';
//ENUMS
import ChatModesEnums from "../enums/chatModes";

/*-------------------------------
    Variables
*-------------------------------*/

let canvasHUB;		// Canvas DOM elemento
let ctxHUB;		    // Canvas contexto de representación

// CAPAS
let canvasCapaMapaAbajo;
let ctxCapaMapaAbajo;
let canvasPersonaje;
let ctxPersonaje;
let canvasCapaMapaArriba;
let ctxCapaMapaArriba;

// CLASSES
/** @type {Interface} */
let clsInterface = new Interface();

/** @type {InterfaceCharacter} */
let clsInterfaceCharacter = new InterfaceCharacter();

/** @type {Chat} */
let clsChat = new Chat();

/** @type {Keyboard} */
let clsKeyboard;

/** @type {Map} */
let clsMap;

/** @type {Mouse} */
let clsMouse;

/** @type {Developer} */
let clsDeveloper;

// ENTITIES
/** @type {LocalPlayer} Class player local */
let localPlayer;

/** @type {RemotePlayer} Class player remote */
let remotePlayers = [];

/** @type {Npc} Class NPC */
let npcs = [];

// DEVELOPER
let modeDeveloper = false;

let lastMapUpdate = Date.now();
let socket;		// Socket connection
let tellCounter = 0;

    
/* ------------------------------
    Iniciando el juego
*------------------------------*/
window.onload = function() {
	// Inicia la conexion al socket
    socket = io.connect();

	// Start listening for events
	setEventHandlers();
}

// GAME EVENT HANDLERS
let setEventHandlers = function() {
    // HUB - PERSONAJES
    document.querySelector('#characters_BtnGetInGame').addEventListener('click', getInGame);
    document.querySelector('#player_BtnCreateCharacter').addEventListener('click', createNewCharacter);
    document.querySelector('#Pj_0').addEventListener('click', function(){ selCharacter(this.id); });    
    document.querySelector('#Pj_1').addEventListener('click', function(){ selCharacter(this.id); });
    document.querySelector('#Pj_2').addEventListener('click', function(){ selCharacter(this.id); });
    document.querySelector('#Pj_3').addEventListener('click', function(){ selCharacter(this.id); });
    document.querySelector('#Pj_4').addEventListener('click', function(){ selCharacter(this.id); });
    
    // Keyboard
	document.getElementById("Mensaje").addEventListener("keydown", localMessage, false);

    // Window resize
	window.addEventListener("resize", onResize, false);
    window.addEventListener("load", onResize, false);

	// Socket connection successful
	socket.on('connect', onSocketConnected);

    // Account characters - load the characters of the account on screen
    socket.on('character:list', onAccountCharacters);

    // Account character - Create
    socket.on('character:create', onCreateCharacter);

    // Message
    socket.on('chat:newMessage', onReceiveMessage);

    // Create Local Player
    socket.on('players:localPlayer', onCreateLocalPlayer);

    // Create remote player
    socket.on('players:remotePlayer', onNewRemotePlayer);

    // Player removed message received
	socket.on("players:playerDisconnect", onRemovePlayer);

    // Player move message received
	socket.on('player:move', onMovePlayer);

    // INIZIALIZA EL MAPA
    socket.on('map:init', onInitMap);

    // DATOS DEL MAPA
    socket.on('map:data', onMapData);

    // Carga los Npc's en el mapa
    socket.on('npcs:newNpc', onNewNpc);

    // Movimiento del Npc
    socket.on('npc:move', onMoveNpc);
}

/*-------------------------------
    Socket connected
*-------------------------------*/
function onSocketConnected () {
    clsInterface.loadScreen();

    // Tell game server client connected
    socket.emit('account:connected', {idAccount: document.querySelector('#ID').value});
}

/*-------------------------------
    HUB - PERSONAJES
*-------------------------------*/
function onAccountCharacters (data) {
    clsInterfaceCharacter.characterList(data);
}

function onCreateCharacter (data) {
    clsInterfaceCharacter.createCharacter(data);
}

function getInGame () {
    clsInterface.loadScreen('#character', 'Invisible');
    socket.emit('character:connected', {idCharacter: clsInterfaceCharacter.getIDPJ()});
}

function createNewCharacter () {
    let data = clsInterfaceCharacter.getDataCreateCharacter();
    
    clsInterface.loadScreen('#createCharacter', 'Invisible');

    socket.emit('character:create', {
        idAccount: data.idAccount, 
        gender: data.genero, 
        element: data.clase, 
        village: data.inicio, 
        appearance: data.apariencia, 
        hair: data.cabello, 
        name: data.name,
    });
}

function selCharacter (IDElement) {
    let characters = clsInterface.getCharacters();
    let id = Math.round(IDElement.split('_').reverse().shift());
    
    if (Math.round(id + 1) === characters.length) {
        let character = characters[id];
        clsInterfaceCharacter.selCharacter(character.ID, character.skinBase, character.name);
    } else {
        clsInterfaceCharacter.createCharacter();
    }
}

/*-------------------------------
    Iniciar videojuego
*-------------------------------*/
// Initialise new remote player
function onNewRemotePlayer (data) {
	remotePlayers.push(new RemotePlayer(data));
}

// Initialise new local player
function onCreateLocalPlayer (data) {
    localPlayer = new LocalPlayer(data);
    clsKeyboard = new Keyboard(data.keyBoard);

    renderingGame();
}

// INICIALIZA EL MAPA
function onInitMap (data) {
    clsMap = new Map(data);
    clsMouse = new Mouse(clsMap.tileSize);
    clsDeveloper = new Developer(clsMap.tileSize);
        
    // REDIMENCIONA EL CANVAS
    onResize();
    
    // INICIA ANIMACION
    window.requestAnimationFrame(animate);
    
    // Oculta la pantalla de carga
    clsInterface.removeOrAddByID('#loading', 'Invisible');
}

// CARGA LAS CAPAS DEL MAPA
function onMapData (data) {
    clsInterface.setShowLoadScreen(false);
    clsMap.setMap(data);
}

// Npc's
function onNewNpc (data) {
    if (npcs.length === data.count) {
        npcs.splice(0, npcs.length);
    }
    npcs.push(new Npc(data.npc));
}

/*-------------------------------
    Funciones de Ayuda
*-------------------------------*/
/**
 * @param {string} id 
 * @returns {RemotePlayer}
 */
function findRemotePlayer (id) {
    for (let remotePlayer of remotePlayers) {
        if (remotePlayer.getID() === id) {
            return remotePlayer;
        }
    }

    return false;
}

/**
 * @param {string} id 
 * @returns {LocalPlayer | RemotePlayer}
 */
function findPlayer (id) {
    if (localPlayer.getID() === id){
        return localPlayer;
    } else {
        return findRemotePlayer(id);
    }
}

/**
 * @param {string} id 
 * @returns {Npc}
 */
function findNpc (id) {
    for (let npc of npcs) {
        if (npc.getID() === id) {
            return npc;
        }
    }

    return false;
}
/*-------------------------------
    Videojuego cargado
*-------------------------------*/
function renderingGame () {
    // Muestra la interfaz principal
    clsInterface.removeClass('#hubPrincial', 'Invisible');

    // Canvas Mapa Abajo
    canvasCapaMapaAbajo = document.getElementById('capasMapaAbajo');
    ctxCapaMapaAbajo = canvasCapaMapaAbajo.getContext('2d');
    ctxCapaMapaAbajo.globalAlpha = 0.1;

    // Canvas Personaje
    canvasPersonaje = document.getElementById('capaPersonaje');
    ctxPersonaje = canvasPersonaje.getContext('2d');
    ctxPersonaje.globalAlpha = 0.1;

    // Canvas Mapa Arriba
    canvasCapaMapaArriba = document.getElementById('capasMapaArriba');
    ctxCapaMapaArriba = canvasCapaMapaArriba.getContext('2d');
    ctxCapaMapaArriba.globalAlpha = 0.1;

    // Canvas HUB
	canvasHUB = document.getElementById("game");
	ctxHUB = canvasHUB.getContext("2d");
	ctxHUB.globalAlpha = 0.1;
}

function onMovePlayer (data) {
    let player = findPlayer(data.id);

    if (player) {
        player.setPosWorld(data.posWorld.x, data.posWorld.y);
        player.dir = data.dir;

        if (localPlayer.getID() !== player.getID()) {
            player.mode = data.mode;
        } else {
            player.setAbsPos(0, 0);
        }
    } else {
        console.log("MovePlayer - Player not found: "+ data.id);
    }

    // Update Collision
    //clsMap.setCollisionOriginal();            
}

// Remove player Remote -- PRUEBA
function onRemovePlayer (data) {
	let player = findPlayer(data.id);

	// Player not found
	if (!player) {
		console.log("RemovePlayer - Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(player), 1);
}

function onMoveNpc (data) {
    let npc = findNpc(data.id);

    if (npc) {
        npc.setPosWorld(data.pos.x, data.pos.y);
        npc.dir = data.dir;
        npc.setAbsPos(0, 0);
    } else {
        console.log("MoveNpc - Npc not found: "+ data.id);
    }
}

/*-------------------------------
    Mensajes
*-------------------------------*/
function onReceiveMessage (data) {
    clsInterface.showMessage(data);
}

function localMessage (e) {
    if (e.keyCode === 13) {
        if (this.value) {
            let data = clsChat.message(localPlayer, this.value);    
            
            if (data.sendServer) {
                socket.emit('chat:newMessage', {name: localPlayer.getName(), mode: data.mode, text: data.text, chatTo: data.chatTo});
            } else if (data.mode === ChatModesEnums.ChatModes().Developer) {
                modeDeveloper = !modeDeveloper;
                clsInterface.showMessage({mode: data.mode, text: data.text +": "+ modeDeveloper, name: localPlayer.getName()});
            } else {
                clsInterface.showMessage({mode: data.mode, text: data.text, name: localPlayer.getName()});
            }
        }
        clsInterface.blur('#Mensaje');
	}
}

/*-------------------------------
    Funciones mouse videojuego
*-------------------------------*/
game.onclick = function (e) {
    if (!$('#hubPrincial').hasClass('Invisible')) {
        clsMouse.click(e, clsMap.getCollision(), canvasHUB, localPlayer);
    }
}

game.onmousemove = function (e) {
    if (!$('#hubPrincial').hasClass('Invisible')) {
        clsMouse.move(e, clsMap.getCollision());
    }
}

/*-------------------------------
    Funciones Teclado videojuego
*-------------------------------*/
document.onkeydown = function (e) {
    if (!$('#hubPrincial').hasClass('Invisible')) {
        clsKeyboard.keyDown(e.keyCode, localPlayer, clsInterface);
    }
}

document.onkeyup = function (e) {
    if (!$('#hubPrincial').hasClass('Invisible')) {
        clsKeyboard.keyUp(e.keyCode, localPlayer, clsInterface);
    }
}

/*-------------------------------
    GAME ANIMATION LOOP
*-------------------------------*/
function animate () {
    let delta = clsInterface.calculateFPS();

    if (delta !== undefined && !clsInterface.getShowLoadScreen()) {
        draw();
        update(delta);
    }
    // Request a new animation frame
    window.requestAnimationFrame(animate);
}

/*-------------------------------
    GAME UPDATE
*-------------------------------*/
function update (delta) {
    // Mover el player
	if (localPlayer.isMoving()) {
		let absPos = localPlayer.absPos;
        let width = $(window).width();
        let height = $(window).height();

        localPlayer.playerMove(delta);
        
        if (localPlayer.getTellCount()) {
            
            socket.emit('player:move', {id: localPlayer.getID(), x: absPos.x, y: absPos.y, dir: localPlayer.getDir(), mode: localPlayer.getMode()});
            
            // Mover el MAPA
            socket.emit('map:data', {width: width, height: height});

            localPlayer.tellCount = 0;
        }
	}
    
    // Npc movimiento
    for (let i = npcs.length; i-- > 0;) {
        let npc = npcs[i];

        if (npc.isMoving()) {
            let absPos = npc.getAbsPos();
            
            //if (absPos.x || absPos.y) {
                npc.playerMove();
                socket.emit('npc:move', {id: npc.getID(), x: absPos.absX, y: absPos.absY, dir: npc.getDir()});
            //}
        }
    }
}

/*-------------------------------
    GAME DRAW
*-------------------------------*/
function cleanScreen (width, height) {
    ctxHUB.clearRect(0, 0, width, height);
    ctxCapaMapaAbajo.clearRect(0, 0, width, height);
    ctxPersonaje.clearRect(0, 0, width, height);
    ctxCapaMapaArriba.clearRect(0, 0, width, height);
}

function draw () {
    let sizeScreen = clsMap.sizeScreen;
    let middleTile = clsMap.middleTile;
    let maxTiles = clsMap.maxTiles;
    let posWorld = localPlayer.getPosWorld();

    // Wipe the canvas clean
    cleanScreen(sizeScreen.width, sizeScreen.height);

    for (let h = 0; h < maxTiles.y; h++) {
        for (let w = 0; w < maxTiles.x; w++) {
            
            // clean mapCollision
            clsMap.setCollision(w, h, 0);

            // Dibuja capas inferiores
            clsMap.drawMapDown(ctxCapaMapaAbajo, w, h);

            // Draw remote players
            for (let remotePlayer of remotePlayers) {
                let posNow = remotePlayer.posNow(middleTile.x, middleTile.y, posWorld);
                
                if (posNow.x == w && posNow.y == h) {
                    remotePlayer.draw(ctxPersonaje, ctxHUB, posNow.x, (posNow.y - 0.5));
                }
            }

            // Draw NPCs            
            for(let npc of npcs) {
                let posNow = npc.posNow(middleTile.x, middleTile.y, posWorld);

                if (posNow.x == w && posNow.y == h) {
                    npc.draw(ctxPersonaje, ctxHUB, posNow.x, (posNow.y - 0.5), clsMap.tileSize);
                    npc.eventVision(posNow, middleTile.x, middleTile.y, clsMap.getCollision());

                    // Save data Npc in map collision
                    clsMap.setCollision(posNow.x, posNow.y, npc);

                    if (modeDeveloper) {
                        if (npc.isAggressive()) {
                            clsDeveloper.drawVisionNpc(ctxHUB, npc.getVisionDistance(), posNow);
                        }
                    }
                }
            }

            // Draw local player
            if (middleTile.x == w && middleTile.y == h) {
                localPlayer.draw(ctxPersonaje, ctxHUB, middleTile.x, (middleTile.y - 0.5), clsMap.tileSize);
            }

            // Dibuja las capas superiores
            clsMap.drawMapUp(ctxCapaMapaArriba, w, h);

            // DEVELOPER
            if (modeDeveloper) {
                clsDeveloper.drawGrid(ctxHUB, w, h);
                clsDeveloper.drawCollision(ctxHUB, w, h, clsMap.getCollision());
            }
        }
    }
}

// Browser window resize
function onResize () {
    let width = $(window).width();
    let height = $(window).height();

    clsInterface.setShowLoadScreen(true);

    socket.emit('map:data', {width: width, height: height});

    clsMap.setSizeScreen(width, height);

	// Maximise the canvas
	canvasHUB.width = window.innerWidth;
    canvasHUB.height = window.innerHeight;

    canvasCapaMapaAbajo.width = window.innerWidth;
    canvasCapaMapaAbajo.height = window.innerHeight;

    canvasPersonaje.width = window.innerWidth;
    canvasPersonaje.height = window.innerHeight;

    canvasCapaMapaArriba.width = window.innerWidth;
    canvasCapaMapaArriba.height = window.innerHeight;
}