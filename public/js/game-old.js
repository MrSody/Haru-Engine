/*-------------------------------
        Mundo Shinoby
    VERSION:    alpha
*-------------------------------*/
"use strict";
/*-------------------------------
    Variables
*-------------------------------*/

let canvas,		// Canvas DOM elemento
	ctx,		// Canvas contexto de representación
    mapCanvas,
	mapCtx,
	localPlayer,	// Clase jugador local
	remotePlayers = [],	// Clase jugador remoto
	enemies,	// Contains the enemies
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
	lastClicked = {x: null, y: null},
	lastMapUpdate = Date.now(),
	socket,		// Socket connection
	tellCounter = 0,
	lastRender = Date.now(),
	lastFpsCycle = Date.now(),
	questlist = [],
    //capas
    capaOne,
    capaTwo,
    capaThree,
    capaFour,
    capaFive;

/* ------------------------------
    Iniciando el juego
 *------------------------------*/

window.onload = function() {
	// Inicia la conexion al socket
	socket = io.connect();

	// Start listening for events
	setEventHandlers();
	//setGameClickHandler();

	// Fialize chatlog scrollbar
	$("#chat").mCustomScrollbar({ autoHideScrollbar: true, });

    // Fialize chatlog scrollbar
	//simpleScroll.init("chat");
}

// GAME EVENT HANDLERS
var setEventHandlers = function() {
    // Keyboard
	document.getElementById("Mensaje").addEventListener("keydown", localMessage, false);

    // Window resize
	window.addEventListener("resize", onResize, false);
    window.addEventListener("load", onResize, false);

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

    // Player move message received
	socket.on('player:move', onMovePlayer);

    // Carga Mapa
    socket.on('map:data', onMapData);

    // REDIMENCIONA EL MAPA
    socket.on('map:init', onInitMap);

    // Carga la coliciones
    socket.on('map:collision', onInitCollisionMap);

    // Dibujar jutsus
    socket.on('player:throwJutsu', onThrowJutsu);

    // Carga los Npc's en el mapa
    socket.on('npcs:newNpc', onNewNpc);

    // Create Invocation
    socket.on('invocation:newInvocation', onNewInvocation);

    // Movimiento del Clon
    socket.on('invocation:move', onMoveClon);

    /*
	socket.on("update player", updatePlayer);

    // Player removed message received
	socket.on("remove player", onRemovePlayer);

	socket.on("new message", receiveMessage);

	socket.on("update enemy", updateEnemy);

	socket.on("update quest", updateQuest);

	socket.on("player hurt", onPlayerHurt);

	socket.on("update world", onUpdateWorld);

	socket.on("update item", updateItem);

	socket.on("get item", getItem);

	socket.on("no player", playerNotFound);
    */
    //document.getElementById("selCharacter").addEventListener("clik", joinPlayer);
};

/*-------------------------------
    Socket connected
*-------------------------------*/
function onSocketConnected () {
    // Carga la pantalla de carga
    clsInteface.loadScreen();

    // Tell game server client connected
    var idAccount = prompt("id del pj");
	socket.emit('account:connected', {idAccount: idAccount});
}

/*-------------------------------
    Personajes
*-------------------------------*/
// Muestra los personajes en la interface
function onAccountCharacters (data) {
    // Ocualta la pantalla de carga
    $('#loading').addClass('Invisible');

    // Muestra la pantalla de los personajes
    $('#personajes').removeClass('Invisible');

    let maxPj = 5, html;

    selCharacter(data[0].id, data[0].skinBase, data[0].nombre, data[0].statFuerza, data[0].statAgilidad, data[0].statInteligencia, data[0].statSellos, data[0].statResistencia, data[0].statVitalidad, data[0].statDestreza, data[0].statPercepcion);

    data.forEach((Pj) => {

        let dataPJ = [Pj.id, Pj.skinBase, Pj.nombre, Pj.statFuerza, Pj.statAgilidad, Pj.statInteligencia, Pj.statSellos, Pj.statResistencia, Pj.statVitalidad, Pj.statDestreza, Pj.statPercepcion];

        html += clsInteface.accountCharacters(dataPJ);
    });

    for (let count = (data.length + 1); count <= maxPj; count++) {
        html += clsInteface.accountNewCharacter(count, data[0].id);
    }

    $('#listPersonajes').append( html );
}

