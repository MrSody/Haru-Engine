window.onload = function() {
	// Inicia la conexion al socket
	socket = io.connect();

	// Start listening for events
    setEventHandlers();
    
    console.log("dentro");
}

// GAME EVENT HANDLERS
let setEventHandlers = function() {

	// Socket connection successful
    socket.on('connect', onSocketConnected);
    
    /*
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
    */
}

/*-------------------------------
    Socket connected
*-------------------------------*/
function onSocketConnected () {

    // Tell game server client connected
    var idAccount = document.querySelector('#ID');
	socket.emit('account:connected', {idAccount: idAccount.value});
}