import Interface from './interface.js';
import CursorTypesEnums from "../../enums/cursorTypes.js";

export default class InterfaceGame extends Interface {
    constructor () {
        super();

        this.canvasCapaMapaAbajo;
        this.ctxCapaMapaAbajo;
        this.canvasPersonaje;
        this.ctxPersonaje;
        this.canvasCapaMapaArriba;
        this.ctxCapaMapaArriba;
        this.canvasHUB;
        this.ctxHUB;
    }

/*-------------------------------
    HUB - CONFIGURE GAME
*-------------------------------*/

    configureHUBGame (localMessage, onResize) {
        // Keyboard
        document.getElementById("Mensaje").addEventListener("keydown", localMessage, false);

        // Window resize
        window.addEventListener("resize", onResize, false);
        window.addEventListener("load", onResize, false);
    }

    configureCanvasGame () {
        this.removeClass('#hubPrincial', 'Invisible');

        this.canvasCapaMapaAbajo = document.getElementById('capasMapaAbajo');
        this.ctxCapaMapaAbajo = this.canvasCapaMapaAbajo.getContext('2d');
        this.ctxCapaMapaAbajo.globalAlpha = 0.1;

        this.canvasPersonaje = document.getElementById('capaPersonaje');
        this.ctxPersonaje = this.canvasPersonaje.getContext('2d');
        this.ctxPersonaje.globalAlpha = 0.1;

        this.canvasCapaMapaArriba = document.getElementById('capasMapaArriba');
        this.ctxCapaMapaArriba = this.canvasCapaMapaArriba.getContext('2d');
        this.ctxCapaMapaArriba.globalAlpha = 0.1;

        this.canvasHUB = document.getElementById("game");
        this.ctxHUB = this.canvasHUB.getContext("2d");
        this.ctxHUB.globalAlpha = 0.1;
    }

/*-------------------------------
    HUB - GAME
*-------------------------------*/
    resizeCanvas (width, height) {
        this.canvasHUB.width = width;
        this.canvasHUB.height = height;

        this.canvasCapaMapaAbajo.width = width;
        this.canvasCapaMapaAbajo.height = height;

        this.canvasPersonaje.width = width;
        this.canvasPersonaje.height = height;

        this.canvasCapaMapaArriba.width = width;
        this.canvasCapaMapaArriba.height = height;
    }

    cleanScreen (width, height) {
        this.ctxHUB.clearRect(0, 0, width, height);
        this.ctxCapaMapaAbajo.clearRect(0, 0, width, height);
        this.ctxPersonaje.clearRect(0, 0, width, height);
        this.ctxCapaMapaArriba.clearRect(0, 0, width, height);
    }

    /**
     * @param {CursorTypesEnums.cursorTypes()} typeCursor
     */
    styleCursor (typeCursor) {
        document.documentElement.style.cursor = typeCursor;
    }

    chatIsActive () {
        return !!(!$('#hubPrincial').hasClass('Invisible') && $("#Mensaje").is(":focus"));
    }

    focusChat () {
        this.focus('#Mensaje');
    }

    showMessage (data) {
        let chatTxtClr;

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

        let spanMessage = document.createElement("span");
        spanMessage.style = "color: "+ chatTxtClr;
        spanMessage.textContent = `${data.name}: ${data.text}`;
        this.documentSelect("#Mensajes").appendChild(spanMessage);
        this.documentSelect("#Mensajes").appendChild(document.createElement('br'));
        this.scrollBottom();
        this.documentSelect("#Mensaje").value = "";
    }

    scrollBottom() {
        let elementChat = this.documentSelect('#Chat');
        elementChat.scrollTop = elementChat.scrollHeight;
    }
}