function selCharacter (...data) {
    let [id, skinBase, nombre, statFuerza, statAgilidad, statInteligencia, statSellos, statResistencia, statVitalidad, statDestreza, statPercepcion] = data;

    $('#characters_Skin').replaceWith(`<div id="characters_Skin" style="margin-top: 15%; margin-left: 40%;"><img src="../sprites/Player/Base/${skinBase}.png" style="width: 150px;"></div>`);
    $('#characters_BtnGetInGame').replaceWith(`<div id="characters_BtnGetInGame" class="mx-auto" style="width: 50%; margin-top: 10%;"><button onclick="getInGame(${id});" style="width: 100%;">Entrar al mundo</button></div>`);

    $('#characters_Name').replaceWith(`<div id="characters_Name"><b>Nombre: ${nombre}</b></div>`);
    $('#characters_Rank').replaceWith(`<div id="characters_Rank"><b>Rango: rango</b></div>`);

    atributos.series[0].update({
        data: [statFuerza, statAgilidad, statInteligencia, statSellos, statResistencia, statVitalidad, statDestreza, statPercepcion]
    });
}

/*-------------------------------
    Crear Personaje
*-------------------------------*/

function createCharacter (data) {

    // Oculta los personajes
    $('#personajes').addClass('Invisible');

    alert("crear pj "+ data);
}

/*-------------------------------
    Iniciar videojuego
*-------------------------------*/

function getInGame (data) {

    // Oculta los personajes
    $('#personajes').addClass('Invisible');

    clsInteface.loadScreen();

    socket.emit('player:connected', {idPlayer: data});
}

function onNewRemotePlayer (data) {
	// Initialise new remote player
	remotePlayers.push(new RemotePlayer(data));
}

function onCreateLocalPlayer (data) {

    // Ocualta la pantalla de carga
    $('#loading').addClass('Invisible');

    // Muestra la interfaz principal
    $('#hubPrincial').removeClass('Invisible');

    // Inicia un nuevo jugador en la clase jugador
    localPlayer = new LocalPlayer(data);
    localPlayer.displayHub();
	//localPlayer.initInventory();
	//initInventory();
    console.log("Localplayer created");

    // Inicializa la clase jutsus
    clsJutsus = new Jutsus();

    // Declare the canvas and rendering context
	canvas = document.getElementById("game");
	ctx = canvas.getContext("2d");
	ctx.globalAlpha = 0.1;

	// Canvas for mini-map
	mapCanvas = document.getElementById("minimap");
	mapCtx = mapCanvas.getContext("2d");
    mapCtx.globalAlpha = 0.1;

	// Maximise the canvas
	canvas.width = 1184;
	canvas.height = 1184;

    // REDIMENCIONA EL CANVAS
    onResize();
}

function onInitMap (data) {
    // CARGA LAS CAPAS
    capaOne = data.capa1;
    capaTwo = data.capa2;
    capaThree = data.capa3;
    capaFour = data.capa4;
    capaFive = data.capa5;

    clsMap.getSpritesheet().onload = function() {
        // INICIA ANIMACION
        animate();
    };
}

function onMapData (data) {
    clsMap = new Map(data);
}

