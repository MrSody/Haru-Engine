export default class Chat {
    constructor () {}

    receiveMessage (data) {
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

    message (localPlayer, text) {
        let help = false, opcion, sayMode, chatTo;
        let textHelp = `Bienvenido al menu de ayuda. <br>
                    - Usa /loc para saber tu ubicacion actual.`;

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
            } else if (opcion == 'pos') {
                help = true;
                text = `Posicion actual: X: ${localPlayer.getPos().x} - Y: ${localPlayer.getPos().y}`;
            } else {
                help = true;
                text = textHelp;
            }
        }

        if (help) {
            this.receiveMessage({mode: sayMode, text: text, name: localPlayer.getName()});
            return {sendServer: false};
        } else {
            return {sendServer: true, mode: sayMode, text: text, chatTo: chatTo};
        }
    }
}