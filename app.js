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
const { models } = require('./database');
const characterController = require('./app/controllers/game/characterController');
const locationController = require('./app/controllers/game/locationController');

// ROUTES
const routes = require('./routes/routes');

const bodyParser = require('body-parser');

/* ------------------------------ *
    CONFIGURATIONS
* ------------------------------ */
app.set('appName', 'P-MS');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: false }));

// Bring public files - Trae los archivos publicos
app.use(express.static(__dirname +'/public'));

/* ------------------------------ *
    ROUTES
* ------------------------------ */
app.use(routes);

app.get("*", (req, res) => {
    res.end("Archivo no encontrado")
});

const server = app.listen(app.get('port'), () => {
    console.log(`Application is working: http://localhost:${app.get('port')}`);
    init();
});

app.get("/game", (req, res) => {
    console.log("dentro en game");
});

/* ------------------------------ *
    SERVER GAME
* ------------------------------ */

// CONSTANTES
const io = socketIO(server);
const engineApi = require("./engine/engine").Engine;

const engine = new engineApi();

async function init () {
    engine.init();
    // Carga los NPCs
    loadNPCs();
    setEventHandlers();
}

/* ------------------------------ *
    SERVER FUNCTIONS
* ------------------------------ */
function setEventHandlers () {
    // Connection
    io.sockets.on('connection', onSocketConnection);

    //io.sockets.on('disconnect',function(){ console.log('user disconnected'); });
};

function onSocketConnection (client) {
    // Listen for account connect
    client.on('account:connected', onAccountConnect);

    // Listen for client disconnected
    client.on('account:disconnect', onClientDisconnect);

	// Listen for new player message
    client.on('character:connected', onCharacterConnect);

    // Listen for account create character
    client.on('character:create', onCharacterCreate);
    
    // Listen for player updates
	//client.on("update player", onUpdatePlayer);

	// Listen for new messages
	client.on('chat:newMessage', onNewMessage);

    // Player move
    client.on('player:move', onMovePlayer);

    // Map
    client.on('map:data', onMap);

    // Move Npc
    client.on('npc:move', onMoveNpc);

	// Listen for logout
    client.on("logout", onClientDisconnect);
    
    client.on('login', onLogin);
}

// TODO: append sequelize in app.js
// change methods of mysql
// and delete the library mysql
async function loadNPCs () {
    await models.npc.findAll()
    .then(dataNPC => {
        if (dataNPC.length > 0) {
            engine.addNPC(dataNPC);
        } else {
            throw "There are no NPCs in the database.";
        }
        console.log("Completed: All NPCs have been loaded...");
    })
    .catch(e => {
        console.log(`Error: app - loadNPCs: ${e}`);
    })
}

/* ------------------------------ *
    CONNECTIONS TO SERVER
* ------------------------------ */
function onLogin (data) {
    Console.log("onLogin "+ data);
}

async function onAccountConnect (data) {
    let toClient = this;

    await characterController.getCharactersSearchAccount(data.idAccount)
    .then(result => {
        if (result.length > 0) {
            toClient.emit('character:list', result);
        } else {
            toClient.emit('character:create', result);
        }
    })
    .catch(e => {
        console.log(`Error: app - onAccountConnect: ${e}`);
    });
}

// Socket client has disconnected
async function onClientDisconnect () {
    let toClient = this;

    try {
        let playerDisconnect = engine.playerDisconnect(this.id);

        console.log(`Se desconecto el jugador: ${playerDisconnect.getName()} - con ID ${playerDisconnect.getIDPJ()}`)

        let character = await models.character.findByPk(playerDisconnect.IDPj);
        await character.update({ online: 0 });

        toClient.broadcast.emit('players:playerDisconnect', {id: playerDisconnect.getID()});
    } catch (error) {
        console.log("ERROR: app - onClientDisconnect: "+ error);
    }
}

/* ------------------------------ *
    CHARACTER
* ------------------------------ */
function sendCharacterToClient (toClient, dataCharacter) {
    // Add new player
    let player = engine.addPlayer(toClient.id, dataCharacter);

    console.log("Conectado al server "+ player.getName());

    // Send information to client
    toClient.emit('players:localPlayer', player);

    // Send world-data to client
    toClient.emit('map:init', {spritesheet: engine.getSpriteWorld(), tileSize: engine.getTileSize()});

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

    // Envia los Npc's del mapa al cliente -- error
    // let NPCCercanos = engine.NPCNearby(player);

    // NPCCercanos.forEach((Npc) => {
    //     toClient.emit('npcs:newNpc', {npc: Npc, count: NPCCercanos.length});
    // });
}

async function onCharacterCreate (data) {
    let toClient = this;

    try {
        let keyboard = await models.keyboard.create();
    
        let attributes = await models.attributes.create();
        
        let setting = await models.setting.create();
    
        let location = await locationController.createLocation(data.village);
        
        let skin = await models.skin.create({ base: data.appearance, hair: data.hair });
    
        let character = await characterController.createCharacter(data, skin, location, setting, attributes, keyboard);

        sendCharacterToClient(toClient, character);
    } catch (e) {
        console.log(`Error: characterController - createCharacter: ${e}`);
    }
}

async function onCharacterConnect (data) {
    let toClient = this;

    await characterController.getCharacterByIdCharacter(data.idCharacter)
    .then(dataCharacter => {
        if (dataCharacter != null) {
            sendCharacterToClient(toClient, dataCharacter);
        } else {
            throw `ID_Character: ${data.idCharacter}, character not exist`;
        }
    })
    .catch(e => {
        console.log(`Error: app - onCharacterConnect: ${e}`);
    });
}

// Player has moved
function onMovePlayer (data) {
    let toClient = this,
        player = engine.playerById(this.id);

	// Player not found
	if (player) {
        // Update player position
        engine.movePlayer(player, data);

        // Broadcast updated position to connected socket clients
        io.emit('player:move', {id: player.getID(), posWorld: player.getPosWorld(), dir: player.getDir(), mode: data.mode});

        // Envia los Npc's del mapa al cliente - error
        // let NPCCercanos = engine.NPCNearby(player);

        // NPCCercanos.forEach((Npc) => {
        //     toClient.emit('npcs:newNpc', {npc: Npc, count: NPCCercanos.length});
        // });

    } else {
		console.log("Player not found: "+ this.id);
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
function onMap (data) {
    let toClient = this,
        player = engine.playerById(toClient.id);

	// Player found
	if (player) {
        let map = engine.getMap(player, data.width, data.height);

        toClient.emit('map:data', {capa1: map.capa1, capa2: map.capa2, capa3: map.capa3, capa4: map.capa4, capa5: map.capa5, capa6: map.capa6, collisionMap: map.collision, collisionMapOld: map.collision});
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
        npc.setPosWorld(data.x, data.y);
        npc.setDirection(data.dir);

        // Broadcast updated position to connected socket clients
        //io.sockets.emit('npc:move', {id: npc.getID(), pos: npc.getPos(), dir: npc.getDir()});
        io.emit('npc:move', {id: npc.getID(), pos: npc.getPosWorld(), dir: npc.getDir()});

    } else {
		util.log("Npc not found: "+ this.id);
		return;
	}
}