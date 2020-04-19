/*-------------------------------
        ProjectMS
    VERSION:    alpha
*-------------------------------*/
"use strict";
/*-------------------------------
    Variables
*-------------------------------*/
let canvasHUB,		// Canvas DOM elemento
    ctxHUB,		// Canvas contexto de representación
    // Capas
    canvasCapaMapaAbajo,
    ctxCapaMapaAbajo,
    canvasPersonaje,
    ctxPersonaje,
    canvasCapaMapaArriba,
    ctxCapaMapaArriba,

	localPlayer,	// Clase jugador local
	remotePlayers = [],	// Clase jugador remoto
    clsInteface = new Interface(),
    clsHelpFunction = new helpFunction(),
    clsChat = new Chat(),
    clsKeyboard,
    clsMouse = new Mouse(),
    clsMap,

	npcs = [],
	collisionMap,	// Map containing NPCs and enemies, 0 = walkable, 1 = enemy, 2 = enemy, 3 = not walkable
	worldSize,
	adjustedTileSize,
	lastMapUpdate = Date.now(),
	socket,		// Socket connection
	tellCounter = 0;
    
/* ------------------------------
    Iniciando el juego
*------------------------------*/
window.onload = function() {
	// Inicia la conexion al socket
	socket = io.connect();

	// Start listening for events
	setEventHandlers();

	// Fialize chatlog scrollbar
	$("#chat").mCustomScrollbar({ autoHideScrollbar: true, });

    // Fialize chatlog scrollbar
    //simpleScroll.init("chat");
}

// GAME EVENT HANDLERS
let setEventHandlers = function() {
    // Keyboard
	document.getElementById("Mensaje").addEventListener("keydown", localMessage, false);

    // Window resize
	window.addEventListener("resize", onResize, false);
    window.addEventListener("load", onResize, false);

    // Window salir
    window.onbeforeunload = function (event) { event.returnValue = "Se va a desconectar"; }

	// Socket connection successful
	socket.on('connect', onSocketConnected);

    // Account characters - load the characters of the account on screen
    socket.on('account:characters', onAccountCharacters);

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

    // Carga Mapa
    socket.on('map:data', onMapData);

    // REDIMENCIONA EL MAPA
    socket.on('map:init', onInitMap);

    // Carga la coliciones
    socket.on('map:collision', onInitCollisionMap);

    // Carga los Npc's en el mapa
    socket.on('npcs:newNpc', onNewNpc);

    // Movimiento del Npc
    socket.on('npc:move', onMoveNpc);
}

/*-------------------------------
    Socket connected
*-------------------------------*/
function onSocketConnected () {
    // Carga la pantalla de carga
    clsInteface.loadScreen();

    // Tell game server client connected
    var idAccount = document.querySelector('#ID');
    socket.emit('account:connected', {idAccount: idAccount.value});
}

/*-------------------------------
    HUB - PERSONAJES
*-------------------------------*/
function onAccountCharacters (data) {
    clsInteface.onAccountCharacters(data);
}

function selCharacter (...data) {
    let [id, skinBase, nombre] = data;
    
    clsInteface.selCharacter(id, skinBase, nombre);
}

/*-------------------------------
    HUB - CREAR PERSONAJE
*-------------------------------*/
function createNewCharacter (data) {
    clsInteface.addClass('#character', 'Invisible');

    clsInteface.removeClass('#createCharacter', 'Invisible');
}

function createCharacter (data) {
    clsInteface.addClass('#character', 'Invisible');

    alert("crear pj "+ data);
}

/*-------------------------------
    Iniciar videojuego
*-------------------------------*/
function getInGame (data) {
    // Oculta los personajes y muestra la pantalla de carga
    clsInteface.loadScreen('#character', 'Invisible');

    socket.emit('player:connected', {idPlayer: data});
}

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

function onInitMap (data) {
    clsMap = new Map(data);

    clsMap.getSpritesheet().onload = function() {

        // Oculta la pantalla de carga
        clsInteface.removeOrAddByID('#loading', 'Invisible');

        // REDIMENCIONA EL CANVAS
        onResize();

        // INICIA ANIMACION
        animate();
    };
}

// CARGA LAS CAPAS
function onMapData (data) {
    clsMap.setCapas(data);
}

// Inicia las coliciones del map - 100%
function onInitCollisionMap (data) {
    collisionMap = data.collisionMap;
}

// Npc's
function onNewNpc (data) {
    if (npcs.length == 0) {
        npcs.push(new Npc(data));
    } else {
        npcs.forEach((npc) => {
            if (data.id != npc.getID()) {
                npcs.push(new Npc(data));
            } else {
                npcs.splice(0, npcs.length);
                npcs.push(new Npc(data));
            }
        });
    }
}

