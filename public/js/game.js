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
	lastClicked = {x: null, y: null},
	lastMapUpdate = Date.now(),
	socket,		// Socket connection
	tellCounter = 0,
	lastRender = Date.now(),
	lastFpsCycle = Date.now(),
	questlist = [];

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
    //socket.on('invocation:move', onMoveClon);
    
    // Movimiento del Npc
    socket.on('npc:move', onMoveNpc);

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

	// Maximise the canvas
	canvas.width = 1184;
	canvas.height = 1184;

    // REDIMENCIONA EL CANVAS
    onResize();
}

function onInitMap (data) {
    // CARGA LAS CAPAS
    clsMap.setCapas(data);

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

function findNpc (id) {
    for (let npc of npcs) {
        if (npc.getID() == id) {
            return npc;
        }
    }

	return false;
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
            middleTileX = Math.round((width / 2) / 32),
            middleTileY = Math.round((height / 2) / 32),
            posWorld = localPlayer.getPos(),
            posNow = invocation.posNow(middleTileX, middleTileY, posWorld);

        if (posNow && !invocation.isFighting()) {

            let pathFinder = new Pathfinder(collisionMap, posNow, tile),
                move = pathFinder.move();
            
            if (move.length > 0) {
                invocation.setPath(move);
            }
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

function disparo () {
    // New Shot
    if(lastPress == KEY_SPACE){
        var s = new Circle(player.x, player.y, 2.5);
        s.rotation = player.rotation;
        s.speed = player.speed+10;
        s.timer = 15;
        shots.push(s);
    }

    // Move Shots
    for(var i = 0,l = shots.length; i < l; i++){
        shots[i].timer--;
        if(shots[i].timer < 0){
            shots.splice(i--, 1);
            l--;
            continue;
        }

        shots[i].move((shots[i].rotation-90) * Math.PI/180, shots[i].speed);
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
	let tile = getClickedTile(e),
        playerPosX = Math.round((canvas.width / 2) / 32),
        playerPosY = Math.round((canvas.height / 2) / 32),
        seals = localPlayer.getSeals();

    console.log(tile);
    
    if (localPlayer.getAttackDistance()) {
        console.log("Click Ataque a distancia: "+ tile.x +"-"+ tile.y);
        attackDistance.push(new AttackDistance({x: playerPosX, y: playerPosY}, tile, 10, 20));
    } else if (seals[seals.length - 1] === 32) {
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
                let invocations = localPlayer.getInvocation(),
                    pathStart = {x: playerPosX, y: playerPosY},
                    pathfinder = new Pathfinder(collisionMap, pathStart, tile),
                    path = pathfinder.calculatePath();

				// Calculate path
				if (path.length > 0) {
					localPlayer.setPath(path);
				}
                if (invocations.length) {
                    moveInvocation(collisionMap, tile);
                }
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
                localPlayer.setAttackDistance(true);
                document.documentElement.style.cursor = "url('../img/game/icons/mouse_remoteAttack.png') 32 32, auto";
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
/*
function animate () {
	let delta = (Date.now() - lastRender)/1000;
	lastRender = Date.now();
    draw();
    event();
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
*/
function animate () {
    let animate = setInterval(() => {
        let delta = (Date.now() - lastRender)/1000;
        lastRender = Date.now();
        draw();
        event(delta);
        update(delta);

        if (Date.now() - lastFpsCycle > 1000) {
            lastFpsCycle = Date.now();
            let fps = Math.round(1/delta);
            //console.log("FPS: "+ fps);
            $(".text").html("FPS: "+ fps +" DELTA: "+ delta);
        }
        // Request a new animation frame using Paul Irish's shim
        //requestAnimationFrame(animate);
        //window.requestAnimFrame(animate);
    }, 1000/12);
}

/*-------------------------------
    GAME UPDATE
*-------------------------------*/
function update (delta) {
    let invocations = localPlayer.getInvocation();
    // Mover el player
	if (localPlayer.isMoving()) {
		let absPos = localPlayer.getAbsPos(),
            width = $(window).width(),
            height = $(window).height();
        
		localPlayer.playerMove(delta);
        
        socket.emit('player:move', {id: localPlayer.getID(), x: absPos.absX, y: absPos.absY, dir: localPlayer.getDir()});
        
        // Mover el MAPA
        socket.emit('map:move', {width: width, height: height});
	}
    // Mover las invocaciones del player
    if (invocations.length) {
        for (let i = invocations.length; i-- > 0;) {
            let invocation = findRemotePlayer(invocations[i]);

            if (invocation && invocation.isMoving()) {
                let absPos = invocation.getAbsPos();

                console.log("Clon: "+ invocation.getName() +" SE movio ");
                invocation.playerMove(delta);

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
    
    // Ataque a distancia
    for (var i = 0, l = attackDistance.length; i < l; i++) {
        attackDistance[i].timer--;
        if (attackDistance[i].timer < 0) {
            attackDistance.splice(i--, 1);
            l--;
            continue;
        }
        if(attackDistance[i].distance() > 0){
          var angle = attackDistance[i].getAngle();
          attackDistance[i].move(angle, delta * 100);
        }
    }
}

function event (delta) {
    let width = $('#game').outerWidth(),
        height = $('#game').outerHeight(),
        middleTileX = Math.round((width / 2) / 32),
        middleTileY = Math.round((height / 2) / 32),
        posWorld = localPlayer.getPos(),
        maxTilesX = Math.floor((width / 32) + 1),
        maxTilesY = Math.floor((height / 32) + 1);
    
    // Radio ataque Npc
    for (let i = npcs.length; i-- > 0;) {
        let npc = npcs[i],
            posNow = npc.posNow(middleTileX, middleTileY, posWorld);
        
        if (posNow && npc.isAggressive() && !npc.isMoving()) {
            
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

/*-------------------------------
    GAME DRAW
*-------------------------------*/
function draw () {
    let width = $('#game').outerWidth(),
        height = $('#game').outerHeight(),
        middleTileX = Math.round((width / 2) / 32),
        middleTileY = Math.round((height / 2) / 32),
        posWorld = localPlayer.getPos(),
        maxTilesX = Math.floor((width / 32) + 1),
        maxTilesY = Math.floor((height / 32) + 1);

    // Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let h = 0; h < maxTilesY; h++) {
        for (let w = 0; w < maxTilesX; w++) {
            
            let dañoJugador;
            
            // Dibuja capas inferiores
            clsMap.drawMapDown(ctx, w, h);

            // Draw Jutsus Down
            let jutsusDown = clsJutsus.getJutsusDown(), count = 0;

            jutsusDown.forEach((jutsu) => {

                if (jutsu[0] == "2") {
                    let countTeleport = 0;
                    while (countTeleport++ < 2) {
                        let posNowJutsu = clsJutsus.posNowJutsu(middleTileX, middleTileY, posWorld, jutsu, countTeleport);
                        if (posNowJutsu.x == w && posNowJutsu.y == h) {
                            clsJutsus.draw(ctx, posNowJutsu.x, posNowJutsu.y, jutsu, count);
                        }
                    }
                } else {
                    let posNowJutsu = clsJutsus.posNowJutsu(middleTileX, middleTileY, posWorld, jutsu);
                    if (posNowJutsu.x == w && posNowJutsu.y == h) {
                        clsJutsus.draw(ctx, posNowJutsu.x, posNowJutsu.y, jutsu, count);
                    }
                }
                count++
            });

            // Dijbujar NPCs
            for (let i = npcs.length; i-- > 0;) {
                let npc = npcs[i],
                    posNow = npc.posNow(middleTileX, middleTileY, posWorld);
                
                if (posNow.x == w && posNow.y == h) {
                    npc.Draw(ctx, posNow.x, posNow.y);
                    dañoJugador = npc;
                }
            }

            // Dibujar remote players
            for (let i = remotePlayers.length; i-- > 0;) {
                let remotePlayer = remotePlayers[i],
                    posNow = remotePlayer.posNow(middleTileX, middleTileY, posWorld);
                
                if (posNow.x == w && posNow.y == h) {
                    remotePlayer.draw(ctx, posNow.x, posNow.y);
                    dañoJugador = remotePlayer;
                }
            }
            
            // Dibuja los ataques a distancia
            for (let i = attackDistance.length; i-- > 0;) {
                let posNow = attackDistance[i].getPos();
                
                if (posNow.x == w && posNow.y == h) {
                    if (!dañoJugador) {
                        attackDistance[i].stroke(ctx);
                    } else {
                        console.log("daño a "+ dañoJugador.getName());
                    }
                }
            }
            
            // Draw local playeyer
            if (middleTileX == w && middleTileY == h) {
                localPlayer.draw(ctx, middleTileX, middleTileY);
            }

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

            // Dibuja las capas superiores
            clsMap.drawMapUp(ctx, w, h);
        }
    }
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