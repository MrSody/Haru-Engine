/*-------------------------------
        ProjectMMO
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
    attackDistance = [], // Contiene los ataques a distancia
    clsJutsus, // Clase jutsus
    clsInteface = new Interface(),
    clsMap,

	quests,
	items,
	npcs = [],
	collisionMap,	// Map containing NPCs and enemies, 0 = walkable, 1 = enemy, 2 = enemy, 3 = not walkable
	worldSize,
	adjustedTileSize,
	showMap = false,
	showQuests = false,
	lastMapUpdate = Date.now(),
	socket,		// Socket connection
	tellCounter = 0,
    questlist = [];
    
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
    HUB - Personajes
*-------------------------------*/
function onAccountCharacters (data) {
    clsInteface.onAccountCharacters(data);
}


function selCharacter (...data) {
    let [id, skinBase, nombre, statFuerza, statAgilidad, statInteligencia, statSellos, statResistencia, statVitalidad, statDestreza, statPercepcion] = data;
    
    clsInteface.selCharacter(id, skinBase, nombre, statFuerza, statAgilidad, statInteligencia, statSellos, statResistencia, statVitalidad, statDestreza, statPercepcion);
}

/*-------------------------------
    Crear Personaje - HUB - Principal
*-------------------------------*/
function createCharacter (data) {
    // Oculta los personajes
    clsInteface.addClass('#personajes', 'Invisible');

    alert("crear pj "+ data);
}

/*-------------------------------
    Iniciar videojuego
*-------------------------------*/
function getInGame (data) {
    // Oculta los personajes y muestra la pantalla de carga
    clsInteface.loadScreen('#personajes', 'Invisible');

    socket.emit('player:connected', {idPlayer: data});
}

// Initialise new remote player
function onNewRemotePlayer (data) {
	remotePlayers.push(new RemotePlayer(data));
}

// Initialise new local player
function onCreateLocalPlayer (data) {
    localPlayer = new LocalPlayer(data);

    renderingGame();
}

function onInitMap (data) {
    clsMap = new Map(data);

    clsMap.getSpritesheet().onload = function() {

        // Ocualta la pantalla de carga
        if (!$('#loading').hasClass('Invisible')) {
            $('#loading').addClass('Invisible');
        }

        // REDIMENCIONA EL CANVAS
        onResize();

        // INICIA ANIMACION
        animate();
    };
}