/*-------------------------------
    Funciones de Ayuda
*-------------------------------*/

/*-------------------------------
    Videojuego cargado
*-------------------------------*/
function renderingGame () {
    // Muestra la interfaz principal
    clsInteface.removeClass('#hubPrincial', 'Invisible');

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

// Move player
function onMovePlayer (data) {
    let player = clsHelpFunction.findPlayer(data.id);

    if (player) {
        player.setPos(data.posWorld.x, data.posWorld.y);
        player.setDir(data.dir);

        if (localPlayer.getID() != player.getID()) {
            player.setMode(data.mode);
        } else {
            player.setAbsPos(0, 0);
        }
    } else {
        console.log("MovePlayer - Player not found: "+ data.id);
    }
}

// Remove player Remote -- PRUEBA
function onRemovePlayer (data) {
	let player = clsHelpFunction.findPlayer(data.id);

	// Player not found
	if (!player) {
		console.log("RemovePlayer - Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(player), 1);
}

function onMoveNpc (data) {
    let npc = clsHelpFunction.findNpc(data.id);

    if (npc) {        
        npc.setPos(data.pos.x, data.pos.y);
        npc.setDir(data.dir);
        npc.setAbsPos(0, 0);
    } else {
        console.log("MoveNpc - Npc not found: "+ data.id);
    }
}

function logout() {
	socket.emit("logout", {id: localPlayer.getID()});
	console.log("Player "+localPlayer.getID()+" logged out");
	socket.emit("disconnect");
	window.location = "login.html";
}

/*-------------------------------
    Mensajes
*-------------------------------*/
function onReceiveMessage (data) {
    clsChat.receiveMessage (data);
}

function localMessage (e) {
    if (e.keyCode == 13) {
        if (this.value) {
            let data = clsChat.message(localPlayer, this.value);    
            
            if (data.sendServer) {
                socket.emit('chat:newMessage', {name: localPlayer.getName(), mode: data.sayMode, text: data.text, chatTo: data.chatTo});
            }
        }
        clsInteface.blur('#Mensaje');
	}
}

/*-------------------------------
    Funciones mouse videojuego
*-------------------------------*/
game.onclick = function (e) {
    clsMouse.click(e);
}

document.onmousemove = function (e) {
    clsMouse.move(e);
}

/*-------------------------------
    Funciones Teclado videojuego
*-------------------------------*/
document.onkeydown = function (e) {    
    clsKeyboard.keyDown(e.keyCode);
}

document.onkeyup = function (e) {
    clsKeyboard.keyUp(e.keyCode);
}

/*-------------------------------
    Interface Game - HUB
*-------------------------------*/
function changeCharacter (mode) {
    clsInteface.changeCharacter(mode);
}

/*-------------------------------
    GAME ANIMATION LOOP
*-------------------------------*/
let lastRender = Date.now(), lastFpsCycle = Date.now();
function animate () {

    setTimeout(function () {

        // Request a new animation frame
        window.requestAnimationFrame(animate);
        
        let dateNow = Date.now(),
            delta = (dateNow - lastRender) / 1000;        

        draw();
        lastRender = dateNow;
        update();
        event();

        if(dateNow - lastFpsCycle > 1000){
            lastFpsCycle = dateNow;
            let fps = Math.round(1 / delta);
            //$(".text").html("FPS: "+ fps +" DELTA: "+ delta);
        }
    }, 200);
}

/*-------------------------------
    GAME UPDATE
*-------------------------------*/
function update () {
    // Mover el player
	if (localPlayer.isMoving()) {
		let absPos = localPlayer.getAbsPos(),
            width = $(window).width(),
            height = $(window).height();

        localPlayer.playerMove();

        socket.emit('player:move', {id: localPlayer.getID(), x: absPos.absX, y: absPos.absY, dir: localPlayer.getDir(), mode: localPlayer.getMode()});
    
        // Mover el MAPA
        socket.emit('map:move', {width: width, height: height});
	}
    
    // Npc movimiento
    for (let i = npcs.length; i-- > 0;) {
        let npc = npcs[i];

        if (npc.isMoving()) {
            let absPos = npc.getAbsPos();
            
            //if (absPos.x || absPos.y) {
                console.log("Npc: "+ npc.getName() +" SE movio ");
                npc.playerMove();

                console.warn(`Movimiento del npc: ${absPos.absX} -- ${absPos.absY}`);

                socket.emit('npc:move', {id: npc.getID(), x: absPos.absX, y: absPos.absY, dir: npc.getDir()});
            //}
        }
    }
}

function event () {
    let width = $('#game').outerWidth(),
        height = $('#game').outerHeight(),
        middleTileX = Math.round((width / 2) / 32),
        middleTileY = Math.round((height / 2) / 32),
        posWorld = localPlayer.getPos(),
        maxTilesX = Math.floor((width / 32) + 1),
        maxTilesY = Math.floor((height / 32) + 1);
    
    // Radio ataque Npc
    for (let i = npcs.length; i-- > 0;) {
        let npc = npcs[i];

        console.log("El npc se mueve "+ npc.isMoving());

        if (!npc.isMoving()) {
            let posNow = npc.posNow(middleTileX, middleTileY, posWorld);
            
            if (posNow && npc.isAggressive()) {
                
                let visionDistance = npc.getVisionDistance(),
                    initVisionX = posNow.x - visionDistance,
                    initVisionY = posNow.y - visionDistance,
                    endVisionX = initVisionX + (visionDistance * 2),
                    endVisionY = initVisionY + (visionDistance * 2);
                
                for (let y = initVisionY; y <= endVisionY; y++) {
                    let x = posNow.x - visionDistance;
                    for (; x <= endVisionX; x++) {
                        if (x >= middleTileX && x <= middleTileX && y >= middleTileY && y <= middleTileY) {

                            let pathFinder = new Pathfinder(collisionMap, posNow, {x: middleTileX, y: middleTileY}),
                                Mover = pathFinder.attack();
                                
                            console.log("El npc "+ npc.getName() +" Ataca a "+ localPlayer.getName() +"---"+ Mover);

                            if (Mover.length > 0) {
                                npc.setPath(Mover);
                            }
                        }
                    }
                }
            }
        }
    }
}

/*-------------------------------
    GAME DRAW
*-------------------------------*/
function draw () {
    let width = $('#game').outerWidth(),
        height = $('#game').outerHeight(),
        middleTileX = Math.round((width / 2) / 32),
        middleTileY = Math.round((height / 2) / 32),
        posWorld = localPlayer.getPos(),
        maxTilesX = Math.floor((width / 32) + 2),
        maxTilesY = Math.floor((height / 32) + 2),
        absPos = localPlayer.getAbsPos();

    // Wipe the canvas clean
    ctxHUB.clearRect(0, 0, width, height);
    ctxCapaMapaAbajo.clearRect(0, 0, width, height);
    ctxPersonaje.clearRect(0, 0, width, height);
    ctxCapaMapaArriba.clearRect(0, 0, width, height);

    for (let h = 0; h < maxTilesY; h++) {
        for (let w = 0; w < maxTilesX; w++) {
            
            let dañoJugador;
                
            // Dibuja capas inferiores
            clsMap.drawMapDown(ctxCapaMapaAbajo, w, h);

            // Dibujar remote players
            for (let i = remotePlayers.length; i-- > 0;) {
                let remotePlayer = remotePlayers[i],
                    posNow = remotePlayer.posNow(middleTileX, middleTileY, posWorld);
                
                if (posNow.x == w && posNow.y == h) {
                    remotePlayer.draw(ctxPersonaje, ctxHUB, posNow.x, posNow.y);
                    dañoJugador = remotePlayer;
                }
            }

            // Dijbujar NPCs - new
            for (let i = npcs.length; i-- > 0;) {
                let npc = npcs[i],
                    posNow = npc.posNow(middleTileX, middleTileY, posWorld);

                if (posNow.x == w && posNow.y == h) {
                    npc.draw(ctxPersonaje, ctxHUB, posNow.x, posNow.y);
                }
            }
                
            // Draw local playeyer
            if (middleTileX == w && middleTileY == h) {
                localPlayer.draw(ctxPersonaje, ctxHUB, middleTileX, middleTileY);
            }

            // Dibuja las capas superiores
            clsMap.drawMapUp(ctxCapaMapaArriba, w, h);
        }
    }
}

// Browser window resize
function onResize () {
    // REDIMENZIONAR MAPA
    let width = $(window).width(),
        height = $(window).height();

    socket.emit('map:move', {width: width, height: height});

	// Maximise the canvas
	canvasHUB.width = window.innerWidth;
    canvasHUB.height = window.innerHeight;

    canvasCapaMapaAbajo.width = window.innerWidth;
    canvasCapaMapaAbajo.height = window.innerHeight;

    canvasPersonaje.width = window.innerWidth;
    canvasPersonaje.height = window.innerHeight;

    canvasCapaMapaArriba.width = window.innerWidth;
    canvasCapaMapaArriba.height = window.innerHeight;

    $('#game').css({ width: $(window).width(), height: $(window).height() });
    $('#capasMapaAbajo').css({ width: $(window).width(), height: $(window).height() });
    $('#capaPersonaje').css({ width: $(window).width(), height: $(window).height() });
    $('#capasMapaArriba').css({ width: $(window).width(), height: $(window).height() });
}