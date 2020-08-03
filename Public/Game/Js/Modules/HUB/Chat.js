export default class Chat {
    constructor () {
        this.textHelp = `Bienvenido al menu de ayuda. <br>- Usa /pos para saber tu ubicacion actual.`;
    }

    message (localPlayer, text) {
        let help = false, opcion, mode, chatTo;

        if (text.charAt(0) == '/') {
            opcion = text.substring(1);

            if (text.charAt(1) == 'w' && text.charAt(2) == ' ') {
                mode = 'w';
                chatTo = null;
                text = text.substring(3);
            } else if (text.charAt(1) == 's' && text.charAt(2) == ' ') {
                mode = 's';
                chatTo = text.substring(3, text.indexOf(' ', 3));
                text = text.substring(text.indexOf(' ', 3));
            } else if (text.charAt(1) == 'd' && text.charAt(2) == ' ') {
                mode = 'd';
                chatTo = null;
                text = text.substring(3);
            } else if (opcion == 'pos') {
                help = true;
                text = `Posicion actual: X: ${localPlayer.getPosWorld().x} - Y: ${localPlayer.getPosWorld().y}`;
            } else if (opcion == 'dev') {
                help = true;
                text = 'modo developer';
                mode = true;
            } else {
                help = true;
                text = this.textHelp;
            }
        }

        if (help) {
            return {sendServer: false, mode: mode, text: text, chatTo: chatTo};
        } else {
            return {sendServer: true, mode: mode, text: text, chatTo: chatTo};
        }
    }
}