class Interface {
    constructor () {
        this.maxPlayers = 5;
        this.maxLoadScreen = 4;
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
        let documentSelect = this.documentSelect(element);
        documentSelect.classList.remove(style);
    }

    addClass (element, style) {
        let documentSelect = this.documentSelect(element);
        documentSelect.classList.add(style);
    }

    removeOrAddByID (element, style) {
        let documentSelect = this.documentSelect(element);
        documentSelect.classList.toggle(style);
    }

    innerHTML (element, html) {
        let documentSelect = this.documentSelect(element);
        documentSelect.innerHTML = html;
    }

    focus (element) {
        let documentSelect = this.documentSelect(element);
        documentSelect.focus();
    }

    blur (element) {
        let documentSelect = this.documentSelect(element);
        documentSelect.blur();
        //alert("quitar focus");
    }

/*-------------------------------
    HUB - Pantalla de carga
*-------------------------------*/
    loadScreen (element, style) {
        
        if (element != null && style != null) {
            this.addClass(element, style);
        }

        let html = `<img src="../img/game/Wallpaper/${this.getRandomInt(1, this.maxLoadScreen)}.jpg" style="width: 100%">`;

        // Elimina la clase Invisible
        this.removeClass('#loading', 'Invisible');

        this.innerHTML('#loading', html);
    }

/*-------------------------------
    HUB - Pantalla de personajes
*-------------------------------*/
    accountCharacters (data) {
        let [id, skinBase, nombre] = data;

        let html =  `<div id="Pj_${id}" class="row personaje bgCharacter" onclick="selCharacter(${id},'${skinBase}','${nombre}')">
                        <div class="col">
                            <img src="../sprites/Player/Base/${skinBase}.png">
                        </div>
                        <div class="col">
                            <div>${nombre}</div>
                            <div>Rango</div>
                        </div>
                    </div>`;

        return html;
    }

    accountNewCharacter (count, id) {
        let html =  `<div id="Pj_${count}" class="col-12 bgNewCharacter" onclick="createNewCharacter(${id})"></div>`;

        return html;
    }
    
    // Muestra los personajes en la interface
    onAccountCharacters (data) {
        // Ocualta la pantalla de carga
        this.addClass('#loading', 'Invisible');

        // Muestra la pantalla de los personajes
        this.removeClass('#character', 'Invisible');

        console.log(data);

        let html = "";

        this.selCharacter(data[0].id, data[0].SkinBase, data[0].Nombre);

        data.forEach((Pj) => {

            let dataPJ = [Pj.id, Pj.SkinBase, Pj.Nombre];

            html += this.accountCharacters(dataPJ);
        });

        for (let count = (data.length + 1); count <= this.maxPlayers; count++) {
            html += this.accountNewCharacter(count, data[0].id);
        }

        this.innerHTML('#listPersonajes', html);
    }

    selCharacter (...data) {
        let [id, skinBase, nombre] = data;
    
        this.innerHTML('#characters_Skin', `<div id="characters_Skin" style="margin-top: 15%; margin-left: 40%;"><img src="../sprites/Player/Base/${skinBase}.png" style="width: 150px;"></div>`);
        this.innerHTML('#characters_BtnGetInGame', `<div id="characters_BtnGetInGame" class="mx-auto" style="width: 50%; margin-top: 10%;"><button onclick="getInGame(${id});" style="width: 100%;">Entrar al mundo</button></div>`);
    
        this.innerHTML('#characters_Name', `<div id="characters_Name"><b>Nombre: ${nombre}</b></div>`);
        this.innerHTML('#characters_Rank', `<div id="characters_Rank"><b>Rango: rango</b></div>`);
    }

/*-------------------------------
    HUB - GAME
*-------------------------------*/
    changeCharacter (mode) {

        $("[id^=containerCharacter]").addClass('Invisible');

        switch (mode) {
            case 1:
                this.removeClass('#containerCharacter_Character', 'Invisible');
                break;
            default:
                alert("Contenedor "+ mode);
        }
    }
}