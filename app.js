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
const { models, queryInterface } = require('./server/database');
const characterController = require('./server/app/controllers/game/characterController');
const locationController = require('./server/app/controllers/game/locationController');

// LOGs
const log4js = require('log4js');
log4js.configure('./config/log4js.json');
const logger = log4js.getLogger('app');
const loggerPlayers = log4js.getLogger('players');
const loggerMessages = log4js.getLogger('messages');

// ROUTES
const routes = require('./server/routes/routes');
const bodyParser = require('body-parser');

// STRING RESOURCE
const i18n = require('./config/i18n-config');
const { Model } = require('sequelize');

/* ------------------------------ *
    CONFIGURATIONS
* ------------------------------ */
app.set('appName', 'Haru-Engine');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/client/views');
app.set('view engine', 'ejs');

//extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: false }));

// Bring public files - Trae los archivos publicos
app.use(express.static(__dirname +'/client/public'));

app.use(i18n.init);

app.use(function(req, res, next) {
    //let lang = req.query.lang || 'en';
    let lang = 'es';
    req.setLocale(lang);
    res.locals.lang = lang;
    next();
});

/* ------------------------------ *
    ROUTES
* ------------------------------ */
app.use(routes);


const server = app.listen(app.get('port'), () => {
    console.log(`Application is working: http://localhost:${app.get('port')}`);
    init();
});

app.get("/game", (req, res) => {
    loggerPlayers.info('Inside the game');
});

/* ------------------------------ *
    SERVER GAME
* ------------------------------ */
const io = socketIO(server);
const engineApi = require("./server/core/engine/engine").Engine;

const engine = new engineApi();

async function init () {
    engine.init();

    // Carga los NPCs
    loadNPCs();
    resetData();
    setEventHandlers();
}

async function resetData () {

    await queryInterface.tableExists('account').then(existTable => {
        if (existTable) {
            models.account.count().then(numAccount => {
                if (numAccount > 0) {
                    models.account.update({ online: 0 }, { where: {}});
                }
            });
        }
    });

    await queryInterface.tableExists('character').then(existTable => {
        if (existTable) {
            models.character.count().then(numCharacter => {
                if (numCharacter > 0) {
                    models.character.update({ online: 0 }, { where: {}});
                }
            });
        }
    });
}

/* ------------------------------ *
    SERVER FUNCTIONS
* ------------------------------ */
function setEventHandlers () {
    io.sockets.on('connection', onSocketConnection);
}

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

    // Listen for client disconnect
    client.on('disconnect', onClientDisconnect);
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
            throw new Error("There are no NPCs in the database.");
        }
        logger.info("Completed: All NPCs have been loaded...");
    })
    .catch(e => {
        logger.error('Error:', {file: 'app.js', method:'loadNPCs', message: e});
    })
}

/* ------------------------------ *
    CONNECTIONS TO SERVER
* ------------------------------ */
/**
* @param {{idAccount: string;}} data
*/
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
        logger.fatal('Error:', {file: 'app.js', method:'onAccountConnect', message: e});
    });
}

async function onClientDisconnect () {
    let toClient = this;

    try {
        let character = engine.playerDisconnect(this.id);

        loggerPlayers.info(`The player disconnected: ${character.name} - with ID: ${character.IDPj}`);

        let characterDB = await models.character.findByPk(character.IDClient);
        await characterDB.update({ online: 0 });

        let accountDB = await models.account.findByPk(character.IDPj);
        await accountDB.update({ online: 0 });

        toClient.broadcast.emit('players:playerDisconnect', {id: character.IDClient});
    } catch (e) {
        logger.fatal('Error:', {file: 'app.js', method:'onClientDisconnect', message: e});
    }
}

