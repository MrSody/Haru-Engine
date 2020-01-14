/* ------------------------------ *
    CONSTANT VARIABLES
* ------------------------------ */
/*jslint bitwise: true, es5: true */

// EXPRESS
const express = require('express');
const app = express();

// SOCKET IO
const socketIO = require('socket.io');

// CONNECTION TO DB
const DBAdapter = require("./Engine/Modules/DBAdapters/MySQLDBAdapter");

const conexion = DBAdapter();

// RUTAS
const routes = require('./Routes/routes');
const routesApi = require('./Routes/routes-api');

/* ------------------------------ *
    CONFIGURATIONS
* ------------------------------ */
app.set('appName', 'P-MS');
//app.set('port', process.env.PORT || 3000);
app.set('port', 3030);
app.set('views', __dirname + '/Vistas');
app.set('view engine', 'ejs');

// Bring public files - Trae los archivos publicos
app.use(express.static(__dirname +'/public'));

/* ------------------------------ *
    ROUTES
* ------------------------------ */
app.use(routes);
app.use("/api", routesApi);

app.get("*", (req, res) => {
    res.end("Archivo no encontrado")
});

const server = app.listen(app.get('port'), () => {
    console.log('server funcionado en puerto: ', app.get('port'), '\nNombre: ', app.get('appName'));
});

/* ------------------------------ *
    SERVER GAME
* ------------------------------ */
// CONSTANTES
const io = socketIO(server);
//const Account = require('./Engine/Modules/Accounts/Account.js');
const Querys = require('./Engine/Modules/Querys.js');
const engineApi = require("./Engine/Engine").Engine;

const engine = new engineApi(conexion);

//VARIABLES
var players = [],	// Array de los jugadores conectados
	Npcs = [],  // Array de los NPC
    jutsus = []; // Array de los jutsus

function init () {
    // Muestra las cuentas creadas
    conexion.query('Select ID_Cuenta, Nombre from Ninja', (err, results) => {

        if (err) {
            console.log("Error: no esta en base de datos");
        } else {
            for (var i = 0; i < results.length; i++) {
                console.log("cuentas "+ results[i].ID_Cuenta +"-"+ results[i].Nombre);
            }
        }
    });

    engine.init();
    // Carga los NPCs
    loadNPCs();
    setEventHandlers();
}

/* ------------------------------ *
    SERVER FUNCTIONS
* ------------------------------ */
// GAME EVENT HANDLERS
function setEventHandlers () {
    // Connection
    io.sockets.on('connection', onSocketConnection);

    //io.sockets.on('disconnect',function(){ console.log('user disconnected'); });
};

// New socket connection
function onSocketConnection (client) {
    // Listen for account connect
    client.on('account:connected', onAccountConnect);

    // Listen for client disconnected
    client.on('disconnect', onClientDisconnect);

	// Listen for new player message
    client.on('player:connected', onPlayerConnect);
    
    // Listen for player updates
	//client.on("update player", onUpdatePlayer);

	// Listen for new messages
	client.on('chat:newMessage', onNewMessage);

    // Player move
    client.on('player:move', onMovePlayer);

    // Map
    client.on('map:move', onMoveMap);

	// Listen for logout
	//client.on("logout", onLogout);
}

function loadNPCs () {

    const { getSearchNpc } = Querys;

    // Trae los NPCs de db
    conexion.query(getSearchNpc(), (err, results) => {

        if (!err) {

            results.forEach((dataNPC) => {

                npc = engine.createNPC(dataNPC);                

                // Add new npc to the NPCs array
                Npcs.push(npc);
            });
            console.log("Completado: Se han cargado todos los NPCs...");

        } else {
            console.log("Error: No se pudo cargar los NPCs - "+ err);
        }
    });
}

/* ------------------------------ *
    CONNECTIONS TO SERVER
* ------------------------------ */
function onAccountConnect (data) {

    const { getSearchAccount } = Querys;
    let toClient = this;

    console.log("Conectado al server "+ data.idAccount);
    //find account connect
    conexion.query(getSearchAccount(), [data.idAccount], (err, results) => {

        if (!err) {
            if (results.length > 0) {
                toClient.emit('account:characters', results);
            } else {
                console.log("Error: "+ data.idAccount +" no existe");
            }
        } else {
            console.log("Error: "+ data.idAccount +" no esta en base de datos");
        }
    });
}

// Socket client has disconnected
function onClientDisconnect () {

    let playerDisconnect = engine.playerById(this.id, players);
    let toClient = this;

    console.log("se desconecto "+ playerDisconnect.getName());

	players.splice(players.indexOf(playerDisconnect), 1);
    toClient.broadcast.emit('players:playerDisconnect', {id: playerDisconnect.getID()});
}

// PRUEBA
/*
function onLogout(data) {
	var removePlayer = playerById(data.id);
	this.broadcast.emit("new message", {player: removePlayer.getName(), text: "left the game", mode: "s"});
	players.splice(players.indexOf(removePlayer), 1);
	this.broadcast.emit("remove player", {id: data.id});
	console.log("Player "+data.id+" logged out");
};
*/