function onMapData (data) {
    // CARGA LAS CAPAS
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
// Buscar el jugador remoto
function findRemotePlayer (id) {
    for (let remotePlayer of remotePlayers) {
        if (remotePlayer.getID() == id) {
            return remotePlayer;
        }
    }

	return false;
}

// Retornar player
function findPlayer (id) {
    let player;

    if (localPlayer.getID() === id){
        player = localPlayer;
    } else {
        player = findRemotePlayer(id);
    }

    return player;
}

function findNpc (id) {
    for (let npc of npcs) {
        if (npc.getID() == id) {
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
    clsInteface.removeClass('#hubPrincial', 'Invisible');

    // Declara el canvas y renderiza off
    // Mapa Abajo
    canvasCapaMapaAbajo = document.getElementById('capasMapaAbajo');
    ctxCapaMapaAbajo = canvasCapaMapaAbajo.getContext('2d');
    ctxCapaMapaAbajo.globalAlpha = 0.1;

    // Personaje
    canvasPersonaje = document.getElementById('capaPersonaje');
    ctxPersonaje = canvasPersonaje.getContext('2d');
    ctxPersonaje.globalAlpha = 0.1;

    // Mapa Arriba
    canvasCapaMapaArriba = document.getElementById('capasMapaArriba');
    ctxCapaMapaArriba = canvasCapaMapaArriba.getContext('2d');
    ctxCapaMapaArriba.globalAlpha = 0.1;

    // Declare the canvas HUB and rendering context
	canvasHUB = document.getElementById("game");
	ctxHUB = canvasHUB.getContext("2d");
	ctxHUB.globalAlpha = 0.1;
}

// Move player
function onMovePlayer (data) {
    let player = findPlayer(data.id);

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
    let chatTxtClr;
	//var pColor = (data.player == localPlayer.name) ? "#CD96CD" : "#96CDCD";
    switch (data.mode) {
		case 's':
			chatTxtClr = "yellow";
			break;
		case 'w':
			chatTxtClr = "red";
			break;
		default:
			chatTxtClr = "white";
	}

    $('.text .mCSB_container').append("<span style='color: "+ chatTxtClr +";'>"+ data.name +": "+ data.text +"</span></br>");
	$('.text').mCustomScrollbar("update");
	$('.text').mCustomScrollbar("scrollTo","bottom");
	$('#Mensaje').val('');
}

function localMessage (e) {
    let help = false, text, opcion, sayMode, chatTo;

	if (e.keyCode == 13) {
		if (this.value) {
            text = this.value;

            if (text.charAt(0) == '/') {
                opcion = text.substring(1);

                if (text.charAt(1) == 'w') {
					sayMode = 'w';
					chatTo = null;
					text = text.substring(3);
				} else if (text.charAt(1) == 's') {
					sayMode = 's';
					chatTo = text.substring(3, text.indexOf(' ', 3));
					text = text.substring(text.indexOf(' ', 3));
				} else if (text.charAt(1) == 'd') {
					sayMode = 'd';
					chatTo = null;
					text = text.substring(3);
				} else if (opcion == 'loc') {
                    help = true;
                    text = `Posicion actual: X: ${localPlayer.getPos().x} - Y: ${localPlayer.getPos().y}`;
                } else if (opcion == 'ayuda') {
                    help = true;
                    text = 'Bienvenido al menu de ayuda. <br> - Usa /loc para saber tu ubicacion actual. <br> - Usa /Aradio para saber mas sobre la emisora de radio.';
                } else {
                    help = true;
                    text = 'Bienvenido al menu de ayuda. <br> - Usa /loc para saber tu ubicacion actual. <br> - Usa /Aradio para saber mas sobre la emisora de radio.';
                }
			}
            if (help) {
                onReceiveMessage({mode: sayMode, text: text, name: localPlayer.getName()});
            } else {
                socket.emit('chat:newMessage', {name: localPlayer.getName(), mode: sayMode, text: text, chatTo: chatTo});
            }
		}
		$('#Mensaje').blur();
	}
}

/*-------------------------------
    Funciones mouse videojuego
*-------------------------------*/
function getClickedTile (e) {
    //Click en la pagina
	var x = e.pageX;
	var y = e.pageY;

	return {x: Math.floor(x / 32), y: Math.floor(y / 32)};
}

game.onclick = function (e) {
	let tile = getClickedTile(e),
        playerPosX = Math.round((canvasHUB.width / 2) / 32),
        playerPosY = Math.round((canvasHUB.height / 2) / 32);

    console.log(tile);
    
    if (!(tile.x == playerPosX && tile.y == playerPosY) && !(collisionMap[tile.y][tile.x] === 1)) { // To avoid a bug, where player wouldn't walk anymore, when clicked twice on the same tile

        $("#conversation, #confirmation").addClass("hidden");

        if (collisionMap[tile.y][tile.x] == 2) { // Going to talk to NPC

            console.log("Habla con npc");

			var npc = getNpcAt(tile.x * 32, tile.y * 32);

			if (npc.questID != null) {
				var quest = questlist[npc.questID];
				localPlayer.addQuest(quest);
			}

			localPlayer.setGoToNpc(npc);

        } else if (collisionMap[tile.y][tile.x] == 3) { // Going to attack enemy

            console.log("ataca al enemigo");

			for (var i = 0; i < enemies.length; i++) {
				if (enemies[i].alive && tile.x * 32 == enemies[i].x && tile.y * 32 == enemies[i].y) {
					localPlayer.setGoFight(i);
					break;
				}
			}

		} else {

			if (localPlayer.isFighting()) {

                console.log("abando pelea");
				tellCounter = 0;
				//socket.emit("abort fight", {id: localPlayer.ID});
			}

            console.log("camina");
            localPlayer.playerMove();
		}

        console.log("sigue a");
		localPlayer.stop = true;


		// Wait for the player to stop at next tile
		let timer = setInterval(() => {
			if (!localPlayer.isMoving()) {
				clearTimeout(timer);
				localPlayer.stop = false;
                let pathStart = {x: playerPosX, y: playerPosY},
                    pathfinder = new Pathfinder(collisionMap, pathStart, tile),
                    path = pathfinder.calculatePath();

				// Calculate path
				if (path.length > 0) {
					localPlayer.setPath(path);
				}
			}
		}, 1);
	}
}

document.onmousemove = function (e) {
    if (!$('#hubPrincial').hasClass('Invisible')) {
        let tile = getClickedTile(e);

        if (collisionMap[tile.y][tile.x] === 1) {
            document.documentElement.style.cursor = "url('../img/game/icons/mouse_noWalk.png') 16 16, auto";
        } else {
            document.documentElement.style.cursor = "url('../img/game/icons/mouse_walk.png') 16 16, auto";
        }
    }
}


document.onkeydown = function (e) {
    if (!$('#hubPrincial').hasClass('Invisible')) {
        //alert("tecla "+ e.keyCode);

        if (!$("#Mensaje").is(":focus")) {

            let keyCode = e.keyCode;

            // Shift - Correr
            if (keyCode == 16) {
                localPlayer.setRun(true);
            }
        }
    }
}

document.onkeyup = function (e) {
    if (!$('#hubPrincial').hasClass('Invisible')) {
        //alert("tecla "+ e.keyCode);

        if (!$("#Mensaje").is(":focus")) {

            let keyCode = e.keyCode;

            // Shift - Deja de correr
            if (keyCode == 16) {
                localPlayer.setRun(false);
            }
        }
    }
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
            var fps = Math.round(1 / delta);
            //$(".text").html("FPS: "+ fps +" DELTA: "+ delta);
        }

        // Request a new animation frame
        //window.requestAnimFrame(animate);
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