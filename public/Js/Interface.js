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

    documentSelectClasses (documentSelect) {
        return documentSelect.classList;
    }

    removeClass (element, style) {
        let documentSelect = this.documentSelect(element);
        let documentSelectClasses = this.documentSelectClasses(documentSelect);
        documentSelectClasses.remove(style);
    }

    addClass (element, style) {
        let documentSelect = this.documentSelect(element);
        let documentSelectClasses = this.documentSelectClasses(documentSelect);
        documentSelectClasses.add(style);
    }

    removeOrAddByID (element, clase) {
        let documentSelect = document.querySelector(element);
        var documentSelectClasses = documentSelect.classList;
        documentSelectClasses.toggle(clase);
    }

    innerHTML (element, html) {
        let documentSelect = this.documentSelect(element);
        documentSelect.innerHTML = html;
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
        let [id, skinBase, nombre, fuerza, agilidad, inteligencia, sellos, resistencia, vitalidad, destreza, percepcion] = data;

        let html =  `<div id="Pj_${id}" class="row personaje" onclick="selCharacter(${id},'${skinBase}','${nombre}',${fuerza},${agilidad},${inteligencia},${sellos},${resistencia},${vitalidad},${destreza},${percepcion})">
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
        let html =  `<div id="Pj_${count}" class="row" onclick="createCharacter(${id})">`+
                        '<div class="col">'+
                            '<div>Nuevo Pj</div>'+
                        '</div>'+
                    '</div>';

        return html;
    }

    changeCharacter (mode) {

        $("[id^=containerCharacter]").addClass('Invisible');

        switch (mode) {
            case 1:
                this.removeClass('#containerCharacter_Character', 'Invisible');
                break;
            case 2:
                this.removeClass('#containerCharacter_Attribute', 'Invisible');
                break;
            case 4:
                this.removeClass('#containerCharacter_Jutsu', 'Invisible');
                break;
            default:
                alert("Contenedor "+ mode);
        }
    }

    /*-------------------------------
        HUB - Personajes - Principal
    *-------------------------------*/
    // Muestra los personajes en la interface
    onAccountCharacters (data) {
        // Ocualta la pantalla de carga
        this.addClass('#loading', 'Invisible');

        // Muestra la pantalla de los personajes
        this.removeClass('#personajes', 'Invisible');

        console.log(data);

        let html = "";

        this.selCharacter(data[0].id, data[0].skinBase, data[0].nombre, data[0].statFuerza, data[0].statAgilidad, data[0].statInteligencia, data[0].statSellos, data[0].statResistencia, data[0].statVitalidad, data[0].statDestreza, data[0].statPercepcion);

        data.forEach((Pj) => {

            let dataPJ = [Pj.id, Pj.skinBase, Pj.nombre, Pj.statFuerza, Pj.statAgilidad, Pj.statInteligencia, Pj.statSellos, Pj.statResistencia, Pj.statVitalidad, Pj.statDestreza, Pj.statPercepcion];

            html += this.accountCharacters(dataPJ);
        });

        for (let count = (data.length + 1); count <= this.maxPlayers; count++) {
            html += this.accountNewCharacter(count, data[0].id);
        }

        this.innerHTML('#listPersonajes', html);
    }

    selCharacter (...data) {
        let [id, skinBase, nombre, statFuerza, statAgilidad, statInteligencia, statSellos, statResistencia, statVitalidad, statDestreza, statPercepcion] = data;
    
        this.innerHTML('#characters_Skin', `<div id="characters_Skin" style="margin-top: 15%; margin-left: 40%;"><img src="../sprites/Player/Base/${skinBase}.png" style="width: 150px;"></div>`);
        this.innerHTML('#characters_BtnGetInGame', `<div id="characters_BtnGetInGame" class="mx-auto" style="width: 50%; margin-top: 10%;"><button onclick="getInGame(${id});" style="width: 100%;">Entrar al mundo</button></div>`);
    
        this.innerHTML('#characters_Name', `<div id="characters_Name"><b>Nombre: ${nombre}</b></div>`);
        this.innerHTML('#characters_Rank', `<div id="characters_Rank"><b>Rango: rango</b></div>`);
    
        atributos.series[0].update({
            data: [statFuerza, statAgilidad, statInteligencia, statSellos, statResistencia, statVitalidad, statDestreza, statPercepcion]
        });
    }
}