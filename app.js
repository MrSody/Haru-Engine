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

const bodyParser = require('body-parser');

/* ------------------------------ *
    CONFIGURATIONS
* ------------------------------ */
app.set('appName', 'P-MS');
app.set('port', process.env.PORT || 3000);
//app.set('port', 3030);
app.set('views', __dirname + '/Vistas');
app.set('view engine', 'ejs');

//extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: false }));

// Bring public files - Trae los archivos publicos
app.use(express.static(__dirname +'/Public'));

/* ------------------------------ *
    ROUTES
* ------------------------------ */
app.use(routes);

app.get("*", (req, res) => {
    res.end("Archivo no encontrado")
});

const server = app.listen(app.get('port'), () => {
    console.log('server funcionado en puerto: ', app.get('port'), '\nNombre: ', app.get('appName'));
});

app.get("/game", (req, res) => {
    console.log("dentro en game");
    init();
});

/* ------------------------------ *
    SERVER GAME
* ------------------------------ */

// CONSTANTES
const io = socketIO(server);
const Querys = require('./Engine/Modules/Querys').Querys;
const engineApi = require("./Engine/Engine").Engine;

const engine = new engineApi();
const query = new Querys();

function init () {
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

    // Move Npc
    client.on('npc:move', onMoveNpc);

	// Listen for logout
    //client.on("logout", onLogout);
    
    client.on('login', onLogin);
}

function loadNPCs () {
    // Trae los NPCs de db
    conexion.query(query.getSearchNpc(), (err, results) => {

        if (!err) {

            results.forEach((dataNPC) => {
                // Add new npc
                engine.addNPC(dataNPC);
            });
            console.log("Completado: Se han cargado todos los NPCs...");

        } else {
            console.log("Error - loadNPCs : No se pudo cargar los NPCs - "+ err);
        }
    });
}

/* ------------------------------ *
    CONNECTIONS TO SERVER
* ------------------------------ */

function onLogin (data) {
    Console.log("onLogin "+ data);
}

function onAccountConnect (data) {
    let toClient = this;

    //find account connect
    conexion.query(query.getSearchAccount(), [data.idAccount], (err, results) => {

        if (!err) {
            if (results.length > 0) {
                toClient.emit('account:characters', results);
            } else {
                console.log("Error - onAccountConnect: "+ data.idAccount +" no existe");
            }
        } else {
            console.log("Error - onAccountConnect: "+ data.idAccount +" - "+ err);
        }
    });
}

// Socket client has disconnected
function onClientDisconnect () {
    let toClient = this;

    try {
        let playerDisconnect = engine.playerDisconnect(this.id);

        toClient.broadcast.emit('players:playerDisconnect', {id: playerDisconnect.getID()});
    } catch (error) {
        console.log("ERROR - onClientDisconnect: "+ error);
    }
}

/* ------------------------------ *
    PLAYER
* ------------------------------ */

function onPlayerConnect (data) {
    let toClient = this;

    conexion.query(query.getSearchCharacter(), [data.idPlayer], (err, results) => {

        if (!err) {
            if (results.length > 0) {

                // Add new player
                let player = engine.addPlayer(toClient.id, results[0]);

                console.log("Conectado al server "+ player.getName());

                // Send information to client
                toClient.emit('players:localPlayer', player);

                // Send world-data to client
                toClient.emit('map:init', {spritesheet: engine.getSpriteMap(), tileSize: engine.getTileSize()});

                // Message the welcome to client
                toClient.emit('chat:newMessage', {name: 'Server', mode: '', text: 'Bienvenido a P-MS'});

                // Broadcast new player to connected socket clients
                toClient.broadcast.emit('players:remotePlayer', player);

                // Send players connected to new player
                for (let playerRemote of engine.getPlayers()) {
                    if (playerRemote.getID() != toClient.id) {
                        toClient.emit('players:remotePlayer', playerRemote);
                    }
                }

                // Envia los Npc's del mapa al cliente
                let NPCCercanos = engine.NPCNearby(dataPlayers.player);

                NPCCercanos.forEach((Npc) => {
                    toClient.emit('npcs:newNpc', Npc);
                });

            } else {
                console.log("Error - onPlayerConnect: No tiene datos el player: "+ data.idPlayer);
            }
        } else {
            console.log("Error - onPlayerConnect: "+ data.idPlayer +" - "+ err);
        }
    });
}

// Player has moved
function onMovePlayer (data) {
    let toClient = this,
        player = engine.playerById(this.id);

	// Player not found
	if (player) {
        console.log("Dentro MovePlayer "+ data.x +" -- "+ data.y);
        // Update player position
        engine.movePlayer(player, data);

        // Broadcast updated position to connected socket clients
        io.emit('player:move', {id: player.getID(), posWorld: player.getPosWorld(), dir: player.getDir(), mode: data.mode});

        // Envia los Npc's del mapa al cliente
        let NPCCercanos = engine.NPCNearby(player, Npcs);

        NPCCercanos.forEach((Npc) => {
            toClient.emit('npcs:newNpc', Npc);
        });

    } else {
		util.log("Player not found: "+ this.id);
		return;
	};
}

function onNewMessage(data) {
    let toClient = this,
        player = engine.playerById(toClient.id);

    io.emit('chat:newMessage', {name: data.name, mode: '', text: data.text});
}
/* ------------------------------ *
    MAPA
* ------------------------------ */
function onMoveMap(data) {
    let toClient = this,
        player = engine.playerById(toClient.id);

	// Player found
	if (player) {
        // Actualiza la posicion del jugador en la pantalla
        player.setSizeScreen(data.width, data.height);

        //Variables
        let map = engine.getMap(player, data.width, data.height);

        //Envia al cliente el mapa
        toClient.emit('map:data', {capa1: map.capa1, capa2: map.capa2, capa3: map.capa3, capa4: map.capa4, capa5: map.capa5});

        // Envia las colisiones
        toClient.emit('map:collision', {collisionMap: map.collision});
    } else {
        console.log("Player not found: "+ toClient.id);
		return;
	}
}
/* ------------------------------ *
    NPC
* ------------------------------ */
//socket.emit('npc:move', {id: npc.getID(), x: absPos.absX, y: absPos.absY, dir: npc.getDir()});
function onMoveNpc (data) {
    let npc = engine.npcById(data.id);

	// Player not found
	if (npc) {
        console.log("npc");
        npc.setPos(data.x, data.y);
        npc.setDirection(data.dir);

        console.log(npc.getPos());

        // Broadcast updated position to connected socket clients
        //io.sockets.emit('npc:move', {id: npc.getID(), pos: npc.getPos(), dir: npc.getDir()});
        io.emit('npc:move', {id: npc.getID(), pos: npc.getPos(), dir: npc.getDir()});

    } else {
		util.log("Npc not found: "+ this.id);
		return;
	}
}

init();