/* ------------------------------ *
    PLAYER
* ------------------------------ */
function onPlayerConnect (data) {

    const { getSearchNinja } = Querys;
    let toClient = this;

    conexion.query(getSearchNinja(), [data.idPlayer], (err, results) => {

        if (!err) {
            if (results.length > 0) {

                player = engine.createPlayer(toClient.id, results);

                // Add new player to the players array
                players.push(player);

                // Send information to client
                toClient.emit('players:localPlayer', player);

                // Send world-data to client
                toClient.emit('map:init', {spritesheet: engine.getSpriteMap(), tileSize: engine.getTileSize()});

                // Message the welcome to client
                toClient.emit('chat:newMessage', {name: 'Server', mode: '', text: 'Bienvenido a P-MS'});

                // Broadcast new player to connected socket clients
                toClient.broadcast.emit('players:remotePlayer', player);
                /*
                players.forEach((remotePlayer) => {
                    if (remotePlayer.getID() != toClient.id) {
                        
                        let playersRemote = engine.playersCercanos(remotePlayer, players);
                        
                        playersRemote.forEach((playerRemote) => {
                            io.to(`${remotePlayer.getID()}`).emit('players:remotePlayer', playerRemote);
                        });
                    }
                });
                */

                // Send players connected to new player
                for (let playerRemote of players) {
                    if (playerRemote.getID() != toClient.id) {
                        toClient.emit('players:remotePlayer', playerRemote);
                    }
                }
                /*
                let playerRemote = engine.playersCercanos(player, players);

                playerRemote.forEach((remotePlayer) => {
                    toClient.emit('players:remotePlayer', remotePlayer);
                });
                */

                // Envia los Npc's del mapa al cliente
                let NPCCercanos = engine.NPCCercanos(player, Npcs);

                NPCCercanos.forEach((Npc) => {
                    toClient.emit('npcs:newNpc', Npc);
                });

            } else {
                console.log("Error: No tiene datos el player: "+ data.idPlayer);
            }
        } else {
            console.log("Error: No existe el player: "+ data.idPlayer);
        }
    });
}

// Player has moved
function onMovePlayer (data) {
    let toClient = this, player = engine.playerById(this.id, players);

	// Player not found
	if (player) {
        // Update player position
        engine.movePlayer(player, data);

        // Broadcast updated position to connected socket clients
        //io.sockets.emit('player:move', {id: player.getID(), posWorld: player.getPosWorld(), dir: player.getDir()});
        io.emit('player:move', {id: player.getID(), posWorld: player.getPosWorld(), dir: player.getDir()});

        // Envia los Npc's del mapa al cliente
        let NPCCercanos = engine.NPCCercanos(player, Npcs);

        NPCCercanos.forEach((Npc) => {
            toClient.emit('npcs:newNpc', Npc);
        });

    } else {
		util.log("Player not found: "+ this.id);
		return;
	};

	// Check if player stepped on an item
	//var item = getItem(movePlayer.getAbsX(), movePlayer.getAbsY());
    //console.log(item);
	//if(item) {
		//io.sockets.emit("item taken", {x: item[0], y: item[1], type: item[2], change: item[3], id: data.id});
		//movePlayer.takeItem(item[2], item[3]);
		//removeItem(movePlayer.getAbsX(), movePlayer.getAbsY());
	//}
}

function onNewMessage(data) {
	var player = playerById(this.id);
    var toClient = this;

    io.sockets.emit('chat:newMessage', {name: data.name, mode: '', text: data.text});

    /*
	if(data.chatTo){
		var chatTo = playerByName(data.chatTo);
		if (data.mode == "w" && chatTo) {
			io.to(chatTo.id).emit("new message", {player: player.name, text: data.text, mode: data.mode});
		}
		else if (!chatTo) {
			this.emit("new message", {player: data.chatTo, text: "Player " + data.chatTo + " doesn't exist!", mode: "s"});
		}
	}
	else {
		io.sockets.emit("new message", {player: player.name, text: data.text, mode: data.mode});
	}
    */
}

/* ------------------------------ *
    MAPA
* ------------------------------ */
function onMoveMap(data) {
    let toClient = this, player = engine.playerById(toClient.id, players);

	// Player found
	if (player) {
        console.log("Actualizo mapa");
        //Variables
        let map = engine.getMap(data.width, data.height);

        // Actualiza la posicion del jugador en la pantalla
        player.setSizeScreen(data.width, data.height);

        //Envia al cliente el mapa
        toClient.emit('map:data', {capa1: map.capa1, capa2: map.capa2, capa3: map.capa3, capa4: map.capa4, capa5: map.capa5});

        // Envia las colisiones
        toClient.emit('map:collision', {collisionMap: map.collision});
    } else {
        console.log("Player not found: "+ toClient.id);
		return;
	}
}

init();