export default class Chat {
    constructor () {
        this.textHelp = `Bienvenido al menu de ayuda. <br>- Usa /pos para saber tu ubicacion actual.`;
    }

    message (localPlayer, text) {
        let help = false, opcion, sayMode, chatTo;

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
                text = `Posicion actual: X: ${localPlayer.getPosWorld().x} - Y: ${localPlayer.getPosWorld().y}`;
            } else {
                help = true;
                text = this.textHelp;
            }
        }

        if (help) {
            return {sendServer: false, mode: sayMode, text: text, chatTo: chatTo};
        } else {
            return {sendServer: true, mode: sayMode, text: text, chatTo: chatTo};
        }
    }
}