// Inicia las coliciones del map - 100%
function onInitCollisionMap (data) {
    collisionMap = data.collisionMap;
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

//variables que determinan el total de horas, minutos y segundos para la cuenta atras
var timeConcentracion;
function concentracion (min, seg) {

    //cuenta atras
    if (seg-- < 0) {
        seg = 59;
        min--;
    }

    if (min < 0) {
        //final
        localPlayer.displayConcentration(false, false);
        localPlayer.setSeals(false);
    } else {
        localPlayer.displayConcentration(min, seg);
        timeConcentracion = setTimeout('concentracion('+ min +','+ seg +')', 1000);
    }
}

var timeBuff = [];
function Buff (IDBuff, imgBuff, min, seg) {

    //cuenta atras
    if (seg-- < 0) {
        seg = 59;
        min--;
    }

    if (min < 0) {
        //final
        localPlayer.displayBuff(IDBuff, imgBuff, false, false);
        socket.emit("player:cleanBuff", {IDJutsu: IDBuff});
    } else {
        localPlayer.displayBuff(IDBuff, imgBuff, min, seg);
        timeBuff[IDBuff] = setTimeout('Buff('+ IDBuff +','+ imgBuff +','+ min +','+ seg +')', 1000);
    }
}

/*-------------------------------
    Videojuego cargado
*-------------------------------*/
// Move player
function onMovePlayer (data) {
    let player = findPlayer(data.id);

    if (player) {
        // Update player position
        player.setPos(data.posWorld.x, data.posWorld.y);
        player.setDir(data.dir);
        player.setAbsPos(0, 0);
    } else {
        console.log("MovePlayer - Player not found: "+ data.id);
    }
}

function onNewInvocation (data) {
    remotePlayers.push(new Invocation(data));
}

function moveInvocation (collisionMap, tile) {
    let invocations = localPlayer.getInvocation();
    console.log("Invocations: "+ invocations +"--"+ tile.x +"-"+ tile.y);

    for (let i = invocations.length; i-- > 0;) {
        let invocation = findPlayer(invocations[i]);
        console.log("Clon: "+ invocation.getName());

        let width = $('#game').outerWidth(),
            height = $('#game').outerHeight(),
            posWorld = localPlayer.getPos(),
            posNow = invocation.posNow(width, height, posWorld);

        if (posNow && !invocation.isFighting()) {

            let pathFinder = new PathfinderInvocation(posNow, tile),
                moveEnd = pathFinder.moveInvocation();

            console.log(`Movimiento Clon1: ${posNow.x} - ${posNow.y} --- ${tile.x} - ${tile.y} --- ${moveEnd.x} - ${moveEnd.y}`);

            let timer = setInterval(() => {
                clearTimeout(timer);

                console.log("clon: x: "+ invocation.getPos().x +" y: "+ invocation.getPos().y);

                let pathStart = [posNow.x, posNow.y];
                console.log("clon: pathstart "+ posNow.x +"-"+ posNow.y);

                // Calculate path
                console.log("clon: 2: "+ pathStart +" -- 3: "+ moveEnd.x +"-"+ moveEnd.y);
                let path = Pathfinder(collisionMap, pathStart, moveEnd);
                console.log("clon: path "+ path +" -- "+ path.length);
                if (path.length > 0) {
                    invocation.setPath(path);
                }
            }, 1);
        } else if (!posNow && !invocation.isFighting()) {
            console.log("Personaje esta muy lejos");
            //socket.emit('invocation:teleport', {id: invocation.getID(), x: absPos.absX, y: absPos.absY, dir: invocation.getDir()});
            //socket.emit("player:throwJutsu", {pos: tile, IDJutsu: jutsus[j][0]});
        }
    }
}

// Npc's
function onNewNpc (data) {
	npcs.push(new Npc(data));
}

// Dibuja jutsus
function onThrowJutsu (data) {
    let player = findPlayer(data.idPlayer),
        list = [];

    if (player) {
        switch (parseInt(data.efecto)) {
            case 0: // Buff = {idPlayer - idJutsu - efecto - time - sprite}
                clearTimeout(timeBuff[data.idJutsu]);
                Buff(data.idJutsu, data.sprite, data.time.min, data.time.seg);
                break;

            case 2: // Teletrasportacion = {idPlayer - efecto - posNow - posLast}
                // basico = efecto, posFinal, posLast, duracion
                list.push(data.efecto, data.posNow, data.posLast, 150);
                clsJutsus.setJutsusDown(list);
                player.setPos(data.posNow.x, data.posNow.y);
                break;

            case 5: // Clon = {idPlayer - efecto - posClon - posPlayer - invocation}
                console.log(`idPlayer: ${data.idPlayer} posClon: ${data.posClon.x} - ${data.posClon.y} posPlayer: ${data.posPlayer} invocation: ${data.invocation}`);
                list.push(data.efecto, data.posClon, data.posPlayer, 150);
                clsJutsus.setJutsusDown(list);
                player.setInvocation(data.invocation);
                break;
        }
    } else {
        console.log("Throw jutsu - Player not found: "+ data.idPlayer);
    }
}

function throwJutsu (tile) {
    let seals = localPlayer.getSeals(),
        jutsus = localPlayer.getJutsus(),
        showJutsu = [];

    for (var j = 0; j < jutsus.length; j++) {
        var seal1 = jutsus[j][1].Sello_1,
            seal2 = jutsus[j][1].Sello_2,
            seal3 = jutsus[j][1].Sello_3,
            seal4 = jutsus[j][1].Sello_4,
            seal5 = jutsus[j][1].Sello_5;

        console.log("sello "+ jutsus[j][1]);

        if (seals[seals.length - 1] != 32) {
            if (seals[0] == seal1) {
                showJutsu.push(jutsus[j]);
            } else if (seals[0] == seal1 && seals[1] == seal2) {
                showJutsu.push(jutsus[j]);
            } else if (seals[0] == seal1 && seals[1] == seal2 && seals[2] == seal3) {
                showJutsu.push(jutsus[j]);
            } else if (seals[0] == seal1 && seals[1] == seal2 && seals[2] == seal3 && seals[3] == seal4) {
                showJutsu.push(jutsus[j]);
            }
        } else {
            console.log("Envio al server: "+ seals.length);
            switch(seals.length - 1) {
                case 1:
                    if(seals[0] == seal1) {
                        console.log("Envio al server: "+ jutsus[j] +"Tile"+ tile.x +"-"+ tile.y);
                        localPlayer.setSeals(false);
                        socket.emit("player:throwJutsu", {pos: tile, IDJutsu: jutsus[j][0]});
                    }
                    break;

                case 2:
                    if(seals[0] == seal1 && seals[1] == seal2) {
                        console.log("Envio al server: "+ jutsus[j] +"Tile"+ tile.x +"-"+ tile.y);
                        localPlayer.setSeals(false);
                        socket.emit("player:throwJutsu", {pos: tile, IDJutsu: jutsus[j][0]});
                    }
                    break;

                case 3:
                    if(seals[0] == seal1 && seals[1] == seal2 && seals[2] == seal3) {
                        console.log("Envio al server: "+ jutsus[j] +"Tile"+ tile.x +"-"+ tile.y);
                        localPlayer.setSeals(false);
                        socket.emit("player:throwJutsu", {pos: tile, IDJutsu: jutsus[j][0]});
                    }
                    break;

                case 4:
                    if(seals[0] == seal1 && seals[1] == seal2 && seals[2] == seal3 && seals[3] == seal4) {
                        console.log("Envio al server: "+ jutsus[j] +"Tile"+ tile.x +"-"+ tile.y);
                        localPlayer.setSeals(false);
                        socket.emit("player:throwJutsu", {pos: tile, IDJutsu: jutsus[j][0]});
                    }
                    break;
                case 5:
                    if(seals[0] == seal1 && seals[1] == seal2 && seals[2] == seal3 && seals[3] == seal4 && seals[4] == seal5) {
                        console.log("Envio al server: "+ jutsus[j] +"Tile"+ tile.x +"-"+ tile.y);
                        localPlayer.setSeals(false);
                        socket.emit("player:throwJutsu", {pos: tile, IDJutsu: jutsus[j][0]});
                    }
                    break;
                default:
                    localPlayer.setSeals(0);
                    break;
            }
        }
    }

    console.log("jutus: "+ showJutsu);
    localPlayer.showJutsus(showJutsu);
}

function selloEjecutado (keyCode) {
    let seals = localPlayer.getSeals(),
        codeJutsu = localPlayer.keyCodeToCodeJutsu(keyCode);

    if (seals.length < 4) {
        if (seals[seals.length] != codeJutsu && seals.length === 0) {
            return 1;
        } else if (seals[seals.length - 1] != codeJutsu) {
            return 2;
        } else {
            return false;
        }
    } else {
        return false;
    }
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

	var tile = getClickedTile(e),
        playerPosX = Math.round((canvas.width / 2) / 32),
        playerPosY = Math.round((canvas.height / 2) / 32),
        seals = localPlayer.getSeals();

    console.log(tile);

    if (seals[seals.length - 1] === 32) {
        console.log("Click Jutsus: "+ seals[seals.length - 1]);
        throwJutsu(tile);
    } else if (!(tile.x == lastClicked.x && tile.y == lastClicked.y) && !(tile.x == playerPosX && tile.y == playerPosY) && !(collisionMap[tile.y][tile.x] === 1)) { // To avoid a bug, where player wouldn't walk anymore, when clicked twice on the same tile

        $("#conversation, #confirmation").addClass("hidden");
		lastClicked = tile;

        if (collisionMap[tile.y][tile.x] == 2) { // Going to talk to NPC

            console.log("Habla con npc");

			lastClicked = {x: null, y: null};
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
            console.log("nose");

			if (localPlayer.fighting != null) {

                console.log("abando pelea");
				tellCounter = 0;
				//socket.emit("abort fight", {id: localPlayer.ID});
			}

            console.log("camina");
			//localPlayer.justWalk();
            localPlayer.playerMove();

		}

        console.log("sigue a");
		localPlayer.stop = true;


		// Wait for the player to stop at next tile
		let timer = setInterval(() => {
			if (!localPlayer.isMoving()) {
				clearTimeout(timer);
				localPlayer.stop = false;

                var pathStart = [playerPosX, playerPosY];

				// Calculate path
                console.log("clon: 2: "+ pathStart +" -- 3: "+ tile.x +"-"+ tile.y);
				var path = Pathfinder(collisionMap, pathStart, tile);
				if (path.length > 0) {
					localPlayer.setPath(path);
				}
                moveInvocation(collisionMap, tile);
			}
		}, 1);
	}
}

document.onkeyup = function (e) {

    if (!$('#hubPrincial').hasClass('Invisible')) {
        console.log("tecla "+ e.keyCode);

        if (!$("#Mensaje").is(":focus")) {

            let keyCode = e.keyCode;
            // Sellos
            if (keyCode === 81 || keyCode === 87 || keyCode === 69 || keyCode === 82 || keyCode === 84 || keyCode === 65 || keyCode === 83 || keyCode === 68 || keyCode === 70 || keyCode === 71) {

                switch (selloEjecutado(keyCode)) {
                    case 1:
                        localPlayer.setSeals(keyCode);
                        throwJutsu();
                        concentracion(localPlayer.getConcentration().min, localPlayer.getConcentration().seg);
                        break;
                    case 2:
                        localPlayer.setSeals(keyCode);
                        throwJutsu();
                        clearTimeout(timeConcentracion);
                        concentracion(localPlayer.getConcentration().min, localPlayer.getConcentration().seg);
                }
            }

            // Espacio - Ejecutar el jutsus
            if(keyCode === 32) {
                if (localPlayer.getSeals().length > 0) {
                    localPlayer.setSeals(keyCode);
                    clearTimeout(timeConcentracion);
                    localPlayer.displayConcentration(false, false);
                    document.documentElement.style.cursor = "url('../img/game/icons/mouse_jutsu.png') 32 32, auto";
                }
            }

            // Shift - Atacar Cuerpo a cuerpo, Hablar, Cancelar jutsu
            if (keyCode == 16) {
                if (localPlayer.getSeals().length > 0) {
                    console.log("Cancelo el jutsu");
                    localPlayer.setSeals(false);
                    localPlayer.showJutsus(false);
                    clearTimeout(timeConcentracion);
                    localPlayer.displayConcentration(false, false);
                }
            }

            // Alt - Atacar con arma a distancia
            if (keyCode == 18) {

            }

            //Enter - Muestra chat-input-prompt
            if (keyCode === 13) {
                if ($("#input").hasClass("hideClass")) {
                    $("#input").removeClass("hideClass");
                    $("#Mensaje").focus();
                } else {
                    $("#Mensaje").blur();
                    $("#input").addClass("hideClass");
                }
            }

            // M - Mapa
            if (keyCode === 77) {
                toggleMap();
            }

            // P - Personaje
            if (keyCode == 80) {
                if ($('#draggable_contenedorPersonaje').hasClass('invisible')) {
                    $('#draggable_contenedorPersonaje').removeClass('invisible');
                } else {
                    $('#draggable_contenedorPersonaje').addClass('invisible');
                }
            }

            // ESC - MENU
        }
    }
}

document.onmousemove = function (e) {

    if (!$('#hubPrincial').hasClass('Invisible')) {
        let tile = getClickedTile(e),
            seals = localPlayer.getSeals();

        if (seals.length === 0) {
            if (collisionMap[tile.y][tile.x] === 1) {
                document.documentElement.style.cursor = "url('../img/game/icons/mouse_noWalk.png') 16 16, auto";
            } else {
                document.documentElement.style.cursor = "url('../img/game/icons/mouse_walk.png') 16 16, auto";
            }
        }
    }
}

function changeCharacter (mode) {
    clsInteface.changeCharacter(mode);
}

/*-------------------------------
    GAME ANIMATION LOOP
*-------------------------------*/

function animate () {
	let delta = (Date.now() - lastRender)/1000;
	lastRender = Date.now();
    draw();
	update(delta);

	if (Date.now() - lastFpsCycle > 1000) {
		lastFpsCycle = Date.now();
		let fps = Math.round(1/delta);
        //console.log("FPS: "+ fps);
		$(".text").html("FPS: "+ fps +" DELTA: "+ delta);
	}
    // Request a new animation frame using Paul Irish's shim
    //requestAnimationFrame(animate);
    window.requestAnimFrame(animate);
}

/*
let animate = setInterval(() => {
	let delta = (Date.now() - lastRender)/1000;
    lastRender = Date.now();
    draw();
    update(delta);

    if (Date.now() - lastFpsCycle > 1000) {
        lastFpsCycle = Date.now();
        let fps = Math.round(1/delta);
        //console.log("FPS: "+ fps);
        $(".text").html("FPS: "+ fps +" DELTA: "+ delta);
    }
}, 1000/15);
*/
/*-------------------------------
    GAME UPDATE
*-------------------------------*/

function update (dt) {
    let invocations = localPlayer.getInvocation();
	if (localPlayer.isMoving()) {
		let absPos = localPlayer.getAbsPos(),
            width = $(window).width(),
            height = $(window).height();

        console.log("SE movio ");
		localPlayer.playerMove(dt);

        socket.emit('player:move', {id: localPlayer.getID(), x: absPos.absX, y: absPos.absY, dir: localPlayer.getDir()});

        // Mover el MAPA
        socket.emit('map:move', {width: width, height: height});

        //console.log("dir: "+ localPlayer.getDir() +"Pos: "+ pos.x +"-"+ pos.y +"ABsPos: "+ absPos.absX +"-"+ absPos.absY);

        //console.log("Envio al server");
        //console.log("id: "+ localPlayer.getID() +" x: "+ pos.x +"y: "+ pos.y +" absX: "+ absPos.absX +" absY: "+ absPos.absY +" dir: "+ localPlayer.getDir() +" canvasX: "+ bgPos.x +" canvasY: "+ bgPos.y);
	}
    if (invocations.length) {
        for (let i = invocations.length; i-- > 0;) {
            let invocation = findRemotePlayer(invocations[i]);

            if (invocation && invocation.isMoving()) {
                let absPos = invocation.getAbsPos();

                console.log("Clon: "+ invocation.getName() +" SE movio ");
                invocation.playerMove(dt);

                console.warn(`Movimiento de la invocacion: ${absPos.absX} -- ${absPos.absY}`);

                socket.emit('invocation:move', {id: invocation.getID(), x: absPos.absX, y: absPos.absY, dir: invocation.getDir()});
            }
        }
    }
	if (localPlayer.isFighting()) {
		if (tellCounter == 0) {
			console.log("ESta Peleando");
            //socket.emit("in fight", {id: localPlayer.getID(), enemyID: localPlayer.enemyID()});
			tellCounter++;
		}
	}
};

/*-------------------------------
    GAME DRAW
*-------------------------------*/

function draw () {
	// Move Background if necessary4
    let width = $('#game').outerWidth(),
        height = $('#game').outerHeight(),
        // Position player
        posX = Math.round((width / 2) / 32) * 32,
        posY = Math.round((height / 2) / 32) * 32,
        posWorld = localPlayer.getPos();

	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

    // DIBUJA EL MAPA
    clsMap.drawMap(capaOne, ctx, width, height);
    clsMap.drawMap(capaTwo, ctx, width, height);
    clsMap.drawMap(capaThree, ctx, width, height);

	// Draw enemies
	/*
    for (var i = 0; i < enemies.length; i++) {
		if(enemies[i].isAlive()) {
			enemies[i].draw(ctx, bgPos.x, bgPos.y);
		}
	}
    */

    // Draw Jutsus Down
    /*
    var posIntX = Math.floor(posWorld.x - posX),
        posIntY = Math.floor(posWorld.y - posY),
        posEndX = Math.floor(posWorld.x + posX),
        posEndY = Math.floor(posWorld.y + posY),
        jutsusDown = clsJutsus.getJutsusDown();

    for (var jutsuDown = 0; jutsuDown < jutsusDown.length; jutsuDown++) {

        if ((posIntX >= jutsusDown[jutsuDown][2].x || jutsusDown[jutsuDown][2].x <= posEndX) && (posIntY >= jutsusDown[jutsuDown][2].y || jutsusDown[jutsuDown][2].y <= posEndY)) {

            clsJutsus.drawJutsus(ctx, posX, posY, jutsuDown);
        }
    }
    */

/*    let jutsusDown = clsJutsus.getJutsusDown(), count = 0;

    jutsusDown.forEach((jutsu) => {

        if (jutsu[0] == "2") {
            let countTeleport = 0;
            while (countTeleport++ < 2) {
                let posNowJutsu = clsJutsus.posNowJutsu(width, height, posWorld, jutsu, countTeleport);
                if (posNowJutsu) {
                    clsJutsus.draw(ctx, (posNowJutsu.x * 32), (posNowJutsu.y * 32), jutsu, count);
                }
            }
        } else {
            let posNowJutsu = clsJutsus.posNowJutsu(width, height, posWorld, jutsu);
            if (posNowJutsu) {
                clsJutsus.draw(ctx, (posNowJutsu.x * 32), (posNowJutsu.y * 32), jutsu, count);
            }
        }
        count++
    });
*/
    /**/
    // Dibujar remote players - new
/*
    for (let i = remotePlayers.length; i-- > 0;) {
        let remotePlayer = remotePlayers[i],
            posNow = remotePlayer.posNow(width, height, posWorld);

        if (posNow) {
            remotePlayer.draw(ctx, (posNow.x * 32), (posNow.y * 32));
        }
    }
*/
    /*
	// Draw remote players - old
    remotePlayers.forEach((remotePlayer) => {
        let posNow = remotePlayer.posNow(width, height, posWorld);
        if (posNow) {
            remotePlayer.draw(ctx, (posNow.x * 32), (posNow.y * 32));
        }
    });
    */

	// Draw local playe
/*
    localPlayer.draw(ctx, posX, posY);
*/
	// Draw items
	//for (var i = 0; i < items.length; i++) {
	//		ctx.drawImage(itemsprites, items[i][2]*44, 0, 44, 44, items[i][0]+bgPos.x, items[i][1]+bgPos.y, 32, 32);
	//}

    // Dijbujar NPCs - new
/*
    for (let i = npcs.length; i-- > 0;) {
        let npc = npcs[i],
            posNow = npc.posNow(width, height, posWorld);

        if (posNow) {
            npc.Draw(ctx, posNow.x, posNow.y);
        }
    }
*/

	// If player is in fight, display stats of enemy
//	if(localPlayer.isGoingToFight()) {
//		var enemy = enemies[localPlayer.enemyID()];
//		var value = localPlayer.isFighting();
//		if(enemy.isAlive() && $("#enemyLevel").hasClass('hideClass')) {
//			enemy.displayStats();
//		}
//	}
//	else if(!$("#enemyLevel").hasClass('hideClass')) {
//		$("#enemyLevel").addClass('hideClass');
//		$("#enemyName").addClass('hideClass');
//		$("#enemyHeart").addClass('hideClass');
//		$("#enemyHealthBorder").addClass('hideClass');
//		$("#enemyHealth").addClass('hideClass');
//	}

    //Dibuja las capas superiores
    clsMap.drawMap(capaFour, ctx, width, height);
    clsMap.drawMap(capaFive, ctx, width, height);

    // Dibuja el minimapa
    clsMap.drawMiniMap(capaOne, mapCtx, width, height);
    clsMap.drawMiniMap(capaTwo, mapCtx, width, height);
    clsMap.drawMiniMap(capaThree, mapCtx, width, height);
    clsMap.drawMiniMap(capaFour, mapCtx, width, height);
    clsMap.drawMiniMap(capaFive, mapCtx, width, height);
}

// Browser window resize
function onResize (e) {
    // REDIMENZIONAR MAPA
    let width = $(window).width(),
        height = $(window).height();

    socket.emit('map:move', {width: width, height: height});

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

    $('#game').css({
        width: $(window).width(),
        height: $(window).height()
    });

    if (showMap) {
        //drawMap();
    }
}
