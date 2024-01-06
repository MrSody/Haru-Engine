export default class Interface {
    constructor () {
        this.maxLoadScreen = 4;
        this.showLoadScreen = false;
        this.fps = 0;
        this.lastCalledTime = performance.now();
    }
/* ------------------------------ *
    GETTERS
* ------------------------------ */
    getShowLoadScreen() {
        return this.showLoadScreen;
    }

/* ------------------------------ *
    SETTERS
* ------------------------------ */
    setShowLoadScreen(showLoadScreen) {
        this.showLoadScreen = showLoadScreen;
    }

/*-------------------------------
    Ayuda - HUB
*-------------------------------*/
    getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    documentSelect (element) {
        return document.querySelector(element);
    }

    removeClass (element, style) {
        this.documentSelect(element).classList.remove(style);
    }

    addClass (element, style) {
        this.documentSelect(element).classList.add(style);
    }

    removeOrAddByID (element, style) {
        this.documentSelect(element).classList.toggle(style);
    }

    innerHTML (element, html) {
        this.documentSelect(element).innerHTML = html;
    }

    focus (element) {
        this.documentSelect(element).focus();
    }

    blur (element) {
        this.documentSelect(element).blur();
    }

    fullScreen (element, width, height) {
        this.documentSelect(element).setAttribute("style", `width: ${width}; height: ${height}`);
    }

    calculateFPS() {
        if (!this.lastCalledTime) {
            this.lastCalledTime = performance.now();
            this.fps = 0;
            return;
        }
    
        let delta = (performance.now() - this.lastCalledTime) / 1000;
        this.lastCalledTime = performance.now();
        this.fps = Math.round(1 / delta);

        if ((performance.now() - this.lastCalledTime) > 0 ){
            $("#FPS").html("FPS: "+ this.fps);// +" DELTA: "+ delta);
        }

        return delta;
    }

/*-------------------------------
    HUB - Pantalla de carga
*-------------------------------*/
    loadScreen () {
        this.generateLoadScreen();
    }

    loadScreen (element, style) {
        if (element != null && style != null) {
            this.addClass(element, style);
        }

        this.generateLoadScreen();
    }

    generateLoadScreen () {
        let html = `<img src="../img/game/Wallpaper/${this.getRandomInt(1, this.maxLoadScreen)}.jpg" style="width: 100%">`;

        // Elimina la clase Invisible
        this.removeClass('#loading', 'Invisible');

        this.innerHTML('#loading', html);
    }

/*-------------------------------
    HUB - GAME
*-------------------------------*/
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

    chatIsActive () {
        return !!(!$('#hubPrincial').hasClass('Invisible') && $("#Mensaje").is(":focus"));
    }

    focusChat () {
        this.focus('#Mensaje');
    }
}