/* ------------------------------ *
    CHARACTER
* ------------------------------ */
/**
* @param {any} toClient
* @param {Model<character>} dataCharacter
*/
function sendCharacterToClient (toClient, dataCharacter) {
    // Add new player
    let player = engine.addPlayer(toClient.id, dataCharacter);

    loggerPlayers.info(`The player connected: ${player.name}`);

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
        if (playerRemote.IDClient !== toClient.id) {
            toClient.emit('players:remotePlayer', playerRemote);
        }
    }

    // Envia los Npc's del mapa al cliente -- error
    // let NPCCercanos = engine.NPCNearby(player);

    // NPCCercanos.forEach((Npc) => {
    //     toClient.emit('npcs:newNpc', {npc: Npc, count: NPCCercanos.length});
    // });
}

/**
* @param {{
*    idAccount: string, 
*    gender: string, 
*    element: string, 
*    village: string, 
*    appearance: string, 
*    hair: string, 
*    name: string,
*   }} data
*/
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
        logger.fatal('Error:', {file: 'app.js', method:'onCharacterCreate', message: e});
    }
}

/**
 * @param {{idCharacter: string;}} data 
 */
async function onCharacterConnect (data) {
    let toClient = this;

    await characterController.getCharacterByIdCharacter(data.idCharacter)
    .then(dataCharacter => {
        if (dataCharacter != null) {
            sendCharacterToClient(toClient, dataCharacter);
        } else {
            throw new Error(`ID_Character: ${data.idCharacter}, character not exist`);
        }
    })
    .catch(e => {
        logger.fatal('Error:', {file: 'app.js', method:'onCharacterConnect', message: e});
    });
}

/**
 * @param {{id: number; x: number; y: number; dir: number; mode: number;}} data
 */
function onMovePlayer (data) {
    let toClient = this,
        player = engine.playerById(this.id);

	if (player) {
        // Update player position
        engine.movePlayer(player, data);

        // Broadcast updated position to connected socket clients
        io.emit('player:move', {id: player.IDClient, posWorld: player.posWorld, dir: player.direction, mode: data.mode});

        // Envia los Npc's del mapa al cliente - error
        // let NPCCercanos = engine.NPCNearby(player);

        // NPCCercanos.forEach((Npc) => {
        //     toClient.emit('npcs:newNpc', {npc: Npc, count: NPCCercanos.length});
        // });

    } else {
        logger.warn('Error:', {file: 'app.js', method:'onMovePlayer', message: `Player not found: ${this.id}`});
	}
}
/* ------------------------------ *
    CHAT
* ------------------------------- */
/**
 * @param {{name: string, mode: string, text: string, chatTo: string;}} data 
 */
function onNewMessage(data) {
    let toClient = this;

    loggerMessages.trace('New message: ', {name: data.name, mode: '', text: data.text})

    io.emit('chat:newMessage', {name: data.name, mode: '', text: data.text});
}

/* ------------------------------ *
    MAP
* ------------------------------ */
/**
 * @param {{width: number, height: number}} data
 */
function onMap (data) {
    let toClient = this,
        player = engine.playerById(toClient.id);

	if (player) {
        let map = engine.getMap(player, data.width, data.height);

        if (map) {
            toClient.emit('map:data', map);
        }
    } else {
        logger.warn('Error:', {file: 'app.js', method:'onMap', message: `Player not found: ${toClient.id}`});
	}
}

/* ------------------------------ *
    NPC
* ------------------------------ */
/**
 * @param {{id: string, x: number, y: number, dir: number}} data 
 */
function onMoveNpc (data) {
    let npc = engine.npcById(data.id);

	if (npc) {
        npc.setPosWorld(data.x, data.y);
        npc.setDirection(data.dir);

        // Broadcast updated position to connected socket clients
        //io.sockets.emit('npc:move', {id: npc.getID(), pos: npc.getPos(), dir: npc.getDir()});
        io.emit('npc:move', {id: npc.getID(), pos: npc.getPosWorld(), dir: npc.getDir()});

    } else {
        logger.warn('Error:', {file: 'app.js', method:'onMoveNpc', message: `Player not found: ${this.id}`});
	}
}